import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { badRequest } from "../utils/api.utils";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const boardId = url.searchParams.get("boardId");
    const members = await prisma?.member.findMany({
      where: {
        boardId: boardId!,
      },
      include: {
        User: true,
      },
    });
    return NextResponse.json(members);
  } catch (error) {}
};

export const POST = async (req: NextRequest) => {
  try {
    const body: AddMember = await req.json();
    const { boardId, userId } = body;
    const member = await prisma?.member.create({
      data: {
        boardId,
        userId,
      },
    });
    const board = await prisma?.board?.update({
      where: { id: boardId },
      data: { updatedAt: new Date(Date.now()).toISOString() },
    });
    const result = Promise.all([member, board]);
    return NextResponse.json(result);
  } catch (error) {
    badRequest("Error Adding Member in board", 400);
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const body: RemoveMember = await req.json();
    const {boardId, userId, memberId: id } = body;
    const member = await prisma?.member.delete({ where: { id } });
    const removeAssignee = await prisma?.assignee.deleteMany({
      where: { AND: { userId, boardId } },
    });
    const board = await prisma?.board?.update({
      where: { id: boardId },
      data: { updatedAt: new Date(Date.now()).toISOString() },
    });
    const result = Promise.all([member,removeAssignee,board]);
    return NextResponse.json(result)
  } catch (error) {
    badRequest("Error removing for member in board",400)
  }
};
