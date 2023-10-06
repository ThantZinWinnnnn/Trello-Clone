"use client";
import React, { useState, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateNewBoard from "../utils/CreateNewBoard";
import { useMutation,useQueryClient  } from "@tanstack/react-query";
import axios from "axios";
import { useBoardStore } from "@/globalState/store/zustand.store";



const CreateNewBoardModal = ({ children }: { children: React.ReactNode }) => {
  const {setSuccessBoardCreation} = useBoardStore()
  const [newBoard, setNewBoard] = useState<string>("");
  const queryClient = useQueryClient()
  const {mutate:createBoard,isLoading} = useMutation({mutationFn:async({inputName,userId}:inputProps)=>{
    const response = await axios.post('/api/board',{boardName:inputName,userId});
    return response.data;
  }})
  const createBoardHandler = (
  data:inputProps
  ) => {
    createBoard(data,{
      onError:(err)=> setSuccessBoardCreation("failed"),
      onSuccess:()=>{
        queryClient.invalidateQueries(["boards"])
        setSuccessBoardCreation("success")
      },
    })
  };


  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="dark:bg-gray-700">
        <DialogHeader>
          <DialogTitle className="mb-6">New Board</DialogTitle>
        </DialogHeader>
        <CreateNewBoard
          name={newBoard}
          setName={setNewBoard}
          createBoardHandler={createBoardHandler}
          isLoading={isLoading}
          ClassName="space-y-6"
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(CreateNewBoardModal);
