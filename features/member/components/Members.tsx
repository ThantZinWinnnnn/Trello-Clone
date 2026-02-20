"use client";

import {
  useGetMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/features/member/hooks/member.hooks";
import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import MemberInfoBtn from "./MemberInfoBtn";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { hasBoardPermission } from "@/modules/shared/rbac";

const rolePriority: Record<BoardRole, number> = {
  OWNER: 0,
  ADMIN: 1,
  MEMBER: 2,
  VIEWER: 3,
};

const Members = ({ boardId }: Props) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ?? "";

  const { data: members, isLoading } = useGetMembers(boardId);
  const { mutate: removeMember } = useRemoveMember(boardId, currentUserId);
  const { mutate: updateRole } = useUpdateMemberRole(boardId);

  const currentMember = useMemo(
    () => members?.find((member) => member?.User?.id === currentUserId),
    [members, currentUserId]
  );

  const currentRole: BoardRole =
    currentMember?.role ?? (currentMember?.isAdmin ? "ADMIN" : "MEMBER");
  const canManageMembers = hasBoardPermission(currentRole, "member:manage");

  const sortedMembers = useMemo(() => {
    return (members ?? []).slice(0).sort((a, b) => {
      const aRole = a.role ?? (a.isAdmin ? "ADMIN" : "MEMBER");
      const bRole = b.role ?? (b.isAdmin ? "ADMIN" : "MEMBER");
      return rolePriority[aRole] - rolePriority[bRole];
    });
  }, [members]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 py-1! bg-blue-600 hover:bg-blue-500 text-white hover:text-white h-8 sm:h-9">
          <span className="text-[0.7rem] font-rubik xl:text-sm">Members</span>
          <Users className="w-3 h-3 xl:w-4 xl:h-4 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-gray-700 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Members</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading members...</p>
        ) : sortedMembers.length === 0 ? (
          <p className="text-sm text-slate-500">No members found.</p>
        ) : (
          <section>
            <p className="mb-2 text-xs text-slate-500">
              {canManageMembers
                ? "You can update member roles and remove users."
                : "You have read-only member access."}
            </p>
            <Separator className="my-2" />
            <section className="flex flex-col gap-3">
              {sortedMembers.map((member) => (
                <MemberInfoBtn
                  key={member.id}
                  boardId={boardId}
                  currentUserId={currentUserId}
                  canManageMembers={canManageMembers}
                  member={{
                    memberId: member.id ?? "",
                    userId: member.User?.id ?? "",
                    name: member.User?.name ?? "Unknown user",
                    image: member.User?.image ?? "",
                    role: member.role,
                    isAdmin: member.isAdmin,
                  }}
                  removeMember={removeMember}
                  updateRole={updateRole}
                />
              ))}
            </section>
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Members;
type Props = {
  boardId: string;
};
