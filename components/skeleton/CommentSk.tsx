import React from 'react'
import UserProfileSk from './UserProfileSk'
import { Skeleton } from '../ui/skeleton'

const CommentSk = () => {
  return (
    <div className='flex gap-2'>
      <UserProfileSk/>
      <div className='space-y-2'>
          <Skeleton className='h-4 w-[200px]'/>
          <Skeleton className='h-4 w-[200px]'/>
      </div>
    </div>
  )
}

export default CommentSk