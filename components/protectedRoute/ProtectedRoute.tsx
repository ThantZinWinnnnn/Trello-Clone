
import React from 'react'
import { authOptions } from '@/lib/next-auth'
import { getServerSession } from "next-auth/next"
import {redirect} from "next/navigation"
const ProtectedRoute = async(
    {children} : {children: React.ReactNode}
) => {
  const session = await getServerSession(authOptions)

  if (!session) {
      redirect('/login')
  }


  return (
    <main>{children}</main>
  )
}

export default ProtectedRoute