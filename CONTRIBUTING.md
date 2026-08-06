# Contributing

Short version: this repo is docs and issues. The PAPI engine is closed source
and lives elsewhere, so there is no server code here to send a patch against.
That is not a soft "we'll open it later" — it's the shape of the project, and
it's better to say so at the top than let you go looking for a `src/`
directory that doesn't exist.

What that leaves is still worth a lot, and this page is about being specific
rather than pasting the usual open-source welcome mat.

## What actually helps

**A good connection report helps most.** Connecting an MCP server and getting
through browser OAuth is the step where people fall off, and it fails
differently in every client. We can only fix the failures we can see. If PAPI
would not connect for you, the
[Connection problem](https://github.com/getpapi/papi/issues/new?template=1-connection-problem.yml)
template asks for the five things that usually identify the cause: your
client, how you installed, what broke, your config with the secrets stripped,
and what `orient` returned. Filling that in takes two minutes and is genuinely
the highest-leverage thing anyone outside the project can do.

**Docs fixes.** Anything in this repo that is wrong, stale, or confusing. A
command that doesn't work as written, a client whose setup has changed, a step
that assumes knowledge a first-timer doesn't have. Small PRs are welcome and
get merged quickly.

**Telling us where the docs failed you.** If you got stuck and then unstuck,
the gap between those two states is the docs bug. Open an issue describing it
even if you don't want to write the fix — knowing *where* someone got lost is
most of the work.

**Feature requests, filed as problems.** These get triaged onto PAPI's own
board and planned into a cycle like anything else, so you'll get an answer
either way, including no. Describe the problem you hit rather than the feature
you imagine; the problem is the part that survives.

## What to send where

| You want to… | Do this |
|---|---|
| Report that PAPI won't connect | [Connection problem](https://github.com/getpapi/papi/issues/new?template=1-connection-problem.yml) issue |
| Report a tool or dashboard bug | [Bug report](https://github.com/getpapi/papi/issues/new?template=2-bug-report.yml) issue |
| Ask how something works | [Discord](https://discord.gg/PbacBJ9fNw) first, or a [Question](https://github.com/getpapi/papi/issues/new?template=3-question.yml) issue |
| Request a feature | [Feature request](https://github.com/getpapi/papi/issues/new?template=4-feature-request.yml) issue |
| Fix a typo or a wrong command in these docs | Pull request |
| Report a security vulnerability | **Not an issue.** See [SECURITY.md](SECURITY.md) |

## Filing an issue that gets fixed

The templates ask for these already, but the reasoning behind them:

- **Name your client and version.** "It doesn't work" in Cursor and in Codex
  are usually two different bugs with the same symptom.
- **Paste errors verbatim.** A summarised error loses the part that identifies
  it. Fenced code blocks, not screenshots — screenshots aren't searchable and
  can't be grepped against logs.
- **Say what `orient` returned.** `orient` is PAPI's one-call state read. Its
  output (or its failure) narrows almost every report immediately.
- **Redact your secrets.** Never paste an `Authorization: Bearer` value, a
  `papi_` key, or anything from `PAPI_DATA_API_KEY`. Header *names* and URLs
  are useful; the values never are. If you do post one by accident, revoke it
  from the dashboard's Connect panel straight away — deleting the comment does
  not un-publish it.
- **Say roughly when it happened, with your timezone.** It lets a report be
  lined up against server-side logs.

## Pull requests

Only for the contents of this repo: `README.md`, `docs/`, `llms-install.md`,
`llms.txt`, `Dockerfile`, and the config examples. Everything else about PAPI
is built through its own plan → build → review cycle in a private repo.

1. Fork, branch, and keep the change focused. One fix per PR reviews faster
   than five bundled together.
2. Run anything you change. If you edit an install command, run it. Config
   snippets in these docs are copied and pasted by people who are already
   frustrated, so they have to work exactly as written.
3. Check your links resolve, including relative ones.
4. Match the surrounding voice. These docs are written plainly and in the
   second person, they lead with the thing that most often goes wrong, and
   they don't oversell. Please keep that.
5. Open the PR. You'll usually get a response within a day or two.

**One special case: `llms.txt`.** The canonical version is served live at
<https://getpapi.ai/llms.txt> and generated from the live endpoint, so the
copy in this repo is a mirror. A PR against it is a useful signal, but the
real fix has to happen upstream and then be mirrored back down. Say what you
think is wrong with the live version and it'll be corrected in both places.

There is no CLA. The contents of this repo are MIT (see [LICENSE](LICENSE)),
and that licence covers this repository only — not the PAPI engine, and not
the PAPI name or logo.

## What not to send

- **Engine features as PRs.** There's nothing here to patch. File the problem
  as an issue instead; that route reaches the board.
- **Large rewrites of working docs.** If you think a whole page is wrong,
  open an issue and make the argument first. It'll save you the writing.
- **AI-generated PRs you haven't read.** Fine to draft with an assistant —
  PAPI is built with one. Not fine to send something you haven't verified.
  If a command in your PR was never run, it isn't ready.
- **Security vulnerabilities as public issues.** [SECURITY.md](SECURITY.md).

## What you can expect back

One person maintains this, so: usually a reply within a day or two, sometimes
longer. Connection reports and security reports jump the queue. A closed issue
always gets a reason, and "not doing this" is a real answer you might get —
you won't be left guessing.

Fixes ship through PAPI's own release cycle. What shipped in each is public at
<https://getpapi.ai/changelog>.
