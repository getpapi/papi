---
name: papi-plan
description: Invoke when starting a new PAPI cycle. Covers plan generation, board management, and cycle scoping rules.
---

# papi-plan

## Completion authority before scheduling or building

Read the task's complete scope, structured `completionAction`, dependencies and assignee before proposing a task set or starting work. When scope requires final decision resolution, read the actual decision and persist its structured link through `board_edit` before scheduling. For `action: resolve`, name the remaining decision action and its current authorized resolver using the canonical decision policy. Owner, per-type and group-quorum permissions must be revalidated at plan apply and task claim; unknown authority refuses final completion. Arbitrary notes, caller-reported retry guidance and a prepared proposal are not permission or human acceptance.

Keep proposal preparation in a separate `action: prepare` task and retain its completed output. Hand the final `action: resolve` task to an authorized resolver only after explicit assignment confirmation. Do not recommend rebuilding Done/In Review preparation. An optional manual approval blocks release only when a task has an explicit dependency or typed blocker.

Reconcile board assignment with branch/PR contents. Transferring tasks or creating a branch at an already merged commit cannot remove those tasks from the original PR's historical diff. Disclose already-merged scope, preserve recipient commits and approval attribution, and use a scoped corrective change when needed; never rewrite shared main or force-push a teammate's branch to claim separation.

## Already-shipped work with missing evidence

Check task status and the original merged commit before scheduling work. Restore
an existing shipped task through `board_reconcile(mode:"restore-evidence")`:
supply the original complete report/handoff, exact implementation and merged
commit SHAs, and a stable idempotency key. Inspect the preview, then confirm the
unchanged evidence with its preview token. Keep its assignee, historical cycle
and cycle UUID intact. Unknown original authorship stays unknown; the person
restoring evidence is a separate actor. Do not simulate `build_execute`, claim
the task or assign it to the current cycle to repair metadata. Acceptance still
requires the human verdict. A stale preview needs a new preview, not a forced write.

## Proposal before persistence

Keep the verified project and caller-owned cycle fixed. Inspect statuses, existing
branches/build evidence, task claims, prerequisites and person-only decisions.
Prepare the exact proposed task IDs/names and show them before `plan` apply.
Approval authorizes that displayed set, not extra tasks or a future cycle.
Never persist a one-task cycle: include at least two eligible coherent tasks,
aiming for three when available. Do not pad with blocked or another person's work.
If fewer than two remain, show the blockers and obtain direction before creating it.
Reuse an already approved plan; do not re-plan an in-flight cycle.

## Workflow Sequences

PAPI tools follow structured flows. The agent manages the cycle workflow automatically — the user should never need to type tool names or remember the flow. Handle the plumbing, surface the summaries.

### Cycle Workflow (auto-managed)

- **Run tools automatically** — don't ask the user to invoke MCP tools manually
- Before implementing: silently run `build_execute <task_id>` (start phase)
- After implementing: run `build_execute <task_id>` (complete phase) with report fields
- After build_execute completes: audit the branch changes for bugs, convention violations, and doc drift (see Post-Build Audit below)
- After audit with findings: fix required corrections, rerun affected checks and
  record the findings. A builder's audit does not authorize a human review verdict.
- After audit clean: present for human review — "Ready for your review — approve or request changes?"
- User approves/requests changes → run `review_submit` behind the scenes

### The Cycle (main flow)

```
plan → build_list → build_execute → audit → review_list → review_submit → build_list
```

1. **plan** — Prepare a proposal; persist it only after approval of the exact task set.
   Next: `build_list` to see prioritised tasks.
2. **build_list** — View tasks ready for execution, ordered by priority.
   Next: `build_execute <task_id>` to start a task.
3. **build_execute** (start) — Marks the task In Progress and returns the handoff.
   Branch operations require a workspace-capable host; a hosted server cannot inspect local Git.
   Next: Implement the task, then `build_execute <task_id>` again with report fields to complete.
