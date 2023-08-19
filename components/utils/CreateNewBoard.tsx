"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

const CreateNewBoard: React.FC<CreateBoardProps> = ({
  name,
  setName,
  isLoading,
  createBoardHandler,
  ClassName
}) => {
  const { data: session } = useSession();

  return (
    <section className={cn(ClassName)}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="name">Enter a board name</Label>
        <Input
          type="email"
          id="name"
          placeholder="e.g.,My Trello board"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button
        className={`bg-blue-700 text-xs hover:bg-blue-800 rounded-sm flex items-center ${
          isLoading && "cursor-not-allowed gap-6"
        }`}
        disabled={isLoading}
        onClick={() => createBoardHandler(name, session?.user.id)}
      >
        {isLoading && <Loader className="animate-spin" />}
        {isLoading ? "Creating..." : "Create a board"}
      </Button>
    </section>
  );
};

export default CreateNewBoard;
