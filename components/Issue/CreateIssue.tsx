"use client";
import React, { useRef, useState, useReducer, useMemo } from "react";
import { useParams } from "next/navigation";

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";
import { UploadButton } from "../utils/util";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";

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

//api
import { useCreateIssue } from "@/lib/hooks/issue.hooks";
import { useQueryClient } from "@tanstack/react-query";
import DescTextArea from "./DescTextArea";

const CreateIssue = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();
  const imageRef = useRef<HTMLInputElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [form, dispatch] = useReducer(reducer, states);
  const { mutate: createIssue, isLoading } = useCreateIssue();
  const params = useParams();
  const boardId = params.boardId as string;
  
  console.log("form", form, "id", boardId);
  const getAllRequiredValues =
    form.image !== "" &&
    form.summary !== "" &&
    form.desc !== "" &&
    form.reporterId !== "" &&
    form.assignees.length > 0 &&
    form.priority !== "";

  const createIssueHandler = () => {
    if (getAllRequiredValues) {
      createIssue(
        { ...form, boardId: boardId, listId: listId },
        {
          onError: () => toast.error("Error Creating Issue"),
          onSuccess: () => {
            queryClient.invalidateQueries(["issues", boardId]);
            toast.success("Issue Created");
            setOpenModal(false);           
          },
        }
      );
    }else{
      toast.error("Please fill the all fields values");
    }
    

    // toast.error("Error Creating Issue");
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <Button
          variant={"ghost"}
          onClick={() => setOpenModal(true)}
          className="w-6 h-6 bg-blue-500 rounded-full ml-auto p-1 flex items-center justify-center my-2 mr-4 hover:bg-blue-600"
        >
          <PlusIcon className="text-white" />
        </Button>

        <DialogContent className="dark:bg-gray-700">
          <DialogHeader>
            <DialogTitle className="text-base font-normal ">
              Create Issue
            </DialogTitle>
          </DialogHeader>
          <section className="flex flex-col space-y-6 overflow-y-scroll px-1">
            <div
              className={`h-[100px] overflow-hidden w-full relative flex items-center justify-center dark:bg-gray-500 rounded-md  ${
                form.image !== ""
                  ? "border-none"
                  : "border-dashed border-[1px] rounded-sm"
              }`}
            >
              {form.image !== "" ? (
                <Image
                  src={form.image}
                  alt="issue photo"
                  fill
                  className="w-full h-full object-contain cursor-pointer"
                  // onClick={() => imageRef.current?.click()}
                  onClick={() => dispatch({ type: "image", value: "" })}
                />
              ) : (
                //     <UploadButton
                //     className="flex items-center justify-center  w-full h-full"
                //     content={{
                //       button({ready}){
                //         if(ready) return <p className="text-white text-sm">Upload Image</p>
                //         return "Getting ready..."
                //       },
                //       allowedContent({ ready, fileTypes, isUploading }) {
                //         if (!ready) return "Checking what you allow";
                //         if (isUploading) return "Seems like image is uploading";
                //         return `image max size (4MB)`;
                //       },
                //     }}
                //   endpoint="imageUploader"
                //   onClientUploadComplete={(res) => {
                //     // Do something with the response
                //     dispatch({type:"image",value:res![0]?.url})
                //   }}
                //   onUploadError={(error: Error) => {
                //     // Do something with the error.
                //     alert(`ERROR! ${error.message}`);
                //   }}
                // />
                // <Button
                //   variant={"ghost"}
                //   className="flex items-center justify-center gap-2 w-full h-full"
                //   onClick={() => imageRef.current?.click()}
                // >
                //   <span className="font-medium"> Click to select an image</span>
                //   <ImageIcon />
                // </Button>
                <div className="flex items-center justify-center gap-2 w-full h-full">
                  <span className="font-medium">
                    Please select the issue type
                  </span>
                  <ImageIcon />
                </div>
              )}
            </div>
            {/* <Input
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
            /> */}
            <IssueTypeDropdown val={form.type} dispatch={dispatch} />
            <div className="grid w-full  items-center gap-1.5">
              <Label htmlFor="summary" className="text-xs">
                Short Summary
              </Label>
              <Input
                type="text"
                id="summary"
                value={form.summary}
                placeholder="Enter short summary"
                onChange={(e) =>
                  dispatch({ type: "summary", value: e.target.value })
                }
                className="dark:bg-gray-500"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-xs font-medium">
                Description
              </Label>
              <DescTextArea value={form.desc} dispatch={dispatch} />
              {/* <InputTextEditor dispatch={dispatch} val={form.desc} /> */}
            </div>
            <div>
              <Label className="text-xs font-medium">Reporter</Label>
              <Dropdown val={form.reporterId} dispatch={dispatch} />
            </div>
            <div>
              <Label className="text-xs font-medium">Assignee</Label>
              <Dropdown
                arVal={form.assignees}
                dispatch={dispatch}
                multiple={true}
              />
            </div>
            <section>
              <Label className="text-xs font-medium">Piority</Label>
              <PiorityDrowdown val={form.priority} dispatch={dispatch} />
            </section>
          </section>
          <DialogFooter>
            <DialogTrigger>
              <Button
                type="button"
                className="px-5 bg-slate-400 hover:bg-slate-500"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
            </DialogTrigger>

            <Button
              type="button"
              className="px-6 bg-blue-600 hover:bg-blue-700 dark:text-white"
              onClick={createIssueHandler}
              disabled={!getAllRequiredValues}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
