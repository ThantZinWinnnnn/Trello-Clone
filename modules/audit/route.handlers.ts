import { NextRequest, NextResponse } from "next/server";
import { AuditActionType, EntityType, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardPermission,
  unauthorized,
} from "@/modules/shared/api.utils";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const asDate = (value: string | null) => {
  if (!isNonEmptyString(value)) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isEntityType = (value: string): value is EntityType => {
  return (Object.values(EntityType) as string[]).includes(value);
};

const isActionType = (value: string): value is AuditActionType => {
  return (Object.values(AuditActionType) as string[]).includes(value);
};

export const GET = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return unauthorized();
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

    const limitParam = Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT);
    const limit = Number.isFinite(limitParam)
      ? Math.max(1, Math.min(limitParam, MAX_LIMIT))
      : DEFAULT_LIMIT;

    const cursor = url.searchParams.get("cursor");
    const actorId = url.searchParams.get("actorId");
    const entityId = url.searchParams.get("entityId");
    const rawEntityType = url.searchParams.get("entityType");
    const rawActionType = url.searchParams.get("actionType");
    const startDate = asDate(url.searchParams.get("startDate"));
    const endDate = asDate(url.searchParams.get("endDate"));

    if (rawEntityType && !isEntityType(rawEntityType)) {
      return badRequest("Invalid entityType");
    }

    if (rawActionType && !isActionType(rawActionType)) {
      return badRequest("Invalid actionType");
    }

    const entityType = rawEntityType && isEntityType(rawEntityType)
      ? rawEntityType
      : undefined;
    const actionType = rawActionType && isActionType(rawActionType)
      ? rawActionType
      : undefined;

    const where: Prisma.AuditEventWhereInput = {
      boardId,
      ...(isNonEmptyString(actorId) ? { actorId } : {}),
      ...(isNonEmptyString(entityId) ? { entityId } : {}),
      ...(entityType ? { entityType } : {}),
      ...(actionType ? { actionType } : {}),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate ? { lte: endDate } : {}),
            },
          }
        : {}),
    };

    const events = await prisma.auditEvent.findMany({
      where,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],
      ...(isNonEmptyString(cursor)
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
      take: limit + 1,
    });

    const hasMore = events.length > limit;
    const items = hasMore ? events.slice(0, limit) : events;
    const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;

    return NextResponse.json({
      items,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("[audit] fetch failed", error);
    return internalServerError("Error while fetching audit events");
  }
};
