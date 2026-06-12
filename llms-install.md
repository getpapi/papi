# PAPI installation instructions for AI assistants

You are installing PAPI, an MCP server that gives this project persistent
planning memory (cycles, plans, builds, reviews). Follow the path for the
tool you are running in. Prefer the remote transport; it needs no local
process and authenticates via browser sign-in (OAuth).

## Claude Code

Run:

```
claude mcp add --transport sse papi https://mcp.getpapi.ai/sse
```

A browser tab opens for sign-in. After the connection succeeds:

1. Call the `setup` tool to scaffold this project.
2. Call `orient` and report which cycle the project is on.

## Codex CLI

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.papi]
url = "https://mcp.getpapi.ai/mcp"
```

Restart Codex. Sign-in happens in the browser on first connection. Then run
`setup`, then `orient`.

## Cursor

Add to the MCP settings (Settings → MCP → Add new server), or write to
`.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "papi": {
      "url": "https://mcp.getpapi.ai/mcp"
    }
  }
}
```

Sign-in opens in the browser on first connection. Then run `setup`, then
`orient`.

## VS Code (Copilot MCP)

```json
{
  "servers": {
    "papi": {
      "url": "https://mcp.getpapi.ai/mcp"
    }
  }
}
```

Then run `setup`, then `orient`.

## Windsurf

```json
{
  "mcpServers": {
    "papi": {
      "url": "https://mcp.getpapi.ai/mcp"
    }
  }
}
```

Then run `setup`, then `orient`.

## Any other MCP client

Generic config: streamable HTTP/SSE endpoint at `https://mcp.getpapi.ai/mcp`
with OAuth discovery. If the client only supports static headers, the user
can create an API key from the dashboard at https://getpapi.ai and supply:

```json
{
  "url": "https://mcp.getpapi.ai/mcp",
  "headers": {
    "Authorization": "Bearer YOUR_CONNECTION_TOKEN",
    "x-papi-project-id": "YOUR_PROJECT_ID"
  }
}
```

Both values come from the dashboard's Connect panel. Never commit them.

## Local runtime (advanced)

For users who prefer a local process over the remote transport:

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

## After any install

1. `setup` scaffolds the project (first time only).
2. `orient` is a single call that returns cycle state and the recommended
   next action. Run it at the start of every session.
3. `plan` creates the first cycle when the user is ready to build.

Report the result of `orient` back to the user in plain language.
