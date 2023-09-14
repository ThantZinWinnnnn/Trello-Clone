import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { badRequest } from "../utils/api.utils";

export const GET = async(req:NextRequest)=>{
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("issueId");
        const comments = await prisma?.comment.findMany({
            where:{issueId:id!},
            include:{
                User:true,
            },
            orderBy:{
                createdAt:"asc"
            }
        });

        return NextResponse.json(comments);
    } catch (error) {
        badRequest("Error Found in searching comments",400)
    }
};

export const POST = async(req:NextRequest)=>{
    try {
        const body:CreateComment = await req.json();
        const {desc,issueId,userId} = body;

        const comment = await prisma?.comment.create({
            data:{
                desc,
                issueId,
                userId
            }
        });

        return NextResponse.json(comment);
    } catch (error) {
        badRequest("Error Found in creating comment",400)
    }
};

export const PUT = async(req:NextRequest) =>{
    try {
        const body:UpdateComment = await req.json();
        const {desc,commentId} = body;
        const updateComment = await prisma?.comment.update({
            where:{
                id:commentId
            },
            data:{
                desc
            }
        });
        return NextResponse.json(updateComment)
    } catch (error) {
        badRequest("Error Found in updating comment",400)
    }
};

export const DELETE =async (req:NextRequest) => {
    try {
        const url = new URL(req.url);
        const commentId = url.searchParams.get("commentId");
        const deletedComment = await prisma?.comment?.delete({
            where:{id:commentId!}
        });
        return NextResponse.json(deletedComment);
    } catch (error) {
        badRequest("Error Found in deleting comment",400)
    }
}