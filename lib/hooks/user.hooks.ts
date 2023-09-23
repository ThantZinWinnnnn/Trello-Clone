import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useGetUsers = (query:string)=>{
    return useQuery<Array<UserProps>>({
        queryKey:['users',query],
        queryFn:async()=>{
            const response = await axios.get(`/api/user?query=${query}`);
            return response.data;
        }
    })
}