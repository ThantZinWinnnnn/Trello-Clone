"use client"
import React, { memo, useState } from "react";
import { Button } from "../ui/button";
import MemberPhotos from "../utils/MemberPhotos";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const IssueFilterByMem = (
  {boardId}:{boardId:string}
) => {
  const [active, setActive] = useState<string[]>([]);

  const {data:users,isLoading} = useQuery({
    queryKey:["users",boardId],
    queryFn:async() => {
      const response = await axios.post('/api/user',{boardId});
      return response.data;
    }
  })

  return (
    <section className="flex justify-end items-center gap-6">
      {((active.includes("1") && active.includes("2")) ||
        active.includes("1") ||
        active.includes("2")) && (
        <>
          <Button variant={"ghost"} className="text-xs">
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
          } else {
            setActive((num) => [...num, "1"]);
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
          } else {
            setActive((num: string[]) => [...num, "2"]);
          }
        }}
      >
        Only My Issues
      </Button>
      <MemberPhotos members={users}/>
      <div className="relative w-[200px]">
        <Input type="text" placeholder="Search..." className="pl-10" />
        <Search className="absolute top-3 left-3" size={15} />
      </div>
    </section>
  );
};

export default memo(IssueFilterByMem);
