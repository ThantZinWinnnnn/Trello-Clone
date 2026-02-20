import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/next-auth";
import { NextResponse } from "next/server";
import {
  AppBoardRole,
  BoardPermission,
  deriveBoardRole,
  hasBoardPermission,
} from "@/modules/shared/rbac";

export const badRequest = (message: string, status = 400) =>
  NextResponse.json({ message }, { status });

export const unauthorized = (message = "Unauthorized") =>
  NextResponse.json({ message }, { status: 401 });

export const forbidden = (message = "Forbidden") =>
  NextResponse.json({ message }, { status: 403 });

export const notFound = (message = "Not Found") =>
  NextResponse.json({ message }, { status: 404 });

export const internalServerError = (message = "Internal server error") =>
  NextResponse.json({ message }, { status: 500 });

export const tooManyRequests = (message = "Too many requests") =>
  NextResponse.json({ message }, { status: 429 });

export const getAuthenticatedUserId = async () => {
  const session = await getAuthSession();
  return session?.user?.id ?? null;
};

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const sanitizeHtml = (value: string) =>
  value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");

export const sanitizePlainText = (value: string) =>
  sanitizeHtml(value).replace(/<[^>]*>/g, "").trim();

export type BoardAccessContext = {
  boardId: string;
  userId: string;
  role: AppBoardRole;
  memberId: string | null;
  isOwner: boolean;
  isAdmin: boolean;
};

export const getBoardAccessContext = async (
  boardId: string,
  userId: string
): Promise<BoardAccessContext | null> => {
  const [board, member] = await Promise.all([
    prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true, userId: true },
    }),
    prisma.member.findFirst({
      where: { boardId, userId },
      select: { id: true, isAdmin: true, role: true },
    }),
  ]);

  if (!board) {
    return null;
  }

  const isOwner = board.userId === userId;
  if (!isOwner && !member) {
    return null;
  }

  const role = deriveBoardRole({
    isOwner,
    role: member?.role ?? null,
    isAdmin: member?.isAdmin,
  });

  return {
    boardId,
    userId,
    role,
    memberId: member?.id ?? null,
    isOwner,
    isAdmin: role === "OWNER" || role === "ADMIN",
  };
};

export const requireBoardPermission = async (
  boardId: string,
  userId: string,
  permission: BoardPermission
) => {
  const access = await getBoardAccessContext(boardId, userId);
  if (!access) {
    return null;
  }

  if (!hasBoardPermission(access.role, permission)) {
    return null;
  }

  return access;
};

export const requireBoardMember = async (boardId: string, userId: string) => {
  const access = await requireBoardPermission(boardId, userId, "board:read");
  if (!access) {
    return null;
  }

  return {
    id: access.memberId ?? access.userId,
    isAdmin: access.isAdmin,
    role: access.role,
  };
};

export const requireBoardAdmin = async (boardId: string, userId: string) => {
  const access = await getBoardAccessContext(boardId, userId);
  if (!access) {
    return null;
  }

  if (!access.isAdmin) {
    return null;
  }

  return {
    id: access.memberId ?? access.userId,
    role: access.role,
  };
};

export const sameColumnReorder = async (
  { id, oIdx, nIdx }: orderProps,
  config: { listId?: string; boardId?: string },
  modal: "issue" | "list"
) => {
  if (oIdx === nIdx) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const fromOrder = oIdx + 1;
  const toOrder = nIdx + 1;
  const moveForward = toOrder > fromOrder;

  await prisma.$transaction(async (tx: any) => {
    if (modal === "issue") {
      await tx.issue.updateMany({
        where: {
          ...config,
          AND: [
            { order: { [moveForward ? "gt" : "lt"]: fromOrder } },
            { order: { [moveForward ? "lte" : "gte"]: toOrder } },
          ],
        },
        data: {
          order: {
            [moveForward ? "decrement" : "increment"]: 1,
          },
        },
      });

      await tx.issue.update({
        where: { id },
        data: { order: toOrder },
      });
      return;
    }

    await tx.list.updateMany({
      where: {
        ...config,
        AND: [
          { order: { [moveForward ? "gt" : "lt"]: fromOrder } },
          { order: { [moveForward ? "lte" : "gte"]: toOrder } },
        ],
      },
      data: {
        order: {
          [moveForward ? "decrement" : "increment"]: 1,
        },
      },
    });

    await tx.list.update({
      where: { id },
      data: { order: toOrder },
    });
  });

  return NextResponse.json({ success: true }, { status: 200 });
};

export const diffColumnReorder = async ({
  id,
  s: { sId, oIdx },
  d: { dId, nIdx },
}: ReorderIssue) => {
  const fromOrder = oIdx + 1;
  const toOrder = nIdx + 1;

  await prisma.$transaction(async (tx: any) => {
    await tx.issue.updateMany({
      where: {
        listId: sId,
        order: { gt: fromOrder },
      },
      data: {
        order: { decrement: 1 },
      },
    });

    await tx.issue.updateMany({
      where: {
        listId: dId,
        order: { gte: toOrder },
      },
      data: {
        order: { increment: 1 },
      },
    });

    await tx.issue.update({
      where: { id },
      data: {
        listId: dId,
        order: toOrder,
      },
    });
  });

  return NextResponse.json({ success: true }, { status: 200 });
};
