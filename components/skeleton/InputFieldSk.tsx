import React from 'react'
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

type InputFieldSkProps = {
    className?:string
}
const InputFieldSk = ({className}:InputFieldSkProps) => {
  return (
    <Skeleton className={cn('h-10 w-full',className)}/>
  )
}

export default InputFieldSk