# PAPI installation instructions for AI assistants

You are installing PAPI, an MCP server that gives this project persistent
planning memory (cycles, plans, builds, reviews). PAPI is a hosted MCP
server. There is one install path: connect to the remote transport over
HTTPS and authenticate via browser sign-in (OAuth). Nothing runs locally,
and there are no tokens to paste. Follow the section for the tool you are
running in.

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

Restart Codex. If a browser sign-in does not open on first connection, run
`codex mcp login papi` to start the OAuth flow. Then run `setup`, then
`orient`.

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

Point the client at the streamable HTTP endpoint
`https://mcp.getpapi.ai/mcp` and let it complete OAuth discovery to sign in
through the browser. Any MCP client with OAuth support connects the same
way. Then run `setup`, then `orient`.

## After any install

1. `setup` scaffolds the project (first time only).
2. `orient` is a single call that returns cycle state and the recommended
   next action. Run it at the start of every session.
3. `plan` creates the first cycle when the user is ready to build.

Report the result of `orient` back to the user in plain language.
