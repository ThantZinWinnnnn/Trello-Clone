import React from 'react'
import { Draggable, DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';
//icon
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';

const TodoCard:React.FC<todoCardProps> = ({id,index,todo,innerRef,draggableProps,draggableHandleProps}) => {
  return (
    <div
    {...draggableProps}
    {...draggableHandleProps}
    ref={innerRef}
    className='bg-white rounded-sm  drop-shadow-md p-3 space-y-3'
    >
        <div className='flex items-center justify-between'>
        <h2>{todo.desc}</h2>
        <Button variant={'ghost'} className='w-6 h-6  flex items-center justify-between rounded-full p-1'>
            <CrossCircledIcon className='text-red-500'/>
        </Button>
        </div>
    </div>
  )
}

export default TodoCard;

type todo ={
    id:string,
    desc:string
}

type todoCardProps = {
    id:string,
    index:number,
    todo:todo,
    innerRef:(element: HTMLElement | null) => void
    draggableProps:DraggableProvidedDraggableProps
    draggableHandleProps:DraggableProvidedDragHandleProps | null | undefined
}