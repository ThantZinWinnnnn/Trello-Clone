"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type RealtimePayload = {
  actorId?: string | null;
};

type RealtimeEvent = {
  id: string;
  type: string;
  boardId: string;
  timestamp: string;
  payload?: RealtimePayload;
};

export const useBoardRealtime = (boardId: string) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [connected, setConnected] = useState(false);
  const [lastExternalUpdateAt, setLastExternalUpdateAt] = useState<string | null>(
    null
  );

  const currentUserId = session?.user?.id ?? null;

  useEffect(() => {
    if (!boardId) {
      return;
    }

    const source = new EventSource(`/api/realtime/boards/${boardId}`);

    const onReady = () => {
      setConnected(true);
    };

    const onError = () => {
      setConnected(false);
    };

    const onMessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data) as RealtimeEvent;
        const actorId = parsed?.payload?.actorId ?? null;

        if (actorId && currentUserId && actorId === currentUserId) {
          return;
        }

        setLastExternalUpdateAt(parsed.timestamp ?? new Date().toISOString());

        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["issues", boardId] }),
          queryClient.invalidateQueries({ queryKey: ["lists", boardId] }),
          queryClient.invalidateQueries({ queryKey: ["members", boardId] }),
          queryClient.invalidateQueries({ queryKey: ["attachments", boardId] }),
          queryClient.invalidateQueries({ queryKey: ["audit"] }),
        ]);
      } catch (error) {
        console.error("[realtime] failed to parse event", error);
      }
    };

    source.addEventListener("ready", onReady);
    source.addEventListener("message", onMessage);
    source.addEventListener("error", onError);

    return () => {
      source.removeEventListener("ready", onReady);
      source.removeEventListener("message", onMessage);
      source.removeEventListener("error", onError);
      source.close();
      setConnected(false);
    };
  }, [boardId, currentUserId, queryClient]);

  const statusText = useMemo(() => {
    if (!connected) {
      return "Realtime disconnected";
    }

    if (lastExternalUpdateAt) {
      return `Updated elsewhere at ${new Date(lastExternalUpdateAt).toLocaleTimeString()}`;
    }

    return "Realtime connected";
  }, [connected, lastExternalUpdateAt]);

  return {
    connected,
    lastExternalUpdateAt,
    statusText,
  };
};
