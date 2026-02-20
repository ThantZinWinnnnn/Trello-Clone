# Architecture

## Stack
- Next.js 13 App Router + TypeScript
- Prisma + PostgreSQL (Supabase-ready connection strings)
- NextAuth for authentication
- React Query for server-state and optimistic updates
- Zustand for lightweight UI state
- Tailwind + Radix UI components

## Application Shape
- `app/*`: route entry points (UI pages + API route handlers)
- `modules/*`: backend business logic by domain
- `features/*`: frontend domain features (hooks/components)
- `modules/shared/*` and `shared/*`: cross-cutting helpers (RBAC, realtime, API utilities)

## Backend Pattern
- Hybrid App Router API structure:
  - Route files remain in `app/api/*` for framework compatibility.
  - Business logic is moved into `modules/*/route.handlers.ts` and service files.
- Access control:
  - `requireBoardPermission(boardId, userId, permission)` is the policy gate.
  - Backend remains source of truth; frontend UI hints are secondary.
- Eventing:
  - Mutations call `logAuditEvent(...)`.
  - Audit write persists event and broadcasts via realtime transport abstraction.

## Realtime Pattern
- Abstraction in `modules/shared/realtime/*` with pluggable transports.
- Current default: in-memory SSE transport.
- Endpoint: `GET /api/realtime/boards/[boardId]` (auth + board access required).
- Client subscription: `useBoardRealtime(boardId)` invalidates impacted query keys.

## Attachment Upload Pattern
- Signed upload flow (local dev provider):
  1. Request upload token (`POST /api/attachments`, action `createUpload`)
  2. Upload bytes via signed URL (`PUT /api/attachments/upload?token=...`)
  3. Finalize metadata (`POST /api/attachments`, action `finalizeUpload`)
- Download served through authenticated endpoint (`GET /api/attachments/[attachmentId]`).
- Scanner hook exists (`modules/attachment/scanner.ts`) and currently stubs `CLEAN/INFECTED/FAILED` by env.

## Security Controls
- Auth required for all board-scoped APIs.
- RBAC checks enforced server-side per permission matrix.
- Input constraints and sanitization in shared API utilities and handlers.
- Signed upload token validation and scope checks on attachments.
- No direct public bucket/file URLs are exposed.

## Known Limitations
- SSE transport is in-memory; multi-instance deployment should use external transport (Pusher/WebSocket adapter).
- Virus scanner is a hook/stub; integrate real scanner service for production.
