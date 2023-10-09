import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Session } from "next-auth";

export const useGetBoards = (session: Session | null) => {
  return useQuery<GetUserBoardsProps>({
    queryKey: ["boards", session?.user?.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/board?userId=${session?.user?.id}`
      );
      console.log("response", response);
      return response.data;
    },
  });
};

export const useGetDetailBoard = (boardId: string) => {
  return useQuery<DetailBoardProps>({
    queryKey: ["board", boardId],
    queryFn: async () => {
      const response = await axios.get(`/api/board/${boardId}`);
      return response.data;
    },
  });
};

export const useDeleteBoard = (userId:string) => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn:async(id:string)=>{
          const response = await axios.delete(`/api/board?boardId=${id}`);
          return response.data;
      },
      onMutate:async(boardId)=>{
          await queryClient.cancelQueries(['boards',userId])
          const previousUserBoards = await queryClient.getQueryData(['boards',userId]);
          queryClient.setQueryData(["boards",userId],(oldUserBoards:GetUserBoardsProps | undefined)=>
          deleteBoardLocally(oldUserBoards!,boardId,"remove"));                   
          return {
              previousUserBoards
          }
      },
      onError:(error,data,context)=>{
         queryClient.setQueryData(["boards",userId],context?.previousUserBoards);
      },
      onSuccess:()=>{
          queryClient.invalidateQueries(["boards",userId]);
      }
  })
}
const updateRemoveOrLeaveBoard = (
  oldUserBoards: GetUserBoardsProps,
  action: "delete" | "leave",
  boardId: string
) => {
  const oldCreatedBoards = oldUserBoards?.createdBoards;
  const oldAssignedBoards = oldUserBoards?.assignedBoards
  // const { createdBoards, assignedBoards } = oldUserBoards;
  const updatedDeletedBoards = oldUserBoards?.createdBoards?.boards?.filter((board) => board?.id !== boardId);
  const updatedLeavedBoards = oldUserBoards?.assignedBoards?.filter((board) => board?.id !== boardId);
   if(action === "delete"){
    return {
        createdBoards:{
            boards:updatedDeletedBoards
        },
        assignedBoards:oldAssignedBoards
    } as GetUserBoardsProps
   }else if(action === "leave"){
    return {
        createdBoards:oldCreatedBoards,
        assignedBoards:updatedLeavedBoards
       } as GetUserBoardsProps
   }
  
  
};

export const deleteBoardLocally = (oldUserBoards: GetUserBoardsProps, boardId: string,action:"remove" | "leave") => {
  const oldCreatedBoards = oldUserBoards?.createdBoards;
  const oldAssignedBoards = oldUserBoards?.assignedBoards;
  const updatedDeletedBoards = oldCreatedBoards?.boards?.filter((board) => board?.id !== boardId);
  const updatedLeavedBoards = oldAssignedBoards?.filter((board) => board?.id !== boardId);
  if(action === "remove"){
    return {
        createdBoards:{
            boards:updatedDeletedBoards
        },
        assignedBoards:oldAssignedBoards
    } as GetUserBoardsProps
   }else if(action === "leave"){
    return {
        createdBoards:oldCreatedBoards,
        assignedBoards:updatedLeavedBoards
       } as GetUserBoardsProps
   }
}
