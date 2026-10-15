---
name: security-audit
description: >
  Full codebase security audit. Use when the user says "security audit", "security check",
  "check security", or periodically as a recurring review. Scans for OWASP top 10,
  secret exposure, dependency vulnerabilities, auth gaps, and unprotected endpoints.
  Unlike pr-reviewer (branch diffs only), this audits the entire codebase.
---

# Security Audit — Full Codebase Review

Perform a comprehensive security audit of the entire codebase. This is NOT a branch diff review — it scans all source files for security issues.

## When to Run

- Periodically as a recurring check (e.g. before a major release)
- After major security-related changes (auth, RLS, API keys)
- Before onboarding external users
- When the user explicitly requests `/security-audit`

## Steps

### 1. Secret Exposure Scan

Search for hardcoded secrets, API keys, tokens, and credentials in source code.

**Patterns to check:**
- `grep -r` for patterns: `sk-`, `sk_live`, `sk_test`, `SUPABASE_SERVICE_ROLE`, `eyJ` (JWT prefixes), `ghp_`, `npm_`, `Bearer `
- Check all `.ts`, `.tsx`, `.js` files for `process.env` usage — verify each env var is listed in `.env.example`
- Check for secrets in: git history (recent 10 commits), config files, test fixtures
- Check that `.env` and `.env.local` are in `.gitignore`

**IMPORTANT:** Never include actual secret values in the report. Reference file:line only.

**Severity:** Critical if secrets found in source, Warning if env var not in .env.example

### 2. Authentication & Authorization

Review auth middleware and access control.

**Files to read:**
- `middleware.ts` — auth middleware, route protection
- `lib/auth.ts` or similar — auth helper functions
- `app/api/**/route.ts` — every API route

**Check for:**
- API routes without auth checks (missing `getServerSession` or equivalent)
- Admin endpoints accessible to non-admin users
- Missing CSRF protection on state-changing endpoints
- Session token handling (httpOnly, secure, sameSite flags)
- RLS policies — verify `user_id` scoping on all tables with user data

**Severity:** Critical for unprotected endpoints, High for weak auth patterns

### 3. SQL Injection & Data Access

Check for unsafe database queries.

**Check for:**
- Raw SQL string concatenation (template literals with user input)
- Missing parameterized queries
- Supabase client usage without RLS context
- Service role key usage outside server-side code
- Data returned to client that shouldn't be (PII, internal IDs, other users' data)

**Severity:** Critical for SQL injection vectors, High for data exposure

### 4. XSS & Client-Side Security

Check React components for XSS vectors.

**Check for:**
- `dangerouslySetInnerHTML` usage — verify input is sanitized
- User-supplied data rendered without escaping
- `eval()`, `new Function()`, or dynamic script injection
- Unvalidated URL parameters used in redirects (open redirect)

**Severity:** High for XSS vectors, Medium for potential issues

### 5. HTTP Security Headers

Read `next.config.ts` or `next.config.js` for security headers.

