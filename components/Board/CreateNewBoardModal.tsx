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
import { changeCreationBoardStatus } from "@/redux/features/board.slice";
import { useAppDispatch } from "@/redux/store/hook";
import { useMutation,useQueryClient  } from "@tanstack/react-query";
import axios from "axios";



const CreateNewBoardModal = ({ children }: { children: React.ReactNode }) => {
  const [newBoard, setNewBoard] = useState<string>("");
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient()
  const {mutate:createBoard,isLoading} = useMutation({mutationFn:async({inputName,userId}:inputProps)=>{
    const response = await axios.post('/api/board',{boardName:inputName,userId});
    return response.data;
  }})
  const createBoardHandler = (
  data:inputProps
  ) => {
    createBoard(data,{
      onError:(err)=> dispatch(changeCreationBoardStatus("failed")),
      onSuccess:()=>{
        queryClient.invalidateQueries(["boards"])
        dispatch(changeCreationBoardStatus("success"))
      },
    })
  };


  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
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
