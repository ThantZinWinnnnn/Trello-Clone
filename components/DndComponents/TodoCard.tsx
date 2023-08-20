import React, { memo } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
//icon
import { AlertCircle, CheckSquare, Bookmark } from "lucide-react";
import {
  DoubleArrowDownIcon,
  DoubleArrowUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@radix-ui/react-icons";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Image from "next/image";

//components
import IssueDetailComponent from "../BoardsComponents/IssueDetailComponent";
import CardMember from "../utils/CardMember";

const TodoCard: React.FC<todoCardProps> = ({
  id,
  index,
  todo,
  innerRef,
  draggableProps,
  draggableHandleProps,
}) => {
  return (
    <div
      key={id}
      {...draggableProps}
      {...draggableHandleProps}
      ref={innerRef}
      className={`bg-white rounded-sm  drop-shadow-md space-y-3 overflow-hidden`}
    >
      <section className="hover:bg-slate-200/50">
        <IssueDetailComponent>
        <section>
          <section className="relative h-[100px] overflow-hidden">
            <Image
              src={"/photos/board-bg.jpeg"}
              fill
              alt="todo bg"
              className="object-cover"
            />
          </section>
          <section className="flex items-center justify-between px-2 py-3">
            <h2 className="text-xs font-medium">{todo.desc}</h2>
            {/* <Button
              variant={"ghost"}
              className="w-8 h-8  flex items-center justify-between rounded-full p-1"
            >
              <CrossCircledIcon className="text-red-500 w-full h-full" />
            </Button> */}
          </section>
          <section className="flex items-center justify-between p-2">
            <div className="flex items-center gap-1">
              <CheckSquare className="w-5 h-5 bg-[#0070f3] p-1 rounded-sm text-white" />
              <ArrowUpIcon className="w-4 h-4 text-red-500" />
            </div>
            <CardMember members={todo.assignees}/>
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
};
