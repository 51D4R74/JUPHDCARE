---
description: "Use when working on authentication, authorization, input validation, or any security-sensitive path."
name: "Security"
applyTo: "server/**,client/src/lib/auth.ts,shared/schema.ts"
---
# Security

## Current auth model

**WARNING**: The current auth has known critical gaps tracked as debt.

- Login: `POST /api/auth/login` compares plaintext password. // DEBT: hash with bcrypt
- Session: client-side only via `localStorage`. No server session or JWT.
- Roles: `collaborator`, `rh`. Checked client-side in `ProtectedRoute`.
- No server-side auth middleware on API routes. // DEBT: add Express middleware

## Known vulnerabilities (tracked debt)

| Issue | Severity | Location |
|---|---|---|
| Plaintext password storage/comparison | CRITICAL | `server/storage.ts`, `server/routes.ts` |
| No server-side auth on API routes | CRITICAL | `server/routes.ts` |
| No rate limiting on login | HIGH | `server/routes.ts` |
| Client-side only access control | HIGH | `client/src/lib/auth.ts` |
| No CSRF protection | MEDIUM | `server/index.ts` |
| Hardcoded passwords in seed data | LOW | `server/storage.ts` |

## Input validation

- Validate EVERY API route input before processing.
- Use Zod schemas from `shared/schema.ts` — they already exist for inserts.
- Reject malformed input with 400 and descriptive PT-BR message.

```typescript
// ✅ Correct — Zod validation at route boundary
const data = insertCheckInSchema.parse(req.body);

// ❌ Wrong — blind trust
const checkIn = await storage.createCheckIn(req.body);
```

## Guidelines for new code

- Never store or compare plaintext passwords. Use bcrypt or argon2.
- Add server-side auth check on any route that reads/writes user-specific data.
- Validate all input at the route boundary with Zod.
- Don't expose internal error details (stack traces, SQL) in API responses.
- Don't log passwords, tokens, or PII.
- Secrets in environment variables (`DATABASE_URL`, etc.), never in committed code.

## Rules

- Every route accessing user data should verify the caller's identity server-side.
- Input validation is mandatory at every API boundary.
- Error responses: PT-BR message without internal details.
- Check `.gitignore` before creating files with credentials.

## Anti-patterns

- Storing or comparing plaintext passwords in new code
- API route without input validation
- Client-side auth as the only access control layer
- Logging passwords, tokens, or sensitive user data
- Trusting `req.body` fields for authorization without server verification
- Secrets or credentials committed to the repository
