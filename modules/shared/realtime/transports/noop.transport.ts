import { RealtimeEvent, RealtimeEventListener, RealtimeTransport } from "@/modules/shared/realtime/types";

export class NoopRealtimeTransport implements RealtimeTransport {
  publish(_event: RealtimeEvent) {
    // no-op transport for environments that disable realtime.
  }

  subscribe(_boardId: string, _listener: RealtimeEventListener) {
    return () => {
      // no-op
    };
  }
}
