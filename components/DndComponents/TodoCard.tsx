"use client"
import React, { memo, useMemo, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
//icon
import { AlertCircle, CheckSquare, Bookmark, LucideIcon } from "lucide-react";
import {
  DoubleArrowDownIcon,
  DoubleArrowUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@radix-ui/react-icons";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Image from "next/image";

//data
import { piorityArr , issueType} from "../DummyData/data";

//components
import IssueDetailComponent from "../Board/IssueDetailComponent";
import CardMember from "../utils/CardMember";

const TodoCard: React.FC<todoCardProps> = ({
  id,
  index,
  todo,
  innerRef,
  draggableProps,
  draggableHandleProps,
  listId
}) => {
  console.log("imgUrl",listId)
  const issue = issueTypeAndPriorityFun(piorityArr,issueType,todo)
  return (
    <div
      key={id}
      {...draggableProps}
      {...draggableHandleProps}
      ref={innerRef}
      className={`bg-white rounded-sm  drop-shadow-md space-y-3 overflow-hidden`}
    >
      <section className="hover:bg-slate-200/50">
        <IssueDetailComponent issue={todo} listId={listId} indx={index}>
        <section>
          <section className="relative h-[100px] overflow-hidden">
            <Image
              // src={todo.image ? `${todo.image}` : "/photos/board-bg.jpeg"}
              src={"/photos/board-bg.jpeg"}
              fill
              alt="todo bg"
              className="object-cover"
            />
          </section>
          <section className="flex items-center justify-between px-2 py-3">
            <h2 className="text-xs font-medium">{todo?.desc}</h2>
          </section>
          <section className="flex items-center justify-between p-2">
            <div className="flex items-center gap-1">
              <issue.Icon className={`w-5 h-5 p-1 rounded-sm text-white ${issue?.issueCat?.color}`} />
              <issue.PiorityIcon className={`w-4 h-4 ${issue?.priority?.color}`} />
            </div>
            <CardMember members={todo?.assignees}/>
          </section>
        </section>
        </IssueDetailComponent>
      </section>
      
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

export interface IssueTypeProps{
  text:string,
  icon:LucideIcon,
  color:string
}

//use Callback
export const issueTypeAndPriorityFun = (piorityArr:Array<PiorityArrProps>,issueType:Array<IssueTypeProps>,todo:DndIssueProps)=> {
  const priority = useMemo(()=>piorityArr.find((pr) => pr.value === todo?.priority),[todo?.priority]);
  const issueCat = useMemo(()=> issueType.find((cat) => cat.text === todo?.type),[todo?.type]);
  const Icon = issueCat?.icon!;
  const PiorityIcon  = priority?.icon!
  return {
    Icon,
    PiorityIcon,
    priority,
    issueCat
  }
}
