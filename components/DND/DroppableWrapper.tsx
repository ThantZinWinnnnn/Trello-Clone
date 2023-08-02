import React from 'react'
import { Droppable } from 'react-beautiful-dnd'

const DroppableWrapper:React.FC<DroppableWrapperProps>  = (
    {
        children,
        droppableId,
        type,
        className,
        isDropDisabled
    }
) => {
  return (
    <Droppable droppableId={droppableId} type={type}>
        {(provided,snapshot)=>(
            <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={className}
            >
                {children}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
  )
}

export default DroppableWrapper;

interface DroppableWrapperProps {
    children:React.ReactNode;
    droppableId:string;
    type:string;
    isDropDisabled?:boolean;
    className?:string;
}