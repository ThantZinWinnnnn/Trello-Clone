
import React, { Dispatch, memo, useCallback } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { P } from '@/app/profile/page'

const Info:React.FC<InfoProps> = ({
    label,connect,type,value,dispatch,disabled
}) => {
  return (
    <section className='flex flex-col gap-1'>
        <Label htmlFor={connect} className='text-sm sm:text-md'>{label}</Label>
        <Input id={connect} type={type} value={value} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
            dispatch({type:`${connect}`,value:e.target.value})
        }} disabled={disabled}/>
    </section>
  )
}

export default memo(Info);

interface InfoProps{
    label:string,
    connect:"name" | "email" | "img",
    type:string,
    value:string,
    dispatch:Dispatch<P>,
    disabled:boolean,
}