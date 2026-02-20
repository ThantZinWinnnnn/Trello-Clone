export type BoardPermission =
  | "board:read"
  | "board:update"
  | "board:delete"
  | "member:manage"
  | "list:create"
  | "list:update"
  | "list:delete"
  | "issue:create"
  | "issue:update"
  | "issue:move"
  | "issue:delete"
  | "comment:create"
  | "comment:update"
  | "comment:delete"
  | "attachment:upload"
  | "attachment:read";

export type AppBoardRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

const OWNER_PERMISSIONS = new Set<BoardPermission>([
  "board:read",
  "board:update",
  "board:delete",
  "member:manage",
  "list:create",
  "list:update",
  "list:delete",
  "issue:create",
  "issue:update",
  "issue:move",
  "issue:delete",
  "comment:create",
  "comment:update",
  "comment:delete",
  "attachment:upload",
  "attachment:read",
]);

const ADMIN_PERMISSIONS = new Set<BoardPermission>([
  "board:read",
  "board:update",
  "member:manage",
  "list:create",
  "list:update",
  "list:delete",
  "issue:create",
  "issue:update",
  "issue:move",
  "issue:delete",
  "comment:create",
  "comment:update",
  "comment:delete",
  "attachment:upload",
  "attachment:read",
]);

const MEMBER_PERMISSIONS = new Set<BoardPermission>([
  "board:read",
  "list:create",
  "list:update",
  "issue:create",
  "issue:update",
  "issue:move",
  "comment:create",
  "comment:update",
  "comment:delete",
  "attachment:upload",
  "attachment:read",
]);

const VIEWER_PERMISSIONS = new Set<BoardPermission>([
  "board:read",
  "attachment:read",
]);

export const ROLE_PERMISSIONS: Record<AppBoardRole, Set<BoardPermission>> = {
  OWNER: OWNER_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
  MEMBER: MEMBER_PERMISSIONS,
  VIEWER: VIEWER_PERMISSIONS,
};

export const hasBoardPermission = (
  role: AppBoardRole,
  permission: BoardPermission
) => {
  return ROLE_PERMISSIONS[role].has(permission);
};

export const deriveBoardRole = (input: {
  isOwner: boolean;
  role?: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER" | null;
  isAdmin?: boolean | null;
}): AppBoardRole => {
  const { isOwner, role, isAdmin } = input;

  if (isOwner) {
    return "OWNER";
  }

  if (role) {
    return role;
  }

  return isAdmin ? "ADMIN" : "MEMBER";
};

export const normalizeRoleToAdminFlag = (
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
) => {
  return role === "OWNER" || role === "ADMIN";
};
