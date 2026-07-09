# Installing PAPI

PAPI connects to your AI tool as an MCP server. It is a hosted server: your
tool talks to `mcp.getpapi.ai` over HTTPS, nothing runs on your machine,
sign-in happens in the browser (OAuth), and updates reach you automatically.
There are no tokens to paste and nothing to install locally.

Pick your tool below. Every path ends the same way: run `setup` once, then
`orient` at the start of every session.

## Claude Code

Paste this into a terminal (works from any directory):

```
claude mcp add --transport sse papi https://mcp.getpapi.ai/sse
```

A browser tab opens so you can sign in. Then in Claude Code:

> Run the `setup` tool to scaffold this project. After setup completes, run
> `orient` and tell me which cycle this project is on.

Prefer to never touch a terminal? Paste this prompt into Claude Code instead:

> Please add PAPI as an MCP server. Run this; it works from any directory:
> `claude mcp add --transport sse papi https://mcp.getpapi.ai/sse`
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

Restart Codex. If a browser sign-in does not open on first connection, run
`codex mcp login papi` to start the OAuth flow.

## Any other MCP client

Use the generic endpoint `https://mcp.getpapi.ai/mcp`. Any MCP client with
OAuth support will walk you through browser sign-in on first connection.

## After installing

1. **`setup`** scaffolds the project (first time only).
2. **`orient`** tells you which cycle you're on and what to do next. Run it
   at the start of every session.
3. **`plan`** creates your first cycle when you're ready.

If anything fails, see [troubleshooting.md](troubleshooting.md).
