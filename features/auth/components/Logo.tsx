import React from 'react'

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <div className="w-5 h-5 border-[2.5px] border-white rounded-md" />
      </div>
      <span className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white drop-shadow-sm">
        BoardForge
      </span>
    </div>
  )
}

export default Logo;