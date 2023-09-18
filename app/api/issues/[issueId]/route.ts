import { NextRequest, NextResponse } from "next/server";
import { badRequest } from "../../utils/api.utils";
import prisma from "@/lib/prisma"

// export const GET = async(req:NextRequest,{ params }: { params: { slug: string } }) => {
//     const url = new URL(req.url)
//     const id = req.url.slice(req.url.lastIndexOf('/') + 1);
//     const uId = url.searchParams.get("userId")
    
//     return NextResponse.json({ "slug": id,"userID":uId});
// }

export const POST = async (req: NextRequest) => {
    try {
        const body:IssueState = await req.json();
        const issueId = req.url.slice(req.url.lastIndexOf('/') + 1);
        const {listId,boardId,assignees,...data} = body;

        const deletedIssue = await prisma?.issue.delete({
            where:{
                id:issueId
            }
        });
        if(deletedIssue){
            const count = await prisma?.issue.aggregate({ where: { listId }, _count: true })
            const issue = await prisma?.issue.create({
                data: { ...data, order: count?._count! + 1, listId },
            })
            const assignee = await prisma?.assignee.createMany({
                data: assignees.map((userId: string) => ({ userId: userId, issueId: issue?.id, boardId:boardId! }))
            });

            return NextResponse.json({assignee})
        }
        
        return badRequest("Invalid request for getting Issue", 400);
        
    } catch (error) {
        return badRequest("Invalid request for getting Issue", 400)
    }
}
