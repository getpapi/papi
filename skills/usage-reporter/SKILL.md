---
name: usage-reporter
description: Report the token usage of a build to PAPI from your AI client's own local transcript. Optional. Use when completing a build and you want tokens recorded, or when asked what a task or stage cost in tokens. Reads only numeric usage, never prompts or responses.
---

# usage-reporter

PAPI cannot see how many tokens a build used: the MCP call only sees its own request, and a model cannot read its own usage. The numbers exist in your AI client's local transcript. This skill sums them for a window and hands you the three numbers `build_execute` already accepts.

It is optional. If it cannot run, complete the build normally: tokens are recorded as **Not recorded**, never as 0 and never estimated.

## What it supports today

| Client | Source | Status |
|---|---|---|
| Claude Code | `~/.claude/projects/<project path with dashes>/*.jsonl` | Verified. Every assistant message carries input, output, cache read and cache creation tokens, a timestamp and the model. |
| Codex, OpenCode | not verified | No equivalent transcript was available to check. A follow-up task exists for each client that is confirmed to write usage. Until then these report Not recorded. |

## How to use it

1. Note the build window: `started_at` when you called `build_execute` to start, and the time you complete it.
2. Run the script with that window (optionally with the stage windows):

```bash
node .claude/skills/usage-reporter/scripts/usage-report.mjs \
  --from 2026-10-14T09:00:00Z --to 2026-10-14T11:30:00Z
```

3. If the result has `"notRecorded": false`, pass its `buildExecute` object into the completing `build_execute` call as `input_tokens`, `output_tokens` and `cache_read_tokens`. If `"notRecorded": true`, pass nothing.

Stage calls (`plan`, `review_submit`, `release`, `strategy_review`): each of these tool responses ends with a line naming the time the next window opened. On your next stage call, run the script with `--from <that time> --to <now>` and pass its `buildExecute` object, your `model` and `window_started_at` as the optional `stage_usage` argument. The server stores it on that call, so no one runs anything by hand and nothing is estimated.

Per-stage totals: pass `--stages '{"plan":["<iso>","<iso>"],"build":[...],"review":[...],"release":[...]}'` using the plan, build, review and release tool-call timestamps. Stages are assigned in order without overlap; whatever falls outside every stage is reported as `unassigned`, so the stages plus `unassigned` always equal the window total.

## What `input_tokens` means

`input_tokens` is every prompt token that was not read from cache: the model's `input_tokens` plus `cache_creation_input_tokens`. `cache_read_tokens` is the cached part, kept apart because it is billed very differently. Totals are **session windows**: any other turns inside the window are counted too, and this is not a per-call figure.

## Privacy: exactly what is read and what leaves the machine

- **Read, locally:** for each assistant record only the numeric usage fields, the timestamp, the message id and the model name. Prompts, responses, file contents and tool output are never read into the result or printed.
- **Printed:** one JSON object with token counts and the model name.
- **Leaves the machine:** nothing, unless you copy `input_tokens`, `output_tokens` and `cache_read_tokens` into the `build_execute` call yourself. Those three integers are the whole payload, validated and capped by the server.
- The script makes no network call.

## Caveats

- The transcript format is not a public contract. The script checks every record and degrades to Not recorded on anything unfamiliar.
- Claude Code writes a streamed message several times with the same `message.id`. The script keeps the last record per id; summing every line would roughly double the output tokens.
