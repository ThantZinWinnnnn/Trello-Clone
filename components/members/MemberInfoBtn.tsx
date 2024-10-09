"use client";
import React, { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ExternalLink, UserX } from "lucide-react";
import { useSession } from "next-auth/react";
import { UseMutateFunction } from "@tanstack/react-query";

const MemberInfoBtn: React.FC<MemberInfoBtnProps> = ({
  imgUrl,
  name,
  isAdmin,
  userId,
  adminId,
  bId,
  mId,
  mutate,
}) => {
  const { data: session } = useSession();
  const admin = session?.user?.id === adminId;
  return (
    <section className="flex items-center justify-between w-full">
      <section className="flex gap-2 items-center">
        <Avatar className="w-7 h-7">
          <AvatarImage src={imgUrl} alt={name} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium">
          {name} <span className="ml-2">{isAdmin && "(Admin)"}</span>
        </span>
      </section>
      {(session?.user?.id === userId || admin) && (
        <Button
          variant={"ghost"}
          disabled={isAdmin!}
          className="text-xs flex gap-1 items-center hover:text-red-600"
          onClick={() => {
            mutate({ boardId: bId!, userId, memberId: mId! });
          }}
        >
          {admin ? (
            <UserX className="w-3 h-3" />
          ) : (
            <ExternalLink className="w-3 h-3" />
          )}
          {admin ? "Remove" : "Leave"}
        </Button>
      )}
    </section>
  );
};

export default memo(MemberInfoBtn);

interface MemberInfoBtnProps {
  imgUrl: string;
  name: string;
  isAdmin: boolean;
  userId: string;
  adminId: string;
  bId?: string;
  mId?: string;
  mutate: UseMutateFunction<
    any,
    unknown,
    RemoveMember,
    {
      previousMembers: unknown;
    }
  >;
}
