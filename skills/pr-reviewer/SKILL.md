---
name: pr-reviewer
description: Review a requested pull request, branch diff or completed task against its actual scope, source and checks. Prepare evidence and comments; post or record a human verdict only when explicitly authorized.
license: MIT
---

# Review a pull request or build

Resolve the actual skill directory from this SKILL.md before using references or scripts. Use the host's available tools; slash commands, Bash, Task and Skill are not universal APIs.

## Gather the current review scope

Read the requested PR metadata, exact head commit, diff, existing reviews, owning rules and handoff. For a branch-only review, fetch the base and read the scoped diff. Preserve dirty work; reuse an isolated existing checkout when appropriate. Do not infer a task from one branch naming pattern: shared cycle branches can contain multiple tasks.

Prefer existing GitHub tools or `gh pr view`, `gh pr diff` and `gh pr checks`. The optional helper `<absolute-skill-dir>/scripts/fetch_pr_data.py <PR_URL> --no-clone --output-dir <owned-staging>` collects the same evidence. It is not required; do not install dependencies, clone again or generate client command files just to review.

Use the owning project's staging directory. On Windows use an owned subdirectory of C:/Develop/Claude/build-temp; on Linux use native storage. Never delete another review's files or overwrite a live checkout.

## Review the owning source

Use [review criteria](references/review_criteria.md) as a reference, scaled to the actual change:
- Does the implementation satisfy the handoff and intended behavior? Trace callers, failure paths, boundaries and affected documentation.
- Check security, authentication, tenancy, secrets and data-access predicates before pagination.
- Check null/empty inputs, type narrowing, exceptions, races, cancellation and stale results.
- Evaluate simplicity, ownership and reuse. Fix the shared owner rather than duplicating behavior.
- Examine meaningful owning tests and actual production-entrypoint evidence. Follow the repository's check policy and resource ceiling; do not duplicate a valid qualification receipt.

Distinguish introduced defects, required corrections, pre-existing issues and optional suggestions. Each actionable finding names a verified path/line, impact, severity and concrete correction. Do not manufacture findings or praise to fill a template. Static inspection is not runtime proof.

## Prepare a reviewable result

Keep the full private findings and a short summary tied to the exact reviewed commit. For comment drafts include file/line, body and intended verdict. Preserve current-head check failures, missing evidence and unresolved reviews. A builder's self-audit is not independent review or human acceptance.

The legacy helper command generator and /show, /send, /send-decline examples in supplemental references are optional client-specific interfaces. Do not generate .claude/commands or assume they exist. Use supported native review tools, or deliver drafts in chat/files.

Posting comments, submitting a GitHub review, contacting teammates and merging are separate actions requiring their applicable authority. If the user explicitly authorized posting, finish the reviewable content and submit through the available supported tool without asking again. Otherwise present the draft.

For a PAPI-managed build, read the current `review_submit` schema. Resolve task IDs from the actual report/PR associations, not branch text. Record `reviewed_commit_sha`, evidence and structured findings only with the required explicit human verdict. Never convert an agent pass into verdict=accept or accept on the user's behalf. Keep pending human review pending.

## Report

Lead with the material findings or state that none were found. Name the reviewed commit, checks actually run/reused and unverified behavior. Link the real PR/diff or local review artifact. Never claim posted, merged, accepted or shipped until the corresponding operation and read-back succeeded.

Additional resources: [GitHub CLI](references/gh_cli_guide.md), [scenarios](references/scenarios.md), [troubleshooting](references/troubleshooting.md). Resolve their paths relative to the actual skill directory.
