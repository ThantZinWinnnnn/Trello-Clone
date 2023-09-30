"use client";
import React, { ForwardRefExoticComponent } from "react";
import { Button } from "../ui/button";
import { LucideIcon } from "lucide-react";

const ProfileButton = ({ text, className, onClick,Icon }: BtnProps) => {
  return (
    <Button
      className={`text-sm py-1 px-4 bg-blue-600 hover:bg-blue-500 text-white flex gap-2 ${className}`}
      onClick={onClick}
    >
      {text}<Icon className="w-4 h-4"/>
    </Button>
  );
};

export default ProfileButton;
type BtnProps = {
  text: string;
  className: string;
  onClick: () => void;
  Icon: LucideIcon
};
