"use client";
import { useGetMembers, useRemoveMember } from "@/lib/hooks/member.hooks";
import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Users, ExternalLink, UserX } from "lucide-react";
import MemberInfoBtn from "./MemberInfoBtn";
import { Separator } from "../ui/separator";

const Members = ({ boardId }: Props) => {
  const { data: members, isLoading } = useGetMembers(boardId);
  const {mutate:removeMember} = useRemoveMember(boardId)
  const admin = useMemo(
    () => members?.find((mem) => mem?.isAdmin === true),
    [members]
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2  bg-blue-600 hover:bg-blue-500 text-white hover:text-white"
          // onClick={handler}
        >
          <span className="text-sm">Members</span>
          <Users className="w-4 h-4 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Members</DialogHeader>
        <section>
          {isLoading ? (
            <h1>Loading...</h1>
          ) : (
            <section>
              <MemberInfoBtn
                imgUrl={admin?.User?.image!}
                name={admin?.User?.name!}
                isAdmin={admin?.isAdmin!}
                userId={admin?.User?.id!}
                adminId={admin?.User?.id!}
                mutate={()=>{}}
              />
              <Separator className="my-2" />
              <section className="flex flex-col gap-3">
                {members?.map(
                  (usr) =>
                    usr?.isAdmin === false && (
                      <MemberInfoBtn
                        key={usr?.id}
                        imgUrl={usr?.User?.image!}
                        name={usr?.User?.name!}
                        isAdmin={usr?.isAdmin!}
                        userId={usr?.User?.id!}
                        adminId={admin?.User?.id!}
                        bId={boardId}
                        mId={usr?.id!}
                        mutate={removeMember}
                      />
                    )
                )}
              </section>
            </section>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default Members;
type Props = {
  boardId: string;
};
