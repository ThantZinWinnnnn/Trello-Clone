"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { useBoardStore } from '@/shared/state/zustand.store';
import { useSession } from 'next-auth/react';
import BoardSkeleton from '@/components/skeleton/BoardSkeleton';

const AssignedBoards = ({ boards, isLoading }: { boards: Array<BoardProps>, isLoading: boolean }) => {
  const router = useRouter();
  const { data: session } = useSession()
  const { setProfileUser, setBoardName, setOpenSetting } = useBoardStore();
  const user = session?.user;
  const skeletonBoards = new Array(3).fill(0).map((_, i) => <BoardSkeleton key={i} />);
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {
        isLoading ? skeletonBoards :
          boards?.map((board) => (
            <button
              key={board.id}
              onClick={() => {
                setProfileUser(user!);
                setBoardName(board?.name);
                setOpenSetting(true)
                router.push(`/boards/${board?.name}/${board.id}`)
              }}
              className="group relative h-28 sm:h-32 w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 text-left p-4 sm:p-5 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top color bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-80" />

              <p className="text-slate-900 dark:text-white font-semibold text-base truncate pr-6 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {board.name}
              </p>
              <div className="flex items-center gap-2 mt-auto">
                <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-white dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </button>
          ))
      }
    </section>
  )
}

export default AssignedBoards