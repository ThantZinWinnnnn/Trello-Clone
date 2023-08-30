"use client"
import React, { useState } from "react";

//profileArr
import { imgArr } from "../DummyData/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppDispatch } from "@/redux/store/hook";
import { addFilterUsrId } from "@/redux/features/board.slice";

const MemberPhotos = () => {
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const diapatch = useAppDispatch()

  return (
    <section className="flex -space-x-2">
      {imgArr.map((img) => (
        <Avatar
          key={`${img.id}`}
          className={`
          w-9 h-9 hover:-translate-y-2 ring-2 ring-white cursor-pointer transition-all duration-100 hover:ring-blue-600
          ${selectedMember.includes(img.id) ? "ring-blue-600 -translate-y-2" : ""}
          `}
          onClick={()=> {
            if(selectedMember.includes(img.id)){
              setSelectedMember(selectedMember.filter(id => id !== img.id));
              diapatch(addFilterUsrId(""))
              
            }else{
                setSelectedMember([...selectedMember, img.id])
                diapatch(addFilterUsrId("cllxyzr4o0003pseubaej17mo"))
            }
          }}
        >
          <AvatarImage src={img.img} alt={` profile ${img.id}`} />
          <AvatarFallback>Profile</AvatarFallback>
        </Avatar>
      ))}
      <div className="w-9 h-9 ring-2 ring-white rounded-full bg-slate-400 z-10 flex items-center justify-center hover:-translate-y-1 cursor-pointer">
        <p className="text-[0.75rem] font-semibold font-rubik">+ 10</p>
      </div>
    </section>
  );
};

export default MemberPhotos;
