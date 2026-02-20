import { createHmac, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { SignedUploadPayload } from "@/modules/attachment/types";

const UPLOAD_ROOT = process.env.LOCAL_UPLOAD_DIR ?? ".uploads";
const TOKEN_SECRET = process.env.ATTACHMENT_SIGNING_SECRET ?? "dev-attachment-secret";

const toBase64Url = (value: string) => Buffer.from(value, "utf8").toString("base64url");
const fromBase64Url = (value: string) => Buffer.from(value, "base64url").toString("utf8");

const sign = (value: string) => {
  return createHmac("sha256", TOKEN_SECRET).update(value).digest("base64url");
};

const normalizeStorageKey = (input: string) => {
  const normalized = path.posix.normalize(input).replace(/^\/+/, "");
  if (normalized.startsWith("..") || normalized.includes("../")) {
    throw new Error("Invalid storage key");
  }
  return normalized;
};

const safeFileName = (fileName: string) => {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
};

export const createStorageKey = (boardId: string, fileName: string) => {
  const safeName = safeFileName(fileName || "attachment");
  const key = `boards/${boardId}/${Date.now()}-${randomUUID()}-${safeName}`;
  return normalizeStorageKey(key);
};

export const createUploadToken = (payload: SignedUploadPayload) => {
  const encoded = toBase64Url(JSON.stringify(payload));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
};

export const verifyUploadToken = (token: string): SignedUploadPayload | null => {
  if (!token.includes(".")) {
    return null;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  if (sign(encoded) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as SignedUploadPayload;
    if (!payload?.key || !payload?.actorId || !payload?.boardId || !payload?.exp) {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null;
    }

    payload.key = normalizeStorageKey(payload.key);
    return payload;
  } catch {
    return null;
  }
};

export const getAbsoluteUploadPath = (storageKey: string) => {
  const normalized = normalizeStorageKey(storageKey);
  return path.resolve(process.cwd(), UPLOAD_ROOT, normalized);
};

export const persistUploadBuffer = async (storageKey: string, bytes: Uint8Array) => {
  const absolutePath = getAbsoluteUploadPath(storageKey);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, bytes);
  return absolutePath;
};

export const readUploadBuffer = async (storageKey: string) => {
  const absolutePath = getAbsoluteUploadPath(storageKey);
  return fs.readFile(absolutePath);
};

export const uploadExists = async (storageKey: string) => {
  try {
    await fs.access(getAbsoluteUploadPath(storageKey));
    return true;
  } catch {
    return false;
  }
};
