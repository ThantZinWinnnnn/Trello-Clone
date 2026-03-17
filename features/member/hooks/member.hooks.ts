import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { deleteBoardLocally } from "@/shared/lib/react-query-optimistic";

export type AddMemberMutationInput = AddMember & {
  user: UserProps;
};

export const useGetMembers = (boardId: string) => {
  return useQuery<MemberProps[]>({
    queryKey: ["members", boardId],
    queryFn: async () => {
      const response = await axios.get(`/api/members?boardId=${boardId}`);
      return response.data;
    },
  });
};

export const useAddMember = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, userId, role }: AddMemberMutationInput) => {
      const response = await axios.post(`/api/members`, { boardId, userId, role });
      return response.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["members", boardId] });
      const previousMembers = queryClient.getQueryData<MemberProps[]>([
        "members",
        boardId,
      ]);
      queryClient.setQueryData(
        ["members", boardId],
        (oldMemberes: MemberProps[] | undefined) =>
          addMemberLocally(oldMemberes ?? [], data.user, data.role ?? "MEMBER")
      );
      return {
        previousMembers,
      };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["members", boardId], context?.previousMembers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members", boardId] });
    },
  });
};

const addMemberLocally = (
  members: MemberProps[],
  user: UserProps,
  role: Exclude<BoardRole, "OWNER">
) => {
  const newMember: MemberProps = {
    User: user,
    id: `temp-${user?.id ?? Date.now()}`,
    createdAt: new Date().toISOString(),
    isAdmin: role === "ADMIN",
    role,
  };
  return [...members, newMember];
};

export const useRemoveMember = (boardId: string, userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RemoveMember) => {
      const response = await axios.delete("/api/members", { data });
      return response.data;
    },
    onMutate: async (data) => {
      const { boardId, userId, memberId } = data;
      await queryClient.cancelQueries(["members", boardId]);
      const previousMembers = await queryClient.getQueryData([
        "members",
        boardId,
      ]);
      const previousUserBoards = await queryClient.getQueryData(["boards", userId]);
      queryClient.setQueryData(['boards', userId], (oldUserBoards: GetUserBoardsProps | undefined) =>
        oldUserBoards ? deleteBoardLocally(oldUserBoards, boardId, "leave") : oldUserBoards
      );
      queryClient.setQueryData(
        ["members", boardId],
        (oldMembers: MemberProps[] | undefined) =>
          removeMemberLocally(oldMembers ?? [], data?.userId)
      );
      return {
        previousMembers,
        previousUserBoards
      }
    },
    onError: (_, data, context) => {
      queryClient.setQueryData(["boards", userId], context?.previousUserBoards);
      queryClient.setQueryData(["members", boardId], context?.previousMembers);
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries(["members", boardId]),
        queryClient.invalidateQueries(["issues", boardId])
      ])
    }
  });
};

const removeMemberLocally = (members: MemberProps[], userId: string) => {
  return members.filter((member) => member?.User?.id !== userId);
};

type UpdateMemberRoleInput = {
  boardId: string;
  memberId: string;
  role: Exclude<BoardRole, "OWNER">;
};

export const useUpdateMemberRole = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMemberRoleInput) => {
      const response = await axios.patch("/api/members", data);
      return response.data;
    },
    onMutate: async ({ memberId, role }) => {
      await queryClient.cancelQueries({ queryKey: ["members", boardId] });
      const previousMembers = queryClient.getQueryData<MemberProps[]>([
        "members",
        boardId,
      ]);

      queryClient.setQueryData(["members", boardId], (oldMembers: MemberProps[] | undefined) =>
        (oldMembers ?? []).map((member) =>
          member.id === memberId
            ? {
              ...member,
              role,
              isAdmin: role === "ADMIN",
            }
            : member
        )
      );

      return { previousMembers };
    },
    onError: (_error, _data, context) => {
      queryClient.setQueryData(["members", boardId], context?.previousMembers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members", boardId] });
    },
  });
};

// export const useDeleteMember = 
