import { NextRequest, NextResponse } from "next/server";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardPermission,
  sameColumnReorder,
  tooManyRequests,
  unauthorized,
} from "@/modules/shared/api.utils";
import { isRateLimited } from "@/modules/shared/rate-limit";
import prisma from "@/lib/prisma";
import { logAuditEvent } from "@/modules/shared/audit-events";
import { AuditActionType, EntityType } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorized();
    }

    if (isRateLimited(`list:create:${userId}`, { limit: 60, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const url = new URL(req.url);
    const boardId = url.searchParams.get("boardId");

    if (!isNonEmptyString(boardId)) {
      return badRequest("boardId is required");
    }

    const access = await requireBoardPermission(boardId, userId, "board:read");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const lists = await prisma.list.findMany({
      where: {
        boardId,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(lists);
  } catch {
    return internalServerError("Error while fetching lists");
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorized();
    }

    if (isRateLimited(`list:reorder:${userId}`, { limit: 120, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const body = await req.json();
    const boardId = body?.boardId;
    const listName = typeof body?.listName === "string" ? body.listName.trim() : "";

    if (!isNonEmptyString(boardId) || !isNonEmptyString(listName)) {
      return badRequest("boardId and listName are required");
    }

    if (listName.length > 100) {
      return badRequest("List name must be 100 characters or fewer");
    }

    const access = await requireBoardPermission(boardId, userId, "list:create");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const count = await prisma.list.count({ where: { boardId } });
    const newList = await prisma.list.create({
      data: {
        name: listName,
        order: count + 1,
        boardId,
      },
    });

    await logAuditEvent({
      actorId: userId,
      actionType: AuditActionType.CREATE,
      entityType: EntityType.LIST,
      entityId: newList.id,
      boardId,
      listId: newList.id,
      metadata: {
        name: newList.name,
        order: newList.order,
      },
    });

    return NextResponse.json(newList);
  } catch {
    return internalServerError("Error while creating list");
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorized();
    }

    if (isRateLimited(`list:update:${userId}`, { limit: 120, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const body: orderProps = await req.json();
    const { id, oIdx, nIdx, boardId } = body;

    if (
      !isNonEmptyString(id) ||
      !isNonEmptyString(boardId) ||
      typeof oIdx !== "number" ||
      typeof nIdx !== "number"
    ) {
      return badRequest("Invalid reorder payload");
    }

    const access = await requireBoardPermission(boardId, userId, "list:update");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const list = await prisma.list.findFirst({
      where: { id, boardId },
      select: { id: true },
    });

    if (!list) {
      return badRequest("Invalid listId for the given board");
    }

    const response = await sameColumnReorder(
      { id, oIdx, nIdx },
      { boardId },
      "list"
    );

    await logAuditEvent({
      actorId: userId,
      actionType: AuditActionType.MOVE,
      entityType: EntityType.LIST,
      entityId: id,
      boardId,
      listId: id,
      metadata: {
        fromIndex: oIdx,
        toIndex: nIdx,
      },
    });

    return response;
  } catch {
    return internalServerError("Error while updating list order");
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorized();
    }

    if (isRateLimited(`list:delete:${userId}`, { limit: 60, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const body: UpdateListName = await req.json();
    const { name, listId } = body;

    if (!isNonEmptyString(name) || !isNonEmptyString(listId)) {
      return badRequest("listId and name are required");
    }

    if (name.trim().length > 100) {
      return badRequest("List name must be 100 characters or fewer");
    }

    const list = await prisma.list.findUnique({
      where: { id: listId },
      select: { boardId: true, name: true },
    });

    if (!list?.boardId) {
      return badRequest("Invalid listId");
    }

    const access = await requireBoardPermission(list.boardId, userId, "list:update");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: { name: name.trim() },
    });

    await logAuditEvent({
      actorId: userId,
      actionType: AuditActionType.UPDATE,
      entityType: EntityType.LIST,
      entityId: listId,
      boardId: list.boardId,
      listId,
      metadata: {
        before: {
          name: list.name,
        },
        after: {
          name: updatedList.name,
        },
      },
    });

    return NextResponse.json(updatedList);
  } catch {
    return internalServerError("Error while updating list");
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorized();
    }

    const url = new URL(req.url);
    const listId = url.searchParams.get("listId");

    if (!isNonEmptyString(listId)) {
      return badRequest("listId is required");
    }

    const list = await prisma.list.findUnique({
      where: { id: listId },
      select: { id: true, boardId: true, name: true, order: true },
    });

    if (!list?.boardId) {
      return badRequest("Invalid listId");
    }

    const access = await requireBoardPermission(list.boardId, userId, "list:delete");
    if (!access) {
      return forbidden("You do not have access to this board");
    }

    const deletedList = await prisma.list.delete({
      where: { id: listId },
    });

    await logAuditEvent({
      actorId: userId,
      actionType: AuditActionType.DELETE,
      entityType: EntityType.LIST,
      entityId: deletedList.id,
      boardId: list.boardId,
      listId: deletedList.id,
      metadata: {
        name: list.name,
        order: list.order,
      },
    });

    return NextResponse.json(deletedList);
  } catch {
    return internalServerError("Error while deleting list");
  }
};
