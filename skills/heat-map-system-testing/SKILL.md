---
name: heat-map-system-testing
description: >-
  Manage system testing across sessions from a product risk heat map: decide which area to charter
  next, fold each session's results and outside bug reports back into the map, and judge when
  testing can stop. Use to run a pre-release or post-change system-test campaign, build or update
  the heat map, or pick the next test charter. The hands-on session itself is user-sim-bug-hunt.
---

# Heat-map system testing

> "The heat map is our true understanding of what in the product is robust and what in the product
> we have low confidence in. … We're constantly looking for more risk areas, and we stop testing
> when we run out of risk areas and can't efficiently find bugs that have an impact on our user
> experience or other stakeholder quality priorities." — Qing, the method's author

System testing runs the built product as its users would, to find what unit and component tests
cannot: interaction problems, cross-component flows, and gaps between intent and behaviour. In this
method a maintained heat map directs it. Charters come from the map's riskiest areas, every result
updates the map, and testing stops when the map is dry. The aim is always, in the
author's words, "the most productive vein to investigate".

## When to use which entry

- **Pre-release system test:** start from the map and let heat choose every charter.
- **After a substantial feature or bug-fix phase**, especially when user interaction or
  cross-component flows changed: the first charter may come straight from the change. Fold the
  changed areas into the map first, so its result lands in the right place, then let heat choose
  any further charters. Small, obvious fixes do not need a system test.
- **Whenever bugs arrive from elsewhere** (users, reviews, CI, other test phases): fold them in so
  heat stays true. The map is maintained continuously, not rebuilt for each release.

## Two roles

- **Map driver** (the runner of this skill): owns the map, writes charters, folds results, routes
  bugs, and declares the map dry. May read anything: source, specs, change history, the quality
  strategy.
- **Hunter:** runs one charter as a first-time user with the `user-sim-bug-hunt` skill. The hunter
  must not see the map, the run log, fold files, earlier hunt reports, target node ids, spec or
  source. These record where controls live and what earlier newcomers made of them, and a hunter who
  knows that can no longer judge whether a newcomer would find them. Dispatch the hunter as a
  separate agent in a working tree without them (step 3 of each turn). If you must hunt in the same
  context, say so in the run log, because that session's discoverability verdicts are compromised.

Neither role fixes bugs. Route findings to the project's bug workflow (for example
`analyse-bug-report` when installed); when a fix lands, fold its area as `changed`.

## Files

Keep these together in a map directory outside the product repository, or git-ignored within it.
A worktree shares the repository's history, so anything committed there, including commit messages
about folds, is visible to the hunter. A fence the hunter could break with `ls` or `git log` is not
a fence.

- `product-map.json`, the map ([schema](scripts/product-map.schema.json)).
- `product-map.log.md`, the run log: one entry per turn and per outside fold.
- `hunts/<charter-id>.md`, one hunt report per charter.
- For a product behind a login: a test account the hunter and map walk can use, kept wherever the
  project keeps credentials, never in the map or log.

Scripts live in this skill's `scripts/` directory (`<skill-dir>/scripts/` below). `update-map.mjs`
and `validate-map.mjs` need only Node; `enumerate-ui.mjs` needs Playwright installed where you run it.

## The map

A tree of **surface → panel → control**: an entry point (window, route, command, endpoint group); a
region within it; one thing a user acts on. Panels are optional where the product has no natural
regions, as in most CLIs. Build or extend the map with
[references/build-the-map.md](references/build-the-map.md) when none exists, the product has grown,
or a hunt reveals a missed affordance.

Each leaf records what is worth testing and what testing has shown:

