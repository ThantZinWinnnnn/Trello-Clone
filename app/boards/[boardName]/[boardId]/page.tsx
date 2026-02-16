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
type Params = {
  params: {
    boardId: string;
  };
};

const Board = ({ params: { boardId } }: Params) => {
  const [openAddMemModal,setOpenAddMemModal] = useState(false);
  const { data: session } = useSession();
  const { memberName } = useBoardStore();
  const debounceValue = useDebounce(memberName,500)
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
  const boardAdmin = useMemo(
    () =>
      boardMembers?.find((member) => member?.User?.id === user?.id)?.isAdmin ??
      false,
    [boardMembers, user?.id]
  );
  const ListsSk = new Array(3).fill(0).map((_, i) => <ListSkeleton key={i} />);
  const handleDrag = (result: DropResult) => {
    const { source: s, destination: d, type, draggableId } = result;

    if (
      !lists ||
      !issues ||
      !d ||
      (s.droppableId === d.droppableId && s.index === d.index)
    )
      return;

    type === "card"
      ? reorderIssues({
          s: { sId: s.droppableId, oIdx: s.index },
          d: { dId: d?.droppableId!, nIdx: d?.index! },
          boardId,
          id: draggableId,
        })
      : reorderLists({
          id: draggableId,
          oIdx: s.index,
          nIdx: d?.index!,
          boardId,
        });
  };

  return (
    <main className="p-3 w-full min-w-0 h-full pl-4 xl:pl-10 overflow-auto">
      <section className="flex flex-col sm:!flex-row sm:justify-between sm:items-center gap-4">
        <Breadcrumbs />
        <section className="flex  gap-2 items-center">
          {/* to hidden add member btn when login user is not equal to board admin */}
          {boardAdmin ? (
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
              className="bg-blue-600 hover:bg-blue-500 py-1! font-rubik dark:text-white text-[0.7rem] lg:text-xs h-8 sm:h-9">
                Add Member
              </Button>
            </AddMemberModal>
          ) : null}
          <Members boardId={boardId} />
        </section>
      </section>
      <section className="flex items-center justify-between my-5">
        <h2 className=" font-semibold text-sm 2xl:text-xl">
          BoardForge Project Board
        </h2>
        <BoardSettingBtn
          boardId={boardId}
          className="text-[0.7rem] font-rubik lg:!hidden"
        />
      </section>
      <IssueFilterByMem boardId={boardId} />
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable direction="horizontal" type="column" droppableId="board">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex w-max gap-4 mt-8 pb-2"
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
                    />
                  ))}
              <CreateNewList boardId={boardId} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </main>
  );
};

export default Board;
