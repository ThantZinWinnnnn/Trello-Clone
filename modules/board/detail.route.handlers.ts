import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardMember,
  unauthorized,
} from "@/modules/shared/api.utils";

export const GET = async (
  _req: Request,
  { params }: { params: { boardId: string } }
) => {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorized();
    }

    const boardId = params.boardId;

    if (!isNonEmptyString(boardId)) {
      return badRequest("boardId is required");
    }

    const member = await requireBoardMember(boardId, userId);

    if (!member) {
      return forbidden("You do not have access to this board");
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        User: true,
        members: {
          include: {
            User: true,
          },
        },
      },
    });

    return NextResponse.json(board);
  } catch {
    return internalServerError("Error while fetching board");
  }
};
