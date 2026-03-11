# JUPHD Care — Global Instructions

## Scope

- Stack: Vite + React 18 + Express 5 + Drizzle ORM + PostgreSQL.
- Runtime: Node 22, NPM, dev server port 5000.
- Structure: `client/` (React SPA), `server/` (Express API), `shared/` (schema + types).
- Phase: Early development — build features on solid foundation, don't over-engineer.

## Language convention

- Instruction files, code comments, commit messages: **English**.
- User-facing output (UI text, API error messages): **Portuguese (PT-BR)**.

## Agent behavior

- Candor without flattery. Fix root cause, don't mask symptoms.
- Concise by default; expand only when clarity genuinely improves.
- Maximum autonomy; ask only on real blockers, business ambiguity, or destructive risk.
- Never speculate about unread code. Read the file before making claims.
- Don't invent facts. Don't create files without need. Don't use destructive actions as shortcuts.
- Ask confirmation before destructive, irreversible, or externally visible actions.

## Project structure

| Path | Purpose |
|---|---|
| `client/src/pages/` | Route pages (wouter) |
| `client/src/components/ui/` | shadcn/ui primitives (Radix + Tailwind) |
| `client/src/lib/` | Client utilities (auth, queryClient, utils) |
| `client/src/hooks/` | Custom React hooks |
| `server/routes.ts` | Express API route handlers |
| `server/storage.ts` | Storage interface (`IStorage`) + in-memory implementation |
| `shared/schema.ts` | Drizzle tables + Zod insert schemas + TS types |
| `script/build.ts` | Build pipeline (esbuild server + Vite client) |

## Key conventions

- Single source of truth for entities: `shared/schema.ts`.
- Storage abstraction: `IStorage` interface → `MemStorage` (current), PostgreSQL via Drizzle (next).
- Client auth: `useSyncExternalStore` + `localStorage` in `client/src/lib/auth.ts`.
- Roles: `collaborator`, `rh`. No multi-tenancy.
- API error format: `{ message: string }` with appropriate HTTP status.
- Validation: Zod schemas from `drizzle-zod` at route boundaries.

## Available scripts

```bash
npm run dev         # Start dev server (tsx + Vite HMR), port 5000
npm run build       # Production build (esbuild + Vite)
npm run start       # Run production build
npm run check       # TypeScript type check (tsc --noEmit)
npm run db:push     # Push Drizzle schema to PostgreSQL
```

## Tech debt policy

- Shortcuts tracked with `// DEBT: [reason] [ticket or deadline]`.
- Untracked debt is hidden debt — hidden debt is regression.

## Tool priority

1. Context already in conversation → 2. Local search → 3. File read → 4. Direct edit → 5. Terminal.
- Don't retry a failed tool. Degrade to cheaper alternative.
- Parallelize independent reads. Sequence dependent ones.

## Instruction topology

- **This file**: global invariants (always loaded — keep lean).
- **`.github/instructions/*.instructions.md`**: conditional rules by path or task.
- **`.github/prompts/*.prompt.md`**: reusable on-demand workflows.
- A rule for a single path or task MUST NOT inflate this file.
