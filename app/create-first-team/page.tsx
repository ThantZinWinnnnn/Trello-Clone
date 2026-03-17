"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const AnimatedBoardVisual = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-full h-full opacity-0" />;

  return (
    <div className="relative w-full max-w-lg aspect-video bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-4 sm:p-6 overflow-hidden shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 backdrop-blur-sm">
      {/* Header mock */}
      <div className="flex items-center gap-2 mb-6 opacity-80">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-sm" />
        </div>
        <div className="w-32 h-4 bg-slate-300 dark:bg-slate-600 rounded-full" />
      </div>

      {/* Lists Container */}
      <div className="flex gap-4 h-full">
        {/* Column 1 */}
        <div className="flex-1 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg p-3 flex flex-col gap-3">
          <div className="w-20 h-3 bg-slate-300 dark:bg-slate-600 rounded-full mb-1" />
          <div className="w-full h-20 bg-white dark:bg-slate-800 rounded shadow-sm p-2 flex flex-col gap-2 transform transition-transform hover:-translate-y-1">
            <div className="w-12 h-2 rounded-full bg-blue-200 dark:bg-blue-900/50" />
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-2" />
            <div className="w-3/4 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="w-full h-20 bg-white dark:bg-slate-800 rounded shadow-sm p-2 flex flex-col gap-2 transform transition-transform hover:-translate-y-1">
            <div className="w-16 h-2 rounded-full bg-purple-200 dark:bg-purple-900/50" />
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-2" />
          </div>
        </div>

        {/* Column 2 (Active/Animated) */}
        <div className="flex-1 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg p-3 flex flex-col gap-3 relative">
          <div className="w-24 h-3 bg-slate-300 dark:bg-slate-600 rounded-full mb-1" />
          <div className="w-full h-20 bg-white dark:bg-slate-800 rounded shadow-sm p-2 flex flex-col gap-2">
            <div className="w-14 h-2 rounded-full bg-amber-200 dark:bg-amber-900/50" />
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-2" />
            <div className="w-5/6 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Floating animated card */}
          <div className="absolute top-[40%] left-3 right-3 h-20 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded shadow-xl p-2 flex flex-col gap-2 animate-bounce z-10 rotate-3">
            <div className="w-10 h-2 rounded-full bg-blue-300 dark:bg-blue-600" />
            <div className="w-full h-2 rounded-full bg-blue-200 dark:bg-blue-800/50 mt-2" />
            <div className="w-4/5 h-2 rounded-full bg-blue-200 dark:bg-blue-800/50" />
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex-1 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg p-3 flex flex-col gap-3">
          <div className="w-16 h-3 bg-slate-300 dark:bg-slate-600 rounded-full mb-1" />
          <div className="w-full h-20 bg-white dark:bg-slate-800 rounded shadow-sm p-2 flex flex-col gap-2 opacity-60">
            <div className="w-12 h-2 rounded-full bg-emerald-200 dark:bg-emerald-900/50" />
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-2" />
          </div>
        </div>
      </div>

      {/* Decorative gradient blur in background */}
      <div className="absolute -z-10 w-[200%] h-[200%] -top-1/2 -left-1/2 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-emerald-500/20 blur-3xl animate-pulse mix-blend-multiply dark:mix-blend-screen" />
    </div>
  );
};

const CreateFirstTeamPage = () => {
  const [boardName, setBoardName] = useState<string>("");
  const router = useRouter();
  const validBoardName = boardName.trim() === "";

  const { mutate: createBoard, isLoading } = useMutation({
    mutationFn: async ({ inputName }: inputProps) => {
      const response = await axios.post("/api/board", {
        boardName: inputName,
      });
      return response.data;
    },
  });

  const createBoardHandler = (inputName: string) => {
    createBoard(
      { inputName },
      {
        onError: () =>
          toast.error(
            "Unfortunately, the request was unsuccessful. Please try again."
          ),
        onSuccess: () => {
          toast.success("Board created successfully");
          setTimeout(() => router.push("/boards"), 400); // Slight delay for toast
        },
      }
    );
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <main className="w-full min-h-screen flex flex-col lg:flex-row bg-white dark:bg-[#0E182A]">
        {/* Left Side: Form */}
        <section className="flex flex-col flex-1 items-center justify-center p-8 lg:p-20 z-10">
          <div className="w-full max-w-md flex flex-col gap-8">
            {/* Minimal Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center">
                <div className="w-3.5 h-3.5 border-2 border-white rounded-sm" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                BoardForge
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Let&apos;s build your <br className="hidden sm:block" />
                <span className="text-blue-600 dark:text-blue-500">first board</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                A board is where work happens. You&apos;ll find your cards, lists, due dates,
                and tools needed to keep your team organized and on track.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Board name
                </label>
                <Input
                  type="text"
                  id="name"
                  placeholder="e.g., Marketing Campaign Q3"
                  value={boardName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBoardName(e.target.value)
                  }
                  className="h-12 border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !validBoardName && !isLoading) {
                      createBoardHandler(boardName);
                    }
                  }}
                />
              </div>

              <Button
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                disabled={validBoardName || isLoading}
                onClick={() => createBoardHandler(boardName)}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating workspace...
                  </>
                ) : (
                  "Create board"
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* Right Side: Visual (Hidden on mobile) */}
        <section className="hidden lg:flex flex-1 items-center justify-center bg-slate-50/50 dark:bg-[#101D30] relative overflow-hidden p-12">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

          <div className="relative w-full max-w-2xl transform hover:-translate-y-2 transition-transform duration-500">
            <AnimatedBoardVisual />

            {/* Decorative generic UI elements around the board to make it look full */}
            <div className="absolute -bottom-8 -right-8 w-40 h-24 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-4 -rotate-6 z-20">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex-shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-full" />
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CreateFirstTeamPage;
