"use client"
import React, { useState,} from "react";

//profileArr
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useBoardStore } from "@/globalState/store/zustand.store";
import UserProfileSk from "../skeleton/UserProfileSk";

type MemberPhotosProps = {
  members : Array<MemberProps>,
  isLoading:boolean
}

const MemberPhotos:React.FC<MemberPhotosProps> = ({members,isLoading}) => {
  const [selectedMember, setSelectedMember] = useState<string>("");
  const {setMemberId} = useBoardStore()
  const MembersSk = new Array(3).fill(0).map((_,i)=><UserProfileSk key={i}/>)
  
  return (
    <section className="flex -space-x-2">
      {
        isLoading ? MembersSk :
        members?.map((usr) => (
          <Avatar
            key={usr?.id}
            className={`
            w-7 h-7 xl:w-9 xl:h-9 hover:-translate-y-2 ring-2 ring-white cursor-pointer transition-all duration-100 hover:ring-blue-600
            ${selectedMember === usr?.id! ? "ring-blue-600 -translate-y-2" : ""}
            `}
            onClick={()=> {
              if(selectedMember === usr?.id){
                // setSelectedMember(selectedMember.filter(id => id !== usr?.User?.id));
                setSelectedMember('');
                setMemberId("")
                console.log("true")
              }else{
                  // setSelectedMember([...selectedMember, usr?.User?.id!])
                  setSelectedMember(usr?.id!)
                  // diapatch(addFilterUsrId(`${usr?.id}`))
                  setMemberId(`${usr?.User?.id}`)
                  console.log("false")
              }
            }}
          >
            <AvatarImage src={usr?.User?.image!} alt={` profile ${usr?.User?.name}`} />
            <AvatarFallback>Profile</AvatarFallback>
          </Avatar>
        ))
      }
     {members?.length > 4 && (
       <div className="w-9 h-9 ring-2 ring-white rounded-full bg-blue-500 z-10 flex items-center justify-center hover:-translate-y-1 cursor-pointer">
       <p className="text-[0.75rem] font-semibold font-rubik text-white">+ {members.length - 4}</p>
     </div>
     )}
    </section>
  );
};

export default MemberPhotos;
