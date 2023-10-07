"use client";
import React, { memo, useEffect, useState } from "react";
import { Button } from "../ui/button";
import MemberPhotos from "../utils/MemberPhotos";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useBoardStore } from "@/globalState/store/zustand.store";
import { useAddMember, useGetMembers } from "@/lib/hooks/member.hooks";
import { useSession } from "next-auth/react";
import moment from "moment";

const IssueFilterByMem = ({ boardId }: { boardId: string }) => {
  const { data: session } = useSession();
  const { issueName, setIssueName, setMemberId, setCurrentDate } =
    useBoardStore();
  const [active, setActive] = useState<string[]>([]);
  const { data: members, isLoading } = useGetMembers(boardId);
  const currentDate = moment().format("YYYY-MM-DD");
  return (
    <section className="flex flex-col sm:!flex-row sm:items-center gap-2 sm:gap-6 sm:justify-end">
      <section className="flex">
      {((active.includes("1") && active.includes("2")) ||
        active.includes("1") ||
        active.includes("2")) && (
        <>
          <Button
            variant={"ghost"}
            className="text-[0.7rem] xl:text-xs font-rubik"
            onClick={() => {
              setMemberId("");
              setCurrentDate("");
              setActive([]);
            }}
          >
            Clear All
          </Button>
          <div className="h-7 w-[1px] bg-slate-400"></div>
        </>
      )}
      <Button
        variant={"ghost"}
        className={`text-[0.7rem] xl:text-xs font-rubik ${
          active.includes("1") && "text-blue-600"
        }`}
        onClick={() => {
          if (active.includes("1")) {
            const updateActive = active.filter((item) => item !== "1");
            setActive(updateActive);
            setCurrentDate("");
          } else {
            setActive((num) => [...num, "1"]);
            setCurrentDate(currentDate);
          }
        }}
      >
        Recently Updated
      </Button>
      <Button
        variant={"ghost"}
        className={`text-[0.7rem] xl:text-xs font-rubik ${
          active.includes("2") && "text-blue-600"
        }`}
        onClick={() => {
          if (active.includes("2")) {
            const updateActive = active.filter((item: string) => item !== "2");
            setActive(updateActive);
            setMemberId("");
          } else {
            setActive((num: string[]) => [...num, "2"]);
            setMemberId(session?.user?.id!);
          }
        }}
      >
        Only My Issues
      </Button>
      </section>
      <section className="flex flex-col sm:!flex-row gap-2 sm:items-center">
      <MemberPhotos members={members!} isLoading={isLoading} />
      <div className="relative w-[200px]">
        <Input
          type="text"
          placeholder="Search..."
          className="pl-10 py-1! text-xs"
          value={issueName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setIssueName(e.target.value);
          }}
        />
        <Search className="absolute top-3 left-3" size={15} />
      </div>
      </section>
    </section>
  );
};

export default memo(IssueFilterByMem);
