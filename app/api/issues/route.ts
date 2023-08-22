import { NextRequest, NextResponse } from "next/server";
import { badRequest } from "../utils/api.utils";

export const GET = async(req:NextRequest)=>{
    try {
        const url = new URL(req.url);
        const issueId = url.searchParams.get("issueId");
        const issueDetail = await prisma?.issue.findUnique({
            where:{
                id:issueId!
            },
            include:{
                User:true,
                assignees:true,
                comments:true
            }
        });

        return NextResponse.json(issueDetail)
    } catch (error) {
        return badRequest("Invalid request for getting Issue",400)
    }
};

export const POST = async(req:NextRequest)=>{
    try {
        const body =await req.json();
        const {image,type,summary,desc,priority,userId,listId,boardId,assignees} = body;
        console.log("bodydata",body)
        const count = await prisma?.issue.aggregate({where:{listId},_count:true})

        const issue = await prisma?.issue.create({
            data:{
                order:+count?._count!,
                image,
                type,
                summary,
                desc,
                priority,
                List:{
                    connect:{
                        id:listId
                    }
                },
                User:{
                    connect:{
                        id:userId
                    }
                }
            },
        });
        const assignee = await prisma?.assignee.create({
            data: assignees.map((userId:string)=>({userId:userId,issueId:issue?.id,boardId}))
        });
        return NextResponse.json({issue,assignee,count}) 
    } catch (error) {
       return badRequest(`${error}`,400)
    }
}

// function updatedAt(id:string) {
//     return prisma?.issue.update({
//       where: { id },
//       data: 
//     });
//   }
