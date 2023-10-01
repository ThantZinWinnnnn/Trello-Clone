import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { badRequest } from "../../utils/api.utils";
export const GET = async (req: NextRequest) => {
  try {
    const boardId = req.url.slice(req.url.lastIndexOf("/") + 1);
    const board = await prisma?.board?.findUnique({ 
        where: { id: boardId } ,
        include:{
            User:true,
            members:{
              include:{
                User:true
              }
            }
        }
    });
    return NextResponse.json(board);
  } catch (error) {
    badRequest("Error Found in searching Board",400)
  }
};