4. **build_execute** (complete) — Records the report and marks the task In Review.
   Push and verify the actual task commit through the owning workspace/remote authority.
   Next: Run the post-build audit automatically.
5. **Post-build audit** — Review branch changes for bugs, convention violations, and doc drift (see Post-Build Audit section below).
   Next: Fix required findings on the current build, then proceed to `review_list`
   for the human verdict. Never fabricate independent review or human acceptance.
6. **review_list** — Shows tasks pending human review (handoff-review or build-acceptance).
   Next: for a task In Review, `review_task` for the review brief, then `review_submit` to approve, accept, or request changes. A task in In Review needs `review_task`, then `review_submit` once it has been reviewed, then `release`.
7. **review_submit** — Records the review verdict and updates task status.
   Next: `build_list` to view next build

   **DO NOT** use `review_submit` as a substitute for `review_list`. If you need to see what is pending review, always call `review_list` first. If `review_list` is unavailable in your tool set (e.g. your MCP client filters parameterless tools), STOP and tell the human their MCP integration is incomplete — never guess at the next pending task. To submit an accept verdict on a build-acceptance review, either pass `reviewer_confirmed: true` or ensure `review_list` has run in the same session within the last 15 minutes. (SUP-2026-010.)

### Strategy Review

```
strategy_review → strategy_change
```

- **strategy_review** — Analyses project health, velocity, and estimation accuracy.
  Next: `strategy_change` if the review recommends adjustments.
- **strategy_change** — Updates active decisions, north star, or project direction based on review findings.

### Detect Strategic Decisions in Conversation

Watch for: direction changes, architecture shifts, deprioritisation with reasoning, new principles, competitive positioning decisions.

When detected:
1. Flag it: "That sounds like a strategic direction change — should I run `strategy_change`?"
2. If confirmed, run `strategy_change` immediately.
3. If mid-build, finish the current task first.

### Idea Capture

```
idea → (picked up by next plan)
```

- **idea** — Captures a new task idea and writes it to the backlog.
  Next: The next `plan` run will prioritise and schedule it.

**First contact — a work-dump is an `idea` batch, not a coding session.** When the
user hands you a list of work on an empty or near-empty board — an audit's
findings, a bug list, "build all of these", a pasted backlog — do NOT start
writing code. There is no task, no BUILD HANDOFF and no cycle for it yet. File
each item with `idea`, then run `plan` to scope a cycle. The user should never
need to know these verbs — route the request through the pipeline for them and
say what you did.

### Project Bootstrap

```
setup → plan
```

- **setup** — {{setup_description}}
  Next: `plan` to run the first cycle planning session.

### Board Management

- **board_view** — Read-only view of all tasks on the board.
- **board_archive** — Removes completed/cancelled tasks from the board to an archive.
- **board_deprioritise** — Defers work or records a typed blocker using action, reason, blocker_type and blocker_ref. Use board_edit dependsOn for prerequisites without changing status. Follow the generated AGENTS.md Follow-up protocol at planning, review and release.

### Quick Reference: Tool → Next Step

| Tool | Next Step |
|------|-----------|
| `setup` | `plan` |
| `plan` | `build_list` |
| `build_list` | `build_execute <task_id>` |
| `build_execute` (start) | Implement, then `build_execute` (complete) |
| `build_execute` (complete) | Post-build audit (automatic) |
| Audit (findings) | Fix, verify and record; present for human review |
| Audit (clean) | `review_list` |
| `review_list` | `review_submit` |
| `review_submit` (approve/accept) | `build_list` |
| `review_submit` (request-changes) | `build_execute` (redo) or `build_list` |
| `strategy_review` | `strategy_change` (if needed) |
| `idea` | Next `plan` picks it up |

## Process Rules

These rules come from 80+ cycles of dogfooding. They prevent the most common sources of wasted time and rework.

