"use client";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";

//components
import IssueTypeDropdown from "./IssueTypeDropdown";
//icon
import { PlusIcon, ImageIcon } from "@radix-ui/react-icons";

//data
import { issueType } from "../DummyData/data";
import { Input } from "../ui/input";
import Image from "next/image";
import { Label } from "../ui/label";
import InputTextEditor from "./InputTextEditor";
import ReporterDropdown from "./ReporterDropdown";
import PiorityDrowdown from "./PiorityDrowdown";

const CreateIssue = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-6 h-6 bg-blue-500 rounded-full ml-auto p-1 flex items-center justify-center my-2 hover:bg-blue-600"
        >
          <PlusIcon className="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base font-normal ">
            Create Issue
          </DialogTitle>
        </DialogHeader>
        <section className="flex flex-col space-y-6">
          <div
            className={`h-[100px] overflow-hidden w-full relative flex items-center justify-center  ${
              image ? "border-none" : "border-dashed border-[1px] rounded-sm"
            }`}
          >
            {image ? (
              <Image
                src={
                  image ? URL.createObjectURL(image) : "/photos/board-bg.jpeg"
                }
                alt="issue phot"
                fill
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => imageRef.current?.click()}
              />
            ) : (
              <Button
                variant={"ghost"}
                className="flex items-center justify-center gap-2 w-full h-full"
                onClick={() => imageRef.current?.click()}
              >
                <span className="font-medium"> Click to select an image</span>
                <ImageIcon />
              </Button>
            )}
          </div>
          <Input
            type="file"
            ref={imageRef}
            className="hidden"
            onChange={(e) => {
              //check e is an image
              if (!e.target.files![0]!.type.startsWith("image/")) return;
              setImage(e.target.files![0]);
            }}
            placeholder="select file"
          />
          <IssueTypeDropdown />
          <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="summary" className="text-xs">Short Summary</Label>
            <Input type="text" id="summary" placeholder="Enter short summary" />
          </div>
          <InputTextEditor/>
          <div>
            <Label className="text-xs font-medium">Reporter</Label>
            <ReporterDropdown/>
          </div>
          <div>
            <Label className="text-xs font-medium">Assignee</Label>
            <ReporterDropdown/>
          </div>
          <PiorityDrowdown/>
        </section>
        <DialogFooter>
           <DialogTrigger>
           <Button type="button" className="px-5 bg-slate-400 hover:bg-slate-500">Cancel</Button>
           </DialogTrigger>
           <DialogTrigger>
           <Button type="button" className="px-6 bg-blue-600 hover:bg-blue-700">Create</Button>
           </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssue;
