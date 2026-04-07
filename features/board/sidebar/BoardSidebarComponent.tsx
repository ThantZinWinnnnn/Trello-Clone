"use client";

import React, { memo } from "react";
import { useRouter, redirect, useParams } from "next/navigation";
import { DotsHorizontalIcon, LayoutIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import BoardSortDropdown from "./BoardSortDropdown";
import { useBoardStore } from "@/shared/state/zustand.store";
import { useSession } from "next-auth/react";
import { useGetBoards } from "@/features/board/hooks/board.hooks";
import BoardButton from "./BoardButton";
import BoardNameSk from "@/components/skeleton/BoardNameSk";
import { compareByUpdatedAt, sortFun } from "@/shared/utils/util";
import BoardSettingBtn from "@/components/utils/BoardSettingBtn";

const BoardSidebarComponent = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const { data: userBoards, isLoading } = useGetBoards(session);
  const router = useRouter();
  const params = useParams();

  const {
    setBoardName,
    setOpenSetting,
    openSetting,
    setProfileUser,
    setReachedSetting,
    sort,
  } = useBoardStore();

  const boardId = params.boardId as string;
  const createdBoards = userBoards?.createdBoards?.boards ?? [];
  const assignedBoards = userBoards?.assignedBoards ?? [];
  const filteredAssignedBoards = assignedBoards.filter(
    (board) => board?.userId !== session?.user?.id
  );
  const userAllBoards = [...createdBoards, ...filteredAssignedBoards];

  const sortedByAlphaBoards = [...userAllBoards].sort((a, b) => sortFun(a, b));
  const sortedByDateBoards = [...userAllBoards].sort(compareByUpdatedAt);

  const updatedBoards =
    sort === "alpha"
      ? sortedByAlphaBoards
      : sort === "date"
        ? sortedByDateBoards
        : userAllBoards;

  const skeletonRows = new Array(4).fill(0);

  return (
    <aside className="boardforge-panel hidden h-full w-[300px] shrink-0 flex-col justify-between p-3 lg:flex xl:w-[320px] border-r border-slate-200 dark:border-slate-700/60">
      <section>
        <header className="px-2 pb-2">
          <p className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
            BoardForge Workspace
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">
            {updatedBoards.length} active board{updatedBoards.length === 1 ? "" : "s"}
          </p>
        </header>

        <Separator className="my-3" />

        <BoardButton
          setOpenSetting={setOpenSetting}
          setReachedSetting={setReachedSetting}
          btnText="Create Boards"
        />

        <Separator className="my-4" />

        <div className="px-1">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
              Your Boards
            </p>
            <BoardSortDropdown>
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                <DotsHorizontalIcon className="h-4 w-4" />
              </button>
            </BoardSortDropdown>
          </div>

          <section className="mt-3 flex flex-col gap-1.5">
            {isLoading
              ? skeletonRows.map((_, i) => <BoardNameSk key={i} />)
              : updatedBoards.map((board) => (
                <Button
                  key={board.id}
                  variant="ghost"
                  onClick={() => {
                    setProfileUser(session?.user!);
                    setBoardName(board?.name);
                    setOpenSetting(true);
                    setReachedSetting(false);
                    router.push(`/boards/${board?.name}/${board.id}`);
                  }}
                  className={`h-10 justify-start rounded-lg border px-2 text-left transition ${boardId === board.id
                      ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-400/60 dark:bg-blue-500/20 dark:text-blue-200"
                      : "border-transparent bg-transparent text-slate-700 hover:border-slate-200 hover:bg-white/80 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                    }`}
                >
                  <LayoutIcon className="mr-2 h-4 w-4 shrink-0" />
                  <span className="max-w-[220px] truncate text-xs font-medium 2xl:text-sm">
                    {board.name}
                  </span>
                </Button>
              ))}
          </section>
        </div>
      </section>

      {openSetting ? (
        <div className="px-1 pt-3">
          <BoardSettingBtn boardId={boardId} className="mb-0 w-full justify-center" />
        </div>
      ) : null}
    </aside>
  );
};

export default memo(BoardSidebarComponent);
