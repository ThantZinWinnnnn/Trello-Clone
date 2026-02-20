import { NextRequest, NextResponse } from "next/server";
import { AuditActionType, EntityType } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardPermission,
  tooManyRequests,
  unauthorized,
} from "@/modules/shared/api.utils";
import {
  AppBoardRole,
  hasBoardPermission,
  normalizeRoleToAdminFlag,
} from "@/modules/shared/rbac";
import { isRateLimited } from "@/modules/shared/rate-limit";
import { logAuditEvent } from "@/modules/shared/audit-events";

const MANAGEABLE_ROLES = new Set<AppBoardRole>([
  "ADMIN",
  "MEMBER",
  "VIEWER",
]);

const resolveMemberRole = (
  role: unknown
): Exclude<AppBoardRole, "OWNER"> => {
  if (role === "ADMIN" || role === "MEMBER" || role === "VIEWER") {
    return role;
  }

  return "MEMBER";
};

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

    const access = await requireBoardPermission(boardId, authUserId, "board:read");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const members = await prisma.member.findMany({
      where: { boardId },
      include: { User: true },
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
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
    const role = resolveMemberRole(body?.role);

    if (!isNonEmptyString(boardId) || !isNonEmptyString(userId)) {
      return badRequest("boardId and userId are required");
    }

    const access = await requireBoardPermission(boardId, authUserId, "board:read");
    if (!access || !hasBoardPermission(access.role, "member:manage")) {
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
        role,
        isAdmin: normalizeRoleToAdminFlag(role),
      },
    });

    await prisma.board.update({
      where: { id: boardId },
      data: { updatedAt: new Date() },
    });

    await logAuditEvent({
      actorId: authUserId,
      actionType: AuditActionType.CREATE,
      entityType: EntityType.MEMBER,
      entityId: member.id,
      boardId,
      metadata: {
        targetUserId: userId,
        role,
      },
    });

    return NextResponse.json(member);
  } catch {
    return internalServerError("Error while adding member");
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    const body = await req.json();
    const boardId = body?.boardId;
    const memberId = body?.memberId;
    const role = resolveMemberRole(body?.role);

    if (!isNonEmptyString(boardId) || !isNonEmptyString(memberId)) {
      return badRequest("boardId and memberId are required");
    }

    if (!MANAGEABLE_ROLES.has(role)) {
      return badRequest("Invalid role");
    }

    const access = await requireBoardPermission(boardId, authUserId, "board:read");
    if (!access || !hasBoardPermission(access.role, "member:manage")) {
      return forbidden("Only board admins can change member roles");
    }

    const [targetMember, board] = await Promise.all([
      prisma.member.findUnique({
        where: { id: memberId },
        select: {
          id: true,
          userId: true,
          boardId: true,
          role: true,
          isAdmin: true,
        },
      }),
      prisma.board.findUnique({
        where: { id: boardId },
        select: { userId: true },
      }),
    ]);

    if (!targetMember || targetMember.boardId !== boardId) {
      return badRequest("Invalid memberId for board");
    }

    if (board?.userId === targetMember.userId) {
      return badRequest("Board owner role cannot be changed");
    }

    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        role,
        isAdmin: normalizeRoleToAdminFlag(role),
      },
    });

    await logAuditEvent({
      actorId: authUserId,
      actionType: AuditActionType.ROLE_CHANGED,
      entityType: EntityType.MEMBER,
      entityId: updatedMember.id,
      boardId,
      metadata: {
        targetUserId: updatedMember.userId,
        before: {
          role: targetMember.role,
          isAdmin: targetMember.isAdmin,
        },
        after: {
          role: updatedMember.role,
          isAdmin: updatedMember.isAdmin,
        },
      },
    });

    return NextResponse.json(updatedMember);
  } catch {
    return internalServerError("Error while updating member role");
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

    const access = await requireBoardPermission(boardId, authUserId, "board:read");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const isSelfLeave = authUserId === userId;
    if (!isSelfLeave && !hasBoardPermission(access.role, "member:manage")) {
      return forbidden("Only board admins can remove other members");
    }

    const [targetMember, board] = await Promise.all([
      prisma.member.findUnique({
        where: { id: memberId },
        select: {
          id: true,
          role: true,
          isAdmin: true,
          userId: true,
          boardId: true,
        },
      }),
      prisma.board.findUnique({
        where: { id: boardId },
        select: { userId: true },
      }),
    ]);

    if (!targetMember || targetMember.boardId !== boardId) {
      return badRequest("Invalid memberId");
    }

    if (board?.userId === targetMember.userId) {
      return badRequest("Board owner cannot be removed");
    }

    const targetIsAdmin = normalizeRoleToAdminFlag(
      targetMember.role ?? (targetMember.isAdmin ? "ADMIN" : "MEMBER")
    );

    if (targetIsAdmin) {
      const adminCount = await prisma.member.count({
        where: {
          boardId,
          OR: [{ role: "ADMIN" }, { role: "OWNER" }, { isAdmin: true }],
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

    await logAuditEvent({
      actorId: authUserId,
      actionType: AuditActionType.DELETE,
      entityType: EntityType.MEMBER,
      entityId: memberId,
      boardId,
      metadata: {
        targetUserId: userId,
        role: targetMember.role,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return internalServerError("Error while removing member");
  }
};
