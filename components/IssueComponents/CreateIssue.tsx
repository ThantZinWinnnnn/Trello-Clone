"use client";
import React, { useRef, useState, useReducer } from "react";
import {
  Dialog,
  DialogContent,
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
import Dropdown from "./Dropdown";
import PiorityDrowdown from "./PiorityDropdown";

const CreateIssue = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [form, dispatch] = useReducer(reducer, states);
  console.log("form", form);

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
            {form.image !== "" ? (
              <Image
                src={form.image !== "" ? form.image : "/photos/board-bg.jpeg"}
                alt="issue photo"
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
              // setImage(e.target.files![0]);
              dispatch({
                type: "image",
                value: URL.createObjectURL(e.target.files![0]),
              });
            }}
            placeholder="select file"
          />
          <IssueTypeDropdown val={form.type} dispatch={dispatch}/>
          <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="summary" className="text-xs">
              Short Summary
            </Label>
            <Input
              type="text"
              id="summary"
              value={form.summary}
              placeholder="Enter short summary"
              onChange={(e) => dispatch({ type: "summary", value: e.target.value })}
            />
          </div>
         <div>
            <Label className="text-xs font-medium">Description</Label>
            <InputTextEditor dispatch={dispatch} val={form.desc}/>
         </div>
          <div>
            <Label className="text-xs font-medium">Reporter</Label>
            <Dropdown val={form.reporterId} dispatch={dispatch}/>
          </div>
          <div>
            <Label className="text-xs font-medium">Assignee</Label>
            <Dropdown arVal={form.assignees} dispatch={dispatch} multiple={true}/>
          </div>
          <section>
            <Label className="text-xs font-medium">Piority</Label>
            <PiorityDrowdown val={form.priority} dispatch={dispatch}/>
          </section>
        </section>
        <DialogFooter>
          <DialogTrigger>
            <Button
              type="button"
              className="px-5 bg-slate-400 hover:bg-slate-500"
            >
              Cancel
            </Button>
          </DialogTrigger>
          <DialogTrigger>
            <Button
              type="button"
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              Create
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssue;

export type T =
  | "image"
  | "type"
  | "summary"
  | "desc"
  | "priority"
  | "reporter"
  | "assignee";
export type I = { type: T; value: string | string[] };
const states: IssueState = {
  image: "",
  type: "",
  summary: "",
  desc: "",
  priority: "",
  reporterId: "",
  assignees: [],
};

const reducer = (state: IssueState, { type, value }: I) => {
  switch (type) {
    case "image":
      return { ...state, image: value as string };
    case "type":
      return { ...state, type: value as string };
    case "summary":
      return { ...state, summary: value as string };
    case "desc":
      return { ...state, desc: value as string };
    case "priority":
      return { ...state, priority: value as string };
    case "reporter":
      return { ...state, reporterId: value as string };
    case "assignee":
      return { ...state, assignees: value as string[] };
  }
};
