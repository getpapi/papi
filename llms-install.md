# PAPI installation instructions for AI assistants

You are installing PAPI, an MCP server that gives this project persistent
planning memory (cycles, plans, builds, reviews).

**Connecting is TWO steps. Step 2 is REQUIRED — step 1 alone leaves the
connection unauthenticated and unusable.**

1. **Add the server.** You can do this.
2. **Authenticate.** You **cannot** do this. OAuth needs a human to approve it
   in a browser, and there is no CLI subcommand for it. After step 1 the server
   sits at `Needs authentication`. **You must tell the user to complete it.**

Do not tell the user a browser opens automatically. It does not.

## Claude Code

**Step 1 — add the server.** Run from the project root:

```
claude mcp add --transport http papi https://mcp.getpapi.ai/mcp
```

This registers PAPI. It does **not** sign the user in. The server will show
`! Needs authentication`.

**Step 2 — tell the user to authenticate.** Say, in your own words:

> Run `/mcp`, choose **papi**, and pick **Authenticate**. A browser tab opens —
> sign in with the same account you used on getpapi.ai, and you're connected.

Wait for the user to confirm they've done it. Only then:

1. Call the `setup` tool to scaffold this project.
2. Call `orient` and report which cycle the project is on.

## Codex CLI

**Step 1.** Add to `~/.codex/config.toml`:

```toml
[mcp_servers.papi]
url = "https://mcp.getpapi.ai/mcp"
```

**Step 2.** Restart Codex, then tell the user they must complete the browser
sign-in prompt on first connection. Then run `setup`, then `orient`.

## Cursor

**Step 1.** Add via Settings → MCP → Add new server, or write `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "papi": {
      "url": "https://mcp.getpapi.ai/mcp"
    }
  }
}
```

**Step 2.** Tell the user to open the MCP settings panel and complete the
sign-in for `papi`. The connection is unusable until they do. Then run `setup`,
then `orient`.

## VS Code (Copilot MCP)

**Step 1.**

```json
{
  "servers": {
    "papi": {
      "url": "https://mcp.getpapi.ai/mcp"
    }
  }
}
```

**Step 2.** Tell the user to complete the sign-in prompt for `papi`. Then run
`setup`, then `orient`.

## Windsurf

**Step 1.**

```json
{
  "mcpServers": {
    "papi": {
      "url": "https://mcp.getpapi.ai/mcp"
    }
  }
}
```

**Step 2.** Tell the user to complete the sign-in prompt for `papi`. Then run
`setup`, then `orient`.

## Any other MCP client

Generic config: streamable HTTP endpoint at `https://mcp.getpapi.ai/mcp` with
OAuth discovery. The user must complete the browser sign-in — you cannot.

If the client only supports static headers, the user can create an API key from
the Connect panel at https://getpapi.ai and supply:

```json
{
  "url": "https://mcp.getpapi.ai/mcp",
  "headers": {
    "Authorization": "Bearer YOUR_CONNECTION_TOKEN",
    "x-papi-project-id": "YOUR_PROJECT_ID"
  }
}
```

This path needs no browser step. Both values come from the dashboard's Connect
panel. Never commit them.

## Local runtime (advanced)

A local process instead of the remote transport. Uses an API key, so there is
no browser step:

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

## After the user has authenticated

1. `setup` scaffolds the project (first time only).
2. `orient` is a single call that returns cycle state and the recommended next
   action. Run it at the start of every session.
3. `plan` creates the first cycle when the user is ready to build.

If a tool call returns an authentication error, the user has not completed
step 2. Send them back to it — do not retry.

Report the result of `orient` back to the user in plain language.
