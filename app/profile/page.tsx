"use client";
import ProfileButton from "@/components/profile/ProfileButton";
import UserInfo from "@/components/profile/UserInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useReducer} from "react";
import {Undo2,ArrowBigUpDash} from "lucide-react"
import { useBoardStore } from "@/globalState/store/zustand.store";

const ProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter()
  const user = session?.user; 
  const {profileUser} = useBoardStore()

  const profileStates :UserProfile = {
      name:profileUser?.name!  ?? "",
      email:profileUser?.email! as string,
      img:profileUser?.image! as string,
  }

  
    
    
 const [profile,dispatch]= useReducer(reduer,profileStates)
  return (
    <section className="container pt-4 overflow-y-scroll">
      <section className="flex gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={profileUser?.image!} alt={user?.name!} />
          <AvatarFallback>{profileUser?.name!}</AvatarFallback>
        </Avatar>
        <p className="flex flex-col gap-1">
          <span>{profileUser?.name}</span>
          <span className="text-xs">{profileUser?.email}</span>
        </p>
      </section>
      <Separator className="my-10" />
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
          value={profile?.name}
          dispatch={dispatch}
          disabled={true}
        />
        <UserInfo
          label="Email"
          connect="email"
          type="email"
          value={profile?.email}
          dispatch={dispatch}
          disabled={true}
        />
        < UserInfo
          label="Image"
          connect="img"
          type="text"
          value={profile?.img}
          dispatch={dispatch}
          disabled={true}
        />
        <section>

         <Avatar className="w-20 h-20 mx-auto">
          <AvatarImage src={user?.image!} alt={user?.name!} />
          <AvatarFallback>{user?.name!}</AvatarFallback>
         </Avatar>
         <section className="flex justify-end gap-2 mt-14">

          <ProfileButton text="Back" onClick={()=>{router.back()}} className="" Icon={Undo2}/>
         {/* <ProfileButton text="Update" onClick={()=>{}} className="" Icon={ArrowBigUpDash}/> */}

         </section>
         </section>
       </section>
      </section>
    </section>
  );
};

export default ProfilePage;

interface UserProfile {
    name:string,
    email:string,
    img:string,
};
export type T = "name" | "email" | "img";
export type P = {type:T,value:string}

const reduer = (state:UserProfile,{type,value}:P)=>{
    switch (type){
        case "name":
            return {...state,name:value};
        case "email":
            return {...state,email:value};
        case "img":
            return {...state,img:value};
        default:
            return state
    }
}


