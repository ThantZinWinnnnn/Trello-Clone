import { NextRequest, NextResponse } from "next/server";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardPermission,
  unauthorized,
} from "@/modules/shared/api.utils";
import { createSignedUpload, finalizeAttachment, listAttachments } from "@/modules/attachment/service";

const DEFAULT_LIMIT = 20;

export const GET = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorized();
    }

    const url = new URL(req.url);
    const boardId = url.searchParams.get("boardId");
    const issueId = url.searchParams.get("issueId") ?? undefined;
    const commentId = url.searchParams.get("commentId") ?? undefined;
    const limitParam = Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT);

    if (!isNonEmptyString(boardId)) {
      return badRequest("boardId is required");
    }

    const access = await requireBoardPermission(boardId, userId, "attachment:read");
    if (!access) {
      return forbidden("You do not have permission to read attachments");
    }

    const items = await listAttachments({
      boardId,
      issueId,
      commentId,
      limit: Number.isFinite(limitParam) ? limitParam : DEFAULT_LIMIT,
    });

    return NextResponse.json(items);
  } catch (error) {
    if (error instanceof Error) {
      return badRequest(error.message);
    }
    return internalServerError("Failed to fetch attachments");
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorized();
    }

    const body = await req.json();
    const action = body?.action;

    if (action === "createUpload") {
      const boardId = body?.boardId;
      const fileName = body?.fileName;
      const contentType = body?.contentType;
      const fileSize = Number(body?.fileSize);
      const issueId = isNonEmptyString(body?.issueId) ? body.issueId : undefined;
      const commentId = isNonEmptyString(body?.commentId) ? body.commentId : undefined;

      if (!isNonEmptyString(boardId)) {
        return badRequest("boardId is required");
      }

      const access = await requireBoardPermission(boardId, userId, "attachment:upload");
      if (!access) {
        return forbidden("You do not have permission to upload attachments");
      }

      const signedUpload = await createSignedUpload({
        boardId,
        actorId: userId,
        issueId,
        commentId,
        fileName,
        contentType,
        fileSize,
      });

      return NextResponse.json(signedUpload);
    }

    if (action === "finalizeUpload") {
      const boardId = body?.boardId;
      const issueId = isNonEmptyString(body?.issueId) ? body.issueId : undefined;
      const commentId = isNonEmptyString(body?.commentId) ? body.commentId : undefined;
      const storageKey = body?.storageKey;
      const fileName = body?.fileName;
      const contentType = body?.contentType;
      const fileSize = Number(body?.fileSize);

      if (!isNonEmptyString(boardId) || !isNonEmptyString(storageKey)) {
        return badRequest("boardId and storageKey are required");
      }

      const access = await requireBoardPermission(boardId, userId, "attachment:upload");
      if (!access) {
        return forbidden("You do not have permission to upload attachments");
      }

      const attachment = await finalizeAttachment({
        boardId,
        actorId: userId,
        issueId,
        commentId,
        storageKey,
        fileName,
        contentType,
        fileSize,
      });

      return NextResponse.json(attachment);
    }

    return badRequest("Unsupported attachment action");
  } catch (error) {
    if (error instanceof Error) {
      return badRequest(error.message);
    }
    return internalServerError("Failed to process attachment");
  }
};
