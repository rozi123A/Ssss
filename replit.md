# NEXUS COMM

تطبيق دردشة عربي فوري بتصميم سيبربانك مستقبلي، مبني بـ React + Express + PostgreSQL.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session signing

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (port 8080, path `/api`)
- Frontend: React 19 + Vite + wouter + TanStack Query + Tailwind CSS v4 (port 20021, path `/`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — DB schema (users, rooms, roomMembers, messages, notifications, calls)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/nexus-comm/src/` — React frontend (RTL Arabic, cyberpunk theme)
- `artifacts/nexus-comm/src/pages/` — ChatPage, RoomsPage, NotificationsPage, CallsPage, Home

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → React Query hooks + Zod schemas
- Guest mode: frontend falls back to localStorage "nexus_guest_user" when `/api/auth/me` returns 401
- Session stored as base64 JSON in a signed cookie `nexus_session`
- Messages route uses `mergeParams: true` and is mounted at `/api/rooms/:id/messages`
- All DB tables use `updatedAt` auto-managed via Drizzle `$onUpdate`

## Product

- **الدردشة**: غرف عامة وخاصة مع رسائل نصية ومرفقات
- **المستخدمون**: حالة الاتصال (online/away/offline) وأدوار (admin/user)
- **الإشعارات**: نظام إشعارات متكامل
- **المكالمات**: واجهة صوتية/مرئية
- **الإحصائيات**: لوحة تحكم بإحصائيات الشبكة

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm run typecheck:libs` before `pnpm --filter @workspace/api-server run typecheck` if schema changes were made
- Seeded users: nexus_admin (id=1), amira_tech (id=2), rayan_dev (id=3), sara_design (id=4), khalid_cyber (id=5)
- `cookie-parser` must be installed in api-server for session cookie parsing

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
