import { Input } from '../ui/input'
import { Label } from '../ui/label'
import React from 'react'

const BoardInfo = ({
    connection,label,value,onChange,disabled
}:Props) => {
  return (
    <section className='flex flex-col gap-2'>
        <Label htmlFor={connection} className='font-semibold'>{label}</Label>
        <Input id={connection} type='text' value={value} onChange={onChange} disabled={disabled}/>
    </section>
  )
}

export default BoardInfo;

interface Props{
    connection:string,
    label:string,
    value:string,
    onChange:()=> void,
    disabled:boolean,
}