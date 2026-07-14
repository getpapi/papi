# PAPI

<!-- mcp-name: io.github.getpapi/papi -->

[![smithery badge](https://smithery.ai/badge/cathal/getpapi)](https://smithery.ai/servers/cathal/getpapi)

**PAPI keeps you in control of what you're building, across every AI tool you and your team use.**

AI coding tools are great at writing code and terrible at remembering why. Every new session starts from zero: you re-explain the project, the decisions, the plan. PAPI is the layer that fixes that. It gives your AI assistant structured project memory (plans, builds, reviews, decisions) that persists across sessions, tools, and teammates.

You connect it once. From then on, your assistant starts every session knowing which cycle you're on, what's in flight, and what to do next.

## Quick start

**Let your AI install it.** Paste this to your assistant — Cursor, Claude Code, Windsurf, Codex, VS Code, or any other MCP client:

> Install PAPI by following https://github.com/getpapi/papi/blob/main/llms-install.md

That's the whole install. Your assistant reads the instructions for whichever tool it's running in and wires up the connection itself.

**Then authenticate — this part is yours.** PAPI signs in over OAuth, and no AI can click through a browser consent screen for you. Your assistant will tell you exactly where to click; until you do, the server sits at `Needs authentication` and no tool call will work. This is the step people miss.

Once you're connected, tell your assistant:

> Run the `setup` tool to scaffold this project, then run `orient` and tell me which cycle this project is on.

### Prefer to wire it up yourself?

Every tool takes the same streamable-HTTP endpoint, `https://mcp.getpapi.ai/mcp`. In Claude Code that's:

```
claude mcp add --transport http papi https://mcp.getpapi.ai/mcp
```

then `/mcp` → **papi** → **Authenticate**.

Per-tool config for Cursor, VS Code, Windsurf, Codex, and any generic MCP client is in [docs/install.md](docs/install.md).

## What you get

- **plan** breaks your goals into a cycle of right-sized tasks, each with a build handoff your assistant can execute directly.
- **build** tracks what was built, what surprised you, and what was discovered along the way.
- **review and release** close the loop, so every cycle feeds the next plan.
- **strategy reviews** every few cycles step back and check direction, not just velocity.
- **A dashboard** at [getpapi.ai](https://getpapi.ai) shows your cycles, board, and decisions, so you can see the state of the project without asking.

The methodology is the product: a plan, build, review, release loop your assistant runs with you, with memory that compounds. PAPI has been built with PAPI for 320+ cycles.

## Tools

PAPI exposes these MCP tools to your assistant. The whole loop is a handful of calls.

**Core loop**
- **orient** — one call returns the current cycle, what's in flight, and the recommended next action. Run it at the start of every session.
- **setup** — scaffold PAPI onto a new project.
- **plan** — break goals into a cycle of right-sized tasks, each with a build handoff your assistant can execute directly.
- **build_list** — list the current cycle's tasks and their handoffs.
- **build_execute** — start a task (creates a branch and handoff) and complete it (records the build report).
- **review_list** / **review_submit** — surface finished builds and record accept / request-changes / reject verdicts.
- **release** — merge completed work and roll the cycle forward.

**Board and backlog**
- **board_view** — read the project board and any task.
- **board_edit** — change a task's status, cycle, priority, or notes.
- **ad_hoc** — record quick work done outside the cycle so it shows in project history.
- **idea** — capture a feature, bug, or research note into the backlog.
- **bug** — file a bug against the board.

**Strategy and intelligence**
- **strategy_review** — step back every few cycles to check direction, not just velocity.
- **strategy_change** — record an Active Decision, with supersede history.
- **zoom_out** — a periodic retrospective across many cycles.

**Docs and projects**
- **doc_register** / **doc_search** — register and find project reference docs.
- **project_list** / **project_switch** / **project_create** — manage multiple PAPI projects.

## Documentation

| Doc | What it covers |
|-----|----------------|
| [docs/install.md](docs/install.md) | Install paths for every supported tool |
| [docs/how-it-works.md](docs/how-it-works.md) | Cycles, handoffs, decisions, and how the pieces fit |
| [docs/troubleshooting.md](docs/troubleshooting.md) | Connection problems, project routing, common fixes |
| [llms-install.md](llms-install.md) | Machine-readable install instructions for AI assistants |

## Links

- Website and dashboard: [getpapi.ai](https://getpapi.ai)
- This repo is documentation only. The PAPI engine is closed source; the `@papi-ai/server` package on npm is the supported local runtime.
- **Licence:** the contents of this repo (docs, guides, config examples, Dockerfile) are MIT. That licence covers this repository only — not the PAPI engine, and not the PAPI name or logo, which are trademarks.

Questions or stuck? Open an issue here.
