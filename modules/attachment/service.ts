import { AuditActionType, EntityType, ScanStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  ALLOWED_ATTACHMENT_CONTENT_TYPES,
  MAX_ATTACHMENT_SIZE_BYTES,
  UPLOAD_TOKEN_TTL_MS,
} from "@/modules/attachment/constants";
import {
  createStorageKey,
  createUploadToken,
  uploadExists,
} from "@/modules/attachment/storage";
import {
  FinalizeAttachmentInput,
  SignedUploadInput,
  SignedUploadResult,
} from "@/modules/attachment/types";
import { logAuditEvent } from "@/modules/shared/audit-events";
import { scanAttachment } from "@/modules/attachment/scanner";

const isSupportedContentType = (contentType: string) => {
  return ALLOWED_ATTACHMENT_CONTENT_TYPES.has(contentType.toLowerCase());
};

const sanitizeFileName = (fileName: string) => {
  return fileName.trim().replace(/[\r\n]+/g, " ").slice(0, 120);
};

const ensureAttachmentScope = async (input: {
  boardId: string;
  issueId?: string;
  commentId?: string;
}) => {
  const { boardId, issueId, commentId } = input;

  if (issueId) {
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: {
        id: true,
        List: {
          select: { boardId: true },
        },
      },
    });

    if (!issue || issue.List?.boardId !== boardId) {
      throw new Error("Invalid issue scope for board");
    }
  }

  if (commentId) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        issueId: true,
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

    if (!comment || comment.Issue?.List?.boardId !== boardId) {
      throw new Error("Invalid comment scope for board");
    }

    if (issueId && comment.issueId !== issueId) {
      throw new Error("Comment does not belong to the issue");
    }
  }
};

export const createSignedUpload = async (
  input: SignedUploadInput
): Promise<SignedUploadResult> => {
  const normalizedFileName = sanitizeFileName(input.fileName);

  if (!normalizedFileName) {
    throw new Error("fileName is required");
  }

  if (!Number.isFinite(input.fileSize) || input.fileSize <= 0) {
    throw new Error("fileSize must be a positive number");
  }

  if (input.fileSize > MAX_ATTACHMENT_SIZE_BYTES) {
    throw new Error(`fileSize exceeds ${MAX_ATTACHMENT_SIZE_BYTES} bytes`);
  }

  if (!isSupportedContentType(input.contentType)) {
    throw new Error("Unsupported file type");
  }

  await ensureAttachmentScope({
    boardId: input.boardId,
    issueId: input.issueId,
    commentId: input.commentId,
  });

  const storageKey = createStorageKey(input.boardId, normalizedFileName);
  const exp = Date.now() + UPLOAD_TOKEN_TTL_MS;
  const token = createUploadToken({
    key: storageKey,
    boardId: input.boardId,
    actorId: input.actorId,
    issueId: input.issueId,
    commentId: input.commentId,
    contentType: input.contentType,
    fileSize: input.fileSize,
    exp,
  });

  return {
    uploadUrl: `/api/attachments/upload?token=${encodeURIComponent(token)}`,
    storageKey,
    expiresAt: new Date(exp).toISOString(),
    maxFileSize: MAX_ATTACHMENT_SIZE_BYTES,
  };
};

export const finalizeAttachment = async (input: FinalizeAttachmentInput) => {
  const normalizedFileName = sanitizeFileName(input.fileName);

  if (!normalizedFileName) {
    throw new Error("fileName is required");
  }

  if (!Number.isFinite(input.fileSize) || input.fileSize <= 0) {
    throw new Error("fileSize must be a positive number");
  }

  if (input.fileSize > MAX_ATTACHMENT_SIZE_BYTES) {
    throw new Error(`fileSize exceeds ${MAX_ATTACHMENT_SIZE_BYTES} bytes`);
  }

  if (!isSupportedContentType(input.contentType)) {
    throw new Error("Unsupported file type");
  }

  await ensureAttachmentScope({
    boardId: input.boardId,
    issueId: input.issueId,
    commentId: input.commentId,
  });

  const exists = await uploadExists(input.storageKey);
  if (!exists) {
    throw new Error("Uploaded file not found");
  }

  const scanStatus =
    input.scanStatus ??
    (await scanAttachment({
      storageKey: input.storageKey,
      contentType: input.contentType,
      fileSize: input.fileSize,
    }));

  const attachment = await prisma.attachment.create({
    data: {
      boardId: input.boardId,
      issueId: input.issueId ?? null,
      commentId: input.commentId ?? null,
      uploaderId: input.actorId,
      fileName: normalizedFileName,
      contentType: input.contentType,
      fileSize: input.fileSize,
      storageKey: input.storageKey,
      scanStatus,
    },
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
  });

  await logAuditEvent({
    actorId: input.actorId,
    actionType: AuditActionType.UPLOAD,
    entityType: EntityType.ATTACHMENT,
    entityId: attachment.id,
    boardId: input.boardId,
    issueId: input.issueId ?? null,
    commentId: input.commentId ?? null,
    metadata: {
      fileName: attachment.fileName,
      contentType: attachment.contentType,
      fileSize: attachment.fileSize,
      scanStatus: attachment.scanStatus,
    },
  });

  return attachment;
};

export const listAttachments = async (input: {
  boardId: string;
  issueId?: string;
  commentId?: string;
  limit: number;
}) => {
  await ensureAttachmentScope({
    boardId: input.boardId,
    issueId: input.issueId,
    commentId: input.commentId,
  });

  return prisma.attachment.findMany({
    where: {
      boardId: input.boardId,
      ...(input.issueId ? { issueId: input.issueId } : {}),
      ...(input.commentId ? { commentId: input.commentId } : {}),
    },
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: Math.min(Math.max(input.limit, 1), 100),
  });
};

export const getAttachmentById = async (id: string) => {
  return prisma.attachment.findUnique({
    where: { id },
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
  });
};

export const canDownloadAttachment = (scanStatus: ScanStatus) => {
  return scanStatus === ScanStatus.CLEAN;
};
