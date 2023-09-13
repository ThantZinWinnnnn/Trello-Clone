import { NextRequest, NextResponse } from "next/server";
import { badRequest } from "../../utils/api.utils";
import prisma from "@/lib/prisma"

// export const GET = async(req:NextRequest,{ params }: { params: { slug: string } }) => {
//     const url = new URL(req.url)
//     const id = req.url.slice(req.url.lastIndexOf('/') + 1);
//     const uId = url.searchParams.get("userId")
    
//     return NextResponse.json({ "slug": id,"userID":uId});
// }

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const boardId = req.url.slice(req.url.lastIndexOf('/') + 1);
        const issues = await prisma?.list.findMany({
            where: { boardId: boardId },
            orderBy: { order: 'asc' },
      include: {
        issues: {
          orderBy: { order: 'asc' },
          include: {
            assignees: {
                orderBy: { createdAt: 'asc' },
              select:{
               
                User:true
              }
            },
          },
        },
      },
        });

        const issuesByList = issues?.reduce((prev, { id, issues }) => ({
            ...prev,
            [id]: issues
        }), {})

        return NextResponse.json(issuesByList)
    } catch (error) {
        return badRequest("Invalid request for getting Issue", 400)
    }
}