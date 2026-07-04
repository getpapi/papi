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

Paste this into a terminal (works from any directory):

```
claude mcp add --transport http papi https://mcp.getpapi.ai/mcp
```

A browser tab opens so you can sign in. Then in Claude Code:

> Run the `setup` tool to scaffold this project. After setup completes, run
> `orient` and tell me which cycle this project is on.

Prefer to never touch a terminal? Paste this prompt into Claude Code instead:

> Please add PAPI as an MCP server. Run this; it works from any directory:
> `claude mcp add --transport http papi https://mcp.getpapi.ai/mcp`
> Claude Code will open a browser tab so I can sign in. After that, call the
> `setup` tool to scaffold this project, then run `orient` and tell me which
> cycle this project is on.

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

First connection opens a browser tab for sign-in.

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
