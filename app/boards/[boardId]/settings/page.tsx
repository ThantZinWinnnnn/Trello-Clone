"use client";
import Breadcrumbs from "@/components/utils/Breadcrumbs";
import React, { useState } from "react";

import { Separator } from "@/components/ui/separator";
import { useDeleteBoard, useGetDetailBoard } from "@/lib/hooks/board.hooks";
import { useParams, useRouter } from "next/navigation";
import BoardInfo from "@/components/setting/BoardInfo";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ConfirmModal from "@/components/utils/ConfirmModal";

const CurrentProjectSettingsPage = () => {
  const params = useParams();
  const { data: session } = useSession();
  const [openConfirmModal, setOpenConfrimModal] = useState(false);
  const router = useRouter();
  const boardId = params.boardId as string;
  const loggedInUser = session?.user;
  const { data: board, isLoading, isFetching } = useGetDetailBoard(boardId);
  const {mutate:deleteBoard} = useDeleteBoard(boardId,session?.user?.id!)
  const currentUserIsAdmin = board?.userId === loggedInUser?.id;
  const deleteBoardHandler = () => {
    deleteBoard(boardId);
    router.push("/boards");
  }
  // const {}
  return (
    <section className="pt-3 px-10 w-[calc(100vw-251px)]">
      <Breadcrumbs />
      <Separator className="my-10" />
      <h5 className="text-2xl font-semibold text-center my-6">
        Board Settings
      </h5>
      <section className="flex flex-col gap-3 max-w-[33rem] mx-auto">
        <section className="relative w-full h-24 rounded-md overflow-hidden">
          <Image
            src={"/photos/board-bg.jpeg"}
            fill
            alt="board image"
            style={{ objectFit: "cover" }}
          />
        </section>
        <BoardInfo
          label="Board Name"
          connection="boardName"
          value={board?.name!}
          onChange={() => console.log("hi")}
          disabled={!currentUserIsAdmin}
        />
        <BoardInfo
          label="Admin Name"
          connection="adminName"
          value={board?.User?.name!}
          onChange={() => console.log("hi")}
          disabled={true}
        />
        <section className="flex flex-col gap-2">
          <Label className="font-semibold">Board Members</Label>
          <section className="flex flex-wrap gap-3 bg-slate-200 p-1 rounded-md">
            {board?.members?.map((member) => (
              <Badge
                key={member?.userId}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <div className="flex items-center gap-2 p-1">
                  <Avatar className="w-6 h-6 ring-offset-background">
                    <AvatarImage
                      src={member?.User?.image!}
                      alt={member.User?.name!}
                    />
                    <AvatarFallback>{member?.User?.name}</AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-medium">
                    {member?.User?.name}
                    <span className="ml-1">
                      {currentUserIsAdmin && "(Admin)"}
                    </span>
                  </p>
                </div>
              </Badge>
            ))}
          </section>
        </section>
        <BoardInfo
          label="GitHub Repository"
          connection="repo"
          value={"https://github.com/Micheal-Winn/Trello-Clone"}
          onChange={() => console.log("hi")}
          disabled={false}
        />
        <p className="text-xs text-red-600 my-2">
          Note : This settings can be changed only by Admin
        </p>
        <section className="flex justify-end items-center">
          <ConfirmModal
            open={openConfirmModal}
            title={currentUserIsAdmin ? "Delete Board" : "Leave Board"}
            desc={
              currentUserIsAdmin
                ? "Are you sure want to delete board?If you delete your board , you will permanently lose your board data."
                : "Are you sure want to leave this board?If you leave your board, you will permanently leave this board."
            }
            btnText="Delete Board"
            onCloseModal={() => setOpenConfrimModal(!openConfirmModal)}
            confrimHandler={deleteBoardHandler}
          >
            <Button
              className="bg-red-500 text-white hover:bg-red-600 py-1 px-4"
              onClick={() => setOpenConfrimModal(!openConfirmModal)}
            >
              {currentUserIsAdmin ? "Delete Board" : "Leave Board"}
            </Button>
          </ConfirmModal>
        </section>
      </section>
    </section>
  );
};

export default CurrentProjectSettingsPage;
