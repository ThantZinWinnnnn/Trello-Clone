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
.
├── app/
│   ├── api/...
│   └── boards/...                # board routes
├── features/                     # UI and hooks by domain
│   ├── audit/
│   ├── board/
│   ├── comment/
│   ├── issue/
│   ├── member/
│   └── realtime/
├── modules/                      # Server and domain logic
│   ├── audit/
│   ├── board/
│   ├── comment/
│   ├── issue/
│   ├── list/
│   ├── member/
│   └── shared/                   # rbac, api utils, realtime, rate limit
├── shared/                       # Cross-cutting client utilities
│   ├── lib/
│   ├── state/
│   └── utils/
└── prisma/
    ├── schema.prisma
    └── seed.ts
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

## Security Highlights
- Server-side RBAC permission matrix (`OWNER/ADMIN/MEMBER/VIEWER`)
- Board-scoped permission checks on API routes
- Sanitized text inputs for comments/user updates

## Known Limitations
- Realtime SSE transport is in-memory (single-instance friendly only)
- In restricted environments, test deps may require manual installation