- **`dimensions`**: the SFDIPOT product elements in play beyond "it exists and does its basic job"
  (James Bach's Heuristic Test Strategy Model). `data`: values flow through it. `interfaces`: it
  persists or calls another component. `platform`: it depends on the environment (OS, window size,
  locale, terminal). `operations`: it belongs to a mode or multi-step workflow. `time`: state carries
  across relaunches, mode switches or concurrent use. Structure and function are implicit.
- **`qualities`**: the quality-strategy priorities at risk there (for example security,
  accessibility, data integrity), drawn from the map's top-level `qualities`. The author: "Map is not
  just subsystem but also quality dimensions per the quality strategy." Omit when the project has no
  quality priorities.
- **Yield state:** `traversals`, `bugsFound`, `dryStreak`, `heat`, and `probed`, the facets a
  charter has actually exercised since the last change.

At the top level, **`charterIdeas`** holds open risk areas not yet chartered, and **`folded`** lists
the evidence already folded (bug ids, hunt report ids), so nothing is counted twice.

**Coverage means facets probed, not buttons walked.** A control clicked once has had its function
tried, not its data, persistence or modes.

### Heat

| Heat | Meaning | Leaf rule |
|---|---|---|
| `unknown` | no evidence yet | no walks and no bugs |
| `hot` | low confidence: a bug or change since the last clean walk; dig here | `dryStreak` 0 |
| `warm` | one clean walk, or dry but with a listed dimension or quality never probed | `dryStreak` 1, or 2+ with un-probed facets |
| `cold` | robust for now | `dryStreak` 2+ and every listed facet probed |

A parent's heat is its hottest leaf. `scripts/update-map.mjs` applies these rules; never hand-edit the
counters or heat. When judgment disagrees with the evidence, for example a clean but
fragile-feeling area that should stay warm, set the leaf's `heatOverride: {heat, reason}`. The script
honours it until a new bug or a change clears it; when its reason lapses sooner, delete it. After
any hand edit, such as setting or deleting an override or adding nodes, fold `{"touched": []}` to
recompute.

## Each turn

1. **Bring the map up to date.** Load it, or build it. Fold everything learned since the last turn
   that is not yet in `folded`, citing each as an `evidence` ref in the fold:
   - product changes since `builtFrom`: `changed: true` on the affected leaves or their parent; add
     new nodes; update `builtFrom`;
   - landed fixes: a changed-only fold (`changed: true` on the fixed leaf). Evidence is optional; if
     you cite any, cite the fix (`fix:<sha>` or the PR), never the already-folded bug id, which the
     script refuses as a replay. When one fix covers leaves you learn about at different times, omit
     evidence on the later fold, because the fix ref is already folded;
   - bugs from outside the loop: `walked: false` with `newBugs`;
   - concerns from reviews or the quality strategy: a `charterIdeas` entry, or a `heatOverride`.

   A change to a leaf never walked leaves it `unknown` (the script lists these). Add such areas to
   `charterIdeas` so they rank first among the unknowns.
2. **Choose the charter** (below).
3. **Dispatch the hunt.** Brief the hunter with: the user story and angle; a starting point only when
   reaching it is not part of what is being tested; how to build and launch the product at
   `builtFrom` (or first fold product changes up to the hunter's commit and set `builtFrom` to it);
   the test account, if it needs a login, by reference (an env var or secret path), never by value;
   where the project's bug tracker is, so the hunter reports only new bugs; a report path inside its
   own working tree; and the fences (do not read the spec, design docs, source or tests). Isolate
   it: give it a checkout, worktree or built product that does not contain the map directory and,
   where the runtime allows, deny it read access to that directory. Keep the target node ids and
   heat reasoning in the run log. File its report as `hunts/<charter-id>.md` by moving it and its
   screenshots out of the hunter's tree, not copying them, or dispatch each charter into a fresh
   worktree or checkout, so the next hunter finds none.
   Several charters on disjoint targets may run in parallel; their reports fold in any order.
4. **Fold the report** (below), only once product changes up to its build commit are folded. Write
   `fold.json` with the report as its evidence ref, run
   `node <skill-dir>/scripts/update-map.mjs <map-dir>/product-map.json fold.json`, then
   `node <skill-dir>/scripts/validate-map.mjs <map-dir>/product-map.json` until it prints `OK`. The
   fold format is in the header of `update-map.mjs`; a fold that walks a leaf or adds bugs must cite `evidence`, so a
   replay is refused rather than counted twice.
5. **Route and decide.** Send new findings to the bug workflow and log where they went. Continue with
   the next turn, or declare the map dry.

### Choose the charter

- Rank `hot` and `unknown` first, then `warm`; skip `cold`. As a heuristic, prefer a cluster (such as
  a panel with several hot or unknown leaves) over a lone control, since defects often cluster. Break
  ties toward more `bugsFound` (a proven vein), or toward an unknown area that changed recently or
  that users reach often.
- **Dig hot veins; skip cold, dry veins.** A warm leaf with an un-probed facet is not dry: rank it
  above a warm leaf whose listed facets have all been probed.
- **Park the known-hot.** A leaf that is hot only because its bug is filed but not yet fixed will
  re-find the same bug. Skip it unless another facet remains un-probed, and note the parking. When the
  fix lands, the `changed` fold makes it hot again for verification.
- Earlier `charterIdeas` compete on the same terms; remove one once chartered or judged low-risk.
- **Name the angle:** one or two consistency oracles the area most plausibly violates, and/or the
  un-probed dimension or quality. Use FEW HICCUPPS (Michael Bolton and James Bach): Familiar problems,
  Explainability, World, History, Image, Comparable products, Claims, User expectations, Product,
  Purpose, Standards and statutes (`user-sim-bug-hunt` explains each). Name only oracles that fit
  the area; the angle turns "poke this area" into "check whether it is inconsistent with X". Phrase
  it as what a user would try ("paste a long name, then reopen the project"), never by the control's
  name or location in the map.
- **Write a user goal, not a click list:** "As a <user in this product's world>, I want to <goal
  that exercises the area> so that <why>." Draw on the product's user stories or requirements when
  they exist, so the goal is one a real user would pursue.

Log each charter in the run log with its id, story, angle, target node ids, why this area (heat plus
angle), the build commit, and any starting point. A charter id is `<date>-c<n>`, the run date plus
the charter's number that day (`2026-09-23-c4`); folds cite its report as `hunt:<charter-id>`.

### Fold the report

- **Walked leaves** are those the hunt actually exercised, taken from its "what I cleared" list and
  flows. A target the hunter never reached is not walked. Count clean walks, because that is how a
  vein cools; a walk that re-finds only an already-folded bug is clean.
- **Attribute each finding** to the most specific leaf. If it concerns an affordance missing from the
  map, add the leaf as described in [build-the-map](references/build-the-map.md) (tags, no counters)
  and fold the bug onto it. If no leaf fits, add one under the nearest surface (for example
  `control:settings-general`) with "attribution uncertain" in `notes`. Folds name leaves only, one
  entry per leaf (`newBugs` counts all its findings); never drop a finding.
- **A generalised finding is not a new bug.** When the same defect also affects a sibling, count it
  once on its origin leaf. Before folding, give the sibling (not in the fold)
  `heatOverride: {heat: "hot", reason: "same defect as <bug> on <origin leaf>"}`, so it neither
  cools nor double-counts; it is parked with the original bug. When the fix lands, fold `changed`
  on the origin leaf and on every leaf carrying that override; `changed` clears the override.
- **Record `probed`** only for facets the hunter demonstrably exercised: boundary data pushed through
  an input counts as `data`; a relaunch and re-check counts as `time`.
- The hunter's problem areas become `heatOverride`s or `charterIdeas`; its "flows to test next"
  become `charterIdeas`; unverified findings stay as ideas or notes, not bugs.

## When to stop

The author defines dryness as "I've genuinely run out of good charter ideas and the last few I tried
all came back clean immediately", adding "there's no such thing as a product with no bugs". Declare
the map dry, with reasons in the run log, when both hold:

- **No risk area is left worth a charter**, across product areas and quality priorities. Hot areas
  have been dug or parked, and every remaining unknown or warm area is named with why it is low-risk
  (for example: static content, unchanged since clean passes, or covered by regression tests).
- **Results have asymptoted:** the last few charters came back clean quickly, and new user-impacting
  findings have trended to zero across several turns, not one lucky dry turn.

`converged: true` (every leaf cold) supports the declaration but is not required for it. Stopping on
budget is not the same as dry: report the remaining heat and the next charter you would run.

## Output

- The updated `product-map.json`, passing `validate-map.mjs`.
- The run log: for each turn, the charter record, the findings with severities and where they were
  routed, and the tally line from `update-map.mjs`.
- A closing verdict: the dry declaration with its reasons and low-risk list, or the reason for
  stopping with the hottest remaining areas and the next charter.

## Optional connections

- **Quality strategy:** when the project has one, take the top-level `qualities` from its priorities.
- **Tracker:** findings may also be filed in the project's tracker, and charters too. The hunter
  reads the tracker, so a filed charter carries only what the hunter may see (story, angle, starting
  point); node ids and heat reasoning stay in the run log. The map stays the source of truth for heat.
- **Deeper heuristics:** Dan Ashby's exploratory-testing skill (`danashby/Exploratory-Testing-Skill`)
  covers tours and data attacks in depth. Nothing here requires it.
