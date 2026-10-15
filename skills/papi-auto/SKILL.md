---
name: papi-auto
description: Continue an approved PAPI cycle through implementation, verification and review using bounded autonomy. Resume durable work without rebuilding it; propose new scope before persisting it.
user-invocable: true
---

# papi-auto

Use papi-plan, papi-build, papi-strategy and papi-idea for the canonical phase
rules. This skill coordinates one cycle; it grants no new scope, human review
authority, publication, deployment or external messaging.

## Modes

- `dry-run`: orient, inspect the current cycle, handoffs and evidence, then show
  proposed actions. Do not claim tasks, apply plans or edit files.
- Resume/default: continue the already approved cycle from its recorded state.
- `unattended`: continue only already authorized work. Never bypass plan approval,
  human verdicts, access controls or release authority.

## Orient and preserve progress

Keep the active project connection and workspace binding fixed. Surface its name
and verify it matches the intended project. Inspect the caller-owned cycle with
`build_list`; distinguish teammate cycles, claims and person-only decisions.
Use MCP records as project authority, not `.papi/` files.

Fetch remote main before new branches. Preserve unrelated dirty work and isolate
in a permitted task directory; never auto-stash, reset or discard it. Record the
exact base, branch, owner, scope and durable receipts.

- In Progress: inspect its branch, commits, saved changes and owned process before
  resuming. A status alone is not progress.
- In Review: already built. Read its report and review queue; never rebuild.
- In Cycle/Backlog: check for existing implementation first. Build only eligible
  approved tasks with a handoff and satisfied prerequisites.
- Done/Cancelled: skip. Never change historical ownership for bookkeeping.
- Already shipped with missing evidence: follow papi-plan's restoration route.

When no cycle is active, prepare at least two coherent eligible tasks, aiming
for three when available. Show exact IDs, names, scope and blockers before
applying. An approved resume needs no new scope approval. Never silently drop
tasks, include another person's work or invent filler. Run a due strategy review
in this conversation; material choices require the user's authority. Never
force past the planner's gate.

## Classify and sequence

Read every handoff together before the first build. Sequence producers before
consumers, then smaller eligible work. Same-module cycle tasks share a branch
regardless of size, with one commit per task. Preserve an explicitly approved
integrated PR. A shared branch takes its highest risk tier. Person-only decisions
remain with their owner; continue independent work while awaiting them.

### Risk-tier definition

Risk-tier modules are `auth`, `data`, `migration`, `security`, `ci`, `payment` and
`billing`. Paths are categories, not a fixed list: inspect the owning repository
for auth/session guard files, database migration code, CI/CD and deployment
configuration, build/lint plumbing, and edge/serverless runtime functions.
For PAPI maintainers, `REVIEW_RISK_TIER_MODULES` and `REVIEW_RISK_TIER_GLOBS` in
`packages/server/src/lib/review-risk-tier.ts` own enforced classification.
Customer projects use their own rules rather than copying PAPI's paths.

### Review authority

Risk selects checks and reviewers; it never authorizes acceptance. Read the exact
diff and report, run owning production-path checks and audit corrections. A
builder's audit is not independent review. Delegate only through available host
tools when authorized or required by owning instructions. Never invent a review
or model identity from defaults. Keep builds In Review until the human verdict
required by `review_submit` exists. Inspect `review_list` first and bind the
explicit verdict to the reviewed commit. Absence of a verdict is not acceptance.

## Execute and recover

Start eligible tasks through `build_execute`, implement the handoff, exercise the
real entry point, push the commit and record an accurate completion report.
Use native host tools actually available; Task, Bash and Skill are not universal
APIs. Hosted HTTP cannot read caller-local response files.

Inspect failures immediately. Preserve the command, original error and last
durable progress; verify claimed blockers before escalation. Repair the smallest
safe in-scope cause. Retry only with evidence of changed input or a transient
cause, at most one identical transient retry and one revised approach per failing
operation. Further failure needs fresh diagnosis, not an indefinite loop.
Never weaken tests, bypass credentials or stop shared services. Notify meaningful
failure or an owned process stop with its recovery, and continue independent work
when a genuine human action remains pending.

If delegation is authorized, record owner, scope, dispatch time, expected output,
last durable progress and the next check within five minutes. Inspect files,
receipts and owned processes at intervals no longer than five minutes. Between
turns use an actual available heartbeat when requested or required, not merely
saved instructions. Disclose any inability to provide timely supervision.

## Finish accurately

Before an authorized merge, verify exact head, local gate, current CI, reviews and
unresolved threads, then confirm the remote merge commit. Release only through
the owning authorized versioned workflow after required tasks and reviews are
resolved. Bookkeeping closure is not deployment. Never plan the next cycle
automatically. Report pending work with its owner and next action; keep a parent
audit open until every required client qualification has actual evidence.

Clean up only verified owned processes and disposable state; preserve shared
resources and durable remote receipts. After compaction, orient and recover that
state in this conversation rather than restarting work.
