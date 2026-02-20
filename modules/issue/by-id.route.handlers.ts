import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardMember,
  requireBoardPermission,
  sanitizeHtml,
  tooManyRequests,
  unauthorized,
} from "@/modules/shared/api.utils";
import { isRateLimited } from "@/modules/shared/rate-limit";
import { logAuditEvent } from "@/modules/shared/audit-events";
import { AuditActionType, EntityType } from "@prisma/client";

const allowedIssueFields = new Set(["listId", "summary", "desc", "priority", "type"]);

export const PUT = async (
  req: Request,
  { params }: { params: { issueId: string } }
) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    if (isRateLimited(`issue:update:${authUserId}`, { limit: 120, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const issueId = params.issueId;
    if (!isNonEmptyString(issueId)) {
      return badRequest("issueId is required");
    }

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: {
        id: true,
        listId: true,
        summary: true,
        desc: true,
        priority: true,
        type: true,
        List: {
          select: {
            boardId: true,
          },
        },
      },
    });

    const boardId = issue?.List?.boardId;
    if (!issue || !isNonEmptyString(boardId)) {
      return badRequest("Invalid issueId");
    }

    const readAccess = await requireBoardPermission(
      boardId,
      authUserId,
      "board:read"
    );
    if (!readAccess) {
      return forbidden("You do not have access to this board");
    }

    const body: IssueUpdateProps = await req.json();
    const { type, value } = body;

    if (!isNonEmptyString(type) || !isNonEmptyString(value)) {
      return badRequest("Invalid update payload");
    }

    if (type === "listId") {
      const moveAccess = await requireBoardPermission(
        boardId,
        authUserId,
        "issue:move"
      );
      if (!moveAccess) {
        return forbidden("You do not have permission to move issues");
      }

      const nextList = await prisma.list.findFirst({
        where: { id: value, boardId },
        select: { id: true },
      });

      if (!nextList) {
        return badRequest("Invalid listId for this board");
      }

      const count = await prisma.issue.count({ where: { listId: value } });
      const updatedList = await prisma.issue.update({
        where: { id: issueId },
        data: { listId: value, order: count + 1, updatedAt: new Date() },
      });

      await logAuditEvent({
        actorId: authUserId,
        actionType: AuditActionType.MOVE,
        entityType: EntityType.ISSUE,
        entityId: issueId,
        boardId,
        issueId,
        listId: value,
        metadata: {
          fromListId: issue.listId,
          toListId: value,
        },
      });

      return NextResponse.json(updatedList);
    }

    if (type === "addAssignes") {
      const updateAccess = await requireBoardPermission(
        boardId,
        authUserId,
        "issue:update"
      );
      if (!updateAccess) {
        return forbidden("You do not have permission to update issues");
      }

      const assigneeMember = await requireBoardMember(boardId, value);
      if (!assigneeMember) {
        return badRequest("Assignee must be a board member");
      }

      const existingAssignee = await prisma.assignee.findFirst({
        where: {
          issueId,
          userId: value,
        },
        select: { id: true },
      });

      if (existingAssignee) {
        return badRequest("User is already assigned to this issue");
      }

      const createdAssignee = await prisma.assignee.create({
        data: {
          userId: value,
          issueId,
          boardId,
        },
      });

      await prisma.issue.update({
        where: { id: issueId },
        data: { updatedAt: new Date() },
      });

      await logAuditEvent({
        actorId: authUserId,
        actionType: AuditActionType.ASSIGN,
        entityType: EntityType.ISSUE,
        entityId: issueId,
        boardId,
        issueId,
        listId: issue.listId,
        metadata: {
          assignedUserId: value,
        },
      });

      return NextResponse.json(createdAssignee);
    }

    if (type === "remvoeAssignee") {
      const updateAccess = await requireBoardPermission(
        boardId,
        authUserId,
        "issue:update"
      );
      if (!updateAccess) {
        return forbidden("You do not have permission to update issues");
      }

      const removedAssignees = await prisma.assignee.deleteMany({
        where: {
          issueId,
          userId: value,
        },
      });

      await prisma.issue.update({
        where: { id: issueId },
        data: { updatedAt: new Date() },
      });

      await logAuditEvent({
        actorId: authUserId,
        actionType: AuditActionType.UNASSIGN,
        entityType: EntityType.ISSUE,
        entityId: issueId,
        boardId,
        issueId,
        listId: issue.listId,
        metadata: {
          unassignedUserId: value,
        },
      });

      return NextResponse.json(removedAssignees);
    }

    if (!allowedIssueFields.has(type)) {
      return badRequest("Unsupported issue update type");
    }

    const updateAccess = await requireBoardPermission(
      boardId,
      authUserId,
      "issue:update"
    );
    if (!updateAccess) {
      return forbidden("You do not have permission to update issues");
    }

    if (type === "summary" && value.trim().length > 200) {
      return badRequest("Issue summary must be 200 characters or fewer");
    }

    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        [type]: type === "desc" ? sanitizeHtml(value) : value,
        updatedAt: new Date(),
      },
    });

    await logAuditEvent({
      actorId: authUserId,
      actionType: AuditActionType.UPDATE,
      entityType: EntityType.ISSUE,
      entityId: issueId,
      boardId,
      issueId,
      listId: issue.listId,
      metadata: {
        field: type,
        before: {
          [type]: issue[type as keyof typeof issue] ?? null,
        },
        after: {
          [type]: value,
        },
      },
    });

    return NextResponse.json(updatedIssue);
  } catch {
    return internalServerError("Error while updating issue");
  }
};
