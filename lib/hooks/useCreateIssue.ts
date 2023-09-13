import { useMutation} from "@tanstack/react-query";
import axios from "axios";

export const useCreateIssue = () => {
    return useMutation({
        mutationFn:async(data:IssueState)=>{
            const response = await axios.post("/api/issues",data);
            return response.data;
        }
    })
}