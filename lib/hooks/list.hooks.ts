import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useGetLists = (boardId: string) => {
   return useQuery<Array<ListProps>>({
        queryKey: ["lists", boardId],
        queryFn: async () => {
          const response = await axios.get(`/api/lists?boardId=${boardId}`);
          return response.data;
        },
      })
}