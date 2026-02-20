import { describe, expect, it } from "vitest";
import { AuditActionType, EntityType, Prisma } from "@prisma/client";
import { createAuditEventPayload } from "@/modules/shared/audit-events";

describe("createAuditEventPayload", () => {
  it("normalizes optional fields to null/json null", () => {
    const payload = createAuditEventPayload({
      actorId: "user-1",
      actionType: AuditActionType.CREATE,
      entityType: EntityType.ISSUE,
      entityId: "issue-1",
      boardId: "board-1",
    });

    expect(payload).toMatchObject({
      actorId: "user-1",
      entityId: "issue-1",
      boardId: "board-1",
      issueId: null,
      listId: null,
      commentId: null,
    });
    expect(payload.metadata).toBe(Prisma.JsonNull);
  });

  it("keeps metadata when provided", () => {
    const payload = createAuditEventPayload({
      actorId: "user-1",
      actionType: AuditActionType.UPDATE,
      entityType: EntityType.ISSUE,
      entityId: "issue-1",
      boardId: "board-1",
      metadata: { field: "summary", before: "old", after: "new" },
    });

    expect(payload.metadata).toEqual({
      field: "summary",
      before: "old",
      after: "new",
    });
  });
});
