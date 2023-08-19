"use client"
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'
import {store} from "@/redux/store/store"

const Providers = ({children}:{children:React.ReactNode}) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        {children}
      </Provider>
    </SessionProvider>
  )
}

export default Providers