import { NextRequest, NextResponse } from "next/server";
import { badRequest } from "../../utils/api.utils";
import prisma from "@/lib/prisma"

// export const GET = async(req:NextRequest,{ params }: { params: { slug: string } }) => {
//     const url = new URL(req.url)
//     const id = req.url.slice(req.url.lastIndexOf('/') + 1);
//     const uId = url.searchParams.get("userId")
    
//     return NextResponse.json({ "slug": id,"userID":uId});
// }

// export const POST = async (req: NextRequest) => {
//     try {
//         const body:IssueState = await req.json();
//         const issueId = req.url.slice(req.url.lastIndexOf('/') + 1);
//         const {listId,boardId,assignees,...data} = body;

//         const deletedIssue = await prisma?.issue.delete({
//             where:{
//                 id:issueId
//             }
//         });
//         if(deletedIssue){
//             const count = await prisma?.issue.aggregate({ where: { listId }, _count: true })
//             const issue = await prisma?.issue.create({
//                 data: { ...data, order: count?._count! + 1, listId },
//             })
//             const assignee = await prisma?.assignee.createMany({
//                 data: assignees.map((userId: string) => ({ userId: userId, issueId: issue?.id, boardId:boardId! }))
//             });

//             return NextResponse.json({assignee})
//         }
        
//         return badRequest("Invalid request for getting Issue", 400);
        
//     } catch (error) {
//         return badRequest("Invalid request for getting Issue", 400)
//     }
// }


export const PUT = async (req: NextRequest) => {
    try {
        const issueId = req.url.slice(req.url.lastIndexOf('/') + 1);
        const body :IssueUpdateProps = await req.json();
        const {type,value,boardId} = body;

        switch(type){
            case "listId":
                const count = await prisma?.issue?.aggregate({where:{listId:value},_count:true})
                const list = await prisma?.issue?.update({
                    where:{id:issueId},
                    data:{[type]:value,order:count?._count + 1}
                });
                return NextResponse.json(list);
            break;
            case "addAssignes":
                const result =await Promise.all([
                    prisma?.assignee?.create({data:{userId:value,issueId,boardId}}),
                    updateDate(issueId),
                ]);
                return NextResponse.json(result);
            break;
            case "remvoeAssignee":
                const removedAssignes = await Promise.all([
                    prisma?.assignee?.deleteMany({where:{AND:{issueId,userId:value}}}),
                    updateDate(issueId)
                ]);
                return NextResponse.json(removedAssignes);
            break;
            default:
                const updateIssue = await prisma?.issue?.update({where:{id:issueId},data:{[type]:value}});
                return NextResponse.json(updateIssue);
            break;
        }
    } catch (error) {
        badRequest('Error Found in updating issue',400)
    }
};



function updateDate(id:string){
    return prisma?.issue?.update({where:{id},data:{updatedAt:new Date(Date.now()).toISOString()}})
}
