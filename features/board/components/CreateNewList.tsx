"use client";
import React, { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross1Icon } from "@radix-ui/react-icons";
import { toast,Toaster } from "sonner";
import { useCreateList } from "@/features/board/hooks/list.hooks";

const CreateNewList:React.FC<CreateNewListProps> = ({boardId}) => {
  const [openListInput, setOpenListInput] = useState(false);
  const [newList, setNewList] = useState<string>("");
  const handleOpenListInput = () => setOpenListInput((prev) => !prev);
  const body = {
    listName:newList,
    boardId
   
  }
    const notEnterText = newList === "";
    const {mutate:createList,isLoading:creating}  = useCreateList(boardId)
    // if(isSuccess) {
    //     handleOpenListInput()
    // }
    // if(isError) toast.error("Error creating list please try again")

  return (
    <section className="w-[280px] shrink-0">
        <Toaster richColors position="top-center"/>
      {openListInput ? (
        <div className="boardforge-column flex flex-col gap-3 p-3">
          <Input
            value={newList}
            className="h-9 rounded-lg border-slate-200 bg-white text-sm dark:border-slate-600 dark:bg-slate-800"
            onChange={(e) => setNewList(e.target.value)}
            placeholder="Enter list title..."
          />
          <div className="flex justify-between items-center">
            <Button className="h-8 rounded-lg bg-blue-600 px-5 text-xs font-semibold hover:bg-blue-700 dark:text-white"
                onClick={()=>{
                    createList(body)
                    setNewList("");
                    setOpenListInput(false);
                }}
                disabled={notEnterText}
            >
              {creating ? "Adding..." : "Add list"}
            </Button>
            <Button variant={"outline"} onClick={handleOpenListInput} className="h-8 rounded-lg border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800">
              <Cross1Icon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          className="boardforge-column h-11 w-full justify-start border-dashed bg-transparent px-4 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-100 dark:hover:bg-slate-700"
          onClick={handleOpenListInput}
        >
          + Create New List
        </Button>
      )}
    </section>
  );
};

export default memo(CreateNewList);

interface CreateNewListProps{
    boardId:string
}
