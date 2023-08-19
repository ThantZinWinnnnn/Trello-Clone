import {api} from "../api";

export const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUserBoards:builder.query<GetUserBoardsProps,string>({
            query:(userId)=>({url:`board?userId=${userId}`}),
            providesTags:["Board"]
        }),
        createBoard:builder.mutation<CreateFirstBoardProps,InputBoardProps>({
            query:(body: {name:string,userId:string})=> ({url:"board",method:"POST",body}),
            invalidatesTags:["Board"]
        }),
    }),
    overrideExisting: false,
});

export const {useCreateBoardMutation,useGetUserBoardsQuery} = extendedApi