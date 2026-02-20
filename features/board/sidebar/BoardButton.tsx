"use client"
import React from 'react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PlusSquare } from 'lucide-react';

const BoardButton:React.FC<BoardButtonProps> = ({
    setOpenSetting,setReachedSetting,btnText
}) => {
    const router = useRouter()
  return (
    <Button
            onClick={() => {
              setOpenSetting(false);
              setReachedSetting(false);
              router.push("/boards");
            }}
            variant={"ghost"}
            className={`flex w-full items-center justify-start gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-5 text-left text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700`}
          >
            <span className="rounded-md bg-blue-600/10 p-1.5 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
              <PlusSquare className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold tracking-wide 2xl:text-sm">{btnText}</p>
          </Button>
  )
}

export default BoardButton;
interface BoardButtonProps{
  setOpenSetting:(bol:boolean)=>void
  setReachedSetting:(bol:boolean)=>void
  btnText:string
}
