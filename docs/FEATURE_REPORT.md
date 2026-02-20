# Feature Report

This report documents the MVP-but-production-shaped implementation for features 0–8.

## 0) Foundation Patterns

### Summary
Established reusable cross-cutting patterns for audit events, RBAC authorization, realtime broadcasting abstraction, and testing scaffolding.

### Architecture
- **Audit event model**: centralized `logAuditEvent(...)` helper writes to DB and broadcasts realtime events.
- **RBAC**: permission matrix (`OWNER/ADMIN/MEMBER/VIEWER`) enforced by `requireBoardPermission`.
- **Realtime abstraction**: transport factory supports `sse`, `ws`, `pusher`, `none` modes.
- **Testing scaffolding**: Vitest + Playwright configs and baseline tests.

### Key Decisions
- Kept App Router API entrypoints stable while moving logic into modules.
- Made auditing best-effort (non-blocking for business writes).
- Started with in-memory SSE for local simplicity and pluggable production transports.

### File Map
- `modules/shared/rbac.ts`
- `modules/shared/api.utils.ts`
- `modules/shared/audit-events.ts`
- `modules/shared/realtime/index.ts`
- `modules/shared/realtime/types.ts`
- `modules/shared/realtime/transports/*`
- `app/api/realtime/boards/[boardId]/route.ts`
- `vitest.config.ts`
- `playwright.config.ts`
- `tests/unit/*`
- `e2e/board-flow.spec.ts`

### Maintenance
- Add new permissions in `modules/shared/rbac.ts` and consume via `requireBoardPermission`.
- Add new realtime transports under `modules/shared/realtime/transports` and factory switch.

### Testing
- Unit: `npm run test:unit`
- E2E: `npm run test:e2e`

### Observability
- Console diagnostics in audit/realtime/search/attachments failure paths.

---

## 1) Activity Timeline + Audit Log

### Summary
Tracks board mutation events (create/update/delete/move/assign) for lists, issues, comments, members, attachments.

### User Value
Users can inspect who changed what and when at board level or card level.

### Architecture
- DB model: `AuditEvent` with actor/action/entity/board/timestamp/metadata.
- API: `GET /api/events` with filters + cursor pagination.
- UI: reusable `ActivityTimeline` component for board settings and card detail modal.

### Key Decisions
- Metadata stored as JSON for extensibility instead of rigid columns.
- Cursor pagination uses event id for stable traversal.

### File Map
- `prisma/schema.prisma` (`AuditEvent`, enums, relations/indexes)
- `modules/audit/route.handlers.ts`
- `app/api/events/route.ts`
- `features/audit/hooks/audit.hooks.ts`
- `features/audit/components/ActivityTimeline.tsx`
- `app/boards/[boardName]/[boardId]/settings/page.tsx`
- `features/board/components/IssueDetailComponent.tsx`
- mutation handlers in:
  - `modules/list/route.handlers.ts`
  - `modules/issue/route.handlers.ts`
  - `modules/issue/by-id.route.handlers.ts`
  - `modules/comment/route.handlers.ts`
  - `modules/member/route.handlers.ts`

### Maintenance
- For any new mutation route, call `logAuditEvent(...)` after successful write.
- Prefer compact, structured metadata fields (`before/after`, `fromListId/toListId`).

### Testing
- Unit payload tests: `tests/unit/audit-events.spec.ts`

### Observability
- `[audit] failed to persist event` and `[audit] fetch failed` logs.

---

## 2) Realtime Board Collaboration

### Summary
Board changes are broadcast and consumed in near-realtime using SSE transport abstraction.

### User Value
Clients get fresh data when other users update the board.

### Architecture
- Server broadcasts from audit helper through `publishBoardEvent`.
- SSE endpoint streams board-scoped events.
- Client hook `useBoardRealtime` invalidates affected queries.
- Basic conflict handling on issue move via `expectedUpdatedAt` -> `409` response.

### Key Decisions
- Stream authorization added (`board:read` required).
- Chose query invalidation strategy over fragile granular cache patching for reliability.

### File Map
- `modules/shared/realtime/*`
- `app/api/realtime/boards/[boardId]/route.ts`
- `features/realtime/hooks/useBoardRealtime.ts`
- `app/boards/[boardName]/[boardId]/page.tsx`
- `modules/issue/route.handlers.ts` (conflict check)

### Maintenance
- Add new realtime event types where domain changes happen (currently emitted via audit helper).
- For high scale, switch `REALTIME_TRANSPORT` to external transport adapter.

### Testing
- E2E flow includes realtime assertion baseline (`e2e/board-flow.spec.ts`).

### Observability
- Realtime parse/listener errors logged in client and server transport.

---

## 3) Full-Text Search + Filters

### Summary
Added board-scoped issue search with filters and URL-synced frontend query state.

### User Value
Users can quickly find cards by text and metadata.

### Architecture
- API: `GET /api/search` with filters (`q`, `assignee`, `status`, `date range`, `label`, `board`).
- PostgreSQL path uses raw `to_tsvector`/`plainto_tsquery`; fallback uses Prisma `contains`.
- Frontend route `/search` with debounced input and query-string synchronization.

### Key Decisions
- Runtime fallback keeps functionality if full-text query fails.
- Added SQL index helper script for production optimization.

### File Map
- `modules/search/query-builder.ts`
- `modules/search/route.handlers.ts`
- `app/api/search/route.ts`
- `features/search/hooks/search.hooks.ts`
- `features/search/components/SearchPageClient.tsx`
- `app/search/page.tsx`
- `prisma/sql/search_indexes.sql`

### Maintenance
- Add new filters in `buildIssueSearchWhere` and extend search UI/query params.
- Keep route-level board permission checks mandatory.

### Testing
- Unit: `tests/unit/search-query-builder.spec.ts`

