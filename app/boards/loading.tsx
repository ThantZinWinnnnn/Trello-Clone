"use client";
import { CSSProperties } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

export default function Loading(){
    return <main className="flex flex-col items-center justify-center h-full w-full">
        <ScaleLoader color="blue"/>
    </main>
}