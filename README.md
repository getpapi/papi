# PAPI

**PAPI keeps you in control of what you're building, across every AI tool you and your team use.**

AI coding tools are great at writing code and terrible at remembering why. Every new session starts from zero: you re-explain the project, the decisions, the plan. PAPI is the layer that fixes that. It gives your AI assistant structured project memory (plans, builds, reviews, decisions) that persists across sessions, tools, and teammates.

You connect it once. From then on, your assistant starts every session knowing which cycle you're on, what's in flight, and what to do next.

## Quick start

PAPI connects to your AI tool as an MCP server. The fastest path is Claude Code:

```
claude mcp add --transport http papi https://mcp.getpapi.ai/mcp
```

A browser tab opens, you sign in, and you're connected. Then tell your assistant:

> Run the `setup` tool to scaffold this project, then run `orient` and tell me which cycle this project is on.

Using Cursor, VS Code, Windsurf, or Codex? See [docs/install.md](docs/install.md).

**Letting your AI do the install?** Point it at [llms-install.md](llms-install.md) and say "install this".

## What you get

- **plan** breaks your goals into a cycle of right-sized tasks, each with a build handoff your assistant can execute directly.
- **build** tracks what was built, what surprised you, and what was discovered along the way.
- **review and release** close the loop, so every cycle feeds the next plan.
- **strategy reviews** every few cycles step back and check direction, not just velocity.
- **A dashboard** at [getpapi.ai](https://getpapi.ai) shows your cycles, board, and decisions, so you can see the state of the project without asking.

The methodology is the product: a plan, build, review, release loop your assistant runs with you, with memory that compounds. PAPI has been built with PAPI for 280+ cycles.

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

Questions or stuck? Open an issue here.
