"use client";
import React, { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MemberPhotos from "@/components/utils/MemberPhotos";
import { useBoardStore } from "@/shared/state/zustand.store";
import { useGetMembers } from "@/features/member/hooks/member.hooks";
import { useSession } from "next-auth/react";
import UserProfileSk from "@/components/skeleton/UserProfileSk";

const IssueFilterByMem = ({ boardId }: { boardId: string }) => {
  const { data: session } = useSession();
  const { setIssueName, setMemberId, setCurrentDate } = useBoardStore();
  const [active, setActive] = useState<string[]>([]);
  const { data: members, isLoading } = useGetMembers(boardId);
  const currentDate = new Date().toISOString();
  const MembersSk = new Array(3).fill(0).map((_, i) => <UserProfileSk key={i} />);

  useEffect(() => {
    // Ensure no stale issue-name filter remains after removing board search UI.
    setIssueName("");
  }, [setIssueName]);

  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <section className="flex flex-wrap items-center gap-1">
      {((active.includes("1") && active.includes("2")) ||
        active.includes("1") ||
        active.includes("2")) && (
        <>
          <Button
            variant={"ghost"}
            className="h-8 rounded-full border border-slate-200 bg-white px-3 text-[0.7rem] font-medium text-slate-600 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            onClick={() => {
              setMemberId("");
              setCurrentDate("");
              setActive([]);
            }}
          >
            Clear All
          </Button>
          <div className="mx-1 h-5 w-px bg-slate-300 dark:bg-slate-600"></div>
        </>
      )}
      <Button
        variant={"ghost"}
        className={`h-8 rounded-full border px-3 text-[0.7rem] font-medium transition ${
          active.includes("1")
            ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-400/60 dark:bg-blue-500/20 dark:text-blue-200"
            : "border-slate-200 bg-white text-slate-600 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
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
        className={`h-8 rounded-full border px-3 text-[0.7rem] font-medium transition ${
          active.includes("2")
            ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-400/60 dark:bg-blue-500/20 dark:text-blue-200"
            : "border-slate-200 bg-white text-slate-600 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
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
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <MemberPhotos members={members!} isLoading={isLoading} />
      </section>
    </section>
  );
};

export default memo(IssueFilterByMem);
