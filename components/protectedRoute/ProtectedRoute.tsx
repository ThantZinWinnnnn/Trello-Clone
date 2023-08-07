'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import {redirect} from "next/navigation"
const ProtectedRoute = () => {
    const {data:session} = useSession({
        required:true,
        onUnauthenticated(){
            redirect('/login?callbackUrl=/')
        }
    })

  return (
    <div>ProtectedRoute</div>
  )
}

export default ProtectedRoute