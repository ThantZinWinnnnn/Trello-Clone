"use client";
import React, { memo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useCreateListMutation } from "@/redux/apis/endpoints/lists.endpoint";
import { toast,Toaster } from "sonner";

const CreateNewList:React.FC<CreateNewListProps> = ({boardId}) => {
  const [openListInput, setOpenListInput] = useState(false);
  const [newList, setNewList] = useState<string>("");
  const handleOpenListInput = () => setOpenListInput((prev) => !prev);
  const body = {
    listName:newList,
    boardId
   
  }
    const [mutate,{isLoading,isError,isSuccess}] = useCreateListMutation();

    // if(isSuccess) {
    //     handleOpenListInput()
    // }
    if(isError) toast.error("Error creating list please try again")

  return (
    <section>
        <Toaster richColors position="top-center"/>
      {openListInput ? (
        <div className="flex flex-col gap-2 w-[250px]">
          <Input
            value={newList}
            className="w-full"
            onChange={(e) => setNewList(e.target.value)}
            placeholder="Enter list title..."
          />
          <div className="flex justify-between items-center">
            <Button className="text-xs bg-blue-600 hover:bg-blue-700 px-6"
                onClick={async()=>{
                    await mutate(body)
                    setOpenListInput(false)
                }}
                disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Add list"}
            </Button>
            <Button variant={"outline"} onClick={handleOpenListInput}>
              <Cross1Icon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          className="bg-[#F4F5F7] text-xs text-black hover:bg-gray-200"
          onClick={handleOpenListInput}
        >
          Create  List
        </Button>
      )}
    </section>
  );
};

export default memo(CreateNewList);

interface CreateNewListProps{
    boardId:string
}
