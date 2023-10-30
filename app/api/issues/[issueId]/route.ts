import { NextRequest, NextResponse } from "next/server";
import { badRequest } from "../../utils/api.utils";
import prisma from "@/lib/prisma"


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
