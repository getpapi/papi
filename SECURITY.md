# Security policy

PAPI is a hosted service. Your project's plans, decisions, and build history
live on our servers, and your AI tool reaches them through an authenticated
MCP endpoint. A vulnerability here is other people's problem too, not just
ours. Here's how to tell us about one, and what happens next.

## Reporting

**Preferred: [open a private security advisory](https://github.com/getpapi/papi/security/advisories/new).**
GitHub's private vulnerability reporting is enabled on this repo. A draft
advisory is visible only to you and the maintainer, keeps the whole exchange
in one thread, and can carry a CVE and a credit line for you at the end.

**Fallback: email <cathal@getpapi.ai>** with "security" in the subject line, or
use the [contact form](https://getpapi.ai/contact) and pick **Security issue**
from the topic dropdown. Use these if you don't have a GitHub account or would
rather not report through it. Both reach the same person, and neither is
treated as a lesser report.

**Please don't open a public GitHub issue for a vulnerability**, and please
don't post it in Discord. Both are public the moment you hit send, and there
is no way to un-publish them. A draft advisory is *not* a public issue — it
stays private until we publish it together.

You do not need a PAPI account, a prior relationship, or a proof-of-exploit
video. A clear description is enough to start.

### What we'll do

| Step | What to expect |
|---|---|
| Acknowledgement | Usually the same day. Always within 3 business days. |
| First assessment | Within 5 business days: whether we can reproduce it, and how severe we think it is. |
| Fix | Critical issues are worked on immediately. Everything else gets a target date we tell you, and we tell you again if it slips. |
| Follow-up | You hear from us when it's fixed and deployed, not just when it's triaged. |

PAPI is a one-person company, so the reply comes from the person who can
actually fix it. That is the upside. The downside is that there is no
follow-the-sun rota — if you don't hear back inside 3 business days, bump the
advisory thread or resend the email; it means it went missing, not that it was
ignored.

### What to include

- What the issue is, and where — a URL, an endpoint, an MCP tool name, or a
  package version.
- How to reproduce it. Exact requests are ideal.
- What an attacker gets out of it: read another account's project data, write
  to it, escalate a role, bypass a tier gate, leak a token.
- Anything about your setup that mattered (client, transport, whether you were
  authenticated).

Redact your own credentials on the way in. If you need to demonstrate one,
mint a throwaway key from the Connect panel and revoke it afterwards.

## Scope

**In scope**

- The hosted MCP server, `https://mcp.getpapi.ai`
- The dashboard and API at `https://getpapi.ai`
- The `@papi-ai/server` package on npm
- Authentication and authorization: OAuth flow, `papi_` API keys, bearer
  tokens, session handling
- Cross-tenant access of any kind — anything that lets one account read or
  write another account's projects, cycles, decisions, or reports
- Anything in this repository: docs, config examples, the Dockerfile,
  workflows

**Out of scope**

- Volumetric denial of service, and load testing of any kind against the
  hosted service
- Findings from an automated scanner with no demonstrated impact — missing
  headers, cookie flags, or a CVE in a dependency you haven't shown is
  reachable
- Vulnerabilities in third-party providers rather than in PAPI's use of them.
  Report those to the provider; tell us too if our configuration is what makes
  it exploitable
- Social engineering, phishing, or physical attacks against anyone connected
  to PAPI
- Missing compliance certifications. We publish what we don't have, plainly,
  at [getpapi.ai/trust](https://getpapi.ai/trust): no SOC 2, no ISO 27001, no
  pentest report, no security team. Those are known gaps, not findings

## Testing rules

Research in good faith and we will treat it as good faith. Concretely:

- Test only against **your own** account and your own projects. If a bug lets
  you reach another account's data, stop as soon as you've confirmed that it
  does. Don't enumerate, don't download, don't keep it.
- Don't degrade the service for anyone else: no load testing, no automated
  scanning against production, no brute force.
- If you come across someone else's data, stop, don't save it, and tell us
  what you saw so we can work out who was exposed.
- Give us a chance to fix it before going public. 90 days is the default; if a
  fix is taking longer than that, talk to us and we'll agree something rather
  than run out the clock on you.

Report inside those lines and we won't pursue or support any legal action over
your research, and we'll work with you if someone else does.

## What we can't offer

There's no bug bounty. PAPI is one person and paying out on an unfunded
promise would be worse than not making one. What you get instead: a fast human
reply, a fix you can verify, and public credit in the
[changelog](https://getpapi.ai/changelog) if you want it — or none, if you'd
rather stay anonymous. Just say which.

## Where fixes land

Most of PAPI is hosted, so security fixes to the server or dashboard reach you
without you doing anything. Fixes that need a user action — a new
`@papi-ai/server` version for local stdio installs, or a config change — are
called out in the [changelog](https://getpapi.ai/changelog) and announced in
[Discord](https://discord.gg/PbacBJ9fNw).

If an incident affects your data, you'll hear it from us directly, not from
the changelog.

## Adjacent

- [Trust & Security](https://getpapi.ai/trust) — where data lives, who can
  read it, how access is controlled, and what PAPI doesn't have yet.
- [Privacy Policy](https://getpapi.ai/privacy)
- [Status](https://getpapi.ai/status)
