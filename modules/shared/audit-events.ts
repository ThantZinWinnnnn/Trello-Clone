import { AuditActionType, EntityType, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { publishBoardEvent } from "@/modules/shared/realtime";

export type AuditMetadata = Prisma.InputJsonValue;

export type CreateAuditEventInput = {
  actorId?: string | null;
  actionType: AuditActionType;
  entityType: EntityType;
  entityId: string;
  boardId: string;
  issueId?: string | null;
  listId?: string | null;
  commentId?: string | null;
  metadata?: AuditMetadata;
};

export const createAuditEventPayload = (input: CreateAuditEventInput) => {
  return {
    actorId: input.actorId ?? null,
    actionType: input.actionType,
    entityType: input.entityType,
    entityId: input.entityId,
    boardId: input.boardId,
    issueId: input.issueId ?? null,
    listId: input.listId ?? null,
    commentId: input.commentId ?? null,
    metadata: input.metadata ?? Prisma.JsonNull,
  };
};

export const logAuditEvent = async (input: CreateAuditEventInput) => {
  try {
    const event = await prisma.auditEvent.create({
      data: createAuditEventPayload(input),
    });

    publishBoardEvent(input.boardId, "audit.event.created", {
      id: event.id,
      actionType: event.actionType,
      entityType: event.entityType,
      entityId: event.entityId,
      issueId: event.issueId,
      listId: event.listId,
      commentId: event.commentId,
      actorId: event.actorId,
      createdAt: event.createdAt.toISOString(),
      metadata: event.metadata as Record<string, unknown> | null,
    });

    return event;
  } catch (error) {
    // Auditing is best-effort: business action should not fail on log sink errors.
    console.error("[audit] failed to persist event", error);
    return null;
  }
};
