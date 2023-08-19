'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

//apis
import { useGetUserBoardsQuery } from '@/redux/apis/endpoints/create.board.endpoint'
import { addBoardsData } from '@/redux/features/board.slice'

//components
import ProjectBoard from '@/components/utils/ProjectBoard'
import { useAppDispatch } from '@/redux/store/hook'
import Loading from './loading'


const BoardsPage = () => {
  const {data:session} = useSession({
    required:true,
    onUnauthenticated(){
      redirect('/login')
    }
  })
  const dispatch = useAppDispatch();

  const {data:userBoards,isSuccess,isFetching,isLoading} = useGetUserBoardsQuery(session?.user?.id!);

  if(isLoading || isFetching) <Loading/>

  if(isSuccess){
    dispatch(addBoardsData(userBoards?.boards!));
    return (
      <main className='p-3'>
        <ProjectBoard boards={userBoards?.boards!}/>
      </main>
    )
  }
}

export default BoardsPage