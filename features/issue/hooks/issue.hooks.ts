import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import {
  deleteIssueLocally,
  updateAssigneeLocally,
  updateIssueOrderLocally,
  updateListStatusLocally,
} from "@/shared/lib/react-query-optimistic";

export const useGetIssues = (boardId: string, userId?: string) => {
  return useQuery<Issues>({
    queryKey: ["issues", boardId],
    queryFn: async () => {
      const query = userId
        ? `/api/issues?boardId=${encodeURIComponent(boardId)}&userId=${encodeURIComponent(userId)}`
        : `/api/issues?boardId=${encodeURIComponent(boardId)}`;
      const response = await axios.get(query);
      return response.data;
    },
    enabled: Boolean(boardId),
  });
};

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
  const issuesQueryKey = ["issues", boardId] as const;

  return useMutation({
    mutationFn: async (data: ReorderIssue) => {
      const response = await axios.put("/api/issues", data);
      return response.data;
    },
    onMutate: async (data) => {
      const { s, d } = data;
      await queryClient.cancelQueries({ queryKey: issuesQueryKey });
      const previousIssues = queryClient.getQueryData<Issues>(issuesQueryKey);

      queryClient.setQueryData(
        issuesQueryKey,
        (oldIssues: Issues | undefined) =>
          updateIssueOrderLocally(oldIssues, { s, d })
      );

      return {
        previousIssues,
      };
    },
    onError: (_error, _data, context) => {
      if (context?.previousIssues) {
        queryClient.setQueryData(issuesQueryKey, context.previousIssues);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: issuesQueryKey }),
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
