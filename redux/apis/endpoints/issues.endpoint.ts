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
        })
    })
});

export const {useGetIssuesQuery,useCreateIssueMutation} = extendedApi;