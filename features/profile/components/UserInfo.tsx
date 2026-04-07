
import React, { memo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Info:React.FC<InfoProps> = ({
    label, connect, type, value, disabled
}) => {
  return (
    <section className='flex flex-col gap-2'>
        <Label htmlFor={connect} className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
            {label}
        </Label>
        <Input 
            id={connect} 
            type={type} 
            value={value}  
            disabled={disabled}
            className="h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-slate-900 dark:text-slate-100"
        />
    </section>
  )
}

export default memo(Info);

interface InfoProps {
    label: string,
    connect: "name" | "email" | "img",
    type: string,
    value: string,
    disabled: boolean,
}