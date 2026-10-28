# PAPI tools

Every tool the PAPI MCP server exposes, grouped by the job it does. The server version is `@papi-ai/server` 0.402.157; the live server may expose a few more.

The core loop is `orient` → `plan` → `build_execute` → `review_task` → `review_submit` → `release`. The rest are the supporting tools for teams, decisions and documents.

**79 tools.**

## Start a session

Orient at the start of every session, and check who else is working.

| Tool | What it does |
|---|---|
| `orient` | Session orientation — run this FIRST at session start before any other tool. |
| `papi` | Say "papi" to check in with Papi — an alias for `orient`. |
| `session_whoami` | Read the identity this session is acting as on the current project: the acting user (id, display name, role), the transport, the announced session… |
| `session_announce` | Announce (or renew) this session's presence on the current project — what task/branch/files it is working on. |
| `session_list` | List every session currently active on this project — its task, branch, and files touched — so you can see a collision risk before starting work. |
| `session_message_send` | Send a short structured message to a session, task, this project, or all sessions on this project. |
| `session_message_list` | Read messages visible to your active session: messages addressed to it or its current task, project/broadcast messages, and its own sends. |
| `session_message_ack` | Acknowledge a message visible to your active session. |
| `tutorial_mode` | Read or change your personal tutorial mode. |
| `init` | Write the MCP config file that connects this project to PAPI. |

## Set up and join

Create a project, or join one a teammate already set up.

| Tool | What it does |
|---|---|
| `setup` | Create a project: writes the Product Brief, the first decisions and conventions, and the workflow instructions your assistant follows. |
| `join` | Join a project that already exists, as a new team member. |
| `project_create` | Create an EMPTY PAPI project for the current workspace (no plan, no seeded backlog) and return its id. |
| `project_list` | List the PAPI projects on your account (id, name, slug, mapped folder). |
| `project_switch` | Select a project you own by id or slug for the active session. |
| `project_edit` | Rename a project and/or change its linked GitHub repo URL — the MCP self-service counterpart to the dashboard project settings. |
| `project_export` | Export project knowledge as an Open Knowledge Format (OKF) v0.1 bundle. |
| `discovery_intake` | Submit your answers to the project's discovery questions, answered in your own AI session, so they roll up into the shared brief attributed to you. |
| `brief_update` | Amend the project Product Brief in place, without regenerating it. |
| `backlog_import` | Import an existing backlog from another tool into PAPI as Backlog tasks, removing the "start from an empty board" wall. |

## Plan

Turn the backlog into a cycle with a handoff for every task.

| Tool | What it does |
|---|---|
| `plan` | Turn a backlog into one scoped cycle of work, with a written spec for every task in it. |
| `handoff_generate` | Generate BUILD HANDOFFs for cycle tasks that don't have one yet. |
| `cycle_append` | Append selected backlog tasks to the currently active cycle without creating a new cycle. |
| `scope_brief` | Decompose a brief-class task (Large/XL, too large to build directly) into a structured scope document. |
| `planning_log` | View bounded project cycle-log history, or edit/delete one caller-owned entry by its stable UUID. |
| `idea` | Capture an idea as a Backlog task. |
| `board_reconcile` | Holistic board review — backlog + deferred tasks in one pass. |
| `hierarchy_update` | Create or update a horizon, stage, or phase in the project hierarchy (AD-14). |

## Build

Pick a task, build it against its handoff, and record what happened.

| Tool | What it does |
|---|---|
| `build_list` | List cycle tasks that have BUILD HANDOFFs ready for execution. |
| `build_describe` | Show the full BUILD HANDOFF for a specific task, including scope, acceptance criteria, and implementation guidance. |
| `build_execute` | Build one task with its spec, its branch and its record kept for you. |
| `build_cancel` | Cancel a build task with a reason. |
| `ad_hoc` | Record work done outside the normal cycle. |
| `board_view` | View the Board. |
| `board_edit` | Edit fields on an existing task. |
| `board_deprioritise` | Remove a task from the current cycle. |
| `board_archive` | Archive tasks from the Board. |
| `board_delete` | Delete one never-started task with no cycle membership, build/review evidence, dependents, discovery links or recorded history. |
| `task_claim` | Claim a task from the shared org Pool into your personal backlog (assignee = you). |
| `task_unclaim` | Release a task you claimed back to the shared Pool (clears assignee). |
| `task_transfer` | Change task ownership in the current project — reassign to another eligible contributor, assign an unassigned task, or (owner only) unassign a task. |
| `task_move` | Move a task from the current project to another project you own. |
| `task_history` | Read one task’s status/cycle transition history — who moved it, when, and which tool did it. |

