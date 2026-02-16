"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

const CreateNewBoard: React.FC<CreateBoardProps> = ({
  name,
  setName,
  isLoading,
  createBoardHandler,
  ClassName
}) => {
  return (
    <section className={cn(ClassName)}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="name">Enter a board name</Label>
        <Input
          type="text"
          id="name"
          placeholder="e.g.,My BoardForge board"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="dark:bg-gray-500"
        />
      </div>
      <Button
        className={`bg-blue-700 text-xs hover:bg-blue-800 rounded-sm flex items-center dark:text-white ${
          isLoading && "cursor-not-allowed gap-6"
        }`}
        disabled={isLoading || name.trim().length === 0}
        onClick={() => createBoardHandler({inputName:name})}
      >
        {isLoading && <Loader className="animate-spin" />}
        {isLoading ? "Creating..." : "Create a board"}
      </Button>
    </section>
  );
};

export default CreateNewBoard;
