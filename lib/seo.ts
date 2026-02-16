export const SITE_NAME = "BoardForge";
export const SITE_DESCRIPTION =
  "A modern project management app built with Next.js, TypeScript, Prisma, and NextAuth.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://boardforge.vercel.app";
export const SITE_URL_OBJECT = new URL(SITE_URL);

export const DEFAULT_OG_IMAGE = "/icon.png";
export const X_HANDLE = "@boardforgeapp";

export const toJsonLd = (payload: unknown) =>
  JSON.stringify(payload).replace(/</g, "\\u003c");
