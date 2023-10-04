import React from 'react'
import { Badge } from '../ui/badge'
import UserProfileSk from './UserProfileSk'
import { Skeleton } from '../ui/skeleton'

const SettingMemSk = () => {
  return (
    <Badge className='bg-slate-200'>
       <div className='flex gap-2 p-1 items-center'>
       <UserProfileSk className='h-6 w-6'/>
       <Skeleton className='h-4 w-[80px]'/>
       </div>
    </Badge>
  )
}

export default SettingMemSk