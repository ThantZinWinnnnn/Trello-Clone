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
    const { source, destination, type } = result;
    console.log( "res", source, "des", destination,"type", type);
    if (type === "column") {
      if (source.index === destination?.index) return;

      const column = dndData.splice(source.index, 1)[0];
      return dndData.splice(destination?.index!, 0, column);
    }

    //same column
    if (
      source.droppableId === destination?.droppableId &&
      source.index === destination.index
    )
      return;
    if (source.droppableId === destination?.droppableId) {
      const column = dndData.find(
        (column, index) => column.id === source.droppableId
      );
      const todo = column?.todos.splice(source.index, 1)[0];
      return column?.todos.splice(destination?.index, 0, todo!);
    }

    if (source.droppableId !== destination?.droppableId) {
      const sourceColumn = dndData.find(
        (column) => column.id === source.droppableId
      );
      const destinationColumn = dndData.find(
        (column, index) => column.id === destination?.droppableId
      );
      const removedTodo = sourceColumn?.todos.splice(source.index, 1)[0];
      return destinationColumn?.todos.splice(
        destination?.index!,
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
