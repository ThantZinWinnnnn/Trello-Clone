import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useGetUsers = (query: string, boardId?: string) => {
    return useQuery<Array<UserProps>>({
        queryKey: ['users', boardId ?? 'all', query],
        queryFn: async () => {
            const params = new URLSearchParams();
            const trimmedQuery = query.trim();
            if (trimmedQuery) {
              params.set("query", trimmedQuery);
            }
            if (boardId) {
              params.set("boardId", boardId);
            }

            const response = await axios.get(`/api/user?${params.toString()}`);
            return response.data;
        },
        keepPreviousData: true,
    })
}
