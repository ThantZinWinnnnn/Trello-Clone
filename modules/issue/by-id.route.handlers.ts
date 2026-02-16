import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardMember,
  sanitizeHtml,
  tooManyRequests,
  unauthorized,
} from "@/modules/shared/api.utils";
import { isRateLimited } from "@/modules/shared/rate-limit";

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
        List: {
          select: {
            boardId: true,
          },
        },
      },
    });

    const boardId = issue?.List?.boardId;
    if (!isNonEmptyString(boardId)) {
      return badRequest("Invalid issueId");
    }

    const member = await requireBoardMember(boardId, authUserId);
    if (!member) {
      return forbidden("You do not have access to this board");
    }

    const body: IssueUpdateProps = await req.json();
    const { type, value } = body;

    if (!isNonEmptyString(type) || !isNonEmptyString(value)) {
      return badRequest("Invalid update payload");
    }

    if (type === "listId") {
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
      return NextResponse.json(updatedList);
    }

    if (type === "addAssignes") {
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

      return NextResponse.json(createdAssignee);
    }

    if (type === "remvoeAssignee") {
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

      return NextResponse.json(removedAssignees);
    }

    if (!allowedIssueFields.has(type)) {
      return badRequest("Unsupported issue update type");
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

    return NextResponse.json(updatedIssue);
  } catch {
    return internalServerError("Error while updating issue");
  }
};
