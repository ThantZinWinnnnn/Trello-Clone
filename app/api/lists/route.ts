import { NextRequest, NextResponse } from "next/server";
import { badRequest } from "../utils/api.utils";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const boardId = url.searchParams.get("boardId");
    const board = await prisma?.board.findUnique({
      where: {
        id: boardId!,
      },
      select: {
        lists: {
          include: {
            issues: {
              include: {
                assignees: {
                  include: {
                    User: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json(board);
  } catch (error) {
    return badRequest("Error Found in searching Boards", 400);
  }
};

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    const { listName, boardId } = body;
    const count = await prisma?.list.aggregate({where:{boardId},_count:true});
    const newList = await prisma?.list.create({
      data: {
        name: listName,
        order: count?._count! + 1,
        boardId,
      },
    });
    return NextResponse.json({newList,count});
  } catch (error) {
    return badRequest(`${error}`, 400);
  }
};
