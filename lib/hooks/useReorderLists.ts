import { useMutation,useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useReorderLists =(boardId:string) => {
    const  queryClient = useQueryClient();
    return useMutation({
        mutationFn:async(data:orderProps)=>{
            const response = await axios.put('/api/lists',data);
            return response.data;
        },
        onMutate:async(data)=>{
            const {id,oIdx,nIdx} = data;
            await queryClient.cancelQueries({queryKey:["lists",boardId]});
            const previouseLists = await queryClient.getQueryData(["lists",boardId]);
            queryClient.setQueryData(["lists",boardId],(oldLists:Array<ListProps> | undefined)=>updateListOrderLocally(oldLists!,{id,oIdx,nIdx}));
            return {
                previouseLists
            }
        },  
        onError:(error,data,context)=>{
            queryClient.setQueryData(["lists"],context?.previouseLists);
        },
        onSettled:()=>queryClient.invalidateQueries(["lists",boardId])
    });


};


const updateListOrderLocally = (lists: Array<ListProps>,{id,oIdx,nIdx}:orderProps ) => {
    const sourceList = lists.slice(0);
    const draggedList = sourceList.splice(oIdx, 1)[0];
    sourceList.splice(nIdx, 0, draggedList);

    return sourceList;
}