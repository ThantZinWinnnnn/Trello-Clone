"use client";
import React, { memo, useMemo } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";

//components
import CreateIssue from "../Issue/CreateIssue";
import { useBoardStore } from "@/globalState/store/zustand.store";

interface ColumnProps {
  id: string;
  index: number;
  column: ListProps;
  issues: Array<DndIssueProps>;
}

const Column: React.FC<ColumnProps> = ({ id, index, column, issues }) => {
  const {issueName,memberId} = useBoardStore();
  const filterIssues = useMemo(
    () =>
      issues?.filter((issue) =>
        issue?.assignees.some((assignee) => assignee?.User?.id === memberId)
      ),
    [issues, memberId]
  );

  const queryIssuesByName = useMemo(()=>issues?.filter((issue)=>issue?.summary.toLowerCase().includes(issueName) ),[issueName,issues])
  console.log("query",issueName)

  // dispatch(addIssueLength(filterIssues?.length ?? 0))

  const userIssues = memberId.length > 0 ? filterIssues : issueName !== "" ?  queryIssuesByName : issues;
  console.log("userId",memberId,"userIssues",filterIssues)

  return (
    <Draggable draggableId={id} index={index!} key={id}>
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
                className={`flex flex-col gap-2 p-2 rounded-md shadow-sm w-[300px] ${
                  snapshot.isDraggingOver ? "bg-gray-200" : "bg-[#F4F5F7]"
                }`}
              >
                <h1 className="flex justify-between items-center">
                  {column?.name}
                  <span className="text-slate-500 font-normal px-2 py-1 rounded-full bg-slate-300 text-xs">
                    {userIssues?.length ?? 0}
                  </span>
                </h1>
                <CreateIssue listId={column?.id} />
                <div className="space-y-3">
                  {userIssues?.length > 0
                    ? userIssues?.map((issue, index) => (
                        <Draggable
                          draggableId={issue?.id}
                          index={index}
                          key={issue?.id}
                        >
                          {(provided) => (
                            <TodoCard
                              key={issue?.id}
                              draggableProps={provided?.draggableProps}
                              draggableHandleProps={provided?.dragHandleProps}
                              innerRef={provided?.innerRef}
                              todo={issue}
                              index={index}
                              id={issue?.id}
                              listId={column?.id}
                            />
                          )}
                        </Draggable>
                      ))
                    : null}
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

export default memo(Column);

// type todo = {
//   id: string;
//   desc: string;
// };

// type column = {
//   id: string;
//   title: string;
//   todos: todo[];
// };

// interface ColumnProps {
//   id: string;
//   column: column;
//   index: number;
// }
