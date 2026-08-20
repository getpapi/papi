# PAPI — Agent Setup Prompt

> **You are an AI coding assistant. Install PAPI for the client you are running inside right now, then stop and hand the authentication step back to the user.** Follow this file exactly. Do not invent credentials, do not configure clients you are not running in, and do not claim setup is complete while authentication is still pending.

## What is PAPI?

PAPI (Persistent Adaptive Project Intelligence) is a **remote MCP server** that gives AI coding assistants structured project management — planning, building, reviewing — with context that persists across sessions and across tools.

- **Server name:** `papi`
- **Transport:** Streamable HTTP
- **Endpoint:** `https://mcp.getpapi.ai/mcp`
- **Machine-readable config:** `https://getpapi.ai/install.txt` (plain text — fetch it for the raw connect config; the `/install` page is human HTML)

There is no database to set up and nothing to run locally. PAPI is hosted.

## Rules (read before editing anything)

1. Configure **only the client you are currently running inside** — not every client on the machine.
2. **Read the existing config before editing.** Merge the `papi` entry in; never clobber unrelated MCP servers or settings. Back up any non-empty config first.
3. Do not add a duplicate if `papi` already points at `https://mcp.getpapi.ai/mcp`.
4. Validate JSON / JSONC / TOML after editing.
5. **Never ask the user to paste a token into chat, and never commit a token to version control.**
6. **Do not claim setup is complete while authentication is still required.**
7. **Do not retry tool calls in a loop after an authentication error** — stop and show the user the authenticate step.
8. Prefer the remote endpoint above. Use the local `npx` runtime only if the user explicitly asks.

## Two ways to connect — pick one

### ⭐ Recommended: Bearer one-liner (comes up already authenticated)

This is the fastest, most reliable path for CLI / agent clients. The server is authenticated the moment it is added — **no browser step, no `/mcp` ritual.** The user gets their **connection token** and **project ID** from the **Connect panel** at https://getpapi.ai — do not generate these yourself.

**Claude Code:**
```bash
claude mcp add --transport http papi https://mcp.getpapi.ai/mcp \
  --header "Authorization: Bearer ${PAPI_CONNECTION_TOKEN}" \
  --header "x-papi-project-id: ${PAPI_PROJECT_ID}"
```

For any other HTTP MCP client, use the same endpoint with these two headers:
```json
{
  "url": "https://mcp.getpapi.ai/mcp",
  "headers": {
    "Authorization": "Bearer ${PAPI_CONNECTION_TOKEN}",
    "x-papi-project-id": "${PAPI_PROJECT_ID}"
  }
}
```
Use environment-variable or secret-store interpolation for both values. Never write the real token into a repository file.

### Alternative: OAuth (browser sign-in)

Add the server without headers, then the **user** completes a browser sign-in. Use this if the user prefers browser auth or the client doesn't support static headers. **The connection is NOT usable until the user finishes OAuth — you cannot do this step for them.**

## Install by client

Configure the one you are running in.

### Claude Code
Bearer (recommended) — see the one-liner above. OAuth alternative:
```bash
claude mcp add --transport http papi https://mcp.getpapi.ai/mcp
```
Adding the server does NOT authenticate it and does NOT open a browser on its own. The sign-in that follows is not yours to run:

```
+-- HUMAN STEP — do not run this yourself ----------------------------
| Hand this step to the user. Only a person can complete a browser OAuth.
|
| Tell them, in their own Claude Code session, either:
|   - open the  /mcp  panel, choose papi, and pick Authenticate.
|     Works on every version, so lead with this one; or
|   - on Claude Code v2.1.186+, the mcp-login subcommand against the papi
|     server — the four words are:  claude / mcp / login / papi  — which
|     opens the browser directly.
|
| Do NOT run either yourself, and do not retry in a background shell, a
| subshell, or a new terminal process. An agent shell is not a TTY, so the
| OAuth prompt fails with "stdin isn't a terminal, so authentication can't be
| completed here". Retrying escalates the failure, it does not fix it.
|
| They must sign in with the same account they used on getpapi.ai.
+-- ── end human step ── ---------------------------------------------
```

