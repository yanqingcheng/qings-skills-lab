---
name: exploratory-qa-session
description: >-
  Run one hands-on exploratory QA session against a product (web or desktop app, CLI, API, or
  docs/skills) as the real human or agent actors who matter: drive it realistically, review
  evidence sceptically, name the violated consistency oracle, and report findings, coverage and
  remaining risk. Use to explore a product for bugs, execute a test charter, test a change or fix,
  or run a blind rediscovery; not for writing automated tests, source-level code review, or fixing
  bugs.
---

# Exploratory QA session

Run this session in the Rapid Software Testing (James Bach and Michael Bolton) and context-driven
tradition: *testing* takes judgement and learning as you go, whereas *checking* is algorithmic.
Passed checks are not testing, and you own the exploration: scripted sweeps support it and never
replace it.

**What counts as a bug** (Yanqing Cheng): an inconsistency between the software and what is
reasonably expected or desirable. A bug matters because it bugs someone who matters: humans who
use, pay for, support, run, rely on or get hurt by the product, and **agents** (bots, scripts, AI)
with equal standing, each tested through its own means and oracles. Report friction, design-caused
"user error", discoverability failures (works, but a newcomer cannot find or understand it), gaps
where a user would reasonably expect a capability, broken conventions, and leaked internals
(requirement IDs, spec jargon, raw errors such as `ENOENT`).

**You inform; the owner decides.** Find and report problems only. Never edit code, fix bugs, sign
off ("SAFE", "ship"), or declare a fix "FIXED" or "NOT FIXED". Describe what you tried, what you
saw, what you left untested, and what risk remains.

## Boundaries and safety

- **Stay black-box by default (spec-blind).** Read only what a real user has: how to install and
  run the product (README), user-facing help (`--help`, in-app help, user docs), user goals, and
  known bugs (the tracker or bug list) so you report only new issues. Do not read specs, design
  docs, architecture, source, tests, product maps, run logs, or earlier hunt reports, because
  knowing where controls live destroys the discoverability test. Exception: when the charter is
  testing a specific change or fix and explicitly names its description or diff as an oracle, read
  only what you need to know what changed and what exercises it. Follow any stricter caller fences
  (for example, `validate-testing-improvement` withholding known bugs, or `heat-map-system-testing`
  isolating the map). If forbidden files sit in your working tree, do not open them and tell the
  caller that isolation failed.
- **Input must match the actor.** Every finding names its actor and counts only if that actor
  could really give that input through the means they have: real keystrokes
  (`locator.pressSequentially`, not `fill()`, which hides per-keystroke focus and re-render bugs),
  clicking only visible controls, standard shortcuts, real CLI commands (using a pty for
  interactive prompts), or the requests and pages offered to an agent. Forced clicks, injected
  events, and DOM or storage edits do not count for ordinary users; security tampering counts only
  when the charter names that risk and it is approved. If ordinary use turns up a security
  surprise, always report it with evidence and ask before probing further.
- **Risky probes and hard lines.** Judge risk by what an action could *do*, not the target's label:
  a preview environment can still send real email or charge money. Ask before anything destructive,
  irreversible, live-write, rate-limiting, paid, external-facing, or security-probing beyond normal
  input; continue safe work while waiting, and list unapproved probes as not run. Hard lines even
  with approval: never use the owner's real personal credentials or payment methods, never message
  real people outside the test, and never print, log, or capture secret values (refer to them by
  name and keep them off screen).

## Running the session

1. **Charter and readiness.** Question the brief first: a contradiction, missing target, or broken
   assumption is already a finding. If a caller gave a charter, pursue its mission and angle;
   otherwise draft a small one: the mission in SBTM form ("Explore *target*, with *resources*, to
   discover *information about which risks*"), who matters, user goals framed as intent (not a click
   list), the main risks, and what "covered" means. Keep it small: one goal done well tells the
   people who decide more than several done thinly. Ask before starting only if something material
   is missing or unclear (target, access, risky approvals, ambiguous scope); otherwise start.
   Identify an **out-of-band oracle** where one exists (state store, database, files written, API
   responses, logs, exit codes) so you can verify off-screen truth without reading source; if none
   exists, say so and lean harder on captures and a second mechanism.
2. **Stand up the driver and smoke-test it.** Prove you reach the right build or version and can
   capture evidence before hunting.
   - Web or Electron: use a real visible browser if available, or this skill's
     `scripts/drive-app.mjs` (run where Playwright is installed, passing a unique `runId` per
     session or charter so screenshots do not overwrite each other). Run its smoke test first.
   - CLI, API, or reading targets (docs, skills, processes): run real commands, real requests, or
     read the exact file version directly; open
     [references/techniques-and-stopping.md](references/techniques-and-stopping.md) for non-web
     adaptations.
   - Behind a login: sign in with the caller's test account as a user would. Without one, say so
     and test only what is reachable signed out.
   - If a needed tool or access is missing, ask or agree a narrower scope instead of ploughing on
     silently. Record anything unreachable under "Not tested".
