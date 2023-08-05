"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Breadcrumbs from "@/components/utils/Breadcrumbs";
import MemberPhotos from "@/components/utils/MemberPhotos";
import { Search } from "lucide-react";
import { DividerVerticalIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import Board from "@/components/DndComponents/Board";

const Boards = () => {
  const [active, setActive] = useState<string[]>([]);

  return (
    <main className="p-3 w-[calc(100vw-251px)] pl-10 overflow-y-scroll">
      <Breadcrumbs />
      <h2 className=" font-semibold my-5 text-xl">Trello Project Board</h2>
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

            // setActive(active === 0 ? 1 : active === 1 ? 0 : active === 2 ? 1 :0);
            // setShowClearBtn(!showClearBtn);
          }}
        >
          Recently Updated
        </Button>
        <Button
          variant={"ghost"}
          className={`text-xs ${active.includes("2") && "text-blue-600"}`}
          onClick={() => {
            if (active.includes("2")) {
              // const index = active.indexOf('2')
              // const updateActive = active.splice(index,1)
              const updateActive = active.filter((item) => item !== "2");
              setActive(updateActive);
            } else {
              setActive((num) => [...num, "2"]);
            }
          }}
        >
          Only My Issues
        </Button>
        <MemberPhotos />
        <div className="relative w-[200px]">
          <Input type="text" placeholder="Search..." className="pl-10" />
          <Search className="absolute top-3 left-3" size={15} />
        </div>
      </section>
      <Board />
    </main>
  );
};

export default Boards;
