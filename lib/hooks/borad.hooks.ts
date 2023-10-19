"use client"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useGetData = ({ T, queryKey, boardId }: GetDataProps) => {
    return useQuery<typeof T>({
        queryKey: [`${queryKey}`, boardId],
        queryFn: async () => {
            const response = await axios.get(`/api/issues?boardId=${boardId}`);
            return response.data;
        }
    })
};
