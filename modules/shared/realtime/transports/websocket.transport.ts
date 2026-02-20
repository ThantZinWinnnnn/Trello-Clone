import { NoopRealtimeTransport } from "@/modules/shared/realtime/transports/noop.transport";

// MVP transport placeholder to keep the abstraction swappable without locking app code.
export class WebSocketRealtimeTransport extends NoopRealtimeTransport {}
