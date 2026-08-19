---
name: check-mcp
description: Diagnose why PAPI tools are missing or failing. Use when the user says "check mcp", "is papi connected", "papi isn't working", "mcp status", or when PAPI tools are expected but do not appear in the available tools list.
---

# Is PAPI connected?

PAPI runs as a hosted MCP server at `https://mcp.getpapi.ai/mcp`. Nothing runs on the
user's machine, so a failure is one of three things: the server is not registered, the
user is not signed in, or the account has no project bound.

Work through the steps in order and stop at the first one that fails. The checks are the
same in every client; only the commands differ, so use the ones for the tool you are
running in.

## Step 1: Are the tools there?

Look at the available tools list for PAPI tools such as `orient`, `board_view` and `plan`.

Tool names vary by how PAPI was installed. Installed as a plugin in Claude Code they are
namespaced `mcp__plugin_papi_papi__orient`; added directly they are `mcp__papi__orient`;
other clients use their own prefixes. All of them mean the same server.

If PAPI tools are present, skip to Step 3. If none are, go to Step 2.

## Step 2: Is the server registered?

Check the client's MCP configuration.

- **Claude Code**: run `claude mcp list`. To install, run `/plugin marketplace add getpapi/papi`
  then `/plugin install papi@papi`, or `claude mcp add --transport http papi https://mcp.getpapi.ai/mcp`.
- **Cursor**: open Settings, then MCP, and look for `papi`. Config lives in `~/.cursor/mcp.json`
  or `.cursor/mcp.json` in the project.
- **VS Code, Windsurf, Codex and others**: check that client's MCP config for a `papi` entry
  pointing at `https://mcp.getpapi.ai/mcp`. Per-client instructions are at
  https://getpapi.ai/docs/install.

If `papi` is absent, PAPI is not installed. Add it, then restart the client, since most
clients only read MCP config at startup.

If `papi` is listed but shows an error or "needs authentication", go to Step 3.

## Step 3: Is the user signed in?

The hosted server requires a PAPI account. Registering the server does not sign anyone in,
and this is the most common cause of "PAPI is installed but nothing works".

Sign-in is interactive and cannot be done on the user's behalf.

- **Claude Code**: run `/mcp`, choose **papi**, pick **Authenticate**. A browser tab opens.
- **Other clients**: the client prompts for OAuth on first use. If it never does, the client
  may not support OAuth discovery. Fall back to an API key from the dashboard's Connect
  panel, set as a bearer token in the MCP config. See https://getpapi.ai/docs/install.

If the user has no account, they create one at https://getpapi.ai. The MCP server
authenticates against the website account, so there is no separate credential.

## Step 4: Is a project bound?

Call `orient`.

- Returns cycle state: PAPI is healthy. Report and stop.
- Asks which project to use: the account has more than one project and this connection has
  no default. Put the list to the user, then call again with their choice and run
  `project_switch` to make it stick.
- Reports an empty board or no cycles: the account is connected but this project has never
  been set up. Call `setup`.

## Step 5: Report

Close with exactly one of these, and end on the single next action rather than a list of
possibilities.

- **Healthy**: registered, signed in, project bound. Name the current cycle.
- **Not signed in**: registered but signed out. Next action is the sign-in step for this client.
- **Not installed**: no `papi` server registered. Next action is the install step for this client.
- **No project**: connected, but nothing set up here. Next action is `setup`.
