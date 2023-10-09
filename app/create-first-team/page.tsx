"use client";
import IntroNavBar from "@/components/Intro/IntroNavBar";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import workspacePhoto from "@/public/photos/board.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";



const CreateFirstTeamPage = () => {
  const [boardName, setBoardName] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();

  const { mutate: createBoard, isLoading } = useMutation({
    mutationFn: async ({ inputName, userId }: inputProps) => {
      const response = await axios.post("/api/board", {
        boardName: inputName,
        userId,
      });
      return response.data;
    },
  });
  const createBoardHandler = (
    inputName: string,
    userId: string | undefined | null
  ) => {
    createBoard(
      { inputName, userId },
      {
        onError: (err) =>
          toast.error(
            "Unfortunately, unsuccessful request for board.Please try again"
          ),
        onSuccess: () => {
          toast.success("Board created successfully");
          setTimeout(() => router.push("/boards"), 200);
        },
      }
    );
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <main className="w-full h-screen">
        <IntroNavBar />
        <section className="flex dark:bg-gray-700">
          <section className="flex flex-col items-center justify-center w-full sm:w-1/2 h-[calc(100vh-49px)]">
            <section className="flex flex-col gap-5">
              <h1 className="text-lg md:text-xl lg:text-2xl font-semibold">
                It all starts with the <br /> board
              </h1>
              <p className="text-[0.65rem] text-slate-400 md:text-xs font-medium">
                A board is where work happens in Trello. You&apos;ll find <br />
                your cards, lists, due dates, and more to keep you <br />
                organized and on track.
              </p>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name" className="text-[0.75rem] md:text-sm lg:text-base">Enter a board name</Label>
                <Input
                  type="email"
                  id="name"
                  placeholder="e.g.,My Trello board"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="dark:bg-gray-500"
                />
              </div>
              <Button
                className={`bg-blue-700 text-xs hover:bg-blue-800 rounded-sm flex items-center dark:text-white ${
                  isLoading && "cursor-not-allowed gap-6"
                }`}
                disabled={isLoading}
                onClick={() => createBoardHandler(boardName, session?.user.id)}
              >
                {isLoading && <Loader className="animate-spin" />}
                {isLoading ? "Creating..." : "Create a board"}
              </Button>
            </section>
          </section>
          <section className="flex-col items-center justify-center w-1/2 h-[calc(100vh-49px)] bg-[#F1F7FF] sm:px-5 md:px-7 xl:px-0 hidden sm:flex">
            <section className="relative w-full h-full  xl:h-[421px] overflow-hidden rounded-xl">
              <Image
                src={workspacePhoto}
                alt="workspace-photo"
                fill
                style={{ objectFit: "contain" }}
              />
            </section>
          </section>
        </section>
      </main>
    </>
  );
};

export default CreateFirstTeamPage;
