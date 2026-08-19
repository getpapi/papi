---
name: check-mcp
description: Diagnose why PAPI tools are missing or failing. Use when the user says "check mcp", "is papi connected", "papi isn't working", "mcp status", or when PAPI tools are expected but do not appear in the available tools list.
---

# Is PAPI connected?

PAPI runs as a hosted MCP server at `https://mcp.getpapi.ai/mcp`. Nothing runs on the
user's machine, so every failure is one of three things: the server is not registered,
the user is not authenticated, or the account has no project bound.

Work through the steps in order and stop at the first one that fails.

## Step 1: Are the tools there?

Look at the available tools list for PAPI tools — `orient`, `board_view`, `plan`.

When PAPI is installed as a plugin, tool names are namespaced by the plugin, so they
appear as `mcp__plugin_papi_papi__orient` rather than `mcp__papi__orient`. Both mean
the same server. A bare `mcp__papi__*` name means PAPI was added directly with
`claude mcp add`, not through the plugin — that also works.

- **Tools present** → skip to Step 3.
- **No PAPI tools at all** → go to Step 2.

## Step 2: Is the server registered?

```bash
claude mcp list
```

- **`papi` is absent** → the plugin is not enabled, or was never installed. Check
  `claude plugin list` for `papi@papi`. Install with:
  ```
  /plugin marketplace add getpapi/papi
  /plugin install papi@papi
  ```
- **`papi` is listed but shows a connection error** → the transport is reachable but
  the session is not authorised. Go to Step 3.

## Step 3: Is the user authenticated?

The hosted server requires a PAPI account. Registering the server does not sign the
user in — this is the single most common cause of "PAPI is installed but nothing works".

Ask the user to run:

```
/mcp
```

then select `papi` and choose **Authenticate**. A browser opens for sign-in. This is
interactive and cannot be completed on the user's behalf.

If they do not have an account yet, they create one at https://getpapi.ai — the MCP
server authenticates against the website account, so there is no separate credential.

## Step 4: Is a project bound?

Call `orient`.

- **Returns cycle state** → PAPI is healthy. Report and stop.
- **Asks which project to use** → the account has more than one project and the
  connection has no default. Put the list to the user, then re-call with their choice
  and run `project_switch` to make it stick.
- **Reports an empty board / no cycles** → the account is connected but this project
  has never been set up. Call `setup`.

## Step 5: Report

Close with exactly one of these:

- **Healthy** — server registered, authenticated, project bound. Name the current cycle.
- **Not authenticated** — server registered but signed out. Next action: `/mcp` → papi → Authenticate.
- **Not installed** — no `papi` server registered. Next action: the two install lines from Step 2.
- **No project** — connected but nothing set up here. Next action: `setup`.

Always end with the single next action, not a list of possibilities.
