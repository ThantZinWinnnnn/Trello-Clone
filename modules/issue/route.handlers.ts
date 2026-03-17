import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  badRequest,
  diffColumnReorder,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardPermission,
  sanitizeHtml,
  sameColumnReorder,
  tooManyRequests,
  unauthorized,
} from "@/modules/shared/api.utils";
import { isRateLimited } from "@/modules/shared/rate-limit";
import { logAuditEvent } from "@/modules/shared/audit-events";
import { AuditActionType, EntityType } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    if (isRateLimited(`issue:create:${authUserId}`, { limit: 60, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const url = new URL(req.url);
    const boardId = url.searchParams.get("boardId");
    const assigneeUserId = url.searchParams.get("userId");

    if (!isNonEmptyString(boardId)) {
      return badRequest("boardId is required");
    }

    const access = await requireBoardPermission(boardId, authUserId, "board:read");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const issues = await prisma.list.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
      include: {
        issues: {
          ...(isNonEmptyString(assigneeUserId) && {
            where: { assignees: { some: { userId: assigneeUserId } } },
          }),
          orderBy: { order: "asc" },
          include: {
            assignees: {
              orderBy: { createdAt: "asc" },
              select: {
                User: true,
                id: true,
                createdAt: true,
                userId: true,
                issueId: true,
                boardId: true,
              },
            },
          },
        },
      },
    });

    const issuesByList = issues.reduce((prev: Issues, list: any) => {
      prev[list.id] = list.issues;
      return prev;
    }, {} as Issues);

    return NextResponse.json(issuesByList);
  } catch {
    return internalServerError("Error while fetching issues");
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    if (isRateLimited(`issue:reorder:${authUserId}`, { limit: 120, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const body = await req.json();
    const { listId, boardId, assignees, ...data } = body as IssueState;

    if (
      !isNonEmptyString(listId) ||
      !isNonEmptyString(boardId) ||
      !isNonEmptyString(data?.summary) ||
      !isNonEmptyString(data?.desc) ||
      !isNonEmptyString(data?.priority) ||
      !isNonEmptyString(data?.type)
    ) {
      return badRequest("Invalid issue payload");
    }

    if (data.summary.trim().length > 200) {
      return badRequest("Issue summary must be 200 characters or fewer");
    }

    const access = await requireBoardPermission(boardId, authUserId, "issue:create");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const list = await prisma.list.findFirst({
      where: { id: listId, boardId },
      select: { id: true },
    });

    if (!list) {
      return badRequest("Invalid listId for the given board");
    }

    const count = await prisma.issue.count({
      where: { listId },
    });

    const normalizedAssignees = Array.isArray(assignees)
      ? Array.from(
        new Set(
          assignees.filter((value): value is string => isNonEmptyString(value))
        )
      )
      : [];

    if (normalizedAssignees.length > 0) {
      const validAssigneeCount = await prisma.member.count({
        where: {
          boardId,
          userId: {
            in: normalizedAssignees,
          },
        },
      });

      if (validAssigneeCount !== normalizedAssignees.length) {
        return badRequest("All assignees must be members of the board");
      }
    }

    const issue = await prisma.issue.create({
      data: {
        image: data.image ?? "",
        type: data.type.trim(),
        summary: data.summary.trim(),
        desc: sanitizeHtml(data.desc.trim()),
        priority: data.priority.trim(),
        reporterId: authUserId,
        order: count + 1,
        listId,
      },
    });

    if (normalizedAssignees.length > 0) {
      await prisma.assignee.createMany({
        data: normalizedAssignees.map((userId) => ({
          userId,
          issueId: issue.id,
          boardId,
        })),
      });
    }

    await logAuditEvent({
      actorId: authUserId,
      actionType: AuditActionType.CREATE,
      entityType: EntityType.ISSUE,
      entityId: issue.id,
      boardId,
      issueId: issue.id,
      listId,
      metadata: {
        summary: issue.summary,
        priority: issue.priority,
        type: issue.type,
        assignees: normalizedAssignees,
      },
    });

    return NextResponse.json(issue);
  } catch {
    return internalServerError("Error while creating issue");
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    if (isRateLimited(`issue:delete:${authUserId}`, { limit: 60, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const body: ReorderIssue = await req.json();
    const {
      id,
      s: { sId, oIdx },
      d: { dId, nIdx },
      boardId,
      expectedUpdatedAt,
    } = body;

    if (
      !isNonEmptyString(id) ||
      !isNonEmptyString(sId) ||
      !isNonEmptyString(dId) ||
      !isNonEmptyString(boardId) ||
      typeof oIdx !== "number" ||
      typeof nIdx !== "number"
    ) {
      return badRequest("Invalid reorder payload");
    }

    const access = await requireBoardPermission(boardId, authUserId, "issue:move");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const [sourceList, destinationList, issue] = await Promise.all([
      prisma.list.findFirst({
        where: { id: sId, boardId },
        select: { id: true },
      }),
      prisma.list.findFirst({
        where: { id: dId, boardId },
        select: { id: true },
      }),
      prisma.issue.findUnique({
        where: { id },
        select: { listId: true, updatedAt: true },
      }),
    ]);

    if (!sourceList || !destinationList || issue?.listId !== sId) {
      return badRequest("Invalid reorder references");
    }

    if (isNonEmptyString(expectedUpdatedAt)) {
      const expected = new Date(expectedUpdatedAt);
      if (!Number.isNaN(expected.getTime())) {
        const changedElsewhere = issue.updatedAt.getTime() !== expected.getTime();
        if (changedElsewhere) {
          return NextResponse.json(
            {
              message: "Issue was updated elsewhere. Please refresh and retry.",
              currentUpdatedAt: issue.updatedAt,
              issueId: id,
            },
            { status: 409 }
          );
        }
      }
    }

    if (sId === dId) {
      const response = await sameColumnReorder(
        { id, oIdx, nIdx },
        { listId: sId },
        "issue"
      );
      await logAuditEvent({
        actorId: authUserId,
        actionType: AuditActionType.MOVE,
        entityType: EntityType.ISSUE,
        entityId: id,
        boardId,
        issueId: id,
        listId: sId,
        metadata: {
          fromListId: sId,
          toListId: dId,
          fromIndex: oIdx,
          toIndex: nIdx,
        },
      });
      return response;
    }

    const response = await diffColumnReorder(body);
    await logAuditEvent({
      actorId: authUserId,
      actionType: AuditActionType.MOVE,
      entityType: EntityType.ISSUE,
      entityId: id,
      boardId,
      issueId: id,
      listId: dId,
      metadata: {
        fromListId: sId,
        toListId: dId,
        fromIndex: oIdx,
        toIndex: nIdx,
      },
    });
    return response;
  } catch {
    return internalServerError("Error while reordering issues");
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    const url = new URL(req.url);
    const issueId = url.searchParams.get("issueId");

    if (!isNonEmptyString(issueId)) {
      return badRequest("issueId is required");
    }

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: {
        id: true,
        listId: true,
        summary: true,
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

    const access = await requireBoardPermission(boardId, authUserId, "issue:delete");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const deletedIssue = await prisma.issue.delete({
      where: { id: issueId },
    });

    await logAuditEvent({
      actorId: authUserId,
      actionType: AuditActionType.DELETE,
      entityType: EntityType.ISSUE,
      entityId: deletedIssue.id,
      boardId,
      issueId: deletedIssue.id,
      listId: issue.listId,
      metadata: {
        summary: issue.summary,
      },
    });

    return NextResponse.json(deletedIssue);
  } catch {
    return internalServerError("Error while deleting issue");
  }
};
