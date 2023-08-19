
import React from 'react'
import { options } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from "next-auth/next"
import {redirect} from "next/navigation"
const ProtectedRoute = async(
    {children} : {children: React.ReactNode}
) => {
  const session = await getServerSession(options)

  if (!session) {
      redirect('/login')
  }


  return (
    <main>{children}</main>
  )
}

export default ProtectedRoute