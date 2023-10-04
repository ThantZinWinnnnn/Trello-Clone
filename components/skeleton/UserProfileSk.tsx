import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { cn } from '@/lib/utils'
type Props = {
    className?: string
}
const UserProfileSk = ({className}:Props) => {
  return (
    <Skeleton className={cn("w-9 h-9 rounded-full",className)}/>
  )
}

export default UserProfileSk