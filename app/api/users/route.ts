import prisma from "@/lib/prisma";
import {NextResponse } from "next/server";

export const GET = async()=>{
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json({message:"Getting Users Errors",error},{status:500})
    }
}


