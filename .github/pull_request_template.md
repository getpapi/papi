<!--
This repo is documentation only. PRs here change docs, install guides, config
examples, or repo metadata — never engine code, which lives in a private repo.
If you were hoping to change PAPI's behaviour, open an issue instead; that's
the path that actually reaches the board.
-->

## What this changes

<!-- One or two sentences. If it fixes something in an issue, link it: Fixes #123 -->

## Why

<!-- What was wrong, misleading, or missing. If you hit this while installing
     PAPI, say what you were doing when it bit you — that context is often
     more useful than the fix. -->

## Checklist

- [ ] This is a docs / config / metadata change, not engine code.
- [ ] I ran any command or config snippet I changed, and it works as written.
- [ ] Links resolve, and relative links point at real files in this repo.
- [ ] No API keys, bearer tokens, project ids, or personal data in the diff.

## If you touched `llms.txt`

<!-- Delete this section if you didn't. -->

`llms.txt` in this repo is a mirror. The canonical copy is served live at
<https://getpapi.ai/llms.txt> and is generated from the live endpoint. A change
here is a signal, not the fix — it gets mirrored upstream on merge, so please
say what you think is wrong with the live version so both stay in step.

- [ ] I checked <https://getpapi.ai/llms.txt> and my change doesn't contradict it.
