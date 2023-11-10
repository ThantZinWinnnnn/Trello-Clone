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
import moment from "moment";
import { sortFun } from "../utils/util";
import BoardSettingBtn from "../utils/BoardSettingBtn";

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
    sort,
  } = useBoardStore();
  const boardId = params.boardId as string;
  const createdBoards = userBoards?.createdBoards?.boards! ?? [];
  const assignedBoards = userBoards?.assignedBoards ?? [];
  const filteredAssignedBoards = assignedBoards?.filter(
    (board) => board?.userId !== session?.user?.id
  );
  const userAllBoards = [...createdBoards!, ...filteredAssignedBoards!];
  const skArr = new Array(3).fill(0);

  const sortedByAlphaBoards = userAllBoards?.sort((a, b) => sortFun(a, b));
  const sortedByDateBoards = userAllBoards?.sort((a, b) =>
    moment(a.updatedAt).diff(moment(b.updatedAt), "days")
  );

  const updatedBoards =
    sort === "alpha"
      ? sortedByAlphaBoards
      : sort === "date"
      ? sortedByDateBoards
      : userAllBoards;
  // console.log("sort", sort);
  // console.log('path',pathname.includes('trelloprojectboard'))
  return (
    <section className="hidden lg:!flex flex-col justify-between  w-[280px] lg:w-[450px] xl:w-[320px] border-r-[1px] border-gray-300 h-[calc(100vh-48px)] opacity-95 bg-[#F4F5F7] p-2 dark:bg-gray-700">
      <section className="">
        <h1 className="text-sm 2xl:text-xl font-semibold text-center">
          Trello Workspace
        </h1>
        <Separator className="my-4 dark:bg-white" />
        <section className="pl-5 flex flex-col space-y-3">
          <BoardButton
            setOpenSetting={setOpenSetting}
            setReachedSetting={setReachedSetting}
            btnText="Create Boards"
          />
          {/* <Link
            href={"/highlights"}
            className="flex items-center gap-7 text-base w-[95%] text-black hover:bg-blue-600 hover:text-white py-2 px-2 rounded-sm cursor-pointer"
          >
            <HeartIcon className="w-5 h-5" />
            <p className="font-medium">HighLights</p>
          </Link> */}
        </section>
        <Separator className="my-6 dark:bg-white" />
        {/* to make boards array */}

        <section>
          <div className="w-full px-2 flex justify-between items-center">
            <p className="text-sm 2xl:text-base">Your boards</p>
            <div className="flex items-center gap-3 group relative">
              <BoardSortDropdown>
                <DotsHorizontalIcon className="w-4 h-4 cursor-pointer" />
              </BoardSortDropdown>
            </div>
          </div>
          <section className="pt-4 flex flex-col gap-2">
            {isLoading
              ? skArr.map((_, i) => <BoardNameSk key={i} />)
              : updatedBoards?.map((board) => (
                  <Button
                    key={board.id}
                    variant={"ghost"}
                    onClick={() => {
                      setProfileUser(session?.user!);
                      setBoardName(board?.name);
                      setOpenSetting(true);
                      setReachedSetting(false);
                      router.push(`/boards/${board?.name}/${board.id}`);
                    }}
                    className={`hover:bg-slate-300 hover:text-blue-700 w-full ${
                      boardId === board.id && "bg-slate-300 text-blue-700"
                    } flex justify-start`}
                  >
                    <LayoutIcon className="w-5 h-5 mr-2" />
                    <span className="text-[0.7rem] font-rubik 2xl:text-sm overflow-hidden text-ellipsis">
                      {board.name}
                    </span>
                  </Button>
                ))}
          </section>
        </section>
      </section>
      {openSetting ? (
        <BoardSettingBtn boardId={boardId}/>
      ) : null}
    </section>
  );
};

export default memo(BoardSidebarComponent);
