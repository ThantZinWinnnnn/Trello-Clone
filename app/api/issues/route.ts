import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { badRequest, diffColumnReorder, sameColumnReorder } from "../utils/api.utils";

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const bId = url.searchParams.get("boardId");
        const uId = url.searchParams.get("userId")
        const issues = await prisma?.list.findMany({
            where: { boardId: bId! },
            orderBy: { order: 'asc' },
      include: {
        issues: {
          ...(uId && { where: { assignees: { some: { userId: uId } } } }),
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

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { listId, boardId, assignees, ...data } = body;
        console.log("bodydata", body)
        const count = await prisma?.issue.aggregate({ where: { listId }, _count: true })
        const issue = await prisma?.issue.create({
            data: { ...data, order: count?._count! + 1, listId },
        })
        const assignee = await prisma?.assignee.createMany({
            data: assignees.map((userId: string) => ({ userId: userId, issueId: issue?.id, boardId }))
        });
        return NextResponse.json({ issue, assignee, count })
    } catch (error) {
        return badRequest(`${error}`, 400)
    }
}

export const PUT = async (req: NextRequest) => {
    try {
        const body: ReorderIssue = await req.json();
        const { id, s: { sId, oIdx }, d: { dId, nIdx } } = body;

        await (sId === dId ?
            sameColumnReorder({ id, oIdx, nIdx }, { listId: sId }, prisma,"issue") :
            diffColumnReorder(body, prisma))

    } catch (error) {
        badRequest("Invalid request for updating Issue Order", 400)
    }
};

export const DELETE = async(req:NextRequest)=>{
    try {
        const url = new URL(req.url);
        const issueId = url.searchParams.get("issueId");
        const deletedIssue = await prisma?.issue?.delete({where:{id:issueId!}});
        return NextResponse.json(deletedIssue)
    } catch (error) {
        badRequest("Invalid issueId for deleting issue",400)
    }
}

