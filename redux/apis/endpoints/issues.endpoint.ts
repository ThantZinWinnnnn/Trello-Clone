import { url } from "inspector";
import {api} from "../api";
import { useMemo } from "react";

export const extendedApi = api.injectEndpoints({
    endpoints:(builder)=> ({
        getIssues:builder.query<Issues,IssueProps>({
            query:({boardId,userId})=>({url:`issues?boardId=${boardId}${userId ? "&userId="+userId : ""}`}),
            providesTags:["Issues"]
        }),
        createIssue:builder.mutation<void,IssueState>({
            query:(body)=> ({url:"issues",method:"POST",body}),
            invalidatesTags:["Issues","Lists"]
        }),
        reorderIssue:builder.mutation<void,ReorderIssue>({
            query:(body)=>({url:"issues",method:"PUT",body}),
            
            async onQueryStarted({s,d,boardId},{dispatch,queryFulfilled}) {
                try {
                    //  await queryFulfilled;
                    dispatch(
                        extendedApi.util.updateQueryData("getIssues",{boardId:boardId!},(oldIssues)=>{
                            console.log("olllll",oldIssues)
                        })
                    ) 
                } catch (error) {
                    console.log("error",error)
                }
            },
            invalidatesTags:["Issues"]
        })
    })
});

export const {useGetIssuesQuery,useCreateIssueMutation,useReorderIssueMutation} = extendedApi;


const redorderIssuesLocal = (oldIssues:Issues,{s,d}:dndOrderProps)=>{
    const source = oldIssues[s.sId].slice(0);
    const destination = oldIssues[d.dId!].slice(0);
    const draggedIssue = source?.splice(s.oIdx,1)[0];
    (s.sId === d.dId ? source : destination)?.splice(d.nIdx,0,draggedIssue!);
    return {...oldIssues,[s.sId]:source,[d.dId!]:destination} as Issues;

}

// const reorderIssuesLocal = (oldIssues:Array<DndListsProps>,{s,d}:dndOrderProps)=>{
//     const sIdx = findIndex(oldIssues,s.sId);//to get source list so that we can splice it
//     const dIdx = findIndex(oldIssues,d?.dId!);//to get destination list so that we can splice it
//     const sourcelist = oldIssues?.splice(sIdx,1)[0];//source list
//     const destinationlist = oldIssues?.splice(dIdx,1)[0];//destination list
//     const draggedIssue = sourcelist?.issues?.splice(s.oIdx,1)[0];
//     (s.sId === d.dId ? sourcelist?.issues : destinationlist?.issues)?.splice(d.nIdx,0,draggedIssue!)
//     oldIssues.splice(sIdx,0,sourcelist)
//     oldIssues.splice(dIdx,0,destinationlist)
//     return oldIssues;
// }




// const findIndex = (oldIssues:Array<DndListsProps>,id:string)=>{
//     return oldIssues?.findIndex((list)=> list?.id === id)
// }