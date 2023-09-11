"use client";

import Breadcrumbs from "@/components/utils/Breadcrumbs";
import React, { useState } from "react";
import IssueFilterByMem from "@/components/Board/IssueFilterByMem";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "@/components/DndComponents/Column";
import CreateNewList from "@/components/Board/CreateNewList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGetData } from "@/lib/hooks/custom.borad.hooks";
import { useReorderIssues } from "@/lib/hooks/custom.borad.hooks";
import { useReorderLists } from "@/lib/hooks/useReorderLists";

type Params = {
  params: {
    boardId: string;
  };
};
const Boards = ({ params: { boardId } }: Params) => {
  const { data: lists } = useQuery<Array<ListProps>>({
    queryKey: ["lists", boardId],
    queryFn: async () => {
      const response = await axios.get(`/api/lists?boardId=${boardId}`);
      return response.data;
    },
  });

  // const {} = useGetData({boardId,queryKey:"lists",type: Array<ListProps>});

  const { data: issues, isLoading } = useQuery<Issues>({
    queryKey: ["issues", boardId],
    queryFn: async () => {
      const response = await axios.get(`/api/issues?boardId=${boardId}`);
      return response.data;
    },
  });

  const { mutate: reorderIssues } = useReorderIssues(boardId);
  const {mutate: reorderLists}  = useReorderLists(boardId)

  console.log("issues", issues);

  const handleDrag = (result: DropResult) => {
    const { source: s, destination: d, type, draggableId } = result;
    console.log("res", s, "des", d, "type", type, "draggableId", draggableId);
    
    if(!lists || !issues || !d || (s.droppableId === d.droppableId  && s.index === d.index) ) return;

    type === "card" ? reorderIssues({
      s: { sId: s.droppableId, oIdx: s.index },
      d: { dId: d?.droppableId!, nIdx: d?.index! },
      boardId,
      id: draggableId,
    }): 
      reorderLists({id:draggableId,oIdx:s.index,nIdx:d?.index!,boardId})
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

export default Boards;
