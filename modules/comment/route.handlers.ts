import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardPermission,
  sanitizePlainText,
  tooManyRequests,
  unauthorized,
} from "@/modules/shared/api.utils";
import { isRateLimited } from "@/modules/shared/rate-limit";
import { logAuditEvent } from "@/modules/shared/audit-events";
import { AuditActionType, EntityType } from "@prisma/client";
import { hasBoardPermission } from "@/modules/shared/rbac";

const MAX_COMMENT_LENGTH = 200;

export const GET = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    if (isRateLimited(`comment:create:${authUserId}`, { limit: 120, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const url = new URL(req.url);
    const issueId = url.searchParams.get("issueId");

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

    const access = await requireBoardPermission(boardId, authUserId, "board:read");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const comments = await prisma.comment.findMany({
      where: { issueId },
      include: {
        User: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(comments);
  } catch {
    return internalServerError("Error while fetching comments");
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    if (isRateLimited(`comment:update:${authUserId}`, { limit: 120, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const body: CreateComment = await req.json();
    const desc = typeof body?.desc === "string" ? sanitizePlainText(body.desc) : "";
    const issueId = body?.issueId;

    if (!isNonEmptyString(issueId) || !isNonEmptyString(desc)) {
      return badRequest("issueId and desc are required");
    }

    if (desc.length > MAX_COMMENT_LENGTH) {
      return badRequest(`Comment must be at most ${MAX_COMMENT_LENGTH} characters`);
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

    const access = await requireBoardPermission(
      boardId,
      authUserId,
      "comment:create"
    );
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const comment = await prisma.comment.create({
      data: {
        desc,
        issueId,
        userId: authUserId,
      },
    });

    await logAuditEvent({
      actorId: authUserId,
      actionType: AuditActionType.CREATE,
      entityType: EntityType.COMMENT,
      entityId: comment.id,
      boardId,
      issueId,
      commentId: comment.id,
      metadata: {
        desc: comment.desc,
      },
    });

    return NextResponse.json(comment);
  } catch {
    return internalServerError("Error while creating comment");
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    if (isRateLimited(`comment:delete:${authUserId}`, { limit: 120, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const body: UpdateComment = await req.json();
    const commentId = body?.commentId;
    const desc = typeof body?.desc === "string" ? sanitizePlainText(body.desc) : "";

    if (!isNonEmptyString(commentId) || !isNonEmptyString(desc)) {
      return badRequest("commentId and desc are required");
    }

    if (desc.length > MAX_COMMENT_LENGTH) {
      return badRequest(`Comment must be at most ${MAX_COMMENT_LENGTH} characters`);
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        userId: true,
        issueId: true,
        desc: true,
        Issue: {
          select: {
            List: {
              select: {
                boardId: true,
              },
            },
          },
        },
      },
    });

    if (!comment) {
      return badRequest("Invalid commentId");
    }

    const boardId = comment.Issue?.List?.boardId;
    if (!isNonEmptyString(boardId)) {
      return badRequest("Invalid comment board relation");
    }

    const updateAccess = await requireBoardPermission(
      boardId,
      authUserId,
      "comment:update"
    );
    if (!updateAccess) {
      return forbidden("You do not have permission to update comments");
    }

    if (comment.userId !== authUserId) {
      return forbidden("Only the comment author can edit this comment");
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { desc },
    });

    await logAuditEvent({
      actorId: authUserId,
      actionType: AuditActionType.UPDATE,
      entityType: EntityType.COMMENT,
      entityId: updatedComment.id,
      boardId,
      issueId: comment.issueId,
      commentId: updatedComment.id,
      metadata: {
        before: {
          desc: comment.desc,
        },
        after: {
          desc: updatedComment.desc,
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch {
    return internalServerError("Error while updating comment");
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");

    if (!isNonEmptyString(commentId)) {
      return badRequest("commentId is required");
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        userId: true,
        issueId: true,
        desc: true,
        Issue: {
          select: {
            List: {
              select: {
                boardId: true,
              },
            },
          },
        },
      },
    });

    if (!comment) {
      return badRequest("Invalid commentId");
    }

    const boardId = comment.Issue?.List?.boardId;
    if (!isNonEmptyString(boardId)) {
      return badRequest("Invalid comment board relation");
    }

    const deleteAccess = await requireBoardPermission(
      boardId,
      authUserId,
      "comment:delete"
    );
    if (!deleteAccess) {
      return forbidden("You do not have access to this board");
    }

    const isCommentOwner = comment.userId === authUserId;
    const canManageMembers = hasBoardPermission(deleteAccess.role, "member:manage");
    if (!isCommentOwner && !canManageMembers) {
      return forbidden("Only admins or the comment author can delete this comment");
    }

    const deletedComment = await prisma.comment.delete({
      where: { id: commentId },
    });

    await logAuditEvent({
      actorId: authUserId,
      actionType: AuditActionType.DELETE,
      entityType: EntityType.COMMENT,
      entityId: deletedComment.id,
      boardId,
      issueId: comment.issueId,
      commentId: deletedComment.id,
      metadata: {
        desc: comment.desc,
      },
    });

    return NextResponse.json(deletedComment);
  } catch {
    return internalServerError("Error while deleting comment");
  }
};
