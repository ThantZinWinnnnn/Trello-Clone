"use client";

import Breadcrumbs from "@/components/utils/Breadcrumbs";
import React, { useCallback, useMemo, useState } from "react";
import IssueFilterByMem from "@/components/Board/IssueFilterByMem";
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import Column from "@/components/DndComponents/Column";
import CreateNewList from "@/components/Board/CreateNewList";
import {
  useGetListsQuery,

} from "@/redux/apis/endpoints/lists.endpoint";
import { useAppSelector,useAppDispatch} from "@/redux/store/hook";
import { useGetIssuesQuery, useReorderIssueMutation } from "@/redux/apis/endpoints/issues.endpoint";
import { addIssueData,addListsData } from "@/redux/features/board.slice";

type Params = {
  params: {
    boardId: string;
  };
};
const Boards = ({ params: { boardId } }: Params) => {
  const filterUsrId = useAppSelector((state) => state.board.filterUsrId);
  const {
    data: listsData,
    isLoading,
    isError,
    error,
  } = useGetListsQuery(`${boardId}`);
  const {data:issuesData} = useGetIssuesQuery({boardId,userId:filterUsrId},{refetchOnMountOrArgChange:true});
  // console.log("lists", lists, "boardId", boardId);

  const [reorderIssue] = useReorderIssueMutation();

  
  

  const handleDrag = (result: DropResult) => {
    const { source: s, destination: d, type } = result;
    console.log("res", s, "des", d, "type", type);

  
    // reorderLists({
    //   id: listId!,
    //   s: { sId: s.droppableId, oIdx: s.index + 1 },
    //   d: { dId: d?.droppableId, nIdx: d?.index! + 1 },
    //   projectId: boardId,
    // });
    reorderIssue({
      s: { sId: s.droppableId, oIdx: s.index + 1 },
      d: { dId: d?.droppableId, nIdx: d?.index! + 1 },
      boardId: boardId,
      id: issuesData![s.droppableId][s.index].id,
    });
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
              {listsData?.length! > 0 &&
                listsData?.map((list, index) => (
                  <Column
                    key={list.id}
                    id={list.id}
                    column={list}
                    index={index}
                    issues={issuesData}
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

interface filteredIssueId {
  lists: DndListsProps[] | undefined;
  s: DraggableLocation;
}

const reorderListsLocal = (oldLists: ReturnDndListsProps, { s, d }: dndOrderProps) => {
  const source = oldLists?.lists.slice(0)
  const draggedList = source.splice(s.oIdx, 1)[0];
  const destinationList = source.splice(d.nIdx, 0, draggedList);
  console.log("deeeee",destinationList)
  return oldLists.lists = destinationList;
}
