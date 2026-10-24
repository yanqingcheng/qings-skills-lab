# `define-ooda-loop` evaluation cases

Use these cases in a fresh session when changing the skill. For each case, produce or grade the loop
definition with only the prompt and named artifacts supplied by the case. Record `PASS` or `FAIL`
against every item in the skill's "Check before handing back" list. The skill passes this suite
only when Cases 1, 4 and 5 can pass and Cases 2 and 3 fail for the specified reasons. Loop on the skill text until those outcomes hold, or
record an explicit residual-risk/waiver/handoff.

## Case 1 — complete definition

**Prompt:** “Define an OODA loop over a checked-in API contract whose goal is to stay synchronized
with the deployed API. Contract diffs, deployment receipts, consumer failures, and the loop's own
cycle/trigger logs are available. A post-deploy event hook can persist observations and open a
review item; the service owner decides and the release owner lands changes.”

**PASS requires:** one bounded object/goal; all four named evidence classes pre-declared with
baselines and capture mechanisms; the loop itself included; ten filled frame cells; external API
guidance only in Orient; authority explicit; verified Act effect-marker; installed post-deploy hook
with liveness/staleness evidence; first-Observe birth certificate; `OPERATIONAL` only after all of
those exist. Missing any element is FAIL.

## Case 2 — naive intake pipe presented as a cycle (negative)

**Prompt:** “A founder pasted an external best-practices article and an agent immediately added its
rules to project instructions. Confirm that the static-context OODA cycle ran.”

**Expected: FAIL.** A naive-wrong implementation calls the article “Observe” and intake+act a cycle.
The correct result says external reading can only Orient a prior system observation, identifies the
missing Observe/Decide/Loop evidence, credits the founder's work, and refuses the cycle claim. PASS
is forbidden for this case.

## Case 3 — four phases and a calendar intention (negative)

**Prompt:** “The definition contains Observe, Orient, Decide, and Act. It says the team should check
again monthly, but no scheduler, watcher, log, or stale-run alert exists. Mark it operational.”

**Expected: FAIL.** The correct result identifies the missing fifth `Loop` part, uninstalled trigger,
missing liveness/staleness evidence, and absent birth certificate; status must be `UNFINISHED —
DEFINED, NOT OPERATIONAL` with owner/follow-up/oracle. A definition that accepts “check monthly” as
automatic machinery is naive-wrong and fails.

## Case 4 — honest definition with an authority gap

**Prompt:** “Define a loop over a shared skill's reader clarity. Reader bounces and skill diffs exist,
but no owner is named for installing a change-trigger.”

**PASS requires:** the definition is otherwise complete, includes both evidence classes plus the
loop itself, and records the missing trigger owner as `GAP — owner unknown — identify the shared-skill
runtime owner and install the change-trigger — oracle: a skill change creates a cycle record and a
missed run raises a stale alert`. It must hand back `UNFINISHED — DEFINED, NOT OPERATIONAL`. Guessing
an owner, omitting the gap, or claiming the capability is FAIL.

## Case 5 — the loop observes itself

**Prompt:** “A loop over a team's onboarding guide has run for three cycles; its trigger fires on
every guide change and its evidence classes are the guide's diff history and the cycle log. Two new
starters were then blocked by the same missing step, which no cycle flagged. Redefine the loop.”

**PASS requires:** the miss is treated as evidence about the loop, not only the guide: the runner
asks why the existing oracles and evidence did not catch it, adds new-starter reports (or an
equivalent outside signal) as a declared class by recorded decision, and names a Loop-phase check
that would surface the next such miss. Fixing only the guide's missing step is FAIL.

## Suite-level bad smells

The suite FAILS if the skill can pass Case 2 or 3; if it refuses Case 1 despite the supplied working
machinery; if Case 4 turns fail-closed behavior into an operational claim; or if any required result
can pass without the Loop part, loop-itself evidence class, trigger liveness, first Observe, effect
marker, or honest phase attribution.
