---
name: deployment-completeness-audit
description: Read-only audit of changes that were built but not wired, deployed or exercised. Trace the target project's actual release path, runtime, migrations and adapters; report evidence and missing access honestly.
---

# Audit deployment completeness

Read the owning project's source, release policy and current evidence before making claims. This skill diagnoses; it grants no deployment, infrastructure access, production SQL, publication or task-creation authority. Use available authenticated read-only surfaces. A missing credential or environment receipt is unverified, not a proved deployment defect.

## Trace the production path

1. **Database operations and migrations.** Locate the project's actual migration directory and migration ledger. Trace calls to stored operations and their fallback conditions. Compare the expected signature/schema with deployed evidence when accessible. A disposable-database replay proves source compatibility, not production activation. Do not assume Supabase or a cloud management API.
2. **Configuration.** Trace each changed environment/configuration name from its owning source to the documented release setting. Record names only; never print secret values. Check default behavior, unset values, feature flags and per-environment activation.
3. **Routes, jobs and entry points.** Follow changed UI actions, endpoints, scheduled jobs and queue handlers from registration to execution. A file existing does not mean a route or scheduler reaches it. Inspect the actual canonical runtime and routing, without creating another helper service.
4. **Dependencies and artifacts.** Check imports, pinned runtime compatibility, artifact digest and the release's actual installed version. Reuse existing exact-source receipts. Compilation and successful tests prove their named scope; they do not prove activation.
5. **Schema and types.** Compare owning database definitions with domain types and selected query projections. Verify caller/tenant predicates before pagination and actual serialization shapes. Never infer a global dataset from RLS alone.
6. **Multiple adapters and surfaces.** Locate the project's actual adapter interface and supported implementations. Trace equivalent methods and their authentication/transaction guarantees. Check whether a stub is supported architecture, obsolete compatibility or an unimplemented production path. A comment is a hypothesis to verify, not permanent proof that a fallback is correct.
7. **Delivery.** Trace exact reviewed source through qualification, immutable artifact, authorized installation, health and the changed user flow. Read the actual remote commit/tag and installed runtime receipt. Keep human acceptance distinct from an agent audit.

For each suspected gap, identify the owning path, trigger, expected versus observed behavior, consequence and falsifying evidence. Classify observed defects separately from unverified deployment and documented non-applicable paths. Do not present static risks as measured incidents.

## Preserve useful evidence

Save a scoped report in the target project's appropriate private/authorized document location. Include the exact source commit, environment, operations actually exercised, reused receipt fingerprints and unavailable checks. Reference historical incidents through the project's own accessible registry; do not embed PAPI maintainer paths or old incident numbers into a customer audit.

With PAPI, register the report using the current doc_register schema and confirmed project UUID. Private is the default. Propose only supported actionable fixes; check duplicates before filing and persist only authorized work. Audit cadence alone does not authorize scheduling, external sends or another release.

Report a concise verdict with the material gaps and the next concrete recovery. Keep private data private and use the documented skill entry point; no separate dashboard feature is intended.
