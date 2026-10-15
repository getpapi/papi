---
name: design
description: >
  Design and critique any visible UI, before and after building. Trigger on UI work: "improve the
  UI", "redesign", "polish", "make it look better", "visual upgrade", "design review", "design
  audit", "layout fix", "UX improvement", or any task whose deliverable is a page, screen, or
  component that renders. Shapes a direction, critiques the surface, builds, and verifies. Reads
  the project's own DESIGN.md and PRODUCT.md at run time. If you are about to write or edit
  anything that renders visible UI, use this skill first.
---

# Design

You are the design lead for this project's UI. This is the ONE design method: shape a direction,
critique the surface, build it, and verify it. It is **project-agnostic** — the project's own
design system is the canon, read at run time. Never assume a palette, font, or file path from this
skill itself.

## Modes — decide first

- **EXPLORATION** — the task asks for mockups, concepts, options, "redesign drastically", or a new
  direction. The project's canon is **suspended**: invent palette, type, layout, tone. Produce
  several mutually different options; do not self-correct back to the current design. There is no
  critique gate here — critique the chosen direction, not the ideation.
- **IMPLEMENTATION** — a direction is chosen and you are building it. Full canon binds, and the
  steps below apply.

If you cannot tell which mode you are in, ask. Treating an exploration as an implementation is what
produces a tweak instead of a redesign.

## Step 0 — Read the project's design system (implementation)

Look for **`DESIGN.md`** (visual system: palette, typography, spacing, elevation, components, named
anti-patterns) and **`PRODUCT.md`** (audience, voice, strategic principles) at the project root, or
the project's declared equivalent. **Their rules govern.** If neither exists, say so — a design
without a system is opinion.

## Step 1 — Shape (one line)

Commit to a direction before building; soft guidance gets ignored and agents converge on median
output. State three dials plus a one-line page read:

- **Variance** (1–10): symmetric/templated → asymmetric/bespoke.
- **Density** (1–10): airy → cockpit. Default LOW; reveal on demand. A cockpit that shows
  everything at once is a failure mode, not a goal.
- **Motion** (1–10): static → cinematic. Motion signals state change, not decoration.

One-line read: `kind / audience / the one thing they must see first`. Every later decision is
measured against it.

## Step 2 — Critique the surface

Give ✅ Pass / ⚠️ Weak / ❌ Fail and one line each:

1. **Hero (conditional).** Does one thing need to lead? If yes, name it; if no (a dense tool, list,
   board or settings surface), a calm even hierarchy is ✅ — do not manufacture a hero. Two
   elements *competing* for dominance is always ❌.
2. **Reading order.** hero → primary action → supporting → tertiary. Interchangeable sections = ⚠️;
   nowhere for the eye to land first = ❌.
3. **Density.** Roughly ≤3 sections above the fold. Does each earn its spot, or could it collapse?
4. **Earned elements.** Name the question each section/card/metric answers. Can't → it doesn't earn
   its space. Decoration with no data or action purpose = ❌.
5. **Typography.** Display > Heading > Subheading > Body > Caption, each distinct. Metric values
   larger and bolder than labels. Use the project's own type scale. Two levels at the same
   weight/size = ❌.
6. **Anti-pattern scan.** Walk the project's named anti-patterns and flag matches.
7. **Colour.** Accent = actions and emphasis, not decoration. Signal colours only on the status
   they represent. Tokens, not hardcoded values.

Verdict block:

```
## Design critique: [surface]
### Score: X/7 passing
| Check | Verdict | Issue |
|-------|---------|-------|
| Hero (conditional) | ✅/⚠️/❌ | ... |
| Reading order | ✅/⚠️/❌ | ... |
| Density | ✅/⚠️/❌ | ... |
| Earned elements | ✅/⚠️/❌ | ... |
| Typography | ✅/⚠️/❌ | ... |
| Anti-pattern scan | ✅/⚠️/❌ | ... |
| Colour | ✅/⚠️/❌ | ... |
### Must-fix before building: [specific fixes]
```

## Step 3 — The five AI-tells (falsifiable; any hit is a fail)

1. **Gradient text or a gradient fill**, unless the project's own canon explicitly allows it.
2. **Cards inside cards**, or a row of identical-sized cards with no hierarchy.
3. **Prose carrying guidance** (what to do, where to look, what state something is in) where a
   visual cue — position, size, colour, an icon, a signpost, motion on change — would carry it.
4. **Monospace on labels, status, timestamps or nav.** Mono is for IDs and code only.
5. **Hostile or jargon empty state** ("No items", "Nothing here", raw command names).

## Step 4 — Build

- Tokens only; no hardcoded colour values.
- One dominant focal point when the surface has one thing that must lead; otherwise a calm order.
- Empty states teach: what shows · when it appears · the next action.
- Mobile is first-class: reflow at 375 / 390 / 640px, no horizontal scroll, no clipped panels.
- Every animation has a reduced-motion fallback; never animate layout properties.

## Step 5 — Verify in the browser

Screenshot at populated, empty, and mobile (375px and 640px). Check contrast in every theme the
project ships. Confirm no new violation of Step 2 or Step 3. If the build looks worse than the
intended direction, the build is wrong.

## The core principle

**Composition > decoration, and show > tell.** A page with perfect tokens and flat hierarchy is
worse than one with slightly-off tokens and a clear reading order where every element earns its
space. Steer with visuals, not text. A hero is conditional, not mandatory.
