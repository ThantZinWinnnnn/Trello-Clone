"use client";

import Breadcrumbs from "@/components/utils/Breadcrumbs";
import React, { useMemo, useState } from "react";
import IssueFilterByMem from "@/features/board/components/IssueFilterByMem";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "@/features/issue/dnd/Column";
import CreateNewList from "@/features/board/components/CreateNewList";
import { useGetIssues, useReorderIssues } from "@/features/issue/hooks/issue.hooks";
import { useReorderLists } from "@/features/board/hooks/list.hooks";
import { useGetLists } from "@/features/board/hooks/list.hooks";
import AddMemberModal from "@/features/member/components/AddMemberModal";
import { useBoardStore } from "@/shared/state/zustand.store";
import { useAddMember, useGetMembers } from "@/features/member/hooks/member.hooks";
import { useGetUsers } from "@/features/user/hooks/user.hooks";
import { Button } from "@/components/ui/button";
import Members from "@/features/member/components/Members";
import { useSession } from "next-auth/react";
import ListSkeleton from "@/components/skeleton/ListSkeleton";
import useDebounce from "@/components/utils/useDebounce";
import BoardSettingBtn from "@/components/utils/BoardSettingBtn";

import axios from "axios";
import { hasBoardPermission } from "@/modules/shared/rbac";
type Params = {
  params: {
    boardId: string;
  };
};

const Board = ({ params: { boardId } }: Params) => {
  const [openAddMemModal, setOpenAddMemModal] = useState(false);
  const [conflictNotice, setConflictNotice] = useState<string | null>(null);
  const { data: session } = useSession();

  const { memberName } = useBoardStore();
  const debounceValue = useDebounce(memberName, 500)
  const { mutate: addMember } = useAddMember(boardId);
  const {
    data: users = [],
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    isError: isUsersError,
  } = useGetUsers(debounceValue, boardId);
  const { data: lists } = useGetLists(boardId);
  const { mutate: reorderIssues } = useReorderIssues(boardId);
  const { mutate: reorderLists } = useReorderLists(boardId);
  const { data: boardMembers } = useGetMembers(boardId);
  const { data: issues, isLoading } = useGetIssues(boardId);
  const user = session?.user;
  const currentMember = useMemo(
    () => boardMembers?.find((member) => member?.User?.id === user?.id),
    [boardMembers, user?.id]
  );
  const currentRole: BoardRole = useMemo(
    () => currentMember?.role ?? (currentMember?.isAdmin ? "ADMIN" : "MEMBER"),
    [currentMember]
  );
  const canManageMembers = hasBoardPermission(currentRole, "member:manage");
  const canCreateList = hasBoardPermission(currentRole, "list:create");
  const canReorderBoard = hasBoardPermission(currentRole, "issue:move");
  const ListsSk = new Array(3).fill(0).map((_, i) => <ListSkeleton key={i} />);
  const handleDrag = (result: DropResult) => {
    if (!canReorderBoard) {
      return;
    }

    const { source: s, destination: d, type, draggableId } = result;

    if (
      !lists ||
      !issues ||
      !d ||
      (s.droppableId === d.droppableId && s.index === d.index)
    )
      return;

    if (type === "card") {
      const expectedUpdatedAt = issues[s.droppableId]?.[s.index]?.updatedAt;

      reorderIssues(
        {
          s: { sId: s.droppableId, oIdx: s.index },
          d: { dId: d?.droppableId!, nIdx: d?.index! },
          boardId,
          id: draggableId,
          expectedUpdatedAt,
        },
        {
          onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
              setConflictNotice("This card was updated elsewhere. Data refreshed.");
              setTimeout(() => setConflictNotice(null), 2500);
            }
          },
        }
      );
      return;
    }

    reorderLists({
      id: draggableId,
      oIdx: s.index,
      nIdx: d?.index!,
      boardId,
    });
  };

  return (
    <main className="h-full min-w-0 w-full overflow-auto pr-1">
      <section className="boardforge-panel p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <Breadcrumbs />
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              BoardForge Project Board
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {conflictNotice ? (
                <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-400/70 dark:bg-amber-500/10 dark:text-amber-300">
                  {conflictNotice}
                </span>
              ) : null}
              {!canReorderBoard ? (
                <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-200">
                  Read-only access
                </span>
              ) : null}
            </div>
          </div>

          <section className="flex flex-wrap items-center gap-2">
            {canManageMembers ? (
              <AddMemberModal
                users={users}
                mutate={addMember}
                boardId={boardId}
                openModal={openAddMemModal}
                closeModal={setOpenAddMemModal}
                boardMembers={boardMembers ?? []}
                isUsersLoading={isUsersLoading}
                isUsersFetching={isUsersFetching}
                isUsersError={isUsersError}
              >
                <Button
                  onClick={() => setOpenAddMemModal(true)}
                  className="h-9 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 sm:text-sm"
                >
                  Add Member
                </Button>
              </AddMemberModal>
            ) : null}
            <Members boardId={boardId} />
            <BoardSettingBtn boardId={boardId} className="mb-0 lg:hidden" />
          </section>
        </div>

        <div className="mt-4">
          <IssueFilterByMem boardId={boardId} />
        </div>
      </section>

      <section className="mt-5">
        <DragDropContext onDragEnd={handleDrag}>
          <Droppable direction="horizontal" type="column" droppableId="board">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex w-max items-start gap-4 pb-4"
              >
                {isLoading
                  ? ListsSk
                  : lists?.length! > 0 &&
                  issues !== undefined &&
                  lists?.map((list, index) => (
                    <Column
                      key={list.id}
                      id={list.id}
                      column={list}
                      index={index}
                      issues={issues![list?.id]}
                      readOnly={!canReorderBoard}
                    />
                  ))}
                {canCreateList ? <CreateNewList boardId={boardId} /> : null}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    </main>
  );
};

export default Board;
