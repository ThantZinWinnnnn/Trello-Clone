"use client";
import React from "react";
import { Button } from "../ui/button";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {Undo2} from "lucide-react";

const ProfileButton = ({ text, className }: BtnProps) => {
  const router = useRouter();
  return (
    <Button
      className={`text-sm py-1 px-4 bg-blue-600 hover:bg-blue-500 text-white flex gap-2 ${className}`}
      onClick={()=>{router.back()}}
    >
      {text}<Undo2 className="w-4 h-4"/>
    </Button>
  );
};

export default ProfileButton;
type BtnProps = {
  text: string;
  className: string;
  Icon?: LucideIcon
};
