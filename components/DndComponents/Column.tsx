"use client";
import React, { memo, useMemo, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { PenSquare,XCircle ,X,Trash2} from "lucide-react";

//components
import CreateIssue from "../Issue/CreateIssue";
import { useBoardStore } from "@/globalState/store/zustand.store";
import moment from "moment";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDeleteList, useUpdateList } from "@/lib/hooks/list.hooks";
import { useParams } from "next/navigation";

interface ColumnProps {
  id: string;
  index: number;
  column: ListProps;
  issues: Array<DndIssueProps>;
}

const Column: React.FC<ColumnProps> = ({ id, index, column, issues }) => {
  const params = useParams()
  const [edit,setEdit] = useState(false);
  const [listName,setListName] = useState(column?.name);
  const { issueName, memberId, currentDate } = useBoardStore();
  const boardId = params.boardId as string;
  const {mutate:updateListName} = useUpdateList(boardId,id);
  const {mutate:deleteList} = useDeleteList(boardId);
  const filterIssues = useMemo(
    () =>
      issues?.filter((issue) =>
        issue?.assignees.some((assignee) => assignee?.User?.id === memberId)
      ),
    [issues, memberId]
  );

  const queryIssuesByName = useMemo(
    () =>
      issues?.filter((issue) =>
        issue?.summary.toLowerCase().includes(issueName)
      ),
    [issueName, issues]
  );

  const updatedIssues = useMemo(
    () =>
      issues?.filter((iss) =>
        moment(iss?.updatedAt).isSame(currentDate, "day")
      ),
    [issues, currentDate]
  );
  const updateListHandler = (e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key === 'Enter'){
      updateListName({name:listName,listId:id})
      setEdit(false)
    }
  };

  const deleteListHandler = ()=>{
    deleteList(id)
  }

  const userIssues =
    memberId.length > 0
      ? filterIssues
      : issueName !== ""
      ? queryIssuesByName
      : currentDate !== ""
      ? updatedIssues
      : issues;
  console.log("userId", memberId, "userIssues", filterIssues);

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
                className={`flex flex-col gap-2 p-2 rounded-md shadow-sm w-[250px] 2xl:w-[300px] ${
                  snapshot.isDraggingOver ? "bg-gray-200" : "bg-[#F4F5F7]"
                }`}
              >
                <div className="flex justify-between items-center">
                  {edit ? <Input value={listName} 
                    onChange={(e)=>setListName(e.target.value)}
                    onKeyDown={updateListHandler}
                  /> 
                  :  <h1 className="dark:text-black text-sm xl:text-base">{column?.name}</h1>}
                  <div className="flex gap-1 items-center">
                    {
                      !edit ? <span className="text-slate-500 font-normal px-2 py-1 rounded-full bg-slate-300 text-xs">
                      {userIssues?.length ?? 0}
                      </span> : 
                      <span onClick={deleteListHandler}>
                        <Trash2 className="h-5 w-5 text-red-600 ml-3"/>
                      </span>
                    }
                    <Button variant={'ghost'} className="dark:hover:bg-transparent"
                      onClick={()=>setEdit(!edit)}
                    >
                      {edit ? <X className="h-5 w-5 dark:text-black dark:hover:text-blue-600"/> : <PenSquare className="h-5 w-5 hover:text-blue-600 dark:text-black dark:hover:text-blue-600"/>}
                    </Button>
                  </div>
                </div>
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
