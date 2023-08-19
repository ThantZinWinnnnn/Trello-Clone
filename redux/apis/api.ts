import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const api = createApi({
    reducerPath: "TrelloApiReducer",
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:3000/api/",
        credentials:"include"
    }),
    tagTypes:["Board","Lists","Issues","Members","AuthUser","Comments"],
    endpoints:(builder)=>({})
});

