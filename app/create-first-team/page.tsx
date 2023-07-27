import IntroNavBar from "@/components/IntroComponents/IntroNavBar";
import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import workspacePhoto from "@/public/photos/board.png";
import Image from "next/image";

const CreateFirstTeamPage = () => {
  return (
    <main className="w-full h-screen">
      <IntroNavBar />
      <section className="flex">
        <section className="flex flex-col items-center justify-center w-1/2 h-[calc(100vh-49px)]">
          <section className="flex flex-col gap-5">
            <h1 className="text-2xl font-semibold">
              It all starts with the <br /> board
            </h1>
            <p className="text-xs font-medium">
              A board is where work happens in Trello. You&apos;ll find <br />
              your cards, lists, due dates, and more to keep you <br />
              organized and on track.
            </p>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Enter a board name</Label>
              <Input
                type="email"
                id="name"
                placeholder="e.g.,My Trello board"
              />
            </div>
            <Button className="bg-blue-700 text-xs hover:bg-blue-800 rounded-sm">
              Next
            </Button>
          </section>
        </section>
        <section className="flex flex-col items-center justify-center w-1/2 h-[calc(100vh-49px)] bg-[#F1F7FF]">
          <section className="relative w-[639px] h-[421px] overflow-hidden rounded-xl">
            <Image
              src={workspacePhoto}
              alt="workspace-photo"
              fill
              className="object-contain w-full h-full"
            />
          </section>
        </section>
      </section>
    </main>
  );
};

export default CreateFirstTeamPage;
