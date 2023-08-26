import {api} from "../api";
export const extendedApi = api.injectEndpoints({
    endpoints:(builder)=>({
        getUsers:builder.query<Array<UserProps>,void>({
            query:()=>({url:"user"}),
            providesTags:["AuthUser"]
        })
    })
});

export const { useGetUsersQuery } = extendedApi;