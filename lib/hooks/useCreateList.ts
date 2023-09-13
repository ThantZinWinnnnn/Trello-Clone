import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import axios from "axios";

export const useCreateList = (boardId: string) => {
  const queryClient = useQueryClient();
  const uniqueId = useId();
  return useMutation({
    mutationFn: async (body: { listName: string; boardId: string }) => {
      const response = await axios.post("/api/lists", body);
      return response.data;
    },
    onMutate: async (data) => {
      const { listName, boardId } = data;

      await queryClient.cancelQueries({ queryKey: ["lists", boardId] });
      const previousLists = await queryClient.getQueryData(["lists", boardId]);
      queryClient.setQueryData(
        ["lists", boardId],
        (oldLists: Array<ListProps> | undefined) => [
          ...oldLists!,
          {
            id: uniqueId,
            name: listName,
            order: oldLists!.length + 1,
            createdAt: "",
            updatedAt: "",
            boardId,
          },
        ]
      );
      return{
        previousLists
      }
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["lists", boardId], context?.previousLists);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["lists", boardId]);
    }
  });
};
