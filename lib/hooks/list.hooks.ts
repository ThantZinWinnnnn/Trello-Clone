import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export const useGetLists = (boardId: string) => {
   return useQuery<Array<ListProps>>({
        queryKey: ["lists", boardId],
        queryFn: async () => {
          const response = await axios.get(`/api/lists?boardId=${boardId}`);
          return response.data;
        },
      })
};

export const useUpdateList = (boardId: string, listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:async(data:UpdateListName)=>{
      const response = await axios.patch('/api/lists',data);
      return response.data;
    },
    onMutate: async (data) => {
      const {listId,name} = data;
      await queryClient.cancelQueries({ queryKey: ["lists", boardId] });
      const previousLists = await queryClient.getQueryData(["lists", boardId]);
      queryClient.setQueryData(['lists',boardId],(oldLists:Array<ListProps> | undefined)=>{
        return oldLists?.map((list)=>{
          if(list?.id === listId){
            return {
              ...list,
              name
            }
          }
          return list
        })
      });

      return {
        previousLists
      }
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["lists", boardId], context?.previousLists);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["lists", boardId])
    }
  });
}

export const useDeleteList = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:async(listId:string)=>{
      const response = await axios.delete(`/api/lists?listId=${listId}`);
      return response.data;
    },
    onMutate:async(listId)=>{
      await queryClient.cancelQueries(["lists", boardId]);
      const previousLists = await queryClient.getQueryData(["lists", boardId]);
      queryClient.setQueryData(["lists", boardId],(oldLists:Array<ListProps> | undefined)=>{
        return oldLists?.filter((list)=>list?.id !== listId);
      });
      return {
        previousLists
      }
    },
    onError:(error,data,context)=>{
      queryClient.setQueryData(["lists", boardId],context?.previousLists);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["lists", boardId])
    }
  })
}