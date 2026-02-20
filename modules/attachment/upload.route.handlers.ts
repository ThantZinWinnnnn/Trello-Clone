import { NextRequest, NextResponse } from "next/server";
import {
  badRequest,
  getAuthenticatedUserId,
  internalServerError,
  unauthorized,
} from "@/modules/shared/api.utils";
import { MAX_ATTACHMENT_SIZE_BYTES } from "@/modules/attachment/constants";
import { persistUploadBuffer, verifyUploadToken } from "@/modules/attachment/storage";

export const runtime = "nodejs";

export const PUT = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorized();
    }

    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return badRequest("token is required");
    }

    const decodedToken = decodeURIComponent(token);
    const payload = verifyUploadToken(decodedToken);

    if (!payload) {
      return badRequest("Invalid or expired upload token");
    }

    if (payload.actorId !== userId) {
      return unauthorized("Upload token does not belong to the active user");
    }

    const body = await req.arrayBuffer();
    const bytes = new Uint8Array(body);

    if (bytes.byteLength <= 0) {
      return badRequest("Upload body is empty");
    }

    if (bytes.byteLength > payload.fileSize || bytes.byteLength > MAX_ATTACHMENT_SIZE_BYTES) {
      return badRequest("Uploaded file exceeds expected size limits");
    }

    await persistUploadBuffer(payload.key, bytes);

    return NextResponse.json({
      success: true,
      storageKey: payload.key,
      uploadedBytes: bytes.byteLength,
    });
  } catch (error) {
    console.error("[attachment] upload failed", error);
    return internalServerError("Failed to upload attachment bytes");
  }
};
