"use client"
import React from 'react'
import { Button } from '@/components/ui/button';
import { useBoardStore } from '@/shared/state/zustand.store';
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
            cn(
              'mb-4 flex h-9 gap-2 rounded-lg border border-blue-300 bg-blue-600 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 xl:text-sm',
              className
            )
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
