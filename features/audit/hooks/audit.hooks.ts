import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export type AuditFilters = {
  boardId: string;
  actorId?: string;
  entityId?: string;
  entityType?: string;
  actionType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
};

type AuditResponse = {
  items: Array<{
    id: string;
    actionType: string;
    entityType: string;
    entityId: string;
    boardId: string;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    actor: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    } | null;
  }>;
  nextCursor: string | null;
  hasMore: boolean;
};

const buildSearchParams = (filters: AuditFilters, cursor?: string | null) => {
  const params = new URLSearchParams();
  params.set("boardId", filters.boardId);
  params.set("limit", String(filters.limit ?? 20));

  if (filters.actorId) params.set("actorId", filters.actorId);
  if (filters.entityId) params.set("entityId", filters.entityId);
  if (filters.entityType) params.set("entityType", filters.entityType);
  if (filters.actionType) params.set("actionType", filters.actionType);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  if (cursor) params.set("cursor", cursor);

  return params.toString();
};

export const useAuditTimeline = (filters: AuditFilters) => {
  const enabled = Boolean(filters.boardId);

  return useInfiniteQuery<AuditResponse>({
    queryKey: ["audit", filters],
    enabled,
    queryFn: async ({ pageParam }) => {
      const query = buildSearchParams(filters, pageParam as string | null);
      const response = await axios.get(`/api/events?${query}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? lastPage.nextCursor : undefined;
    },
  });
};
