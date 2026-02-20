"use client";

import React, { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, UserX } from "lucide-react";
import { UseMutateFunction } from "@tanstack/react-query";

type UpdateRoleFn = (input: {
  boardId: string;
  memberId: string;
  role: Exclude<BoardRole, "OWNER">;
}) => void;

const MemberInfoBtn: React.FC<MemberInfoBtnProps> = ({
  boardId,
  member,
  currentUserId,
  canManageMembers,
  removeMember,
  updateRole,
}) => {
  const isCurrentUser = currentUserId === member.userId;
  const memberRole = member.role ?? (member.isAdmin ? "ADMIN" : "MEMBER");
  const isOwner = memberRole === "OWNER";
  const canRemove = !isOwner && (isCurrentUser || canManageMembers);
  const canChangeRole = canManageMembers && !isOwner;

  return (
    <section className="flex items-center justify-between w-full gap-2">
      <section className="flex gap-2 items-center min-w-0">
        <Avatar className="w-7 h-7">
          <AvatarImage src={member.image} alt={member.name} />
          <AvatarFallback>{member.name}</AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium truncate">
          {member.name}
          <span className="ml-2 text-slate-500">({memberRole})</span>
        </span>
      </section>

      <section className="flex items-center gap-2">
        {canChangeRole ? (
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] dark:bg-gray-800"
            value={memberRole}
            onChange={(event) =>
              updateRole({
                boardId,
                memberId: member.memberId,
                role: event.target.value as Exclude<BoardRole, "OWNER">,
              })
            }
          >
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
            <option value="VIEWER">Viewer</option>
          </select>
        ) : null}

        {canRemove ? (
          <Button
            variant={"ghost"}
            className="text-xs flex gap-1 items-center hover:text-red-600"
            onClick={() => {
              removeMember({
                boardId,
                userId: member.userId,
                memberId: member.memberId,
              });
            }}
          >
            {isCurrentUser ? (
              <ExternalLink className="w-3 h-3" />
            ) : (
              <UserX className="w-3 h-3" />
            )}
            {isCurrentUser ? "Leave" : "Remove"}
          </Button>
        ) : null}
      </section>
    </section>
  );
};

export default memo(MemberInfoBtn);

interface MemberInfoBtnProps {
  boardId: string;
  currentUserId: string;
  canManageMembers: boolean;
  member: {
    memberId: string;
    userId: string;
    name: string;
    image: string;
    role?: BoardRole | null;
    isAdmin?: boolean | null;
  };
  removeMember: UseMutateFunction<
    any,
    unknown,
    RemoveMember,
    {
      previousMembers: unknown;
    }
  >;
  updateRole: UpdateRoleFn;
}
