import { url } from "inspector";
import {api} from "../api";

export const extendedApi = api.injectEndpoints({
    endpoints:(builder)=> ({
        getIssues:builder.query<DndIssueProps,void>({
            query:()=>({url:"issues"}),
            providesTags:["Issues"]
        }),
        createIssue:builder.mutation<void,IssueState>({
            query:(body)=> ({url:"issues",method:"POST",body}),
            invalidatesTags:["Issues","Lists"]
        }),
        reorderIssue:builder.mutation<void,ReorderIssue>({
            query:(body)=>({url:"issues",method:"PUT",body}),
            
            // async onQueryStarted({s,d,projectId},{dispatch,queryFulfilled}) {
            //     dispatch(
            //         extendedApi.util.updateQueryData<string>("getIssues",projectId,(oldIssues)=>)
            //     )
            // }
        })
    })
});

export const {useGetIssuesQuery,useCreateIssueMutation,useReorderIssueMutation} = extendedApi;


// const redorderIssuesLocal = (issues:)