import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetMembers = (boardId: string) => {
  return useQuery<MemberProps[]>({
    queryKey: ["members", boardId],
    queryFn: async () => {
      const response = await axios.get(`/api/members?boardId=${boardId}`);
      return response.data;
    },
  });
};

export const useAddMember = (boardId: string, usr: UserProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddMember) => {
      const response = await axios.post(`/api/members`, data);
      return response.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries(["members", boardId]);
      const previousMembers = await queryClient.getQueryData([
        "members",
        boardId,
      ]);
      queryClient.setQueryData(
        ["members", boardId],
        (oldMemberes: MemberProps[] | undefined) =>
          addMemberLocally(oldMemberes!, usr)
      );
      return {
        previousMembers,
      };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["members", boardId], context?.previousMembers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["members", boardId]);
    },
  });
};

const addMemberLocally = (members: MemberProps[], user: UserProps) => {
  const newMember = { User: user,id:user?.id,createdAt:user?.id, isAdmin:false };
  return [...members, newMember];
};

export const useRemoveMember = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RemoveMember) => {
      const response = await axios.delete("/api/members", { data });
      return response.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries(["members", boardId]);
      const previousMembers = await queryClient.getQueryData([
        "members",
        boardId,
      ]);
      queryClient.setQueryData(
        ["members", boardId],
        (oldMembers: MemberProps[] | undefined) =>
          removeMemberLocally(oldMembers!, data?.userId)
      );
      return {
        previousMembers
      }
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["members", boardId], context?.previousMembers);
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries(["members", boardId]),
        queryClient.invalidateQueries(["issues",boardId])
      ])
    }
  });
};

const removeMemberLocally = (members: MemberProps[], userId: string) => {
  return members.filter((member) => member?.User?.id !== userId);
};
