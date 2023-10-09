"use client";

import Breadcrumbs from "@/components/utils/Breadcrumbs";
import React from "react";
import IssueFilterByMem from "@/components/Board/IssueFilterByMem";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "@/components/DndComponents/Column";
import CreateNewList from "@/components/Board/CreateNewList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useReorderIssues } from "@/lib/hooks/issue.hooks";
import { useReorderLists } from "@/lib/hooks/list.hooks";
import { useGetLists } from "@/lib/hooks/list.hooks";
import AddMemberModal from "@/components/members/AddMemberModal";
import { useBoardStore } from "@/globalState/store/zustand.store";
import { useAddMember, useGetMembers } from "@/lib/hooks/member.hooks";
import { useGetUsers } from "@/lib/hooks/user.hooks";
import { Button } from "@/components/ui/button";
import Members from "@/components/members/Members";
import { useSession } from "next-auth/react";
import ListSkeleton from "@/components/skeleton/ListSkeleton";
import { usePathname } from "next/navigation";
import BoardSettingBtn from "@/components/utils/BoardSettingBtn";
type Params = {
  params: {
    boardId: string;
  };
};

const Board = ({ params: { boardId } }: Params) => {
  const path = usePathname();
  const { data: session } = useSession();
  const { member, memberName } = useBoardStore();
  const { mutate: addMember } = useAddMember(boardId, member!);
  const { data: users, isLoading: loading } = useGetUsers(memberName);
  const { data: lists } = useGetLists(boardId);
  const { mutate: reorderIssues } = useReorderIssues(boardId);
  const { mutate: reorderLists } = useReorderLists(boardId);
  const { data: boardMembers } = useGetMembers(boardId);
  const { data: issues, isLoading } = useQuery<Issues>({
    queryKey: ["issues", boardId],
    queryFn: async () => {
      const response = await axios.get(`/api/issues?boardId=${boardId}`);
      return response.data;
    },
  });
  const user = session?.user;
  const boardAdmin = boardMembers?.find(
    (member) => member?.User?.id === user?.id
  )?.isAdmin!;
  const ListsSk = new Array(3).fill(0).map((_, i) => <ListSkeleton key={i} />);
  const alreadyAddedMember = Boolean(boardMembers?.find((mem)=>mem?.User?.id === member?.id));

  const handleDrag = (result: DropResult) => {
    const { source: s, destination: d, type, draggableId } = result;
    console.log("res", s, "des", d, "type", type, "draggableId", draggableId);

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
    <main className="p-3 w-full pl-4 xl:pl-10 overflow-y-scroll">
      <section className="flex flex-col sm:!flex-row sm:justify-between sm:items-center gap-4">
        <Breadcrumbs />
        <section className="flex  gap-2 items-center">
          {/* to hidden add member btn when login user is not equal to board admin */}
          {boardAdmin ? (
            <AddMemberModal
              users={users!}
              loading={loading}
              mutate={addMember}
              boardId={boardId}
              beenAdded={alreadyAddedMember}
            >
              <Button className="bg-blue-600 hover:bg-blue-500 py-1! font-rubik dark:text-white text-[0.7rem] lg:text-xs h-8 sm:h-9">
                Add Member
              </Button>
            </AddMemberModal>
          ) : null}
          <Members boardId={boardId} />
        </section>
      </section>
      <section className="flex items-center justify-between my-5">
        <h2 className=" font-semibold text-sm 2xl:text-xl">
          Trello Project Board
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
              className="flex gap-4 mt-8 overflow-x-scroll"
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
