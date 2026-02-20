"use client";
import React, { memo, useMemo, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { PenSquare, X, Trash2 } from "lucide-react";

//components
import CreateIssue from "@/features/issue/components/CreateIssue";
import { useBoardStore } from "@/shared/state/zustand.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteList, useUpdateList } from "@/features/board/hooks/list.hooks";
import { useParams } from "next/navigation";
import { isSameDay } from "@/shared/utils/util";

interface ColumnProps {
  id: string;
  index: number;
  column: ListProps;
  issues: Array<DndIssueProps>;
  readOnly?: boolean;
}

const Column: React.FC<ColumnProps> = ({
  id,
  index,
  column,
  issues,
  readOnly = false,
}) => {
  const params = useParams();
  const [edit, setEdit] = useState(false);
  const [listName, setListName] = useState(column?.name);
  const { issueName, memberId, currentDate } = useBoardStore();
  const boardId = params.boardId as string;
  const { mutate: updateListName } = useUpdateList(boardId, id);
  const { mutate: deleteList } = useDeleteList(boardId);
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
        issue?.summary.toLowerCase().includes(issueName.toLocaleLowerCase())
      ),
    [issueName, issues]
  );

  const updatedIssues = useMemo(
    () =>
      issues?.filter((iss) => isSameDay(iss?.updatedAt ?? "", currentDate)),
    [issues, currentDate]
  );
  const updateListHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateListName({ name: listName, listId: id });
      setEdit(false);
    }
  };

  const deleteListHandler = () => {
    deleteList(id);
  };

  const userIssues =
    memberId.length > 0
      ? filterIssues
      : issueName !== ""
        ? queryIssuesByName
        : currentDate !== ""
          ? updatedIssues
          : issues;

  return (
    <Draggable draggableId={id} index={index!} key={id} isDragDisabled={readOnly}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="min-h-[80px] w-[280px] shrink-0 border border-slate-200 dark:border-slate-600 rounded-md"
        >
          {/* render droppable components */}
          <Droppable droppableId={id} type="card" isDropDisabled={readOnly}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`boardforge-column flex min-h-[140px] flex-col gap-3 p-3 transition ${snapshot.isDraggingOver ? "ring-2 ring-blue-300" : ""
                  }`}
              >
                <div className="flex items-center justify-between gap-2">
                  {edit ? (
                    <Input
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      onKeyDown={updateListHandler}
                      className="h-8 rounded-md border-slate-200 bg-white text-sm dark:border-slate-600 dark:bg-slate-800"
                    />
                  ) : (
                    <h1 className="max-w-[180px] truncate text-sm font-semibold text-slate-800 dark:text-slate-100 xl:text-base">
                      {column?.name}
                    </h1>
                  )}
                  <div className="flex items-center gap-1">
                    {!edit ? (
                      <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                        {userIssues?.length ?? 0}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={deleteListHandler}
                        className="rounded-md p-1 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    {readOnly ? null : (
                      <Button
                        variant={"ghost"}
                        className="h-7 w-7 p-0 text-slate-500 hover:bg-slate-100 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-700"
                        onClick={() => setEdit(!edit)}
                      >
                        {edit ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <PenSquare className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                {readOnly ? null : <CreateIssue listId={column?.id} />}
                <div className="space-y-2.5">
                  {userIssues?.length > 0
                    ? userIssues?.map((issue, index) => (
                      <Draggable
                        draggableId={issue?.id}
                        index={index}
                        key={issue?.id}
                        isDragDisabled={readOnly}
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
