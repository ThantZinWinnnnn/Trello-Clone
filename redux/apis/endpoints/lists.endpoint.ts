
import { api } from "../api";

export const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getLists: builder.query<Array<ListProps>, string>({
            query: (boardId: string) => ({ url: `lists?boardId=${boardId}` }),
            providesTags: ["Lists"]
        }),
        createList: builder.mutation<ListProps, CreateListProps>({
            query: (body) => ({ url: "lists", method: "POST", body }),
            invalidatesTags: ["Lists"]
        }),
        // reorder: builder.mutation<void, ReorderIssue>({
        //     query: (body) => ({ url: "lists", method: "PUT", body }),
        //     async onQueryStarted({ s, d, projectId }, { dispatch }) {
        //         dispatch(
        //             extendedApi.util.updateQueryData("getLists", projectId!, (oldLists) => 
        //             {
        //              console.log("lllllllllllllllllllllllll",oldLists?.lists)
        //             })
        //         )
        //     },
        //     invalidatesTags: ["Lists"]
        // })
    })
});

export const { useGetListsQuery, useCreateListMutation } = extendedApi;

const reorderListsLocal = (oldLists: ReturnDndListsProps, { s, d }: dndOrderProps) => {
    const source = oldLists?.lists.slice(0)
    const draggedList = source.splice(s.oIdx, 1)[0];
    const destinationList = source.splice(d.nIdx, 0, draggedList);
    console.log("deeeee",destinationList)
    return oldLists.lists = destinationList;
}