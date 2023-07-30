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
    console.log();
  };

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable direction="horizontal" type="column" droppableId="board">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}
            //temporary css later change flex
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
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