3. **Explore realistically.** Follow hunches ("bugs cluster") and move between breadth and depth.
   - **Be determined:** when blocked, try reasonable workarounds (paste instead of typing, another
     route, defaults, reload or relaunch) so you reach bugs beyond an early blocker, logging each
     block and workaround. A workaround does not clear the original failure.
   - **Tool or product?** When an action fails, do not force it. Isolate before calling it a tool
     limit (try another route or minimal repro), and record competing hypotheses with their
     evidence if unsure.
   - **Newcomer oracle:** when hunting as a first-time user, judge each step as
     works-and-discoverable, works-but-not-discoverable (a fail), broken, or missing. Jumping
     straight to a URL is fine to reach a surface, but does not test navigating there.
   - **Press the risks:** vary data, boundaries, sequences, interruptions, persistence across
     relaunch, interfaces (compare UI against the out-of-band oracle), platform/viewport, and error
     handling. When testing a change or fix, confirm it is in the version under test and exercise
     the changed path and its neighbourhood under varied conditions, not only the original check.
     Open `references/techniques-and-stopping.md` when choosing probe angles or stuck.
4. **Verify and review evidence sceptically.**
   - **Prove it twice:** confirm a failure through a second independent mechanism and, where one
     exists, the out-of-band oracle before reporting it as a confirmed bug (gated controls and
     missed clicks mimic bugs). Keep anything you cannot prove twice under "Unverified"; never
     drop it.
   - **Name the oracle** (FEW HICCUPPS below). An observation with no violated oracle belongs in
     problem areas, not bugs.
   - **Inspect what you cite:** open and view every screenshot, capture, or log behind a claim
     before reporting; check console errors and warnings, failed network requests, and stderr or
     exit codes; check that counts, paths, and claims agree with the raw files and claim no more
     than you actually drove and saw.
5. **Stop for a named reason and clean up.** Stop on judgement, not a quota or pass count. A dry run
   means no more interesting questions, and one dry goal is not dryness: in an early run the best
   finding came after two dry ones. Open `references/techniques-and-stopping.md`, pick the stopping
   heuristic (Bolton and Bach) that fits, and record a `Stopped because:` line. Stop only the
   processes, browsers, and temporary files you started.

## Consistency oracles: FEW HICCUPPS

Michael Bolton and James Bach's heuristics. A product may have a problem when it is inconsistent
with any of these (or, for familiar problems, when it matches one):

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

Write to the path the caller names; otherwise use a unique per-session file such as
`hunts/<date>-<slug>.md` so reports do not overwrite each other. Scale length to the session, and
keep the RST three-part story (product, testing, quality) readable rather than burying it in a dump.

- **Opening:** a one-line findings summary in plain words (what was observed, who it hurts, within
  what was sampled) and the exact target and version tested.
- **Coverage and what I cleared:** areas or surfaces sampled with depth (`deep`, `quick look` or
  `not touched`; never pass counts), plus **What I cleared** (what was exercised and found fine,
  which callers such as `heat-map-system-testing` use to cool walked areas).
- **Story (what I did):** concise chronological account of the charter/goals, what you tried,
  expected, saw, and pivoted to, with inline evidence paths.
- **Findings (bugs):** severity-ranked by harm to people or agents (critical, high, medium, low, or
  "question: intended?", explaining harm in words first); when there are several findings, group
  them by user experience (lost work, wrong answer, stuck flow, confusing screen), never by guessed
  cause. For each: one-sentence title (trigger, failure, user impact), shortest repro steps, what
  happened vs expected, violated oracle (FEW HICCUPPS), actor and real means, who it hurts and
  severity, how often, status (`reproduced`, `observed`, `inferred`), evidence paths, and
  second-mechanism / out-of-band confirmation. Label causal hypotheses as inference. For a claimed
  fix, report what was tried, how many times, under what conditions, and remaining risk.
- **Not tested:** readiness gaps, skipped or blocked areas, unapproved risky probes, and tool
  limits with what each kept you from seeing (for example, recommend a real-display pass when a
  headless harness cannot drag-resize).
- **Problem areas and oddities:** fragile, confusing, or under-explored spots without a proven bug,
  blocks and workarounds log, and per-step newcomer verdicts when hunting as a first-time user.
- **Unverified / needs human:** findings not proven twice and goals that could not be pursued.
- **Flows to test next:** small, concrete follow-up charters worth running next.
- **Closing lines:** `Stopped because: <heuristic>, <why>; not covered: <what>; risk remaining:
  <what and for whom>`, `Evidence reviewed: <what you opened, plus anything not viewed>`, and any
  breach of spec-blindness stated plainly.
