# How PAPI works

PAPI gives your AI assistant a structured loop to run with you, and the
memory to make each pass through the loop smarter than the last.

## The cycle

```
plan → build → review → release → (next plan)
```

- **plan** looks at your backlog, your past cycles, and your active
  decisions, then proposes a cycle: a small set of right-sized tasks, each
  with a build handoff.
- **build** is where your assistant implements a task. Starting a build
  creates a branch and returns the handoff; completing it records a build
  report: actual effort, surprises, and anything discovered along the way.
- **review** records your verdict on each build: accept, request changes,
  or reject.
- **release** closes the cycle, merges the work, and tags it. Then the next
  plan starts from everything the last cycle learned.

## Build handoffs

A handoff is a self-contained spec for one task: why now, what to do, what
NOT to do, acceptance criteria, likely files, and a pre-mortem of what could
go wrong. Handoffs are written so an assistant can execute them without
extra context. They persist with the task, so a different tool (or a
teammate's assistant) can pick the task up cold.

## Decisions

Architectural and strategic choices are recorded as Active Decisions with a
confidence level. Your assistant checks them before making related choices,
and supersedes rather than overwrites them when direction changes, so the
history of why stays intact.

## Strategy reviews

Every few cycles, PAPI steps back: are the cycles pointing the right
direction? What recurring friction should become a task? The output feeds
the next plan, so course corrections happen on evidence, not vibes.

## Where things live

- **Your AI tool** is the command surface. Plans, builds, and reviews all
  happen in conversation, through MCP tools.
- **The dashboard** at [getpapi.ai](https://getpapi.ai) is the review and
  visibility surface: board, cycles, decisions, briefs, and your team.
- **Your data** is stored per-project and per-user in PAPI's hosted
  backend. The remote transport authenticates every request; project data
  is scoped to your account. Team members you add to a project can see its
  board, decisions, and brief read-only.

## What PAPI is not

- Not a code generator. Your AI tool writes the code; PAPI keeps the plan,
  the memory, and the loop.
- Not a ticket system you maintain by hand. The board is written and read
  by the tools as a side effect of working.
- Not autonomous. The loop pauses for your decisions at plan approval and
  review. You stay in control; that is the point.
