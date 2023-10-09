"use client"
import React from 'react'
import { Button } from '../ui/button';
import { useBoardStore } from '@/globalState/store/zustand.store';
import { usePathname, useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    boardId:string,
    className?:string
}

const BoardSettingBtn = ({boardId,className}:Props) => {
    const {setReachedSetting} = useBoardStore();
    const router = useRouter();
    const path = usePathname();
    const bName = path?.split("/")[2];
    const decodeName = decodeURIComponent(bName);
  return (
    <Button
          className={
            cn('flex gap-2 bg-blue-600 text-white hover:bg-blue-700 mb-4 text-xs xl:text-sm h-8 sm:h-9',className)
          }
          onClick={() => {
            setReachedSetting(true);
            router.push(`/boards/${decodeName}/${boardId}/settings`);
          }}
        >
          Project Settings <Settings className="w-4 h-4" />
        </Button>
  )
}

export default BoardSettingBtn