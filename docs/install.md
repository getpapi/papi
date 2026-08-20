# Installing PAPI

PAPI connects to your AI tool as an MCP server. There are two transports:

- **Remote (recommended).** Your tool talks to `mcp.getpapi.ai` over HTTPS.
  Nothing runs on your machine, sign-in happens in the browser, and updates
  reach you automatically.
- **Local (advanced).** Your tool runs `@papi-ai/server` from npm locally.
  Useful when you want the process under your own control.

Pick your tool below. Every path ends the same way: run `setup` once, then
`orient` at the start of every session.

## Claude Code

Connecting is **two steps**. Step 2 is the one people miss — without it the
connection is registered but unusable.

**Step 1 — add the server.** The shortest path is the plugin. Run these inside
Claude Code; there is nothing to copy or edit, and it works from any directory:

```
/plugin marketplace add getpapi/papi
/plugin install papi@papi
```

The plugin carries the server config, so PAPI is registered the moment it
installs. It also brings two skills: `check-mcp`, which diagnoses a connection
that isn't working, and `papi-verify`, which health-checks the current cycle.

Prefer the terminal, or not on Claude Code's plugin system? Add the endpoint
directly instead — same server, same account:

```
claude mcp add --transport http papi https://mcp.getpapi.ai/mcp
```

This registers PAPI. It does **not** sign you in, and **no browser opens**. The
server will show `! Needs authentication`.

**Step 2 — authenticate.** In Claude Code:

> Run `/mcp`, choose **papi**, and pick **Authenticate**. A browser tab opens —
> sign in, and you're connected.

There is no CLI command for this. Only you can approve it.

Once connected:

> Run the `setup` tool to scaffold this project. After setup completes, run
> `orient` and tell me which cycle this project is on.

Prefer to never touch a terminal? Paste this prompt into Claude Code instead:

> Please add PAPI as an MCP server. Run this; it works from any directory:
> `claude mcp add --transport http papi https://mcp.getpapi.ai/mcp`
> That registers it but does not sign me in — so then tell me to run `/mcp`,
> choose papi, and pick Authenticate (you can't do that step for me). Once I
> confirm I'm authenticated, call the `setup` tool to scaffold this project,
> then run `orient` and tell me which cycle this project is on.

## Cursor

Settings → MCP → Add new server, or create `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "papi": {
      "url": "https://mcp.getpapi.ai/mcp"
    }
  }
}
```

On first connection the server sits unauthenticated until you complete the
sign-in prompt for `papi` in the MCP settings panel. It will not sign you in on
its own.

## VS Code (Copilot MCP)

Add to your MCP config (note VS Code uses `servers`, not `mcpServers`):

```json
{
  "servers": {
    "papi": {
      "url": "https://mcp.getpapi.ai/mcp"
    }
  }
}
```

## Windsurf

Add to Windsurf's MCP settings:

```json
{
  "mcpServers": {
    "papi": {
      "url": "https://mcp.getpapi.ai/mcp"
    }
  }
}
```

## Codex CLI

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.papi]
url = "https://mcp.getpapi.ai/mcp"
```

Check it registered with `codex mcp list`. Codex prompts for browser sign-in on
first connection; that step is yours and no agent can do it for you.

To connect with an API key from the dashboard's Connect panel instead of signing
in through the browser:

```toml
[mcp_servers.papi]
url = "https://mcp.getpapi.ai/mcp"
bearer_token_env_var = "PAPI_CONNECTION_TOKEN"

[mcp_servers.papi.http_headers]
x-papi-project-id = "<your-project-id>"
```

Set `PAPI_CONNECTION_TOKEN` in your environment. Codex reads the token from
there, so the key never lands in the config file.

Two field names matter here, because getting them wrong fails silently rather
than loudly. Codex calls these `bearer_token_env_var` and `http_headers`. A
`[mcp_servers.papi.headers]` block is not a field Codex recognises and is
discarded without an error, leaving the connection unauthenticated until the
first tool call returns 401. `bearer_token` is rejected outright for URL
servers. For other headers whose values come from the environment, use
`[mcp_servers.papi.env_http_headers]`, which maps a header name to the env var
holding its value.

## Any other MCP client

Use the generic endpoint `https://mcp.getpapi.ai/mcp`. Clients that support
OAuth discovery will walk you through sign-in. Clients that only support
static headers can use an API key from the [getpapi.ai](https://getpapi.ai)
Connect panel:

```json
{
  "url": "https://mcp.getpapi.ai/mcp",
  "headers": {
    "Authorization": "Bearer YOUR_CONNECTION_TOKEN",
    "x-papi-project-id": "YOUR_PROJECT_ID"
  }
}
```

Keep the token out of version control. It is revocable from the dashboard.

## Local runtime (advanced)

Runs the server on your machine via npx. You need a project id and API key
from the dashboard's Connect panel.

```json
{
  "mcpServers": {
    "papi": {
      "command": "npx",
      "args": ["-y", "@papi-ai/server"],
      "env": {
        "PAPI_PROJECT_ID": "YOUR_PROJECT_ID",
        "PAPI_DATA_API_KEY": "YOUR_CONNECTION_TOKEN"
      }
    }
  }
}
```

## After installing

1. **`setup`** scaffolds the project (first time only).
2. **`orient`** tells you which cycle you're on and what to do next. Run it
   at the start of every session.
3. **`plan`** creates your first cycle when you're ready.

If anything fails, see [troubleshooting.md](troubleshooting.md).
