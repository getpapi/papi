---
name: papi-verify
description: >
  Use when the user says "verify", "health check", "check papi", "verify cycle",
  or after completing all cycle tasks before release. Runs a structured health check
  on the current PAPI cycle state: plan validity, build state, review coverage,
  branch hygiene, and data consistency.
---

# PAPI Verify — Structured Cycle Health Check

Run a comprehensive verification of the current PAPI cycle state. This is the "smoke test for PAPI itself" — catches regressions and data quality issues before they reach external users.

## Steps

### 1. Orient and capture cycle state

Run `orient` to get the current cycle number, task counts, and board state. Record:
- Current cycle number
- Tasks by status (Backlog, In Progress, In Review, Done)
- Any carry-forward items

### 2. Plan validity check

Run `build_list` to get all cycle tasks. For each In Cycle task, verify:
- [ ] Task has a title (not empty)
- [ ] Task has a priority assigned
- [ ] Task has a complexity/effort estimate
- [ ] Task has a BUILD HANDOFF (check if it appears in build_list output)

Report: `PLAN: X/Y tasks have valid handoffs`

### 3. Build state check

For each task status, verify consistency:

**In Progress tasks:**
- [ ] Check if a `feat/task-XXX` branch exists (`git branch | grep feat/task-XXX`)
- [ ] Flag any In Progress task with no branch (orphaned status)

**Done tasks (this cycle):**
- [ ] Check if a build report exists (these appear in the build_list or board_view output)
- [ ] Flag any Done task without a build report

Report: `BUILD: X branches found for Y In Progress tasks. Z Done tasks with reports.`

### 4. Review coverage check

Run `review_list` to check:
- [ ] How many tasks are In Review
- [ ] Are there Done tasks that were never reviewed (skipped review_submit)

Report: `REVIEW: X tasks pending review, Y tasks reviewed and accepted`

### 5. Branch hygiene check

Run `git branch | grep feat/task` and cross-reference with board state:
- [ ] Branches for Done tasks that haven't been merged (orphaned branches)
- [ ] Branches for tasks not in this cycle (leftover from previous cycles)
- [ ] Current branch — are we on main or a feature branch?

Report: `BRANCHES: X feature branches, Y orphaned, Z ready to merge`

### 6. Data consistency check

Verify dashboard data matches MCP state:
- [ ] Run `board_view` and compare task counts with orient output
- [ ] Check if cycle number in orient matches what board_view shows
- [ ] Flag any discrepancies

Report: `DATA: Cycle N, board shows X tasks, orient shows Y tasks`

## Output Format

Present results as a structured report:

```
PAPI VERIFICATION — Cycle N
=============================

PLAN:     [PASS/FAIL] X/Y tasks with valid handoffs
BUILD:    [PASS/FAIL] X branches for Y in-progress tasks, Z reports for W done tasks
REVIEW:   [PASS/FAIL] X pending review, Y accepted
BRANCHES: [PASS/WARN/FAIL] X feature branches, Y orphaned
DATA:     [PASS/FAIL] Counts consistent across orient and board_view

Overall: [PASS / X warnings / Y failures]

Failures:
- [list specific failures with task IDs]

Warnings:
- [list specific warnings]
```

## Rules

- This is READ-ONLY — do not fix anything, just report
- Run all checks even if early ones fail
- Use PASS/WARN/FAIL consistently: PASS = no issues, WARN = minor issues that don't block, FAIL = something is wrong
- Always show the full report, even if everything passes
- If a check can't run (e.g., no In Progress tasks), report as PASS with a note
