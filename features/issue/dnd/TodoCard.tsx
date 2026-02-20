"use client";
import React, { memo, useMemo } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
//icon
import { LucideIcon } from "lucide-react";

import Image from "next/image";

//data
import { piorityArr, issueType } from "@/components/DummyData/data";

//components
import IssueDetailComponent from "@/features/board/components/IssueDetailComponent";
import CardMember from "@/components/utils/CardMember";

const TodoCard: React.FC<todoCardProps> = ({
  id,
  index,
  todo,
  innerRef,
  draggableProps,
  draggableHandleProps,
  listId,
}) => {
  const issue = useIssueTypeAndPriorityFun(piorityArr, issueType, todo);
  return (
    <div
      key={id}
      {...draggableProps}
      {...draggableHandleProps}
      ref={innerRef}
      className={`boardforge-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg hover:bg-slate-50/80 dark:hover:bg-slate-700/40`}
    >
      <IssueDetailComponent issue={todo} listId={listId} indx={index}>
        <section className="w-full text-left outline-none">
          <section className="relative h-[88px] overflow-hidden border-b border-slate-200/80 bg-slate-100/70 dark:border-slate-600 dark:bg-slate-700/60 2xl:h-[108px]">
            <Image
              src={todo.image ? `${todo.image}` : "/photos/board-bg.jpeg"}
              // src={"/photos/board-bg.jpeg"}
              fill
              alt="todo bg"
              className="object-cover"
              style={{ objectFit: "contain" }}
            />
          </section>
          <section className="flex items-center justify-between px-2 py-2">
            <h2 className="line-clamp-2 text-[0.78rem] font-semibold leading-5 text-slate-800 dark:text-slate-100 xl:text-sm">
              {todo?.summary}
            </h2>
          </section>
          <section className="flex items-center justify-between border-t border-slate-200/80 px-2 py-2 dark:border-slate-600">
            <div className="flex items-center gap-1">
              <issue.Icon
                className={`w-5 h-5 p-1 rounded-sm text-white ${issue?.issueCat?.color}`}
              />
              <issue.PiorityIcon
                className={`w-4 h-4 ${issue?.priority?.color}`}
              />
            </div>
            <CardMember members={todo?.assignees} />
          </section>
        </section>
      </IssueDetailComponent>
    </div>
  );
};

export default memo(TodoCard);

type todo = {
  id: string;
  desc: string;
};

type todoCardProps = {
  id: string;
  index: number;
  todo: DndIssueProps;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  draggableHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  listId: string;
};

export interface IssueTypeProps {
  text: string;
  icon: LucideIcon;
  color: string;
}

//use Callback
export const useIssueTypeAndPriorityFun = (
  piorityArr: Array<PiorityArrProps>,
  issueType: Array<IssueTypeProps>,
  todo: DndIssueProps
) => {
  const priority = useMemo(
    () => piorityArr.find((pr) => pr.value === todo?.priority),
    [todo?.priority, piorityArr]
  );
  const issueCat = useMemo(
    () => issueType.find((cat) => cat.text === todo?.type),
    [issueType, todo]
  );
  const Icon = issueCat?.icon!;
  const PiorityIcon = priority?.icon!;
  return {
    Icon,
    PiorityIcon,
    priority,
    issueCat,
  };
};
