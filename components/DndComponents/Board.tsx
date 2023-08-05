"use client"

import React from "react";

//dnd
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";

//data
import { dndData } from "../DummyData/data";

//components
import Column from "./Column";

const Board = () => {
  const handleDrag = (result: DropResult) => {
    const { source, destination, type } = result;
    console.log("des",destination,"res",source,"type",type)
    if(type === "column"){
      if(source.index === destination?.index) return;

      const column = dndData.splice(source.index,1)[0];
      return dndData.splice(destination.index,0,column)
    }
    
    //same column
    if(source.droppableId === destination?.droppableId && source.index === destination.index) return;
    if(source.droppableId === destination?.droppableId) {
      const column = dndData.find((column,index)=> column.id === source.droppableId);
      const todo = column?.todos.splice(source.index,1)[0];
      return column?.todos.splice(destination?.index,0,todo)
    }

    if(source.droppableId !== destination?.droppableId){
      const sourceColumn = dndData.find((column)=> column.id === source.droppableId);
      const destinationColumn = dndData.find((column,index)=> column.id === destination?.droppableId);
      const removedTodo = sourceColumn?.todos.splice(source.index,1)[0];
      return destinationColumn?.todos.splice(destination?.index,0,removedTodo)
    
    }
  };

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable direction="horizontal" type="column" droppableId="board">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}
            //temporary css later change flex
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 overflow-x-scroll"
          >
            {dndData.map((column, index) => (
              <Column
                key={column.id}
                id={column.id}
                column={column}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
          
        )}
        
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
