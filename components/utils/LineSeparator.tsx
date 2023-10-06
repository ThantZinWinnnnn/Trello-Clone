import React from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'

type Props = {
    className?:string
}
const LineSeparator = ({className}:Props) => {
  return (
    <Separator className={cn('my-4 dark:bg-white',className)}/>
  )
}

export default LineSeparator