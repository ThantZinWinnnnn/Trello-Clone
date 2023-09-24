import { NextRequest, NextResponse } from "next/server";
import { badRequest, sameColumnReorder } from "../utils/api.utils";
import prisma from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const boardId = url.searchParams.get("boardId");
    const lists = await prisma?.list.findMany({
      where: {
        boardId: boardId!,
      },
        orderBy:{order:"asc"}  
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

export const PUT = async (req: NextRequest) => {
  try {
    const body :orderProps = await req.json();

    const {id,oIdx,nIdx,boardId}  = body;

    await sameColumnReorder({id,oIdx,nIdx},{boardId},prisma,"list")
  } catch (error) {
    badRequest("Error Found in updating Lists", 400);
  }
}

export const PATCH = async(req:NextRequest)=>{
  try {
    const body :UpdateListName = await req.json();
    const {name,listId} = body;
    const list = await prisma?.list.update({
      where:{id:listId},
      data:{
        name
      }
    });
    return NextResponse.json(list)
  } catch (error) {
    badRequest("Error Found in updating Lists", 400);
  }
};

export const DELETE = async(req:NextRequest)=>{
  try {
    const url = new URL(req.url);
    const listId = url.searchParams.get("listId");
    const deletedList = await prisma?.list.delete({
      where:{id:listId!}
    });
    return NextResponse.json(deletedList)
  } catch (error) {
    badRequest("Error Found in deleting List", 400);
  }
}
