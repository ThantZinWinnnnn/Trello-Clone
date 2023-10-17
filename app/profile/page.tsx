import ProfileButton from "@/components/profile/ProfileButton";
import UserInfo from "@/components/profile/UserInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";
import {Undo2} from "lucide-react";
import { getServerSession } from "next-auth";
import { useBoardStore } from "@/globalState/store/zustand.store";

const ProfilePage = async() => {
  const session = await getServerSession()
  const user = session?.user as UserProps; 

  // const profileStates :UserProfile = {
  //     name:profileUser?.name!  ?? "",
  //     email:profileUser?.email! as string,
  //     img:profileUser?.image! as string,
  // }

  
    
    
//  const [profile,dispatch]= useReducer(reduer,profileStates)
  return (
    <section className="container pt-4 h-full ">
      <section className="flex gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.image!} alt={user?.name!} />
          <AvatarFallback className="relative w-12 h-12">
            <Image src={user?.image!} fill alt="default user photo" style={{objectFit:'cover'}}/>
          </AvatarFallback>
        </Avatar>
        <p className="flex flex-col gap-1">
          <span>{user?.name}</span>
          <span className="text-xs">{user?.email}</span>
        </p>
      </section>
      <Separator className="my-4 lg:my-10" />
      <section className="max-w-[33rem] mx-auto">
        <div className="relative w-full h-24 rounded-md overflow-hidden mb-3">
          <Image
            src={"/photos/profileImg.png"}
            fill
            alt="profile instance photo"
          />
        </div>
        <h4 className="font-semibold text-lg sm:text-2xl my-5">
          Manage your Personal Information
        </h4>
       <section className="flex flex-col gap-4">
       <UserInfo
          label="Name"
          connect="name"
          type="text"
          value={user?.name!}
          // dispatch={dispatch}
          disabled={true}
        />
        <UserInfo
          label="Email"
          connect="email"
          type="email"
          value={user?.email!}
          // dispatch={dispatch}
          disabled={true}
        />
        < UserInfo
          label="Image"
          connect="img"
          type="text"
          value={user?.image!}
          // dispatch={dispatch}
          disabled={true}
        />
        <section>

         <Avatar className="w-20 h-20 mx-auto">
          <AvatarImage src={user?.image!} alt={user?.name!} />
          <AvatarFallback className="relative w-20 h-20 mx-auto">
            <Image src={user?.image!} fill alt="default user photo" style={{objectFit:'cover'}}/>
          </AvatarFallback>
         </Avatar>
         <section className="flex justify-end gap-2 mt-4 lg:mt-14">

          <ProfileButton text="Back"  className=""/>
         {/* <ProfileButton text="Update" onClick={()=>{}} className="" Icon={ArrowBigUpDash}/> */}

         </section>
         </section>
       </section>
      </section>
    </section>
  );
};

export default ProfilePage;

// interface UserProfile {
//     name:string,
//     email:string,
//     img:string,
// };
export type T = "name" | "email" | "img";
export type P = {type:T,value:string}

// const reduer = (state:UserProfile,{type,value}:P)=>{
//     switch (type){
//         case "name":
//             return {...state,name:value};
//         case "email":
//             return {...state,email:value};
//         case "img":
//             return {...state,img:value};
//         default:
//             return state
//     }
// }


