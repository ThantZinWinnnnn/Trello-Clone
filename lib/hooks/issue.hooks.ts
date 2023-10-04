import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";


export const useCreateIssue = () => {
  return useMutation({
      mutationFn:async(data:IssueState)=>{
          const response = await axios.post("/api/issues",data);
          return response.data;
      },
  })
};
export const useReorderIssues = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: async (data: ReorderIssue) => {
          const response = await axios.put('/api/issues', data);
          return response.data;
      },
      onMutate: async (data) => {
          const { s, d, boardId, id } = data;
          await queryClient.cancelQueries({ queryKey: ["issues", boardId] });
          const previouseIssues = await queryClient.getQueryData(["issues", boardId]);
          queryClient.setQueryData(["issues", boardId], (oldIssues: Issues | undefined) => 
          updateIssueOrderLocally(oldIssues!, { s, d }));
          return {
              previouseIssues
          }
      },
      // onError:(error,data,context)=>{
      //     queryClient.setQueryData(["issues",boardId],context?.previouseIssues);
      // },
      onSettled: () => queryClient.invalidateQueries(["issues", boardId])
  })
};

const updateIssueOrderLocally = (issues: Issues, { s, d }: dndOrderProps) => {
  const source = issues[s.sId].slice(0);
  const target = issues[d.dId].slice(0);
  const draggedIssue = source.splice(s.oIdx, 1)[0]; // remove dragged item from its source list
  (s.sId === d.dId ? source : target).splice(d.nIdx, 0, draggedIssue); // insert dragged item into target list
  return { ...issues, [d.dId]: target, [s.sId]: source } as Issues;
};


export const useChangeListStatus = (
  boardId: string,
  oldListId: string,
  newListId: string,
  issueId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IssueUpdateProps) => {
      const response = await axios.put(`/api/issues/${issueId}`, data);
      return response.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries(["issues", boardId]);
      const previousIssues = await queryClient.getQueryData([
        "issues",
        boardId,
      ]);
      queryClient.setQueryData(
        ["issues", boardId],
        (oldIssues: Issues | undefined) =>
          updateListStatusLocally(oldIssues!, oldListId, newListId, issueId)
      );

      return {
        previousIssues,
      };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["issues", boardId], context?.previousIssues);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["issues", boardId]);
    },
  });
};

const updateListStatusLocally = (
  issues: Issues,
  oldListId: string,
  newListId: string,
  issueId: string
) => {
  const source = issues[oldListId]?.slice(0);
  const target = issues[newListId]?.slice(0);
  const changedIssueIdx =
    source?.find((issue) => issue?.id === issueId)?.order! - 1;
  const changedIssue = source?.splice(changedIssueIdx, 1)[0];
  target?.splice(target?.length, 0, changedIssue);
  return { ...issues, [oldListId]: source, [newListId]: target } as Issues;
};

export const useUpdateAssignee = (
  issueId: string,
  listId: string,
  user: UserProps,
  boardId: string,
  updateType: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IssueUpdateProps) => {
      const response = await axios.put(`/api/issues/${issueId}`, data);
      return response.data;
    },
    onMutate: async (data) => {
      const { boardId, value, type } = data;
      await queryClient.cancelQueries(["issues", boardId]);
      const previousIssues = await queryClient.getQueryData([
        "issues",
        boardId,
      ]);
      queryClient.setQueryData(
        ["issues", boardId],
        (oldIssues: Issues | undefined) =>
          updateAssigneeLocally(
            oldIssues!,
            issueId,
            listId,
            user,
            value,
            boardId,
            updateType
          )
      );
      return {
        previousIssues,
      };
    },
    onError: (error, data, context) => {
      queryClient.setQueriesData(["issues", boardId], context?.previousIssues);
    },
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries(["issues", boardId]),
        queryClient.invalidateQueries(["users", boardId]),
      ]);
    },
  });
};

const updateAssigneeLocally = (
  issues: Issues,
  issueId: string,
  listId: string,
  user: UserProps,
  value: string,
  boardId: string,
  type: string
) => {
  const source = issues[listId]?.slice(0);
  const issue = source?.find((issue) => issue?.id === issueId);
  const sourceIssueIdx =
    source?.find((issue) => issue?.id === issueId)?.order! - 1;
  const tobeUpdatedIssue = source?.splice(sourceIssueIdx, 1)[0];

  const removeAssignIndx = tobeUpdatedIssue?.assignees?.findIndex(
    (assignee) => assignee?.User?.id === user?.id
  );
  const indx = tobeUpdatedIssue?.assignees?.length;
  // tobeUpdatedIssue?.assignees?.splice(indx!, 0, {
  //         id:value,
  //         createdAt: "",
  //         userId: user?.id!,
  //         issueId,
  //         boardId,
  //         User: user,
  //       })

  type == "add"
    ? tobeUpdatedIssue?.assignees?.splice(indx!, 0, {
        id: value,
        createdAt: "",
        userId: user?.id!,
        issueId,
        boardId,
        User: user,
      })
    : type == "remove"
    ? tobeUpdatedIssue?.assignees?.splice(removeAssignIndx!, 1)
    : null;

  return { ...issues, [listId]: [...source, tobeUpdatedIssue] } as Issues;
};

// const issueUpdateFun = async(data:IssueUpdateProps,issueId:string)=>{
//   const response = await axios.put(`/api/issues/${issueId}`,data);
//   return response.data;
// }

const issueSuccessFun = (queryClient: QueryClient, boardId: string) => {
  queryClient.invalidateQueries(["issues", boardId]);
};

export const useDeleteIssue = (boardId: string, listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (issueId: string) => {
      const response = await axios.delete(`/api/issues?issueId=${issueId}`);
      return response.data;
    },
    onMutate: async (issueId) => {
      await queryClient.cancelQueries(["issues", boardId]);
      const previousIssues = await queryClient.getQueryData([
        "issues",
        boardId,
      ]);
      queryClient.setQueryData(
        ["issues", boardId],
        (oldIssues: Issues | undefined) =>
          deleteIssueLocally(oldIssues!, listId, issueId)
      );
      return {
        previousIssues,
      };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["issues", boardId], context?.previousIssues);
    },
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries(["issues", boardId]),
        queryClient.invalidateQueries(["users", boardId]),
      ]);
    }
  });
};

const deleteIssueLocally = (
  issues: Issues,
  listId: string,
  issueId: string
) => {
  const source = issues[listId]?.slice(0);
  const toBeDeletedIndx = source?.findIndex((issue) => issue?.id === issueId);
  source?.splice(toBeDeletedIndx!, 1);
  return { ...issues, [listId]: source } as Issues;
};
