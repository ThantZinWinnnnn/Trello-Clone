import { subscribeBoardEvents } from "@/modules/shared/realtime";
import {
  forbidden,
  getAuthenticatedUserId,
  requireBoardPermission,
  unauthorized,
} from "@/modules/shared/api.utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: {
    boardId: string;
  };
};

export async function GET(request: Request, { params }: Params) {
  const { boardId } = params;
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return unauthorized();
  }

  const access = await requireBoardPermission(boardId, userId, "board:read");
  if (!access) {
    return forbidden("You do not have access to this realtime stream");
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (eventName: string, payload: Record<string, unknown>) => {
        controller.enqueue(
          encoder.encode(
            `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`
          )
        );
      };

      send("ready", { boardId, connectedAt: new Date().toISOString() });

      const unsubscribe = subscribeBoardEvents(boardId, (event) => {
        send("message", event as unknown as Record<string, unknown>);
      });

      const heartbeat = setInterval(() => {
        send("ping", { t: Date.now() });
      }, 20_000);

      const cleanup = () => {
        clearInterval(heartbeat);
        unsubscribe();
        controller.close();
      };

      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
