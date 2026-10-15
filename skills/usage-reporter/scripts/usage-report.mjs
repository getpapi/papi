#!/usr/bin/env node
/**
 * usage-report: sum the token usage your AI client wrote to its OWN local transcript between two
 * moments, so a build can report it (task-4836). Optional, local, and read-only.
 *
 *   node usage-report.mjs --from <iso> --to <iso> [--stages '{"build":["<iso>","<iso>"]}'] [--dir <path>] [--cwd <path>]
 *
 * WHAT IT READS. Only numeric usage fields, the timestamp, the message id and the model name from
 * Claude Code assistant records. It never reads, stores or prints prompts or responses.
 * WHAT IT PRINTS. One JSON object: totals, optional per-stage totals, and the build_execute fields.
 * WHAT LEAVES THE MACHINE. Nothing, unless you copy those numbers into build_execute yourself.
 * FAILS CLOSED. Any error, missing transcript or unfamiliar format prints {"notRecorded":true} and
 * exits 0: "Not recorded" is the honest answer, never 0, never an estimate.
 *
 * TRANSCRIPT FORMAT (verified against Claude Code, Oct 2026; not a public contract). Each assistant
 * message is written once per streamed chunk, all sharing message.id, with the same input and cache
 * numbers and a growing output_tokens. Summing every line double-counts, so this keeps the last
 * (largest output) record per message id. Totals are SESSION WINDOWS: turns that are not PAPI work
 * inside the window are counted too.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

/** Claude Code stores a project's sessions in ~/.claude/projects/<cwd with non-alphanumerics as dashes>. */
export function transcriptDirFor(cwd, home = homedir()) {
  return join(home, '.claude', 'projects', resolve(cwd).replace(/[^A-Za-z0-9]/g, '-'));
}

/** Parse transcript text into one usage record per assistant message (last chunk wins). */
export function usageRecords(text) {
  const byId = new Map();
  for (const line of text.split('\n')) {
    if (!line) continue;
    let o;
    try { o = JSON.parse(line); } catch { continue; }
    const m = o && o.type === 'assistant' ? o.message : null;
    const u = m && typeof m === 'object' ? m.usage : null;
    if (!u || typeof o.timestamp !== 'string' || !Number.isFinite(Date.parse(o.timestamp))) continue;
    const num = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0);
    const rec = {
      id: m.id || o.requestId || o.uuid,
      at: Date.parse(o.timestamp),
      model: typeof m.model === 'string' ? m.model : null,
      input: num(u.input_tokens),
      output: num(u.output_tokens),
      cacheRead: num(u.cache_read_input_tokens),
      cacheCreate: num(u.cache_creation_input_tokens),
    };
    if (!rec.id) continue;
    const prev = byId.get(rec.id);
    if (!prev || rec.output >= prev.output) byId.set(rec.id, rec);
  }
  return [...byId.values()];
}

const ZERO = () => ({ inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0, messages: 0 });

/** Sum records whose timestamp is inside [fromMs, toMs]. */
export function sumWindow(records, fromMs, toMs) {
  const t = ZERO();
  const models = new Map();
  for (const r of records) {
    if (r.at < fromMs || r.at > toMs) continue;
    t.inputTokens += r.input;
    t.outputTokens += r.output;
    t.cacheReadTokens += r.cacheRead;
    t.cacheCreationTokens += r.cacheCreate;
    t.messages += 1;
    if (r.model) models.set(r.model, (models.get(r.model) ?? 0) + 1);
  }
  const model = [...models].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return { totals: t, model };
}

/**
 * The report: window totals plus per-stage totals. Stage windows are clipped to the main window and
 * assigned in order so a message is never counted twice; whatever falls in no stage is `unassigned`,
 * which makes stages + unassigned equal the window total exactly.
 */
export function buildReport(records, fromIso, toIso, stages = {}) {
  const fromMs = Date.parse(fromIso);
  const toMs = Date.parse(toIso);
  if (!Number.isFinite(fromMs) || !Number.isFinite(toMs) || toMs < fromMs) return notRecorded('invalid window');
  const win = sumWindow(records, fromMs, toMs);
  if (win.totals.messages === 0) return notRecorded('no usage records in the window');
  const claimed = new Set();
  const perStage = {};
  for (const [name, range] of Object.entries(stages)) {
    const a = Math.max(fromMs, Date.parse(range?.[0]));
    const b = Math.min(toMs, Date.parse(range?.[1]));
    const t = ZERO();
    if (Number.isFinite(a) && Number.isFinite(b) && b >= a) {
      for (const r of records) {
        if (r.at < a || r.at > b || claimed.has(r.id)) continue;
        claimed.add(r.id);
        t.inputTokens += r.input; t.outputTokens += r.output; t.cacheReadTokens += r.cacheRead; t.cacheCreationTokens += r.cacheCreate; t.messages += 1;
      }
    }
    perStage[name] = t;
  }
  const unassigned = ZERO();
  for (const r of records) {
    if (r.at < fromMs || r.at > toMs || claimed.has(r.id)) continue;
    unassigned.inputTokens += r.input; unassigned.outputTokens += r.output; unassigned.cacheReadTokens += r.cacheRead; unassigned.cacheCreationTokens += r.cacheCreate; unassigned.messages += 1;
  }
  const t = win.totals;
  return {
    notRecorded: false,
    source: 'claude-code-transcript',
    window: { from: fromIso, to: toIso },
    totals: t,
    model: win.model,
    stages: Object.keys(perStage).length ? { ...perStage, unassigned } : null,
    // The build_execute fields. input_tokens counts every prompt token that was not read from cache.
    buildExecute: {
      input_tokens: t.inputTokens + t.cacheCreationTokens,
      output_tokens: t.outputTokens,
      cache_read_tokens: t.cacheReadTokens,
    },
  };
}

export function notRecorded(reason) {
  return { notRecorded: true, reason, source: 'claude-code-transcript' };
}

function readAll(dirOrFile, fromMs) {
  if (!existsSync(dirOrFile)) return null;
  const files = statSync(dirOrFile).isDirectory()
    ? readdirSync(dirOrFile).filter((f) => f.endsWith('.jsonl')).map((f) => join(dirOrFile, f)).filter((f) => statSync(f).mtimeMs >= fromMs)
    : [dirOrFile];
  return files.map((f) => readFileSync(f, 'utf8')).join('\n');
}

export function run(argv) {
  const arg = (k) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : undefined; };
  try {
    const from = arg('from'); const to = arg('to');
    if (!from || !to) return notRecorded('--from and --to are required');
    const source = arg('dir') ?? transcriptDirFor(arg('cwd') ?? process.cwd());
    const text = readAll(source, Date.parse(from));
    if (text === null) return notRecorded('no transcript directory found');
    const stages = arg('stages') ? JSON.parse(arg('stages')) : {};
    return buildReport(usageRecords(text), from, to, stages);
  } catch (e) {
    return notRecorded(`could not read the transcript: ${e instanceof Error ? e.message : 'unknown error'}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  process.stdout.write(`${JSON.stringify(run(process.argv.slice(2)), null, 2)}\n`);
}