### Building
- **Verify before claiming done.** Hit the endpoint, check the rendered output, confirm the data round-trips. Never say "should work" — prove it works.
- **Preview frontend changes.** After any UI/styling build, provide the localhost URL so the user can visually review. Don't make them ask for it.
- **Debug one change at a time.** When fixing issues, make one change, verify it, then move on. Don't stack multiple untested fixes.
- **Test the write-read roundtrip.** Every data write path must have a verified read path. If you write to DB, confirm the read query returns what was written. This is the #1 source of silent failures.
- **Test after every build.** Run the project's test suite after implementing. Suggest follow-up tasks from learnings when meaningful.
- **Build patiently.** Validate each phase against the last. Don't rush through implementation — test through the UI, not just the API.

### Security
- **Audit before widening access.** Before any build that adds endpoints, modifies auth/RLS, introduces new user types, or changes access controls — review the security implications first. Fix findings before shipping.
- **Flag access-widening changes.** If a build touches auth, RLS policies, API keys, or user-facing access, note "Security surface reviewed" in the build report's `discovered_issues` or `architecture_notes`.
- **Never ship secrets.** Do not commit .env files, API keys, or credentials. Check `.gitignore` covers sensitive files before pushing.
- **Privacy.** Verify the deployment's actual collection and opt-out contract;
  do not promise anonymity or enforcement from an unverified environment flag.

### Planning & Scope
- **NEVER run `plan` more than once per cycle.** Adjust the cycle with `board_deprioritise` or `idea` instead.
- **Resolve the caller-owned cycle before planning another.** Complete its reviews
  and authorized release/closure; carry-forward needs an explicit disposition.
- **Large plan/handoff outputs:** Use inline output or the connected tool's
  supported structured/chunk contract on HTTP. `llm_response_file` is only valid
  for a local stdio/workspace server that can read that actual absolute path.
  It is mutually exclusive with inline output; remote servers cannot read your disk.
- **Only build tasks assigned to the current cycle.** Use `build_list` — it filters to current-cycle tasks with handoffs.
- **Don't ask premature questions.** If the project is in early cycles, don't ask about deployment accounts, hosting providers, OAuth setup, or commercial features. Focus on building core functionality first.
- **Split large ideas.** If an idea has 3+ concerns, submit it as 2-3 separate ideas so the planner creates properly scoped tasks — not kitchen-sink handoffs.
- **Close completed cycles accurately.** Verify remote parity, all task statuses,
  required reviews and the owning release workflow. Carry out an already authorized
  release; use `close_cycle` for explicitly requested bookkeeping-only closure.
  Never imply that cycle closure is a versioned release or authorizes publication,
  public access, a deployment or an external message.
- **Verify readiness before releasing.** Inspect the complete caller-owned cycle,
  not only its review queue. Resolve pending work within approved scope; moving
  or cancelling it needs an authorized disposition. Never mutate another member's
  work to make release pass. Verify the remote implementation and exact evidence.

### Communication
- **Show task names, not just IDs.** When summarising board state or reconciliation, include task names — e.g. "task-42: Add supplier form" not just "task-42".
- **Surface the next command.** After each step, tell the user what comes next. Commands should be surfaced, not memorised.

### Stage Readiness
- **Access-widening stages require auth/security phases.** Before declaring a stage complete, check if it widens who can access the product (e.g. Alpha Distribution, Alpha Cohort). If so, auth hardening and security review must be completed first — not discovered after the fact.
- **Pattern:** Audit access surface → fix vulnerabilities → then widen access. Never ship access-widening without a security phase.


<!-- PAPI_ENRICHMENT_TIER_1 -->

## Batch Building (unlocked at cycle 6)

For multi-task cycles, build without unnecessary stops between eligible tasks:
- Build prerequisite producers before consumers; within that order prefer XS/S first
- All same-module cycle tasks share one `feat/cycle-N-<module>` branch regardless of size
- One commit per task for traceable history, even on shared branches
- After all tasks built, batch review them together
