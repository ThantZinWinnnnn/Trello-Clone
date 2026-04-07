import { expect, test } from "@playwright/test";
import { addAuthCookiesToContext, resolveBaseURL } from "./support/auth";

const authCookie = process.env.E2E_AUTH_COOKIE;

test.describe("board collaboration flow", () => {
  test.skip(!authCookie, "Set E2E_AUTH_COOKIE to run authenticated e2e flow");

  test("create board -> add issue -> move issue -> audit/realtime/search", async ({ request, page }) => {
    const cookieHeader = authCookie as string;
    const baseURL = resolveBaseURL(test.info().project.use.baseURL);
    await addAuthCookiesToContext(page.context(), cookieHeader, baseURL);

    await page.goto("/boards");

    const boardResponse = await request.post("/api/board", {
      headers: { cookie: cookieHeader },
      data: { boardName: `E2E-${Date.now()}` },
    });
    expect(boardResponse.ok()).toBeTruthy();
    const board = (await boardResponse.json()) as { id: string; name: string };

    const inProgressResponse = await request.post("/api/lists", {
      headers: { cookie: cookieHeader },
      data: { boardId: board.id, listName: "In Progress" },
    });
    const doneResponse = await request.post("/api/lists", {
      headers: { cookie: cookieHeader },
      data: { boardId: board.id, listName: "Done" },
    });
    expect(inProgressResponse.ok()).toBeTruthy();
    expect(doneResponse.ok()).toBeTruthy();

    const inProgress = (await inProgressResponse.json()) as { id: string };
    const done = (await doneResponse.json()) as { id: string };

    const issueResponse = await request.post("/api/issues", {
      headers: { cookie: cookieHeader },
      data: {
        boardId: board.id,
        listId: inProgress.id,
        image: "",
        type: "Task",
        summary: "E2E searchable card",
        desc: "E2E description",
        priority: "Medium",
        reporterId: "ignored-by-api",
        assignees: [],
      },
    });
    expect(issueResponse.ok()).toBeTruthy();
    const issue = (await issueResponse.json()) as { id: string };

    const realtimeEventPromise = page.evaluate((id: string) => {
      return new Promise<string>((resolve, reject) => {
        const source = new EventSource(`/api/realtime/boards/${id}`);
        const timer = setTimeout(() => {
          source.close();
          reject(new Error("Timed out waiting for realtime message"));
        }, 10_000);

        source.addEventListener("message", (event) => {
          const parsed = JSON.parse((event as MessageEvent).data) as { type?: string };
          if (parsed.type === "audit.event.created") {
            clearTimeout(timer);
            source.close();
            resolve(parsed.type);
          }
        });
      });
    }, board.id);

    await request.put(`/api/issues/${issue.id}`, {
      headers: { cookie: cookieHeader },
      data: {
        type: "listId",
        value: done.id,
        boardId: board.id,
      },
    });

    await expect(realtimeEventPromise).resolves.toBe("audit.event.created");

    const auditResponse = await request.get(`/api/events?boardId=${board.id}&entityId=${issue.id}`, {
      headers: { cookie: cookieHeader },
    });
    expect(auditResponse.ok()).toBeTruthy();
    const auditPayload = (await auditResponse.json()) as { items: Array<{ actionType: string }> };
    expect(auditPayload.items.some((item) => item.actionType === "MOVE")).toBeTruthy();

    const searchResponse = await request.get(
      `/api/search?boardId=${board.id}&q=${encodeURIComponent("searchable card")}`,
      {
        headers: { cookie: cookieHeader },
      }
    );
    expect(searchResponse.ok()).toBeTruthy();
    const searchPayload = (await searchResponse.json()) as { items: Array<{ id: string }> };
    expect(searchPayload.items.some((item) => item.id === issue.id)).toBeTruthy();
  });
});
