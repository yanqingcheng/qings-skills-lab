---
name: user-sim-bug-hunt
description: >-
  Run one hands-on test session against a running app (web, desktop or CLI) as a spec-blind
  first-time user: drive it like a determined newcomer, prove each finding twice, and name the
  consistency oracle it violates. Use to execute a test charter or a blind rediscovery run; not for
  a heuristic UX audit, a source-level bug hunt, or fixing bugs.
---

# User-simulation bug hunt

Find what real users would hit by being one: a first-time user with a goal, driving the product the
way a person physically does. Friction is a bug, not only functional breakage.

## Stay spec-blind

Read only what a real user would have: how to install and run the product (its README), user-facing
help (`--help`, in-app help, user docs), the user goals (user stories, positioning; read for what
users want, never as a map of where things are), and the project's known bugs (its tracker or bug
list) so you report only new bugs.

Do not read specs, design docs, architecture, source, tests, a product map with its run log and
fold records, or earlier hunt reports (they say where controls live, how newcomers fared and what to
try next). Knowing where controls live or how they are wired destroys the discoverability test;
this is the rule the method rests on. If your working tree holds such files, do not open them; tell
the caller, because the isolation has failed.
A caller running a blind rediscovery (for example the `validate-testing-improvement` skill, where
installed) may also withhold the known bugs and bug notes. Follow the caller's fences.

## Procedure

1. **Take the charter, or distil goals.** A charter from `heat-map-system-testing` gives one user
   story and an angle; pursue that. Otherwise list 6 to 10 things a user would try to accomplish,
   from the user-voice material. Frame them as intent, not features.
2. **Find the out-of-band oracle** before hunting: where the product's truth lives off-screen, such as
   its state store, database, files written, logs, API responses or exit codes. If there is none,
   say so and lean harder on screenshots and a second mechanism.
3. **Stand up the drive and smoke-test it.**
   - Web or Electron: this skill's `scripts/drive-app.mjs`, run from a directory where Playwright is
     installed, with a URL or the built Electron main entry. Run its smoke test first. Pass a
     per-charter `runId` so screenshots do not overwrite each other.
   - CLI: run real commands in a shell, using a pty for interactive prompts.
   - Behind a login: sign in with the test account the caller gives, as a user would. Without one,
     say so and hunt only what is reachable signed out.
   - Other desktop apps: whatever automation reaches them. List anything you cannot drive under
     "not tested".
4. **Hunt each goal, driving like a human (interaction-grade).** Scripted data checks miss a whole
   band of interaction bugs.
   - Enter text as keystrokes (`locator.pressSequentially`), not `fill()` or setting the value:
     `fill()` hides per-keystroke focus and re-render bugs. Click only visible affordances. Try
     right-click and the standard keyboard shortcuts. Navigate by discovery.
   - **Be a determined user.** When blocked, try what a motivated person would: paste instead of
     typing, accept a default, take another route, reload or relaunch. Keep going through the whole
     flow so you reach the bugs beyond an early blocker. Log each block and every workaround tried.
   - **Newcomer oracle.** At each step ask how someone new to this product would try to do it, and
     record a verdict: works-and-discoverable, works-but-not-discoverable (a FAIL), broken, or missing.
     A feature that works but cannot be found fails just as a broken one does.
   - **Drive the charter's angle hard.** Data: too big, too small, zero-one-many, boundaries, special
     characters, paste. Time and operations: relaunch and re-check persistence, enter and leave modes,
     do steps out of order, interrupt. Interfaces: compare what the product shows with the
     out-of-band oracle. Platform: resize, change locale, narrow the terminal.
   - Also report as bugs: **gaps** (a user would reasonably expect to be able to do this and cannot;
     that is a bug, not "not built yet"); **leaked internals** in user-facing text (requirement or
     decision IDs, section references, spec or fixture jargon, dev-diary phrasing such as "this pass",
     raw error strings such as `ENOENT`); and footguns, traps, inconsistency and incoherence.
5. **Prove it twice and name the oracle.** Before reporting that something is broken, confirm it
   through a second independent mechanism and, where one exists, the out-of-band oracle. A disabled
   control may be gated rather than broken, and a missed confirmation click can look like a bug. If
   you cannot prove it twice, list it as unverified. Then name the consistency oracle it violates
   (below). A finding with no nameable oracle goes under problem areas, not bugs.
6. **Stop on dryness, not a number.** With a single charter, stop when its goal and angle are
   exhausted. With your own goals, stop after two consecutive goals find nothing new. Five sharp
   findings beat padding to a quota.
7. **Write the report** (below). Find and document only; do not fix.

## Consistency oracles: FEW HICCUPPS

Michael Bolton and James Bach's heuristics. A product may have a problem when it is inconsistent
with any of these, or, for familiar problems, when it matches one:

| Oracle | Inconsistent with |
|---|---|
| Familiar problems | (matches) a failure pattern you have seen before |
| Explainability | an explanation you could give for why it behaved that way |
| World | real-world or domain facts |
| History | earlier versions, with no intended and communicated change |
| Image | the maker's desired image: typos, broken layout, leaked internals |
| Comparable products | how peer products do the same thing |
| Claims | labels, tooltips, help, docs or marketing |
| User expectations | what a reasonable user would expect |
| Product | the same operation elsewhere in the product |
| Purpose | what the feature is for, even when it technically works |
| Standards and statutes | relevant standards, accessibility guidelines, contracts or law |

## Report

Write to the path the caller names. Without one, use a new file per session, such as
`hunts/<date>-<goal>.md`, so reports do not overwrite each other.

- The charter or goals pursued.
- **Findings**, severity-ranked. For each: the goal, repro steps, what happened, why it matters to
  the user, the violated oracle, severity, evidence (screenshot, log or state path), and the
  second-mechanism confirmation.
- **What I cleared:** what was checked and found fine. The heat map cools from this list.
- **Not tested**, with reasons. When a whole class of interaction is out of reach (for example
  drag-resize under a headless harness), say so and recommend a real-display pass; another persona in
  the same harness will not reach it.
- **Problem areas:** places that felt fragile, confusing or under-explored without a proven bug.
- **Flows to test next:** further user goals worth a future charter.
- **Unverified / needs human:** findings not proven twice and goals that could not be pursued.
- The blocks and workarounds log, and the per-step newcomer verdicts.
- Any breach of spec-blindness, stated plainly.
