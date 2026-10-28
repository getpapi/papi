# How PAPI works

PAPI runs a plan, build, review and release loop with your AI assistant. The
plan, the decisions and the reasoning behind them live in one place, so your
assistant and your team read the same project.

## The loop

```
orient → plan → build → review → release → (next plan)
```

- **orient** starts every session. It returns the current cycle, what is in
  flight, and the recommended next action.
- **plan** turns the backlog into one scoped cycle. Every task gets a build
  handoff: scope, what is out of scope, acceptance criteria, the decisions
  that constrain it, and the files it is likely to touch.
- **build** (`build_execute`) starts a task. It hands back the handoff, puts
  the work on the right branch, and marks the task In Progress. Completing it
  records a build report: effort against estimate, surprises, dead ends, and
  bugs found outside the scope.
- **review** has two steps. `review_task` returns the review brief: the
  acceptance criteria, the decisions and conventions that bind the module, and
  what the build report claims. Your assistant then checks the change and asks
  you for a verdict. `review_submit` records it. Accept moves the task to Done,
  request changes sends it back for rework, and reject discards the build.
  The verdict is always a human's.
- **release** cuts a versioned release: a git tag, a CHANGELOG entry, and a
  push. `close_cycle` finishes a cycle without a version. Either way, the next
  plan starts from what the cycle learned.

## Build handoffs

A handoff is a self-contained spec for one task. It says what to build, what
is deliberately out of scope, how it will be checked, and which files it is
likely to touch. Handoffs are written so an assistant can execute them
without extra context. They persist with the task, so a different tool or a
teammate's assistant can pick the task up cold.

## Decisions and conventions

PAPI keeps two kinds of project rule:

- **Active Decisions** are live stances, such as "Stripe Checkout, not a custom
  payment flow". Each has a confidence level that moves as evidence arrives.
  When direction changes, a decision is superseded rather than overwritten, so
  the history of why stays intact. `ad_view` reads one in full.
- **Conventions** are settled build rules, such as "use the existing date
  helper". Declare one with `convention_declare` and every future task on the
  project is told about it, so nobody re-explains it each session. A convention
  can be scoped to one module.

## Teams

A project has members with one of three roles:

- **viewer** can read the board, decisions and reviews. This is the default.
- **editor** can run the full build, review and release cycle.
- **release_manager** can run the cycle and carry approved releases through.

The project owner sets roles with `contributor_add`. A new member runs `join`
rather than `setup`. `join` shows the decisions and documents to read and the
task pool to claim from, and it writes nothing to the repo.

Work is assigned with `task_claim` (take a task from the pool) or
`task_transfer` (hand a task to a teammate). Sessions show who is working on
what: `session_announce` says what this session is on, `session_list` shows
everyone else, and `session_message_send` passes questions, warnings and
handoffs between sessions.

## Strategy reviews

Every few cycles, PAPI steps back and checks direction: velocity, which
decisions still hold, and what recurring friction should become a task.
`strategy_review` produces recommendations, and `strategy_change` records a
new decision when direction shifts. `zoom_out` looks across the whole arc of
the project. The output feeds the next plan, so course corrections come from
evidence rather than instinct.

## Where things live

- **Your AI tool** is the command surface. Plans, builds and reviews happen in
  conversation, through MCP tools. [Every tool, grouped by job](tools.md).
- **The dashboard** at [getpapi.ai](https://getpapi.ai) shows the board, the
  cycles, decisions, reviews and your team.
- **Your data** is stored in PAPI's hosted backend. The remote transport
  authenticates every request, and project data is scoped to the project's
  members.

## What PAPI is not

- **Not a code generator.** Your AI tool writes the code. PAPI keeps the plan,
  the decisions and the loop.
- **Not a ticket system you maintain by hand.** The board is written and read
  by the tools as a side effect of working.
- **Not unattended at the verdict.** Plans and reviews are shaped by you.
  `review_submit` needs a human verdict, and nothing is accepted on your behalf.
