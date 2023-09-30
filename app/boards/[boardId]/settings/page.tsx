import Breadcrumbs from '@/components/utils/Breadcrumbs'
import React from 'react'
import Info from '@/components/utils/Info'
import { Separator } from '@/components/ui/separator'

const CurrentProjectSettingsPage = () => {
  return (
    <section className='pt-3 px-10 w-[calc(100vw-251px)]'>
        <Breadcrumbs/>
        <Separator className='my-10'/>
    </section>
  )
}

export default CurrentProjectSettingsPage