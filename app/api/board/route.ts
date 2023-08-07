import prisma from "@/lib/prisma";
import { NextRequest,NextResponse } from "next/server";

export const POST = async (req:NextRequest,res:NextResponse)=>{
   try {
    const body = await req.json();
    const {name,userId}  = body;
    const newBoard = await prisma.board.create({
      data:{
         name,
         userId
      }
    })
    return NextResponse.json(newBoard)
   } catch (error) {
    return NextResponse.json({message:"Creating board error",error},{status:400})
   }

}