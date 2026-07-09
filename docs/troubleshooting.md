# Troubleshooting

## Connection

**The MCP server doesn't appear in my tool.**
Restart the tool after adding the config; most clients only read MCP config
at startup. For Claude Code, `claude mcp list` shows what's registered.

**Sign-in tab never opens.**
Your client may not support OAuth discovery, or the browser handoff was
blocked. In Codex, run `codex mcp login papi` to start the flow manually.
Otherwise connect from a client with OAuth support (Claude Code, Cursor,
VS Code, Windsurf) — see [install.md](install.md).

**401 or "unauthorized" on every call.**
The token is missing, expired, or revoked. Create a fresh key in the
dashboard's Connect panel and update your config. Tokens never expire on a
schedule, but revoking one in the dashboard kills it immediately.

**Calls hang or time out.**
Check https://mcp.getpapi.ai/healthz returns 200. If it does, the problem
is local config; if it doesn't, the service is having a moment and the fix
is on us.

## Projects

**My work landed in the wrong project.**
One account can have many projects, and a misconfigured default sends
writes to the wrong one. Fixes, in order:

1. `project_list` to see your projects.
2. `project_switch` with the right project id or slug to repoint the
   session (and folder) at it.
3. For a one-off write, pass `project=<id>` on the individual tool call.

**"No project specified and no default configured."**
PAPI refuses to guess which project to write to. Pass `project=<id>` on the
call, or run `project_switch` to set the default for the session and folder.

**`setup` says a project already exists.**
Setup is idempotent per folder and name; it returns the existing project
rather than creating a duplicate. Run `orient` to confirm you're connected
to the one you expect.

## Sessions

**My assistant forgot where we were.**
Run `orient`. One call returns the cycle number, what's in flight, and the
recommended next action. It's designed to be the first call of every
session.

**The dashboard shows different data than my assistant reports.**
The dashboard and the tools read the same backend; a mismatch is almost
always two different projects selected. Check the project switcher in the
dashboard header against `orient`'s project name.

## Still stuck?

Open an issue on this repo with the tool you're using and what you tried.
Don't include any tokens or credentials.
