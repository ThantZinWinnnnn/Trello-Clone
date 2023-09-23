"use client"
import React, { memo, useEffect, useState } from "react";
import { Button } from "../ui/button";
import MemberPhotos from "../utils/MemberPhotos";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useBoardStore } from "@/globalState/store/zustand.store";
import { useAddMember, useGetMembers } from "@/lib/hooks/member.hooks";
import { useGetUsers } from "@/lib/hooks/user.hooks";
import AddMemberModal from "./AddMemberModal";
import { useSession } from "next-auth/react";
import moment from "moment";

const IssueFilterByMem = (
  {boardId}:{boardId:string}
) => {
  const {data:session} = useSession()
  const {issueName,setIssueName,memberName,setMemberId,member,setCurrentDate} = useBoardStore()
  const [active, setActive] = useState<string[]>([]);
  const {data:members,isLoading} = useGetMembers(boardId);
  const {data:users,isLoading:loading,isError,refetch} = useGetUsers(memberName)
  const {mutate:addMember} = useAddMember(boardId,member!)
  const currentDate = moment().format("YYYY-MM-DD");
   
  console.log("memberName",memberName,"users",users);
  return (
    <section className="flex justify-between items-center">
      <AddMemberModal users={users!} loading={loading} mutate={addMember} boardId={boardId}>
      <Button className="bg-blue-500 hover:bg-blue-600">Add Member</Button>
      </AddMemberModal>
      <section className="flex items-center gap-6">
      {((active.includes("1") && active.includes("2")) ||
        active.includes("1") ||
        active.includes("2")) && (
        <>
          <Button variant={"ghost"} className="text-xs" onClick={()=>{
            setMemberId('')
            setCurrentDate("")
            setActive([])
          }}>
            Clear All
          </Button>
          <div className="h-7 w-[1px] bg-slate-400"></div>
        </>
      )}
      <Button
        variant={"ghost"}
        className={`text-xs ${active.includes("1") && "text-blue-600"}`}
        onClick={() => {
          if (active.includes("1")) {
            const updateActive = active.filter((item) => item !== "1");
            setActive(updateActive);
            setCurrentDate("")
          } else {
            setActive((num) => [...num, "1"]);
            setCurrentDate(currentDate)
          }
        }}
      >
        Recently Updated
      </Button>
      <Button
        variant={"ghost"}
        className={`text-xs ${active.includes("2") && "text-blue-600"}`}
        onClick={() => {
          if (active.includes("2")) {
            const updateActive = active.filter((item: string) => item !== "2");
            setActive(updateActive);
            setMemberId('')
          } else {
            setActive((num: string[]) => [...num, "2"]);
            setMemberId(session?.user?.id!)
          }
        }}
      >
        Only My Issues
      </Button>
      <MemberPhotos members={members!}/>
      <div className="relative w-[200px]">
        <Input type="text" placeholder="Search..." className="pl-10" value={issueName}
          onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
            setIssueName(e.target.value)
            
          }}
        />
        <Search className="absolute top-3 left-3" size={15} />
      </div>
      </section>
    </section>
  );
};

export default memo(IssueFilterByMem);
