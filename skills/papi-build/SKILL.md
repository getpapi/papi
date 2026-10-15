---
name: papi-build
description: Invoke when executing a build via build_execute. Covers branching, gestalt pre-build check, and post-build audit.
---

# papi-build

For missing evidence on an existing shipped task, follow papi-plan's
**Already-shipped work with missing evidence** route. Ordinary build completion
is for actual implementation; evidence restoration preserves assignment and
historical cycle and does not count a new build.

## Completion authority before scheduling or building

Read the task's complete scope, structured `completionAction`, dependencies and assignee before proposing a task set or starting work. When scope requires final decision resolution, read the actual decision and persist its structured link through `board_edit` before scheduling. For `action: resolve`, name the remaining decision action and its current authorized resolver using the canonical decision policy. Owner, per-type and group-quorum permissions must be revalidated at plan apply and task claim; unknown authority refuses final completion. Arbitrary notes, caller-reported retry guidance and a prepared proposal are not permission or human acceptance.

Keep proposal preparation in a separate `action: prepare` task and retain its completed output. Hand the final `action: resolve` task to an authorized resolver only after explicit assignment confirmation. Do not recommend rebuilding Done/In Review preparation. An optional manual approval blocks release only when a task has an explicit dependency or typed blocker.

Reconcile board assignment with branch/PR contents. Transferring tasks or creating a branch at an already merged commit cannot remove those tasks from the original PR's historical diff. Disclose already-merged scope, preserve recipient commits and approval attribution, and use a scoped corrective change when needed; never rewrite shared main or force-push a teammate's branch to claim separation.

## Cycle PR preparation

Follow the owning repository's actual branch, qualification and release contract.
Read its workflow before selecting checks; PAPI maintainer scripts are not
requirements for customer projects. Finish authorized metadata before qualifying
the final tree once, and rerun affected checks after substantive changes. Record
the exact head and evidence. Never treat local-only commits as shipped.

Fetch remote main before branching. Preserve dirty work and isolate from that
fetched tip in a permitted task directory; never stash or discard someone else's
work automatically. All same-cycle, same-module tasks share
`feat/cycle-N-<module>` regardless of size, with one commit per task. Reuse the
dependency's branch when required. Never use light mode on a shared branch.

## Follow-up and shared-session guidance

Follow the owning project's shared-session protocol at build completion and review:
distinguish current-build corrections from separate findings, preserve learning
references and dispositions, and inspect downstream prerequisites before claiming
work is unblocked. Reuse the mutation response's session_id and enrich it through
session_announce; inspect session_list before authorized coordination. Caller
branch activity is advisory, never proof that the hosted server inspected Git.

## Gestalt Pre-Build Check

**Before `build_execute` on the first task of any multi-task cycle, read the cycle as a whole:**

1. Run `build_list` to see every task assigned to the current cycle.
2. Read the BUILD HANDOFFs together — not one at a time. Look for:
   - **Shared files** across handoffs — the same path in two FILES LIKELY TOUCHED lists usually means a refactor opportunity, a shared helper to extract first, or a sequencing constraint.
   - **Shared modules** — multiple tasks in the same module should land on a shared cycle branch (`feat/cycle-N-<module>`) so they merge together.
   - **Design decisions implicit across tasks** — e.g. one task introduces a new field, a later task consumes it. Build the producer first.
   - **Module split** — cross-module dependencies need explicit coordination;
     sequence producers before consumers and preserve an approved shared PR scope.
3. Only then run `build_execute` on the first task.

This is a one-time check at the start of the cycle, not per-task. It catches scope conflicts, redundant work, and ordering hazards that an isolated handoff read can't see. Skip it for single-task cycles.

## Completing the build: send the data PAPI cannot see

The hosted server cannot see your machine, so send these with the completing `build_execute` call (the start response lists them with your build window already filled in). Each one the dashboard otherwise shows as **Not recorded**:

