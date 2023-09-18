
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useChangeListStatus = (
  boardId: string,
  oldListId: string,
  newListId: string,
  issueId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IssueState) => {
      const response = await axios.post(`/api/issues/${issueId}`, data);
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
