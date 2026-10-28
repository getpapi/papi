#!/usr/bin/env node
/**
 * opencode-usage-report: sum the token usage OpenCode wrote to its OWN local database between two
 * moments (task-4842). Same contract as usage-report.mjs: optional, local, read-only, fails closed.
 *
 *   node opencode-usage-report.mjs --from <iso> --to <iso> [--stages '{...}'] [--db <path>]
 *
 * WHAT IT READS. From the `message` table only the creation time and, via json_extract, the model
 * id and the numeric `tokens` object of ASSISTANT messages. The `data` column also holds message
 * text for other roles and parts live in the separate `part` table; neither is selected, read or
 * printed here.
 * FAILS CLOSED. A missing database, an unreadable file, a Node without node:sqlite or an unfamiliar
 * shape prints {"notRecorded":true} and exits 0. Never 0, never an estimate.
 *
 * DATABASE FORMAT (verified against OpenCode on a real machine, Oct 2026; not a public contract).
 * Location: ~/.local/share/opencode/opencode.db. Table `message(id, session_id, time_created ms,
 * time_updated, data json)`. For role "assistant", data.tokens is
 * { total, input, output, reasoning, cache: { read, write } } and data.modelID names the model.
 * `input` excludes cached tokens (total = input + output + reasoning + cache.read + cache.write on
 * every checked row), so the mapping to build_execute is: input_tokens = input + cache.write,
 * output_tokens = output + reasoning, cache_read_tokens = cache.read. Each assistant message is one
 * row, so there is no streamed-chunk double count. Totals are SESSION WINDOWS across every OpenCode
 * session on the machine, not only this project: other work in the window is counted too.
 */
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { buildReport, notRecorded } from './usage-report.mjs';

const SOURCE = 'opencode-database';

export function defaultDbPath(home = homedir()) {
  return join(home, '.local', 'share', 'opencode', 'opencode.db');
}

/** Map one `tokens` object to a usage record, or null when it is not the verified shape. */
export function recordFromRow(id, timeCreated, modelId, tokens) {
  const num = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null);
  if (!id || !Number.isFinite(timeCreated) || !tokens || typeof tokens !== 'object') return null;
  const input = num(tokens.input);
  const output = num(tokens.output);
  const cacheRead = num(tokens.cache?.read);
  const cacheWrite = num(tokens.cache?.write);
  if (input === null || output === null || cacheRead === null || cacheWrite === null) return null;
  return {
    id,
    at: timeCreated,
    model: typeof modelId === 'string' ? modelId : null,
    input,
    output: output + (num(tokens.reasoning) ?? 0),
    cacheRead,
    cacheCreate: cacheWrite,
  };
}

/** Read assistant usage rows inside [fromMs, toMs] from an OpenCode database, read-only. */
export async function readRecords(dbPath, fromMs, toMs) {
  const { DatabaseSync } = await import('node:sqlite');
  const db = new DatabaseSync(dbPath, { readOnly: true });
  try {
    const rows = db.prepare(
      `SELECT id, time_created AS t, json_extract(data, '$.modelID') AS model, json_extract(data, '$.tokens') AS tokens
         FROM message
        WHERE time_created BETWEEN ? AND ? AND json_extract(data, '$.role') = 'assistant'`,
    ).all(fromMs, toMs);
    const out = [];
    for (const r of rows) {
      let tokens = null;
      try { tokens = typeof r.tokens === 'string' ? JSON.parse(r.tokens) : null; } catch { /* skip */ }
      const rec = recordFromRow(r.id, r.t, r.model, tokens);
      if (rec) out.push(rec);
    }
    return out;
  } finally {
    db.close();
  }
}

export async function run(argv) {
  const arg = (k) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : undefined; };
  try {
    const from = arg('from'); const to = arg('to');
    if (!from || !to) return notRecorded('--from and --to are required', SOURCE);
    const fromMs = Date.parse(from); const toMs = Date.parse(to);
    if (!Number.isFinite(fromMs) || !Number.isFinite(toMs)) return notRecorded('invalid window', SOURCE);
    const dbPath = arg('db') ?? defaultDbPath();
    if (!existsSync(dbPath)) return notRecorded('no OpenCode database found', SOURCE);
    const records = await readRecords(dbPath, fromMs, toMs);
    const stages = arg('stages') ? JSON.parse(arg('stages')) : {};
    return buildReport(records, from, to, stages, SOURCE);
  } catch (e) {
    return notRecorded(`could not read the OpenCode database: ${e instanceof Error ? e.message : 'unknown error'}`, SOURCE);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  process.stdout.write(`${JSON.stringify(await run(process.argv.slice(2)), null, 2)}\n`);
}