> If the user is running Claude Code **inside** VS Code (CLI or the Claude Code extension), use THIS section — not the "VS Code (native Copilot MCP)" section below. The tell is `/mcp`: Claude Code has it, native VS Code MCP does not.

### OpenAI Codex
Merge into `~/.codex/config.toml` (TOML, not JSON):
```toml
[mcp_servers.papi]
url = "https://mcp.getpapi.ai/mcp"

# Bearer (recommended — already authenticated).
# Set PAPI_CONNECTION_TOKEN in the environment; Codex reads the token from
# there rather than from the config file, so the key never lands on disk.
bearer_token_env_var = "PAPI_CONNECTION_TOKEN"

[mcp_servers.papi.http_headers]
x-papi-project-id = "<your-project-id>"
```

Codex names these fields `bearer_token_env_var` and `http_headers`. A
`[mcp_servers.papi.headers]` block is not a field Codex knows, and it is dropped
without an error, so the connection comes up unauthenticated and every tool call
returns 401. `bearer_token` is rejected outright for URL servers — use
`bearer_token_env_var`. To source other headers from the environment, use
`[mcp_servers.papi.env_http_headers]`, which maps a header name to the env var
holding its value.
Validate `codex mcp list`. For OAuth instead, omit the headers block — then the sign-in is the user's:

```
+-- HUMAN STEP — do not run this yourself ----------------------------
| Hand this step to the user. Only a person can complete a browser OAuth.
|
| Codex prompts to authorise in the browser on first connection. Codex also
| has an mcp-login subcommand against the papi server — the four words are:
| codex / mcp / login / papi — and that is theirs to run, not yours.
|
| You cannot complete it for them, and there is no agent-side retry that
| will. Wait for them to confirm, then verify with the orient tool.
+-- ── end human step ── ---------------------------------------------
```

### Cursor
Merge into `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "papi": {
      "url": "https://mcp.getpapi.ai/mcp",
      "headers": {
        "Authorization": "Bearer ${PAPI_CONNECTION_TOKEN}",
        "x-papi-project-id": "${PAPI_PROJECT_ID}"
      }
    }
  }
}
```
For OAuth instead: drop the `headers` block, then Cursor Settings → MCP → authenticate `papi`.

### VS Code (native Copilot MCP)
Merge into `.vscode/mcp.json` (VS Code uses `servers`, not `mcpServers`):
```json
{
  "servers": {
    "papi": {
      "url": "https://mcp.getpapi.ai/mcp",
      "headers": {
        "Authorization": "Bearer ${PAPI_CONNECTION_TOKEN}",
        "x-papi-project-id": "${PAPI_PROJECT_ID}"
      }
    }
  }
}
```
> Only use this section for **native** VS Code MCP. If the user is running Claude Code inside VS Code, use the Claude Code section instead.

### Windsurf / Cascade
Merge into `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "papi": {
      "serverUrl": "https://mcp.getpapi.ai/mcp",
      "headers": {
        "Authorization": "Bearer ${PAPI_CONNECTION_TOKEN}",
        "x-papi-project-id": "${PAPI_PROJECT_ID}"
      }
    }
  }
}
```
For OAuth instead: drop `headers`, then Windsurf Settings → Cascade → MCP Servers → authenticate.

### OpenCode
Merge into `opencode.json` / `opencode.jsonc`:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "papi": {
      "type": "remote",
      "url": "https://mcp.getpapi.ai/mcp",
      "enabled": true,
      "headers": {
        "Authorization": "Bearer ${PAPI_CONNECTION_TOKEN}",
        "x-papi-project-id": "${PAPI_PROJECT_ID}"
      }
    }
  }
}
```
Validate `opencode mcp list`. For OAuth instead: drop `headers` and run `opencode mcp auth papi`.

### Hermes Agent
Merge into `~/.hermes/config.yaml` (YAML, not JSON):
```yaml
mcp_servers:
  papi:
    url: "https://mcp.getpapi.ai/mcp"
    headers:
      Authorization: "Bearer ${PAPI_CONNECTION_TOKEN}"
      x-papi-project-id: "${PAPI_PROJECT_ID}"
