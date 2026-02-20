# BoardForge

BoardForge is a Trello-style project management app built with Next.js App Router, Prisma, and React Query.

## Tech Stack
- Next.js 13 (App Router) + TypeScript
- Prisma ORM + PostgreSQL
- NextAuth (Google provider)
- React Query + Zustand
- Tailwind CSS + Radix UI

## Folder Structure (Current)
```text
app/
  api/...
  boards/...                # board routes
features/
  attachment/
  audit/
  board/
  comment/
  issue/
  member/
  realtime/
modules/
  attachment/
  audit/
  board/
  comment/
  issue/
  list/
  member/
  shared/                   # rbac, api utils, realtime, rate limit
shared/
  lib/
  state/
  utils/
prisma/
  schema.prisma
  seed.ts
docs/
  ARCHITECTURE.md
  FEATURE_REPORT.md
```

## Environment Variables
Create `.env` with at least:

```bash
DATABASE_URL="postgresql://..."          # pooled connection
DIRECT_URL="postgresql://..."            # direct DB for migrations
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# SEO
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Realtime: sse | ws | pusher | none
REALTIME_TRANSPORT="sse"

# Attachments
ATTACHMENT_SIGNING_SECRET="replace-me"
LOCAL_UPLOAD_DIR=".uploads"
ATTACHMENT_SCAN_MODE="clean"             # clean | infected | failed

# Optional demo seed
DEMO_BOARD_ID="00000000-0000-0000-0000-000000000001"
DEMO_BOARD_NAME="BoardForge Demo Board"
```

## Local Development

1. Install dependencies
```bash
npm install
```

2. Generate Prisma client + run migrations
```bash
npx prisma generate
npx prisma migrate dev
```

3. (Optional) seed demo roles/board
```bash
npm run seed
```

4. Run app
```bash
npm run dev
```

## Build & Quality
```bash
npm run typecheck
npm run lint
npm run build
```

## Tests
```bash
npm run test:unit
npm run test:e2e
```

### E2E Auth Note
`e2e/board-flow.spec.ts` expects `E2E_AUTH_COOKIE` for authenticated API/UI flow.

## Realtime (Dev)
- SSE endpoint: `/api/realtime/boards/[boardId]`
- Client hook: `useBoardRealtime(boardId)`
- Events are emitted from audit writes.

## Signed Uploads (Dev)
1. Request signed upload token via `POST /api/attachments` (`action=createUpload`)
2. Upload bytes to `PUT /api/attachments/upload?token=...`
3. Finalize metadata via `POST /api/attachments` (`action=finalizeUpload`)
4. Download via authenticated route `GET /api/attachments/[attachmentId]`

## Security Highlights
- Server-side RBAC permission matrix (`OWNER/ADMIN/MEMBER/VIEWER`)
- Board-scoped permission checks on API routes
- Sanitized text inputs for comments/user updates
- Signed token validation and board-scope checks for uploads
- Protected attachment downloads and scan-status gating

## Known Limitations
- Realtime SSE transport is in-memory (single-instance friendly only)
- Attachment virus scanning is stubbed (hook ready for real scanner)
- In restricted environments, test deps may require manual installation

## Additional Docs
- Architecture: `docs/ARCHITECTURE.md`
- Full implementation report: `docs/FEATURE_REPORT.md`
