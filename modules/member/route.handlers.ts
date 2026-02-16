import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardAdmin,
  requireBoardMember,
  tooManyRequests,
  unauthorized,
} from "@/modules/shared/api.utils";
import { isRateLimited } from "@/modules/shared/rate-limit";

export const GET = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    if (isRateLimited(`member:get:${authUserId}`, { limit: 60, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const url = new URL(req.url);
    const boardId = url.searchParams.get("boardId");

    if (!isNonEmptyString(boardId)) {
      return badRequest("boardId is required");
    }

    const member = await requireBoardMember(boardId, authUserId);
    if (!member) {
      return forbidden("You do not have access to this board");
    }

    const members = await prisma.member.findMany({
      where: {
        boardId,
      },
      include: {
        User: true,
      },
    });
    return NextResponse.json(members);
  } catch {
    return internalServerError("Error while fetching members");
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    if (isRateLimited(`member:add:${authUserId}`, { limit: 60, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const body: AddMember = await req.json();
    const { boardId, userId } = body;

    if (!isNonEmptyString(boardId) || !isNonEmptyString(userId)) {
      return badRequest("boardId and userId are required");
    }

    const admin = await requireBoardAdmin(boardId, authUserId);
    if (!admin) {
      return forbidden("Only board admins can add members");
    }

    const alreadyMember = await prisma.member.findFirst({
      where: { boardId, userId },
      select: { id: true },
    });

    if (alreadyMember) {
      return badRequest("Member is already part of this board");
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return badRequest("User not found");
    }

    const member = await prisma.member.create({
      data: {
        boardId,
        userId,
      },
    });

    await prisma.board.update({
      where: { id: boardId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(member);
  } catch {
    return internalServerError("Error while adding member");
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    const body: RemoveMember = await req.json();
    const { boardId, userId, memberId } = body;

    if (
      !isNonEmptyString(boardId) ||
      !isNonEmptyString(userId) ||
      !isNonEmptyString(memberId)
    ) {
      return badRequest("boardId, userId and memberId are required");
    }

    const actingMember = await requireBoardMember(boardId, authUserId);
    if (!actingMember) {
      return forbidden("You do not have access to this board");
    }

    const isSelfLeave = authUserId === userId;
    if (!actingMember.isAdmin && !isSelfLeave) {
      return forbidden("Only board admins can remove other members");
    }

    const targetMember = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        isAdmin: true,
      },
    });

    if (!targetMember) {
      return badRequest("Invalid memberId");
    }

    if (targetMember.isAdmin) {
      const adminCount = await prisma.member.count({
        where: {
          boardId,
          isAdmin: true,
        },
      });

      if (adminCount <= 1) {
        return badRequest("Board must have at least one admin");
      }
    }

    await prisma.member.delete({ where: { id: memberId } });
    await prisma.assignee.deleteMany({
      where: {
        userId,
        boardId,
      },
    });
    await prisma.board.update({
      where: { id: boardId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch {
    return internalServerError("Error while removing member");
  }
};
