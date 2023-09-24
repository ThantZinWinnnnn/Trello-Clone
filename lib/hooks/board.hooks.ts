import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Session } from "next-auth";


export const useGetBoards = (session:Session | null)=>{
    return useQuery<GetUserBoardsProps>({
        queryKey:['boards',session?.user?.id],
        queryFn:async ()=>{
          const response = await axios.get(`/api/board?userId=${session?.user?.id}`);
          console.log("response",response)
          return response.data;
        },
      })
}