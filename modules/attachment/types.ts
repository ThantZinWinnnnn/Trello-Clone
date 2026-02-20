import { ScanStatus } from "@prisma/client";

export type SignedUploadInput = {
  boardId: string;
  actorId: string;
  issueId?: string;
  commentId?: string;
  fileName: string;
  contentType: string;
  fileSize: number;
};

export type SignedUploadPayload = {
  key: string;
  boardId: string;
  actorId: string;
  issueId?: string;
  commentId?: string;
  contentType: string;
  fileSize: number;
  exp: number;
};

export type SignedUploadResult = {
  uploadUrl: string;
  storageKey: string;
  expiresAt: string;
  maxFileSize: number;
};

export type FinalizeAttachmentInput = {
  boardId: string;
  actorId: string;
  issueId?: string;
  commentId?: string;
  storageKey: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  scanStatus?: ScanStatus;
};
