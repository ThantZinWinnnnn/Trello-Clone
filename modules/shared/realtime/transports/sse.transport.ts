import { RealtimeEvent, RealtimeEventListener, RealtimeTransport } from "@/modules/shared/realtime/types";

type ListenerSet = Set<RealtimeEventListener>;

export class InMemorySseTransport implements RealtimeTransport {
  private listenersByBoard = new Map<string, ListenerSet>();

  publish(event: RealtimeEvent) {
    const listeners = this.listenersByBoard.get(event.boardId);
    if (!listeners) {
      return;
    }

    listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        // Keep fan-out resilient: one bad subscriber must not break others.
        console.error("[realtime] listener error", error);
      }
    });
  }

  subscribe(boardId: string, listener: RealtimeEventListener) {
    const listeners = this.listenersByBoard.get(boardId) ?? new Set();
    listeners.add(listener);
    this.listenersByBoard.set(boardId, listeners);

    return () => {
      const current = this.listenersByBoard.get(boardId);
      if (!current) {
        return;
      }

      current.delete(listener);
      if (current.size === 0) {
        this.listenersByBoard.delete(boardId);
      }
    };
  }
}
