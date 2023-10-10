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
import { useGetMembers, useRemoveMember } from "@/lib/hooks/member.hooks";
import SettingMemSk from "@/components/skeleton/SettingMemSk";

const CurrentProjectSettingsPage = () => {

  const params = useParams();
  const { data: session } = useSession();
  const [openConfirmModal, setOpenConfrimModal] = useState(false);
  const router = useRouter();
  const boardId = params.boardId as string;
  const loggedInUser = session?.user;
  const { data: board, isLoading, isFetching } = useGetDetailBoard(boardId);
  const {data:members,isLoading:isLoadingMembers,isFetching:fetchingMembers} = useGetMembers(boardId);
  const currentUserIsAdmin = board?.userId === loggedInUser?.id;
  const {mutate:updateUserBoards} = useDeleteBoard(loggedInUser?.id as string);
  const mId = members?.find(mem=>mem?.User?.id === loggedInUser?.id)?.id;
  const {mutate:leaveBoard} = useRemoveMember(boardId,loggedInUser?.id!)
  const deleteBoardHandler = () => {
    updateUserBoards(boardId);
    router.push("/boards");
  };
  const leaveBoardHandler = ()=>{
    leaveBoard({boardId,userId:loggedInUser?.id!,memberId:mId!})
    router.push("/boards");
  }
  // const {}
  return (
    <section className="pt-3 px-2 sm:px-10 w-full xl:w-[calc(100vw-250px)] h-full overflow-y-scroll pb-12">
      <Breadcrumbs />
      <section className="flex gap-2  mt-5">

      <Avatar className="w-10 h-10">
          <AvatarImage src={loggedInUser?.image!} alt={loggedInUser?.name!} />
          <AvatarFallback>
            {loggedInUser?.name!}
          </AvatarFallback>
        </Avatar>

        <p className="flex flex-col text-xs sm:text-sm">
          <span>{loggedInUser?.name!}</span>
          <span className="text-[0.6rem] sm:text-[0.65rem]">{loggedInUser?.email!}</span>
        </p>
      </section>
      <Separator className="mb-5 sm:mb-10 mt-5" />
      <h5 className="text-lg sm:text-2xl font-semibold text-center my-2 sm:my-6">
        Board Settings
      </h5>
      <section className="flex flex-col gap-3 max-w-[33rem] mx-auto overflow-y-scroll">
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
          disabled={true}
          isLoading={isLoading}
        />
        <BoardInfo
          label="Admin Name"
          connection="adminName"
          value={board?.User?.name!}
          onChange={() => console.log("hi")}
          disabled={true}
          isLoading={isLoading}
        />
        <section className="flex flex-col gap-2">
          <Label className="font-semibold">Board Members</Label>
          <section className="flex flex-wrap gap-3 bg-slate-200 p-1 rounded-md min-h-6 dark:bg-gray-500">
            {
              (isLoadingMembers || fetchingMembers) ? <SettingMemSk/>
              :board?.members?.map((member) => (
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
                    <p className="text-xs font-medium dark:text-white">
                      {member?.User?.name}
                      <span className="ml-1">
                        {member?.isAdmin && "(Admin)"}
                      </span>
                    </p>
                  </div>
                </Badge>
              ))
            }
          </section>
        </section>
        <BoardInfo
          label="GitHub Repository"
          connection="repo"
          value={"https://github.com/Micheal-Winn/Trello-Clone"}
          onChange={() => console.log("hi")}
          disabled={false}
          isLoading={false}
        />
        {/* <p className="text-[0.6rem] sm:text-xs text-red-600 my-2">
          Note : This settings can be changed only by Admin
        </p> */}
        <section className="flex justify-end items-center">
          <ConfirmModal
            open={openConfirmModal}
            title={currentUserIsAdmin ? "Delete Board" : "Leave Board"}
            desc={
              currentUserIsAdmin
                ? "Are you sure want to delete board?If you delete your board , you will permanently lose your board data."
                : "Are you sure want to leave this board?If you leave your board, you will permanently leave this board."
            }
            btnText={currentUserIsAdmin ? "Delete Board" : "Leave Board"}
            onCloseModal={() => setOpenConfrimModal(!openConfirmModal)}
            confrimHandler={currentUserIsAdmin ? deleteBoardHandler : leaveBoardHandler}
          >
            <Button
              className="bg-red-500 text-white hover:bg-red-600 py-1 px-4 text-xs sm:text-base h-8 sm:h-9 mt-4"
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