### Observability
- `[search] full-text path failed, falling back to contains` warnings.

---

## 4) Role-Based Permissions (Owner/Admin/Member/Viewer)

### Summary
Implemented backend-enforced permission matrix and role-aware frontend controls.

### User Value
Safer collaboration and clearer responsibilities by role.

### Architecture
- `BoardRole` enum persisted on members.
- Permission matrix in shared RBAC module.
- API routes gate with `requireBoardPermission`.
- Member management supports add/remove/update-role.
- UI hides/disables actions for low-permission roles.

### Key Decisions
- Backend is source of truth; frontend only mirrors expected access.
- Owner-only board deletion enforced via `board:delete` permission.

### File Map
- `prisma/schema.prisma` (`BoardRole`, `Member.role`)
- `modules/shared/rbac.ts`
- `modules/shared/api.utils.ts`
- `modules/member/route.handlers.ts`
- `app/api/members/route.ts`
- `features/member/hooks/member.hooks.ts`
- `features/member/components/{AddMemberModal.tsx,Members.tsx,MemberInfoBtn.tsx}`
- `app/boards/[boardName]/[boardId]/page.tsx`
- `features/issue/dnd/Column.tsx`
- `modules/board/route.handlers.ts`
- `prisma/seed.ts`

### Maintenance
- Keep permission changes centralized in RBAC matrix.
- Use seed script to produce deterministic demo roles.

### Testing
- Unit: `tests/unit/rbac.spec.ts`

### Observability
- Permission denials return explicit `403` messages.

---

## 5) Test Suite Baseline (Vitest + Playwright)

### Summary
Added baseline test scaffolding and initial unit/e2e tests.

### Architecture
- Vitest for unit tests.
- Playwright serial e2e flow for core board behavior.
- CI-ready scripts in `package.json`.

### Key Decisions
- E2E test is auth-cookie-driven for portability in local/dev environments.
- Unit tests target high-value deterministic services (audit payload, RBAC, search builder).

### File Map
- `package.json` scripts + dev deps
- `vitest.config.ts`
- `playwright.config.ts`
- `tests/unit/audit-events.spec.ts`
- `tests/unit/rbac.spec.ts`
- `tests/unit/search-query-builder.spec.ts`
- `e2e/board-flow.spec.ts`

### Maintenance
- Expand unit tests around handlers/services before UI-level e2e expansion.
- Keep e2e deterministic with seeded data and stable auth bootstrap.

### Testing
- `npm run test:unit`
- `npm run test:e2e`

### Observability
- Playwright traces are retained on failure.

---

## 6) Attachment Pipeline (Signed Upload + Scanner Hook)

### Summary
Implemented secure signed upload flow, metadata persistence, scan status hook, and protected download endpoint.

### User Value
Users can attach files to cards with controlled access and architecture-ready scanning.

### Architecture
- Upload flow:
  1. `POST /api/attachments` (`createUpload`) -> signed URL/token + storageKey
  2. `PUT /api/attachments/upload?token=...` -> upload bytes
  3. `POST /api/attachments` (`finalizeUpload`) -> DB metadata + scan status + audit event
- Download: `GET /api/attachments/[attachmentId]` requires board read permission and CLEAN status.
- Local dev storage provider writes to `.uploads` (configurable).

### Key Decisions
- Tokenized scoped upload avoids direct bucket exposure.
- Scanner is an interface/stub to enable later ClamAV/SaaS scanner integration.

### File Map
- `prisma/schema.prisma` (`Attachment`, `ScanStatus`, relations/indexes)
- `modules/attachment/{constants.ts,types.ts,storage.ts,scanner.ts,service.ts,route.handlers.ts,upload.route.handlers.ts,by-id.route.handlers.ts}`
- `app/api/attachments/route.ts`
- `app/api/attachments/upload/route.ts`
- `app/api/attachments/[attachmentId]/route.ts`
- `features/attachment/hooks/attachment.hooks.ts`
- `features/attachment/components/IssueAttachments.tsx`
- `features/board/components/IssueDetailComponent.tsx`

### Maintenance
- Add cloud providers in `modules/attachment/storage.ts` behind same contract.
- Replace scanner stub in `modules/attachment/scanner.ts` with production scanner client.
- Keep content type/size policy centralized in constants.

### Testing
- Covered indirectly in e2e flow pattern; add dedicated integration tests next.

### Observability
- `[attachment] upload failed` and download error logs.

---

## Operational Notes

### Weak Points (Current)
1. Realtime SSE is in-memory; multi-instance deployments require external transport.
2. Playwright/Vitest dependencies may need installation in restricted environments.
3. Attachment scanner is stubbed (architecture-ready but not production scanner yet).

### Suggested Showcase Features (Prioritized)
1. **Background job worker + outbox for realtime/audit fanout**
   - Value: reliable async events
   - Effort: M
   - Demonstrates: distributed consistency patterns
2. **Per-board automation rules (e.g., auto-move on label)
   - Value: productivity
   - Effort: M
   - Demonstrates: domain workflow engine design
3. **Granular permission editor (custom roles)
   - Value: enterprise control
   - Effort: M/L
   - Demonstrates: policy modeling + migration strategy
4. **Attachment antivirus integration (ClamAV or SaaS scanner)
   - Value: production security
   - Effort: M
   - Demonstrates: secure file pipeline
5. **Activity feed subscriptions/preferences
   - Value: reduced notification noise
   - Effort: S/M
   - Demonstrates: user-centric event filtering
6. **OpenTelemetry traces + structured logs
   - Value: operability
   - Effort: M
   - Demonstrates: production observability
7. **Database migration automation checks in CI
   - Value: safer schema evolution
   - Effort: S
   - Demonstrates: deployment discipline
