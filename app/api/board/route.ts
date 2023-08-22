import prisma from "@/lib/prisma";
import { NextRequest,NextResponse } from "next/server";
import { badRequest } from "../utils/api.utils";


export const GET = async (req:NextRequest)=>{
   try {
      const url = new URL(req.url);
      const userId = url.searchParams.get("userId");
      const userBoards = await prisma.user.findUnique({
         where:{
            id:userId!
         },
         select:{
            boards:true,
         }
      });
      console.log("boards",userBoards)
      return NextResponse.json(userBoards)
   } catch (error) {
      badRequest("Error Found in searching Boards",400)
   }
}

export const POST = async (req:NextRequest,res:NextResponse)=>{
   try {
    const body = await req.json();
    const {name,userId}  = body;
    const newBoard = await prisma.board.create({
      data:{
         name,
         userId
      }
    });
    await prisma.member.create({
      data:{
         boardId:newBoard.id,
         userId,
         isAdmin:true
      }
    })
    return NextResponse.json(newBoard)
   } catch (error) {   
    return badRequest("Creating board error",400)
   }
};

export const DELETE = async(req:NextRequest)=>{
   try {
      const url = new URL(req.url);
      const boardId = url.searchParams.get("boardId");
      const deletedBoard = await prisma.board.delete({
         where:{
            id:boardId!
         }
      })
      return NextResponse.json(deletedBoard)
   } catch (error) {
      return badRequest("Error deleting board",400)
   }
}