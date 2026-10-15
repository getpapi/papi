---
name: papi-integration-recipe
description: >
  Use when the user wants to feed data from a connected MCP tool (Sentry, Linear,
  GitHub, Slack, or any other) into PAPI. Demonstrates the "host agent = integration
  bus" pattern: read from the external tool, map to PAPI shape, write via PAPI tool.
  PAPI never owns connectors — the user's AI session passes data between services.
user-invocable: true
---

# Integration Recipe — PAPI as system of record

Your AI session is the integration bus. Any MCP tool you have connected — Sentry, Linear,
GitHub, Slack — can push data into PAPI without additional infrastructure.

```
1. Read from connected tool  →  2. Map to PAPI shape  →  3. Write via PAPI tool
```

PAPI handles auth for PAPI. The other tool handles its own auth. The agent session passes
data between them. No token vaults, no sync workers, no egress.

---

## Recipe: Sentry error → PAPI idea

**Trigger:** Production error needs a backlog task before context is lost.

```
# Step 1 — Read from Sentry
mcp__sentry__list_issues(project="your-project", status="unresolved", limit=5)

# Step 2 — Pick an issue, extract: title, fingerprint, URL

# Step 3 — Write to PAPI
mcp__papi__idea(
  text="Fix: <error title>",
  notes="Production error. Fingerprint: <id>.\nReference: <sentry-issue-url>",
  priority="P1 High",
  module="core"
)
```

---

## Recipe: Linear issue → PAPI board_edit

**Trigger:** Sync Linear issue state into an existing PAPI task.

```
# Step 1 — Read from Linear
mcp__linear__get_issue(id="LIN-123")

# Step 2 — Resolve LIN-123 to PAPI task_id (by notes lookup or title match)

# Step 3 — Update PAPI task
mcp__papi__board_edit(
  task_id="task-NNN",
  notes="Linear LIN-123 — <status>. <description>."
)
```

---

## Recipe: GitHub issue → PAPI idea

**Trigger:** New bug filed on GitHub → triage into PAPI backlog.

```
# Step 1 — Read from GitHub
mcp__github__list_issues(repo="org/repo", state="open", labels=["bug"])

# Step 2 — For each issue: extract number, title, URL

# Step 3 — Write to PAPI
mcp__papi__idea(
  text="GH#<number>: <issue title>",
  notes="Filed on GitHub.\nReference: <issue-url>",
  priority="P2 Medium"
)
```

---

## Pattern template — works for any source

| Step | What to do |
|------|-----------|
| **Read** | `mcp__<tool>__<read_fn>(params)` |
| **Map** | Extract: title, reference URL, priority from source |
| **Write** | `mcp__papi__idea(text, notes)` for new items; `mcp__papi__board_edit(task_id, ...)` for updates |

**`idea` vs `board_edit`:**
- New data from external source → `idea` (creates backlog task for triage)
- Updating an existing PAPI task with external context → `board_edit`

**Always include a `Reference:` line in `notes`** pointing to the source URL or ID.
The planner reads this line and surfaces it in BUILD HANDOFFs.

Use actual connected tools and current schemas; external names above are examples,
not a promise they exist. Inspect source references before repeating a write.
Keep the PAPI binding fixed; another project requires explicit target authorization.
Read access does not authorize sending messages or changing the source system.

---

## What PAPI never does in this pattern

- Store tokens for third-party services
- Run background sync workers
- Own webhook receivers
- Make outbound calls to external APIs at request time

The agent session is the integration bus by design — keeps PAPI's security surface
minimal, egress zero, and the user in control of every write.
