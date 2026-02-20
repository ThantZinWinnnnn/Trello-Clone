export type RealtimeEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  boardId: string;
  type: string;
  timestamp: string;
  payload: TPayload;
};

export type RealtimeEventListener = (event: RealtimeEvent) => void;

export interface RealtimeTransport {
  publish(event: RealtimeEvent): void;
  subscribe(boardId: string, listener: RealtimeEventListener): () => void;
}
