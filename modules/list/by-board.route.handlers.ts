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

export async function GET(
  _req: Request,
  { params }: { params: { boardId: string } }
) {
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

    const lists = await prisma.list.findMany({
      where: {
        boardId,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(lists);
  } catch {
    return internalServerError("Error while fetching lists");
  }
}
