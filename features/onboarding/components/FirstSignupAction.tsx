"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

const FirstSignupAction = () => {
    const [accepted, setAccepted] = useState(false);

    return (
        <div className="w-full flex flex-col items-center mt-2">
            <div className="w-full">
                {accepted ? (
                    <Link href="/create-first-team" className="w-full block">
                        <button className="w-full h-11 bg-blue-600 hover:bg-blue-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-sm font-medium rounded-lg transition-all active:scale-[0.98] shadow-sm flex items-center justify-center">
                            Complete setup & continue
                        </button>
                    </Link>
                ) : (
                    <button
                        disabled
                        className="w-full h-11 bg-slate-200 dark:bg-blue-600 text-slate-400 dark:text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed flex items-center justify-center border border-slate-300 dark:border-slate-700 transition-colors"
                    >
                        Complete setup & continue
                    </button>
                )}
            </div>

            <div className="flex items-start space-x-3 mt-6 self-center">
                <Checkbox
                    id="hobby-terms"
                    checked={accepted}
                    onCheckedChange={(checked) => setAccepted(checked as boolean)}
                    className="mt-0.5"
                />
                <label
                    htmlFor="hobby-terms"
                    className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer max-w-[280px]"
                >
                    I accept the conditions for this hobby project. (No formal terms or privacy policy exist).
                </label>
            </div>
        </div>
    );
};

export default FirstSignupAction;
