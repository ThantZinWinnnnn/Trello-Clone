import { describe, expect, it } from "vitest";
import { deriveBoardRole, hasBoardPermission } from "@/modules/shared/rbac";

describe("RBAC", () => {
  it("derives owner role for board owner", () => {
    const role = deriveBoardRole({ isOwner: true, role: "MEMBER", isAdmin: false });
    expect(role).toBe("OWNER");
  });

  it("falls back to admin role from legacy isAdmin flag", () => {
    const role = deriveBoardRole({ isOwner: false, role: null, isAdmin: true });
    expect(role).toBe("ADMIN");
  });

  it("prevents viewer from mutating issue", () => {
    expect(hasBoardPermission("VIEWER", "issue:update")).toBe(false);
    expect(hasBoardPermission("VIEWER", "board:read")).toBe(true);
  });

  it("allows admin to manage members", () => {
    expect(hasBoardPermission("ADMIN", "member:manage")).toBe(true);
  });
});
