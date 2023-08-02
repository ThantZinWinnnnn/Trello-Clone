import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { Button } from "../ui/button";

//icon
import { PlusIcon } from "@radix-ui/react-icons";

//components
import CreateIssue from "../IssueComponents/CreateIssue";

const Column: React.FC<ColumnProps> = ({ id, column, index }) => {
  return (
    <Draggable draggableId={id} index={index} key={id}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="min-h-[80px]"
        >
          {/* render droppable components */}
          <Droppable droppableId={id} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`flex flex-col gap-2 p-2 rounded-md shadow-sm ${
                  snapshot.isDraggingOver ? "bg-gray-200" : "bg-[#F4F5F7]"
                }`}
              >
                <h1 className="flex justify-between items-center">
                  {column.title}
                  <span className="text-slate-500 font-normal px-2 py-1 rounded-full bg-slate-300 text-xs">
                    {column.todos.length}
                  </span>
                </h1>
                <CreateIssue/>
                <div className="space-y-3">
                  {column.todos.map((todo, index) => (
                    <Draggable
                      draggableId={todo.id}
                      index={index}
                      key={todo.id}
                    >
                      {(provided) => (
                        <TodoCard
                          key={todo.id}
                          draggableProps={provided.draggableProps}
                          draggableHandleProps={provided.dragHandleProps}
                          innerRef={provided.innerRef}
                          todo={todo}
                          index={index}
                          id={todo.id}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;

type todo = {
  id: string;
  desc: string;
};

type column = {
  id: string;
  title: string;
  todos: todo[];
};

interface ColumnProps {
  id: string;
  column: column;
  index: number;
}
