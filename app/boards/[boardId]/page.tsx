"use client";

import Breadcrumbs from "@/components/utils/Breadcrumbs";
import React, { useState } from "react";
import IssueFilterByMem from "@/components/Board/IssueFilterByMem";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "@/components/DndComponents/Column";
import CreateNewList from "@/components/Board/CreateNewList";
import { useGetListsQuery } from "@/redux/apis/endpoints/lists.endpoint";

type Params = {
  params: {
    boardId: string;
  };
};
const Boards = ({ params: { boardId } }: Params) => {
  const {
    data: listsData,
    isLoading,
    isError,
    error,
  } = useGetListsQuery(`${boardId}`);
  const lists = listsData?.lists;
  console.log("lists", lists, "boardId", boardId);

  const handleDrag = (result: DropResult) => {
    const { source: s, destination: d, type } = result;
    console.log("res", s, "des", d, "type", type);
    
  };

  return (
    <main className="p-3 w-[calc(100vw-251px)] pl-10 overflow-y-scroll">
      <Breadcrumbs />
      <h2 className=" font-semibold my-5 text-xl">Trello Project Board</h2>
      <IssueFilterByMem />
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable direction="horizontal" type="column" droppableId="board">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-4 mt-8 overflow-x-scroll"
            >
              {lists?.length! > 0 &&
                lists?.map((list, index) => (
                  <Column
                    key={list.id}
                    id={list.id}
                    column={list}
                    index={index}
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

export default Boards;
