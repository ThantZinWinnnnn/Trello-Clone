import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { badRequest } from "../utils/api.utils";

//get all users
export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const q = url.searchParams.get("query");
        const users = await prisma.user.findMany({
            where:{
                name:{contains:q!}
            },
        });
        return NextResponse.json(users);
    } catch (error) {

        return badRequest("Getting Users Errors", 500)
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { boardId } = body;
        const user = await prisma.assignee.findMany({
            where: {
                boardId
            },
            select: {
                User: true,
            }

        });

        const users = user.reduce((usrArr, { User }) => {
            if (!usrArr.find(usr => usr.id === User?.id!)) {
                usrArr.push(User!)
            }
            return usrArr
        }, [] as Array<UserProps>)
        return NextResponse.json(users);
    } catch (error) {

        return badRequest("Getting User Errors", 500)
    }
}


