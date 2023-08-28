"use client";

import React, { memo } from "react";
import { useSearchParams } from "next/navigation";
//dnd
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";

//data
import { dndData } from "../DummyData/data";

//components
import Column from "./Column";
import { useGetListsQuery } from "@/redux/apis/endpoints/lists.endpoint";
import CreateNewList from "../BoardsComponents/CreateNewList";

interface BoardProps {
  id: string;
}

const Board: React.FC<BoardProps> = ({ id }) => {
  const {
    data: listsData,
    isLoading,
    isError,
    error,
  } = useGetListsQuery(`${id}`);
  const lists = listsData?.lists;
  console.log("lists", lists, "boardId", id);


  const handleDrag = (result: DropResult) => {
    const { source :s, destination:d, type } = result;
    console.log( "res", s, "des", d,"type", type);
    if (type === "column") {
      if (s.index === d?.index) return;

      const column = dndData.splice(s.index, 1)[0];
      return dndData.splice(d?.index!, 0, column);
    }

    //same column
    if (
      s.droppableId === d?.droppableId &&
      s.index === d.index
    )
      return;
    if (s.droppableId === d?.droppableId) {
      const column = dndData.find(
        (column, index) => column.id === s.droppableId
      );
      const todo = column?.todos.splice(s.index, 1)[0];
      return column?.todos.splice(d?.index, 0, todo!);
    }

    if (s.droppableId !== d?.droppableId) {
      const sourceColumn = dndData.find(
        (column) => column.id === s.droppableId
      );
      const destinationColumn = dndData.find(
        (column, index) => column.id === d?.droppableId
      );
      const removedTodo = sourceColumn?.todos.splice(s.index, 1)[0];
      return destinationColumn?.todos.splice(
        d?.index!,
        0,
        removedTodo!
      );
    }
  };

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable direction="horizontal" type="column" droppableId="board">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            //temporary css later change flex
            className="flex gap-4 mt-8 overflow-x-scroll"
          >
            {
              lists?.length! > 0 && lists?.map((list, index) => (
                <Column key={list.id} id={list.id} column={list} index={index} />
              ))
            }
            <CreateNewList boardId={id}/>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default memo(Board);
