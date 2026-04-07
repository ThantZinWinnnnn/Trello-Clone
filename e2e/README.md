# E2E Quick Notes

For full E2E conventions, read `tests/AGENTS.md`.

## Run
- `npm run test:e2e`
- `npm run test:e2e:headed`

## Auth
- This project’s authenticated E2E flow uses `E2E_AUTH_COOKIE`.
- Without it, authenticated specs (for example `e2e/board-flow.spec.ts`) are skipped.

## Scope
- Keep Playwright specs in this folder as `*.spec.ts`.