```
Run `/reload-mcp` in an open session to load it without a restart, and validate with `hermes mcp test papi`.

For OAuth instead: run `hermes mcp add papi --url https://mcp.getpapi.ai/mcp --auth oauth`, then the user authorises in the browser (tokens persist to `~/.hermes/mcp-tokens/papi.json`). That command writes `url` and `auth` only — if the user has more than one PAPI project, add a `headers:` map with `x-papi-project-id` to the YAML afterwards, or every call has to name the project explicitly.

### Any other Streamable HTTP MCP client
Configure a remote server named `papi` at `https://mcp.getpapi.ai/mcp`. Prefer the two bearer headers above. If the client only does OAuth, add it without headers and have the user complete the client's browser auth flow.

## After connecting — run the first tool

**Connecting is not the same as running a tool.** Once `papi` is connected and authenticated, tell the user's tool to:

1. Run `setup` — initialises PAPI for the project (Product Brief + a CLAUDE.md with the workflow).
2. Run `orient` — returns the current cycle, task counts, and the recommended next action.

If `orient` returns cycle data, PAPI is working. If the tool reports the PAPI tools don't exist, the server is **added but not authenticated** — send the user back to the authenticate step (do not retry in a loop).

## Verify

- Config still parses; exactly one `papi` entry; endpoint is exactly `https://mcp.getpapi.ai/mcp`; unrelated settings intact.
- State is one of: connected · awaiting authentication · disabled · failing. If awaiting authentication, show the exact per-client authenticate action and **stop** — do not label this complete.

## Adding a second project

Each project has its own **project ID** (same connection token). Grab the new project's ID from the Connect panel at https://getpapi.ai, create a config in that project's root with the new `x-papi-project-id`, and restart the client.

## Optional: local runtime (only if explicitly requested)

PAPI can run as a local `npx` process instead of the remote endpoint. Use this **only** when the user asks for it. Credentials come from the dashboard Connect panel.
```json
{
  "mcpServers": {
    "papi": {
      "command": "npx",
      "args": ["-y", "@papi-ai/server"],
      "env": {
        "PAPI_PROJECT_ID": "${PAPI_PROJECT_ID}",
        "PAPI_DATA_API_KEY": "${PAPI_CONNECTION_TOKEN}"
      }
    }
  }
}
```
Add the config file (e.g. `.mcp.json`) to `.gitignore` — it references credentials.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Tool says "connected" but PAPI tools are missing | Server added but not authenticated (OAuth path) | **HUMAN STEP** — ask the user to run their client's authenticate action (in Claude Code, the /mcp panel → papi → Authenticate). Do not run it yourself. Or switch to the bearer one-liner, which needs no authenticate step. |
| Authentication error on a tool call | OAuth incomplete or expired | **HUMAN STEP** — ask the user to re-authenticate. Do NOT reinstall, and do NOT retry in a loop; an agent shell cannot complete OAuth. |
| `papi` server missing after restart | Config not loaded / wrong path | Confirm the config path for your client and that the endpoint ends in `/mcp`; restart the client. |
| Config was overwritten | Merge clobbered the file | Restore the backup and merge only the `papi` entry. |
| Wrong PAPI project | Wrong `x-papi-project-id` | Check the ID against the Connect panel at https://getpapi.ai. |

## References

- Dashboard / Connect panel: https://getpapi.ai
- Repository: https://github.com/getpapi/papi
- This file (raw): https://github.com/getpapi/papi/blob/main/llms-install.md
- MCP endpoint: https://mcp.getpapi.ai/mcp
