
import Image from 'next/image'
//components
import IntroNavBar from '@/components/IntroComponents/IntroNavBar'
import { Button } from '@/components/ui/button'
import introLogo from "@/public/photos/intro-img.png"

export default function Home() {
  return (
    <main className="w-full h-screen">
     <IntroNavBar/>
     <section className='flex'>
      <section className='flex flex-col items-center justify-center w-1/2 h-[calc(100vh-49px)]'>
        <section className='flex flex-col gap-5'>
        <h1 className='font-semibold text-3xl text-left font-rubik'>Welcome to Trello!</h1>
        <p className='font-semibold text-sm text-slate-400 tracking-wide leading-7'>We are glad you made it.Let&apos;s star organizing your <br/>
          projects so you can get things done.
        </p>
        <Button className='bg-blue-700 w-[200px] font-semibold hover:bg-blue-600'>
          Build your first board
        </Button>
        </section>
      </section>
      <section className='flex flex-col items-center justify-center w-1/2 h-[calc(100vh-49px)] bg-[#F1F7FF]'>
        <Image src={introLogo} alt='intro logo' className='w-[550px]'/>
      </section>
     </section>
    </main>
  )
}