- `model` (your exact model id) and `agent` (your client's name, used only if the server cannot tell).
- Tokens: run the `usage-reporter` skill's script once, just before completing, for the window from the build start to now, and pass `input_tokens`, `output_tokens` and `cache_read_tokens` from its `buildExecute` field. If the skill is unavailable or prints `notRecorded`, pass nothing. Never estimate tokens.
- `commit_sha`, `files_changed`, `acceptance_results` (one entry per criterion with `met` and `evidence`) and `handoff_accuracy`.

## Post-Build Audit

After every `build_execute` (complete), audit the branch before presenting for human review. This catches bugs and convention violations early.

1. **Identify changed files:** Run `git diff origin/main --name-only` to find modified files. If no changes, report "No changes to audit" and skip.
2. **Review each changed file** for:
   - Logic errors, off-by-one mistakes, incorrect conditions
   - Unhandled edge cases (null, undefined, empty inputs)
   - Convention violations defined in the owning repository's instructions
   - Incorrect type narrowing or unsafe casts
3. **Documentation check:** If any `docs/` files describe behaviour that the change modified, flag as "Doc drift".
4. **Report:** For each issue: file path, severity (Bug/Convention/Doc drift), what's wrong, how to fix.
5. **If findings exist:** Fix required corrections and rerun affected checks.
   Record the audit honestly; `review_submit` records a human verdict, not the
   builder's self-audit.
6. **If clean:** Present for human review — "Ready for your review — approve or request changes?"

## Housekeeping — Opt-In Deep Sweep

`orient` runs a fast cheap-checks-only path by default. The deep sweep — orphaned branches, In Review tasks with no PR, stale In Progress branches, unrecorded commits, unregistered docs — is opt-in via `deep_housekeeping: true`.

When to run with `deep_housekeeping: true`:
1. Before `release` — catch board/branch drift.
2. After a long break (>1 day since last session) — surface anything that fell off.
3. When you suspect drift — odd cycle counts, missing PRs.

**Don't run deep on every session start.** It pollutes early context with cross-reference output that's noise 80% of the time. The default fast path tells you what cycle you're on, what's in flight, and what to do next; that's the daily-driver shape.

If the deep sweep surfaces something fixable (orphaned branches, missing PRs), fix it silently and report after — same autonomous-plumbing rule as before.

## Context Compression Recovery

When the system compresses prior messages, immediately:
1. **Run `orient`** — single call for cycle state
2. Check your todo list for in-progress work
3. Verify saved commits, receipts, owned processes and relevant board state
4. **NEVER re-build a task that is already In Review or Done.**
5. Continue where you left off — don't restart or re-plan

## Tool Use Discipline

Most tool errors are habit issues, not capability issues. Avoid them up front:

- **Ranged reads for large files.** Before `Read`-ing a file you haven't already touched this session, check its size. For files over ~1000 lines, or known-large surfaces (generated SQL, lockfiles, HTML reports, large templates), use `offset` + `limit` from the start instead of hitting the token ceiling.
- **Search-before-read for unverified paths.** If a path comes from memory or inference rather than a file you've read this session, run `Glob` or list the parent directory first. Don't `Read` paths you haven't confirmed exist.
- **Use available native file/search tools.** Discover paths first and use
  bounded reads; do not assume another host's Read/Glob/Bash names exist.
- **Verify-before-recommend.** Before suggesting a new task, hook, or skill, check whether it already exists: `board_view` for tasks, `doc_search` for docs, `ls .claude/hooks/` for hooks. Recommending duplicates of already-shipped work wastes a build slot.

## Review and completion evidence

Complete through the existing MCP connection with accurate acceptance results,
commit SHA, changed files, handoff accuracy and surprises. Report an exact model
only when this call exposes it; otherwise send `model_evidence: []` and preserve
unknown. Do not infer it from a client name, configured default or another turn.

Read the report and exact diff, exercise the changed production entry point, and
attach actual review/test evidence. Use review subagents only when the host
supports them and delegation is authorized or required by owning instructions.
Builder self-audit is not independent review or a human verdict. Keep work In
Review until accepted by the human. Verify current-head CI and unresolved reviews
before an authorized merge, then confirm the remote merge commit.

Investigate failed or stalled work immediately, preserve progress and repair the
smallest safe in-scope cause. Retries need evidence and a bound. Never silently
stop, bypass access or weaken tests to hide a failure.
