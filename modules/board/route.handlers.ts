import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardAdmin,
  tooManyRequests,
  unauthorized,
} from "@/modules/shared/api.utils";
import { isRateLimited } from "@/modules/shared/rate-limit";

export const GET = async () => {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorized();
    }

    if (isRateLimited(`board:create:${userId}`, { limit: 20, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const [createdBoards, assignedBoards] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          boards: true,
        },
      }),
      prisma.board.findMany({
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      createdBoards,
      assignedBoards,
    });
  } catch {
    return internalServerError("Error while fetching boards");
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorized();
    }

    if (isRateLimited(`board:delete:${userId}`, { limit: 20, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const body = await req.json();
    const boardName = typeof body?.boardName === "string" ? body.boardName.trim() : "";

    if (!isNonEmptyString(boardName)) {
      return badRequest("Board name is required");
    }

    if (boardName.length > 100) {
      return badRequest("Board name must be 100 characters or fewer");
    }

    const newBoard = await prisma.board.create({
      data: {
        name: boardName,
        userId,
      },
    });

    await prisma.member.create({
      data: {
        boardId: newBoard.id,
        userId,
        isAdmin: true,
      },
    });

    return NextResponse.json(newBoard);
  } catch {
    return internalServerError("Error while creating board");
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorized();
    }

    const url = new URL(req.url);
    const boardId = url.searchParams.get("boardId");

    if (!isNonEmptyString(boardId)) {
      return badRequest("boardId is required");
    }

    const canDelete = await requireBoardAdmin(boardId, userId);

    if (!canDelete) {
      return forbidden("Only board admins can delete boards");
    }

    const deletedBoard = await prisma.board.delete({
      where: {
        id: boardId,
      },
    });

    return NextResponse.json(deletedBoard);
  } catch {
    return internalServerError("Error deleting board");
  }
};