## Review

Get the review brief, then record the human verdict.

| Tool | What it does |
|---|---|
| `review_list` | List tasks ready for your sign-off — shows completed builds waiting for approval or feedback. |
| `review_task` | Get the review brief for a task: call once a task is In Review, before review_submit. |
| `review_claim` | Claim a Pending Review from the shared cross-user review queue so you are the one reviewing it. |
| `review_submit` | Record the human verdict on a completed build: accept, request changes, or reject. |
| `learning_action` | Mark a cycle learning as actioned (linking it to a task or idea) or list unactioned learnings. |
| `discovered_issue_resolve` | Mark a discovered_issue (cycle_learnings row, category="issue") as resolved. |
| `bug` | Report a bug in PAPI, or submit an idea. |
| `bug_list` | List the upstream bug/idea reports YOU filed to the PAPI maintainers (via the `bug` tool with report=true or an auto-routed PAPI bug), newest first. |
| `bug_resolve` | Set the triage status (and an optional resolution note) for one or more upstream bug/idea reports YOU filed, in a single call. |

## Release

Close the cycle, with a versioned release or without one.

| Tool | What it does |
|---|---|
| `release` | Cut a versioned release — creates a git tag, generates CHANGELOG.md, and pushes to remote. |
| `close_cycle` | Close the caller's accepted cycle with a durable, unversioned CHANGELOG.md entry. |

## Strategy and decisions

Check direction, record decisions, and read the reasoning behind them.

| Tool | What it does |
|---|---|
| `strategy_review` | Run a Strategy Review — assesses project direction, velocity, and Active Decisions. |
| `strategy_change` | Apply a strategic shift to the project. |
| `strategy_agenda` | Queue topics for the next strategy review. |
| `zoom_out` | Run a Zoom-Out Retrospective — a higher-level meta-retrospective that sits above strategy reviews. |
| `ad_view` | View one or all Active Decisions with full bodies. |
| `decision_resolve` | Act on a `proposed` decision from your terminal — cast your position (agree/object/abstain) or transition it (resolve/withdraw). |
| `query` | Run a bounded, read-only structured query against your PAPI project. |

## Conventions and docs

Settled build rules, and the project documents behind them.

| Tool | What it does |
|---|---|
| `convention_declare` | Record a settled build rule once so every future task on this project is told about it, instead of re-explaining it each session. |
| `convention_list` | List the build rules this project has declared, with the id needed to remove one. |
| `convention_edit` | Edit an existing project build rule in place. |
| `convention_remove` | Remove a declared build rule so it stops appearing in future builds. |
| `doc_register` | Register or update a document in the doc registry. |
| `doc_edit` | Edit an existing registered doc IN PLACE — same doc id, same row, no duplicate. |
| `doc_search` | Search the doc registry for documents by type, tags, keyword, or pending actions. |
| `doc_scan` | Scan docs/ and plans directories for unregistered .md files. |
| `doc_read` | Read a registered document's stored BODY back out of the database, and optionally restore it to disk. |
| `doc_delete` | Permanently delete a registered doc. |
| `doc_reorder` | Persist the display order of docs within this project. |
| `doc_action_promote` | Promote a single pending action from a registered doc into a Backlog task. |

## Team and tooling

Contributors, roles, sibling projects and the harness inventory.

| Tool | What it does |
|---|---|
| `contributor_list` | List the current project's contributors (any project member). |
| `contributor_add` | Add a contributor to a project by email, or change an existing member's role (owner-only). |
| `contributor_remove` | Remove a contributor from the current project by email (owner-only). |
| `agent_list` | List the sub-agents discovered in the project's `.claude/agents/*.md` files (read-only). |
| `inventory_sync` | Sync this project's harness inventory — skills, sub-agents, hooks, and MCP tools — to the database so the dashboard can surface it. |
| `get_sibling_ads` | Read Active Decisions from sibling PAPI projects that share the same Supabase instance. |

