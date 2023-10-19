import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Session } from "next-auth";
import { deleteBoardLocally } from "./utils.functions";

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

