import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import exp from "constants";

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

export const useAddAssignee = (issueId: string, listId: string, user: UserProps,boardId:string,updateType:string) => {
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
        previousIssues
      }
    },
    onError:(error,data,context)=>{
      queryClient.setQueriesData(["issues",boardId],context?.previousIssues);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["issues", boardId]);
    }
  });
};


const updateAssigneeLocally = (
  issues: Issues,
  issueId: string,
  listId: string,
  user: UserProps,
  id: string,
  boardId: string,
  type:string
) => {
  const source = issues[listId]?.slice(0);
  const sourceIssueIdx =
    source?.find((issue) => issue?.id === issueId)?.order! - 1;
  const tobeUpdatedIssue = source?.splice(sourceIssueIdx, 1)[0];
  const indx = tobeUpdatedIssue?.assignees?.length;
  if(type === "add"){
    tobeUpdatedIssue?.assignees?.splice(indx!, 0, {
      id,
      createdAt: "",
      userId: user?.id!,
      issueId,
      boardId,
      User: user,
    });
  };
  tobeUpdatedIssue?.assignees?.filter((assignee)=>assignee?.User?.id !== user?.id)
  
  return { ...issues, [listId]: [...source,tobeUpdatedIssue]} as Issues;
};

// const issueUpdateFun = async(data:IssueUpdateProps,issueId:string)=>{
//   const response = await axios.put(`/api/issues/${issueId}`,data);
//   return response.data;
// }


const issueSuccessFun =  (queryClient:QueryClient,boardId:string) => {
  queryClient.invalidateQueries(["issues", boardId]);
}
