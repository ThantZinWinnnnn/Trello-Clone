import { NextRequest, NextResponse } from "next/server";
import { badRequest, sameColumnReorder } from "../utils/api.utils";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const boardId = url.searchParams.get("boardId");
    const lists = await prisma?.list.findMany({
      where: {
        boardId: boardId!,
      },
        orderBy:{order:"asc"},
          // include: {
          //   issues: {
          //     orderBy:{
          //       order:"asc"
          //     },
          //     include: {
          //       assignees: {
          //         include: {
          //           User: true,
          //         },
          //       },
          //     },
          //   },
          // },
        
    });
    return NextResponse.json(lists);
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

export const PUT = async (req:NextRequest)=>{
  try {
    const body:ReorderIssue = await req.json();
    const {s,d,boardId,id} = body;
    console.log("liiiiiii",body)
    return sameColumnReorder({id,oIdx:s.oIdx,nIdx:d.nIdx},{boardId:boardId},prisma?.list)
  } catch (error) {
    badRequest(`${error}`,400)
  }
}