**Required headers:**
- `Content-Security-Policy` — verify it's not too permissive
- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` or `SAMEORIGIN`
- Do not recommend X-XSS-Protection; it is deprecated. Verify supported CSP and modern browser protections instead.
- `Referrer-Policy`

**Severity:** Medium for missing headers, Low for suboptimal values

### 6. Dependency Vulnerabilities

Use the project's authorized dependency audit path and existing dependency tree. Keep its complete JSON and exit code in a quoted, uniquely owned TASK_STAGING path, then summarize. Do not truncate the source or install a scanner. Apply framework-specific checks only where that framework exists.

```bash
npm audit --json > $TASK_STAGING/dependency-audit.json
```

**Report:** Count of critical/high/moderate/low vulnerabilities. Flag any with known exploits.

**Severity:** Critical/High matching npm audit severity

### 7. Environment & Configuration

Check for configuration security issues.

**Check for:**
- Debug mode enabled in production config
- Verbose error messages exposed to client (stack traces)
- CORS configuration — verify it's not `*` in production
- Rate limiting on API routes (especially auth endpoints)
- File upload limits and validation

**Severity:** High for exposed debug info, Medium for missing rate limits

### 8. Degraded-Mode Analysis (Fail Open vs Fail Closed)

**Background:** A common latent vulnerability class: a fix adds proper user/tenant scoping only for the happy path — when the auth or DB client initializes successfully — and leaves the unhappy path (the dependency is unavailable, misconfigured, or an env var is missing) falling through to an unscoped or default-tenant response. The app then fails **open** in exactly the condition where it should fail **closed**.

Check every auth and data-scoping path for what happens when a dependency is unavailable:

**What to check:**
- Every API route/handler that scopes data by user or tenant — does it return an error (fail closed) or fall back to a default/global value (fail open) when the DB or auth client comes back null/undefined?
- Your DB/session client factory (e.g. `getDbClient()`, `getSupabaseServer()`, `getSession()`) — what does it return when required env vars or connections are missing?
- Your auth middleware — what happens if the session/token lookup throws? Does it redirect to login (fail closed) or let the request through (fail open)?
- Any code path that resolves a tenant/project/user ID from request context — what happens if that resolution is ambiguous or fails mid-request?

**Pattern to flag:** Any code path of the form:
```typescript
const client = getScopedClient();
if (client) {
  // scope data by user_id / tenant_id
}
// falls through here WITHOUT scoping if client is null/undefined
```

**Required behaviour:** If a request is authenticated but the system cannot verify its scope (tenant/user/project), the response MUST be an error (e.g. 503) — never a fallback to a default, global, or owner-level dataset.

**Severity:** Critical if fail-open exposes another user's/tenant's data, High if fail-open exposes any unscoped data

### 9. Route-Guard / Public-Path Audit

**Background:** Many frameworks gate auth with an allowlist of "public" paths matched by prefix (e.g. `PUBLIC_PATHS.some(p => pathname.startsWith(p))`). A broad prefix like `/api/auth` makes every future route added under that prefix public by default — a developer (or LLM) adding a new route there won't know they just created an unauthenticated endpoint.

**Files to check:**
- Your auth middleware / route guard file (e.g. `middleware.ts`, `proxy.ts`, or your framework's equivalent) — find the public-path/allowlist definition.

**Check for:**
- Any entry that is a directory-level prefix (ends without a filename, e.g. `/api/auth`, `/api/internal`) rather than a specific path
- Any path in the allowlist that wasn't explicitly audited when it was added
- Compare the allowlist against the actual routes in your API directory — flag any route directory that could have new files added that would inherit public status

**Required pattern:** Each entry in the allowlist must be a specific, fully-qualified path (e.g. `/api/auth/callback`), not a prefix that would match a whole directory of routes.

**Also check:** Any PR or recent commit that modified the allowlist — these changes are high-risk and should always be reviewed manually.

**Severity:** High if broad prefix found that covers routes not intended to be public, Medium if path was added without documented rationale

## Output Format

Present findings as a structured report:

```
# Security Audit Report — [date]

## Summary
- Critical: N findings
- High: N findings
- Medium: N findings
- Low: N findings

## Critical Findings
### [CRIT-1] Title
- **File:** path/to/file.ts:line
- **Issue:** Description
- **Fix:** Recommended remediation

## High Findings
### [HIGH-1] Title
...

## Medium Findings
...

## Low Findings
...

## What Was Checked
- [ ] Secret exposure scan
- [ ] Auth & authorization review
- [ ] SQL injection & data access
- [ ] XSS & client-side security
- [ ] HTTP security headers
- [ ] Dependency vulnerabilities
- [ ] Environment & configuration
- [ ] Degraded-mode analysis (fail open vs fail closed)
- [ ] Route-guard / public-path audit

## Recommendations
Prioritized list of next actions.
```

## Important Notes

- This skill does NOT fix issues — it reports them only
- Never include actual secret values in the report
- Focus on actionable findings, not theoretical risks
- If a finding was already addressed (e.g., a scoping/RLS migration already applied), note it as resolved rather than re-flagging it

## Patterns Worth Checking (derived from real-world incidents)

These are real vulnerability classes found in production multi-tenant apps. Use them as a checklist baseline, not a complete list:

| Pattern | Root Cause | Fix |
|---------|-----------|-----|
| Permissive fallback policies override scoped ones | A base/default schema or policy created broad-access rules that a later, narrower rule didn't fully replace | Audit and remove all default-allow policies once scoped ones exist |
| Cross-tenant data leak via missing scoping | A route falls back to a default/global ID when the request-specific ID is absent | Add explicit scoping with no fallback; return empty/error instead |
| Latent fail-open on dependency unavailability | Scoping logic only runs in the `if (client)` branch; the implicit else path serves unscoped data | Fail closed (e.g. 503) before the scoping check, not after |
| Broad prefix in a public-path allowlist | A prefix like `/api/auth` was added for convenience and never revisited as new routes were added under it | Replace prefixes with explicit, fully-qualified paths |
