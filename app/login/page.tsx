import React from "react";
//components
import Authenticate from "@/components/auth/Authenticate";
import Logo from "@/components/auth/Logo";
import leftLogo from "@/public/photos/left-logo.png";
import rightLogo from "@/public/photos/right-logo.png";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const page = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#F9FAFC] relative">
      <section className="w-[400px] flex flex-col gap-14">
        <Logo />
        <Authenticate />
        <Separator className="my-10" />
      </section>

      <section className="mt-8">
        <svg
          aria-label="Atlassian"
          fill="currentColor"
          role="img"
          viewBox="0 0 539.669 67"
          className="text-blue-700 h-6"
        >
          <path d="M296.309 27.06c0 8 3.73 14.42 18.31 17.23 8.7 1.82 10.52 3.23 10.52 6.13s-1.82 4.64-8 4.64a44.89 44.89 0 0 1-21.13-5.72v13.1c4.39 2.15 10.19 4.56 21 4.56 15.25 0 21.3-6.79 21.3-16.9m0 0c0-9.53-5.05-14-19.31-17.07-7.87-1.74-9.78-3.48-9.78-6 0-3.15 2.82-4.47 8-4.47 6.3 0 12.51 1.91 18.4 4.56V14.63a41.58 41.58 0 0 0-18-3.73c-14.09 0-21.38 6.13-21.38 16.16M492.189 11.73v54.44h11.6V24.66l4.89 11.02 16.41 30.49h14.58V11.73h-11.6v35.14l-4.39-10.2-13.18-24.94h-18.31zM405.729 11.73h12.68v54.44h-12.68zM391.099 50.1c0-9.53-5.05-14-19.31-17.07-7.87-1.74-9.78-3.48-9.78-6 0-3.15 2.82-4.47 8-4.47 6.3 0 12.51 1.91 18.4 4.56V14.63a41.58 41.58 0 0 0-18-3.73c-14.09 0-21.38 6.13-21.38 16.16 0 8 3.73 14.42 18.31 17.23 8.7 1.82 10.52 3.23 10.52 6.13s-1.82 4.64-8 4.64a44.89 44.89 0 0 1-21.13-5.72v13.1c4.39 2.15 10.19 4.56 21 4.56 15.25 0 21.3-6.79 21.3-16.9M197.829 11.73v54.44h26.06l4.1-11.76h-17.4V11.73h-12.76zM146.339 11.73V23.5h14.09v42.67h12.76V23.5h15.08V11.73h-41.93zM127.839 11.73h-16.72l-19 54.44h14.55l2.66-9.17a36 36 0 0 0 20.34 0l2.69 9.17h14.5Zm-8.36 35.46a24.76 24.76 0 0 1-7-1l7-23.77 7 23.77a24.76 24.76 0 0 1-7 1ZM268.809 11.73h-16.72l-19 54.44h14.5l2.71-9.17a36 36 0 0 0 20.3 0l2.69 9.17h14.5Zm-8.36 35.46a24.76 24.76 0 0 1-7-1l7-23.77 7 23.77a24.76 24.76 0 0 1-7 1ZM464.089 11.73h-16.72l-19 54.44h14.5l2.71-9.17a36 36 0 0 0 20.3 0l2.69 9.17h14.5Zm-8.36 35.46a24.76 24.76 0 0 1-7-1l7-23.77 7 23.77a24.76 24.76 0 0 1-7 1Z"></path>
          <path d="M19.036 30.875a1.636 1.636 0 0 0-1.397-.564 1.348 1.348 0 0 0-1 .803L.153 64.068a1.444 1.444 0 0 0 1.291 2.09H24.4a1.389 1.389 0 0 0 1.286-.8c4.823-9.952 1.838-25.417-6.649-34.483ZM66.05 64.08C65.741 63.46 35.163 2.275 34.41.754A1.302 1.302 0 0 0 33.31 0L33.26 0a1.579 1.579 0 0 0-1.3.812l-.002.001c-8.289 13.131-9.228 28.985-2.511 42.41l11.065 22.13a1.438 1.438 0 0 0 1.296.817h22.951a1.444 1.444 0 0 0 1.292-2.09Z"></path>
        </svg>
      </section>
      {/* to add copyright */}
      <p></p>
      {/* <div className="absolute left-0 bottom-0">
        <Image src={leftLogo} alt="left-logo" className="w-[300px] h-[297px]"/>
      </div>
      <div className="absolute right-0 bottom-0">
        <Image src={rightLogo} alt="right-logo" className="w-[350px] h-[297px]"/>
      </div> */}
    </main>
  );
};

export default page;
