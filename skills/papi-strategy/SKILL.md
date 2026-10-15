---
name: papi-strategy
description: Invoke when running strategy_review or making Active Decision changes. Covers strategy review cadence and AD lifecycle.
---

# papi-strategy

## Strategy Reviews

Every 5 cycles, PAPI offers a strategy review — a deep analysis of velocity, estimation accuracy, active decisions, and project direction.

- **Don't skip them.** They're where compounding value comes from.
- Run in the current conversation. Only verified context pressure warrants a
  fresh chat; elapsed time, task type and compaction alone do not.
- Reviews produce recommendations that feed into the next plan.
- If the review recommends AD changes, use `strategy_change` to apply them.

### Close the review

After apply, verify the stored review and recommendations. Apply authorized
decision changes and feed the findings into the next proposed task set. Share
externally only when requested, through an available supported tool, with explicit
send authorization for the destination. Marketing is not a review gate.
Remote HTTP accepts inline output or supported structured chunks; a caller-local
output path works only when the connected local workspace server can read it.

## Active Decision Lifecycle

Active Decisions (ADs) track architectural and product choices with confidence levels (LOW → MEDIUM → HIGH).

- Check ADs before making architectural choices — run `health` for the AD summary.
- ADs are for product/architecture choices only, not process preferences.
- When new evidence appears, update AD confidence via `strategy_change`.
- Supersede rather than overwrite — old decisions stay as history.
- An AD conflict is a user decision. Submit it through `idea` with
  `conflicts_with_ad: "AD-N"`; preserve its evidence behind the decision gate
  instead of shelving it. Use the deployment's supported resolution flow.
- New ADs should include a `### Reversal Trigger` section: specify the signal that would invalidate the stance, the action to take (modify/supersede/abandon), and why writing it now prevents sunk-cost drift later.
