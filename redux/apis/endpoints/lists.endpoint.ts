
import {api} from "../api";

export const extendedApi = api.injectEndpoints({
    endpoints:(builder)=>({
        getLists:builder.query<ReturnDndListsProps,string>({
            query:(boardId:string)=>({url:`lists?boardId=${boardId}`}),
            providesTags:["Lists"]
        }),
        createList:builder.mutation<ListProps,CreateListProps>({
            query:(body)=>({url:"lists",method:"POST",body}),
            invalidatesTags:["Lists"]
        })
    })
});

export const { useGetListsQuery,useCreateListMutation} = extendedApi;