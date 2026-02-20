import { NextResponse } from "next/server";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardPermission,
  unauthorized,
} from "@/modules/shared/api.utils";
import {
  canDownloadAttachment,
  getAttachmentById,
} from "@/modules/attachment/service";
import { readUploadBuffer } from "@/modules/attachment/storage";

export const runtime = "nodejs";

export const GET = async (
  _req: Request,
  { params }: { params: { attachmentId: string } }
) => {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorized();
    }

    const attachmentId = params.attachmentId;
    if (!isNonEmptyString(attachmentId)) {
      return badRequest("attachmentId is required");
    }

    const attachment = await getAttachmentById(attachmentId);
    if (!attachment) {
      return badRequest("Attachment not found");
    }

    const access = await requireBoardPermission(
      attachment.boardId,
      userId,
      "attachment:read"
    );
    if (!access) {
      return forbidden("You do not have permission to read this attachment");
    }

    if (!canDownloadAttachment(attachment.scanStatus)) {
      return forbidden("Attachment cannot be downloaded until scan status is CLEAN");
    }

    const fileBuffer = await readUploadBuffer(attachment.storageKey);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": attachment.contentType,
        "Content-Disposition": `attachment; filename=\"${attachment.fileName}\"`,
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (error) {
    console.error("[attachment] download failed", error);
    return internalServerError("Failed to download attachment");
  }
};
