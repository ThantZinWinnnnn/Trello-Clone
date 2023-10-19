import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import {
  deleteIssueLocally,
  updateAssigneeLocally,
  updateIssueOrderLocally,
  updateListStatusLocally,
} from "./utils.functions";

export const useCreateIssue = () => {
  return useMutation({
    mutationFn: async (data: IssueState) => {
      const response = await axios.post("/api/issues", data);
      return response.data;
    },
  });
};
export const useReorderIssues = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReorderIssue) => {
      const response = await axios.put("/api/issues", data);
      return response.data;
    },
    onMutate: async (data) => {
      const { s, d, boardId, id } = data;
      await queryClient.cancelQueries({ queryKey: ["issues", boardId] });
      const previouseIssues = await queryClient.getQueryData([
        "issues",
        boardId,
      ]);
      queryClient.setQueryData(
        ["issues", boardId],
        (oldIssues: Issues | undefined) =>
          updateIssueOrderLocally(oldIssues!, { s, d })
      );
      return {
        previouseIssues,
      };
    },
    // onError:(error,data,context)=>{
    //     queryClient.setQueryData(["issues",boardId],context?.previouseIssues);
    // },
    onSettled: () => queryClient.invalidateQueries(["issues", boardId]),
  });
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
    },
  });
};
