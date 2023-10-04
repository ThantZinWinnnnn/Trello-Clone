"use client";
import React, { memo } from "react";
// to remove below import to button array components
import { useRouter, usePathname, redirect, useParams } from "next/navigation";

//icon
import {
  HeartIcon,
  PlusIcon,
  DotsHorizontalIcon,
  LayoutIcon,
} from "@radix-ui/react-icons";

//components
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import BoardSortDropdown from "./BoardSortDropdown";
import Link from "next/link";
import { useBoardStore } from "@/globalState/store/zustand.store";
import { useSession } from "next-auth/react";
import { useGetBoards } from "@/lib/hooks/board.hooks";
import { Settings } from "lucide-react";
import BoardButton from "./BoardButton";
import BoardNameSk from "../skeleton/BoardNameSk";

const BoardSidebarComponent = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const {
    data: userBoards,
    isLoading,
    isSuccess,
    isFetching,
    isError,
  } = useGetBoards(session);
  const router = useRouter();
  const params = useParams();
  const {
    boards,
    setBoardName,
    setOpenSetting,
    openSetting,
    setProfileUser,
    setReachedSetting,
  } = useBoardStore();
  const boardId = params.boardId as string;
  const createdBoards = userBoards?.createdBoards?.boards! ?? [];
  const assignedBoards = userBoards?.assignedBoards ?? [];
  const filteredAssignedBoards = assignedBoards?.filter(
    (board) => board?.userId !== session?.user?.id
  );
  const userAllBoards = [...createdBoards!, ...filteredAssignedBoards!];
  const skArr = new Array(3).fill(0)
  console.log("boardsss", boards);
  // console.log('path',pathname.includes('trelloprojectboard'))
  return (
    <section className="flex flex-col justify-between w-[250px] border-r-[1px] border-gray-300 h-[calc(100vh-48px)] opacity-95 bg-[#F4F5F7] p-2">
      <section>
        <h1 className="text-xl font-semibold text-center">Trello Workspace</h1>
        <Separator className="my-4" />
        <section className="pl-5 flex flex-col space-y-3">
          <BoardButton
            setOpenSetting={setOpenSetting}
            setReachedSetting={setReachedSetting}
            btnText="Create Boards"
          />
          <Link
            href={"/highlights"}
            className="flex items-center gap-7 text-base w-[95%] text-black hover:bg-blue-600 hover:text-white py-2 px-2 rounded-sm cursor-pointer"
          >
            <HeartIcon className="w-5 h-5" />
            <p className="font-rubik">HighLights</p>
          </Link>
        </section>
        <Separator className="my-6" />
        {/* to make boards array */}

        <section>
          <div className="w-full px-2 flex justify-between items-center">
            <p className="font-rubik">Your boards</p>
            <div className="flex items-center gap-3 group relative">
              <BoardSortDropdown>
                <DotsHorizontalIcon className="w-4 h-4 cursor-pointer" />
              </BoardSortDropdown>
              <PlusIcon className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
          <section className="pt-4 flex flex-col gap-2">
            {
              isLoading ? skArr.map((_,i)=><BoardNameSk key={i} />) :
              userAllBoards?.map((board) => (
                <Button
                  key={board.id}
                  variant={"ghost"}
                  onClick={() => {
                    setProfileUser(session?.user!);
                    setBoardName(board?.name);
                    setOpenSetting(true);
                    setReachedSetting(false);
                    router.push(`/boards/${board.id}`);
                  }}
                  className={`hover:bg-slate-300 hover:text-blue-700 w-full ${
                    boardId === board.id && "bg-slate-300 text-blue-700"
                  } flex justify-start`}
                >
                  <LayoutIcon className="w-5 h-5 mr-2" />
                  <span>{board.name}</span>
                </Button>
              ))
            }
          </section>
        </section>
      </section>
      {openSetting ? (
        <Button
          className="flex gap-2 bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => {
            setReachedSetting(true);
            router.push(`/boards/${boardId}/settings`);
          }}
        >
          Project Settings <Settings className="w-4 h-4" />
        </Button>
      ) : null}
    </section>
  );
};

export default memo(BoardSidebarComponent);
