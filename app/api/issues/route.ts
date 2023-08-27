import prisma from "@/lib/prisma";
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
        const body = await req.json();
        const {listId,boardId,assignees,...data} = body;
        console.log("bodydata",body)
        const count = await prisma?.issue.aggregate({where:{listId},_count:true})
        const issue = await prisma?.issue.create({
           data:{...data,order:count?._count! + 1,listId},
        })
        const assignee = await prisma?.assignee.createMany({
            data: assignees.map((userId:string)=>({userId:userId,issueId:issue?.id,boardId}))
        });
        return NextResponse.json({issue,assignee,count}) 
    } catch (error) {
       return badRequest(`${error}`,400)
    }
}

