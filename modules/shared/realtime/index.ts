import { randomUUID } from "crypto";
import { NoopRealtimeTransport } from "@/modules/shared/realtime/transports/noop.transport";
import { PusherRealtimeTransport } from "@/modules/shared/realtime/transports/pusher.transport";
import { InMemorySseTransport } from "@/modules/shared/realtime/transports/sse.transport";
import { WebSocketRealtimeTransport } from "@/modules/shared/realtime/transports/websocket.transport";
import { RealtimeEvent, RealtimeEventListener, RealtimeTransport } from "@/modules/shared/realtime/types";

const createTransport = (): RealtimeTransport => {
  const mode = (process.env.REALTIME_TRANSPORT ?? "sse").toLowerCase();

  switch (mode) {
    case "pusher":
      return new PusherRealtimeTransport();
    case "ws":
    case "websocket":
      return new WebSocketRealtimeTransport();
    case "none":
      return new NoopRealtimeTransport();
    case "sse":
    default:
      return new InMemorySseTransport();
  }
};

const transport = createTransport();

export const publishBoardEvent = (
  boardId: string,
  type: string,
  payload: Record<string, unknown>
) => {
  const event: RealtimeEvent = {
    id: randomUUID(),
    boardId,
    type,
    payload,
    timestamp: new Date().toISOString(),
  };

  transport.publish(event);
  return event;
};

export const subscribeBoardEvents = (
  boardId: string,
  listener: RealtimeEventListener
) => {
  return transport.subscribe(boardId, listener);
};

export type { RealtimeEvent } from "@/modules/shared/realtime/types";
