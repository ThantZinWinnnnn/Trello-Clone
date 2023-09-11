import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useReorderIssues =(boardId:string) => {
    const  queryClient = useQueryClient();
    return useMutation({
        mutationFn:async(data:ReorderIssue)=>{
            const response = await axios.put('/api/issues',data);
            return response.data;
        },
        onMutate:async(data)=>{
            const {s,d,boardId,id} = data;
            await queryClient.cancelQueries({queryKey:["issues",boardId]});
            const previouseIssues = await queryClient.getQueryData(["issues",boardId]);
            queryClient.setQueryData(["issues",boardId],(oldIssues:Issues | undefined)=>updateIssueOrderLocally(oldIssues!,{s,d}));
            return {
                previouseIssues
            }
        },  
        onError:(error,data,context)=>{
            queryClient.setQueryData(["issues",boardId],context?.previouseIssues);
        },
        onSettled:()=>queryClient.invalidateQueries(["issues",boardId])
    })
};

const updateIssueOrderLocally = (issues: Issues, { s, d }: dndOrderProps) => {
    const source = issues[s.sId].slice(0);
    const target = issues[d.dId].slice(0);
    const draggedIssue = source.splice(s.oIdx, 1)[0]; // remove dragged item from its source list
    (s.sId === d.dId ? source : target).splice(d.nIdx, 0, draggedIssue); // insert dragged item into target list
    return { ...issues, [d.dId]: target, [s.sId]: source } as Issues;
  };