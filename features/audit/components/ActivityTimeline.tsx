"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuditTimeline } from "@/features/audit/hooks/audit.hooks";

type Props = {
  boardId: string;
  entityId?: string;
  entityType?: "ISSUE" | "LIST" | "COMMENT";
  title?: string;
};

const actionOptions = [
  "",
  "CREATE",
  "UPDATE",
  "DELETE",
  "MOVE",
  "ASSIGN",
  "UNASSIGN",
  "ROLE_CHANGED",
  "UPLOAD",
];

const ActivityTimeline = ({
  boardId,
  entityId,
  entityType,
  title = "Activity Timeline",
}: Props) => {
  const [actorId, setActorId] = useState("");
  const [actionType, setActionType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filters = useMemo(
    () => ({
      boardId,
      entityId,
      entityType,
      actorId: actorId.trim() || undefined,
      actionType: actionType || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      limit: 20,
    }),
    [boardId, entityId, entityType, actorId, actionType, startDate, endDate]
  );

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useAuditTimeline(filters);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <section className="rounded-md border border-slate-300 p-3 dark:border-slate-600">
      <header className="mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
      </header>

      <section className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Filter by actor id"
          value={actorId}
          onChange={(e) => setActorId(e.target.value)}
          className="text-xs"
        />
        <select
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-xs"
        >
          {actionOptions.map((option) => (
            <option key={option || "all"} value={option}>
              {option || "All Actions"}
            </option>
          ))}
        </select>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="text-xs"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="text-xs"
        />
      </section>

      {isLoading ? (
        <p className="text-xs text-muted-foreground">Loading timeline...</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No activity found.</p>
      ) : (
        <section className="flex max-h-[320px] flex-col gap-2 overflow-y-auto pr-1">
          {items.map((event) => (
            <article
              key={event.id}
              className="rounded-md border border-slate-200 p-2 text-xs dark:border-slate-600"
            >
              <p className="font-medium">
                {event.actionType} {event.entityType.toLowerCase()}
              </p>
              <p className="text-muted-foreground">
                by {event.actor?.name ?? event.actor?.email ?? "System"} at{" "}
                {new Date(event.createdAt).toLocaleString()}
              </p>
              <p className="text-muted-foreground">entityId: {event.entityId}</p>
            </article>
          ))}
        </section>
      )}

      <footer className="mt-3 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
        {isFetching && !isFetchingNextPage ? (
          <span className="text-xs text-muted-foreground">Refreshing...</span>
        ) : null}
      </footer>
    </section>
  );
};

export default ActivityTimeline;
