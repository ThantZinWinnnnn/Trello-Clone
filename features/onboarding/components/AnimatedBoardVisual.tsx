"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBoardVisualProps {
  /**
   * The variant determines specific animations or transform rotations
   * "hero" - Includes the -rotate-2 transform used on the home page
   * "standard" - Flat visual used in create-first-team
   */
  variant?: "hero" | "standard";
  className?: string;
}

const AnimatedBoardVisual: React.FC<AnimatedBoardVisualProps> = ({
  variant = "standard",
  className
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-full h-full opacity-0" />;

  return (
    <div
      className={cn(
        "relative w-full max-w-xl aspect-video bg-white/80 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/50 dark:ring-white/10 backdrop-blur-xl transition-transform duration-700",
        variant === "hero" ? "transform -rotate-2 hover:rotate-0" : "",
        className
      )}
    >
      {/* Header mock */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8 opacity-80">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-md" />
        </div>
        <div className="space-y-1.5 flex-1 max-w-[160px]">
          <div className="w-full h-3 sm:h-4 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="w-2/3 h-2 sm:h-3 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      </div>

      {/* Lists Container */}
      <div className="flex gap-3 sm:gap-4 h-full relative">
        {/* Column 1 */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-2 sm:p-3 flex flex-col gap-3 border border-slate-100 dark:border-slate-800/50">
          <div className="w-16 sm:w-24 h-2 sm:h-3 bg-slate-200 dark:bg-slate-700 rounded-full mb-1" />
          <div className="w-full h-20 sm:h-24 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-2 sm:p-3 flex flex-col gap-2 transform transition-transform hover:-translate-y-1">
            <div className="w-10 sm:w-14 h-2 rounded-full bg-blue-200 dark:bg-blue-900/50" />
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 mt-1 sm:mt-2" />
            <div className="w-3/4 h-2 rounded-full bg-slate-100 dark:bg-slate-700" />
            <div className="mt-auto flex items-center gap-1 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-200 dark:bg-slate-600" />
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 -ml-2" />
            </div>
          </div>
          <div className="w-full h-16 sm:h-20 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-2 sm:p-3 sm:flex flex-col gap-2 transform transition-transform hover:-translate-y-1 hidden">
            <div className="w-16 h-2 rounded-full bg-purple-200 dark:bg-purple-900/50" />
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 mt-2" />
          </div>
        </div>

        {/* Column 2 (Active/Animated) */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-2 sm:p-3 flex flex-col gap-3 border border-slate-100 dark:border-slate-800/50 mt-2 sm:mt-4 relative">
          <div className="w-12 sm:w-20 h-2 sm:h-3 bg-slate-200 dark:bg-slate-700 rounded-full mb-1" />
          <div className="w-full h-24 sm:h-28 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-2 sm:p-3 flex flex-col gap-2 relative">
            <div className="w-12 sm:w-16 h-2 rounded-full bg-amber-200 dark:bg-amber-900/50" />
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 mt-1 sm:mt-2" />
            <div className="w-5/6 h-2 rounded-full bg-slate-100 dark:bg-slate-700" />
          </div>

          {/* Floating animated card (only visible if standard to mimic create-first-team animation) */}
          <div className="absolute top-[45%] left-2 right-2 sm:left-3 sm:right-3 h-16 sm:h-20 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 shadow-xl p-2 flex flex-col gap-2 animate-bounce z-10 rotate-3 rounded-lg">
            <div className="w-10 h-2 rounded-full bg-blue-300 dark:bg-blue-600" />
            <div className="w-full h-2 rounded-full bg-blue-200 dark:bg-blue-800/50 mt-1 sm:mt-2" />
            <div className="w-4/5 h-2 rounded-full bg-blue-200 dark:bg-blue-800/50 hidden sm:block" />
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-2 sm:p-3 flex flex-col gap-3 border border-slate-100 dark:border-slate-800/50 mt-4 sm:mt-8 opacity-60">
          <div className="w-20 sm:w-28 h-2 sm:h-3 bg-slate-200 dark:bg-slate-700 rounded-full mb-1" />
          <div className="w-full h-16 sm:h-20 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-2 sm:p-3 flex flex-col gap-2">
            <div className="w-10 sm:w-12 h-2 rounded-full bg-emerald-200 dark:bg-emerald-900/50" />
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 mt-1 sm:mt-2" />
          </div>
        </div>
      </div>

      {/* Decorative gradient blur in background behind the board */}
      <div className="absolute -z-10 w-[200%] h-[200%] -top-1/2 -left-1/2 bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-3xl animate-pulse mix-blend-overlay" />
    </div>
  );
};

export default AnimatedBoardVisual;
