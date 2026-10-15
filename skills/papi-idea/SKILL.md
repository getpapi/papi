---
name: papi-idea
description: Invoke when submitting backlog ideas, registering docs, or filing research. Covers idea pipeline and doc registry conventions.
---

# papi-idea

## Reusable skill or method drafts

When the user asks to make, create, write, or draft a reusable skill or method, produce a reviewable `SKILL.md` through the caller's native file/skill mechanism. An ambiguous artifact request should not become a generic idea or note. The `idea` tool recognizes this intent in unstructured text and returns bounded drafting guidance without writing a backlog task or document. It does not generate the artifact through a server-side model.

Read the target project's own canon and tailor the draft to the actual request. Include frontmatter `name` and `description` with an invocation trigger, purpose, required inputs, ordered steps, expected result, scope boundaries, and concrete verification. Keep reusable methods project-agnostic; resolve project-specific paths and policies when invoked. Show the finished draft for review. Do not install, execute, or publish it implicitly.

When the user requests saving in PAPI, register the finalized complete body with existing `doc_register` as `framework` or `guide`, private by default, and verify exact project-scoped body read-back. Use the existing docs index convention for a saved workspace document. No separate skill entity is needed.

Explicit requests to file a task or bug remain FILE-ONLY, including “file a task to fix skill installation.” Structured `type`, `discovery`, or `scope_class=task` also retains its existing intake route. Draft creation and backlog filing are distinct caller intents.

## Idea Pipeline (unlocked at cycle 21)

The `idea` tool is your backlog intake — not just for features, but bugs, research, and big ideas.

### FILE-ONLY mode for filing requests

When the user explicitly asks to file, submit, capture, or add an idea, bug, research item, or document to the backlog, enter FILE-ONLY mode for that request:

- Gather only the minimum intake information and perform the required project-scoped PAPI operation, including the receipt, duplicate check, `Reference:` line, and any required documentation-index maintenance.
- Do not read source files or inspect the implementation. Do not edit source or configuration files, create a branch or commit, run tests or builds, or begin implementing the filed item.
- After the filing operation is recorded, stop and report the durable result. Do not continue into implementation unless the user explicitly asks to build or fix it.

FILE-ONLY mode does not apply when the user explicitly asks to build, fix, or implement something. Do not infer FILE-ONLY mode from a short or ambiguous feature request; resolve the user's intent first.

- When you discover something during a build, submit it via `idea` rather than stopping to fix it.
- Include a `Reference:` line pointing to relevant docs so the planner has context.
- Split large ideas into 2-3 focused submissions for better planner scoping.
- The backlog is the steering wheel — priority + notes shape what gets planned next.
- Check plausible duplicates before creating work; reuse existing tasks and
  evidence. Retry uncertain writes by inspecting their receipt/source reference,
  never by blindly creating another record.
- Keep the active project fixed. Filing in another project requires explicit
  authorization for that target, including per-call overrides.
- Submit AD conflicts with `conflicts_with_ad: "AD-N"`; let the user resolve the
  decision instead of dropping the proposal.

## Doc Registry

Docs are first-class entities. When research or planning produces a stable document:
- Register it with `doc_register` after it's finalised.
- Doc summaries travel with tool context — the planner and strategy review can find relevant docs.
- Keep docs current — update the review header after any change.
- Docs default to `private`; valid visibility values are `private`, `contributors`
  and `public`. Match `docs/private/`, `docs/contributors/` or `docs/public/` to
  that visibility. Do not widen access just to let a planner read a doc.
- Hosted HTTP cannot read caller-local files. Supply the finalized body through
  the supported contract and read it back to verify complete storage.

## Documentation Maintenance

Before creating a new doc, check `docs/INDEX.md` — it may already exist. When creating or archiving docs, update the index.

After implementing any code change, check if the change affects any documentation in `docs/`. If a doc describes behaviour, architecture, or file interactions that your change modified, update the doc to stay accurate.

When updating a doc, add or update a review header immediately below the title:

```
# Document Title
> Last reviewed: task-NNN — DD-MM-YYYY
```

Replace `task-NNN` with the task ID that triggered the update, and `DD-MM-YYYY` with today's date.
