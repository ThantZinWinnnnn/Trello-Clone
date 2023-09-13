import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { badRequest } from "../../utils/api.utils";

export async function GET(req:NextRequest) {
    try {
        const boardId = req.url.slice(req.url.lastIndexOf('/') + 1);
        const lists = await prisma?.list.findMany({
            where:{
                boardId
            },
            orderBy:{
                order:"asc"
            }
        });
        return NextResponse.json(lists)
    } catch (error) {
        badRequest('Error Found in searching Lists',400)
    }
}