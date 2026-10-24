---
name: review-to-asymptote
description: >-
  Repeat review and fix on any artefact (code, docs, spec, plan, skill) until fresh reviews stop
  finding meaningful issues, with the stopping point judged by the caller or an independent
  model, never by whoever made the fixes. Use when asked to review "until asymptote", "until dry"
  or "until reviews stop finding things". A single review or a fixed number of passes does not
  need this.
---

# Review to asymptote

An artefact is at **asymptote** when re-review stops finding meaningful issues. What makes the
loop trustworthy is who decides it has stopped.

- **Cycle** — review, fix, then review the fixed state again. Budgets count cycles.
- **Round** — one reviewer's pass for one purpose (a lens, the open review, or the coherence pass).

## The reviser never calls asymptote

Roles are defined by relation to the edits:

- **Reviser** — anyone who wrote a fix to the artefact during the loop.
- **Caller** — the agent that dispatched the loop's reviewers and fixers without editing the
  artefact itself, or anyone above it (the person who asked).
- **Owner** — whose artefact it is and whose taste decides; usually the person who asked. With no
  human in the loop, treat the owner as absent: batch owner questions into the hand-back.

The reviser does not judge whether the artefact has converged. Having written the fixes, it reads
the artefact as it meant it to be read and misses what it cannot see in its own work. The judge is
one of:

- **The caller.** Accepting or rejecting individual findings along the way is adjudication and
  does not disqualify it. Where it has a reviser's report, it reads the current artefact first.
- **An independent model** — a reviewer that made no edits, has not seen the reviser's reasoning,
  and was not briefed in a way that steers the verdict. Prefer a different model family from
  the reviser's, if one is available, since reviewers from the same family share blind spots. A fresh same-model agent with a
  different brief is a weaker substitute; if you use one, say so in the verdict. Role-play
  personas inside the reviser's own context are not independent.

The judge gets the artefact, the framing (scope, what good looks like, the meaningful line) and
the trajectory (angles, models and briefs tried, with per-round counts); finding contents,
dispositions and the reviser's reasoning are withheld until after its own pass.

The judge answers two questions, not one:

1. **Did the latest rounds find meaningful issues?** Any accepted meaningful finding means another
   cycle.
   Polish does not; it may be fixed after the verdict without reopening the loop.
2. **Which angles are still missing?** Whoever briefs the reviewers also chooses their angles, and
   a clean round from an angle already tried is weak evidence. If the judge can see an untried
   angle that could plausibly find something — a different model family, a different high-level brief, a
   reader or user the reviews have not simulated, a seam between parts — it names it (and runs it
   if it can) before calling asymptote.

**If you edited the artefact**, do not declare asymptote. Either get an independent judge and
report its verdict, or hand back what [What to hand back](#what-to-hand-back) lists, marked *ready
for a convergence verdict*, so your caller decides.

**No subagents available** (no one to dispatch reviewers to): first try launching a fresh process
with only the artefact and a brief — for example `claude -p` or `codex exec` — since that is closer
to independent than anything done in your own context. Failing that, run the loop yourself: keep
review passes separate from fix passes, vary the review briefs between cycles, and make sure the
re-review in step 4 is a separate pass rather than a check of your own fixes. A fresh process on a
different model family may report its verdict as the independent judge. If you fell back to your own
context, hand back as *ready for a convergence verdict, no independent reviewer was available*.

## Frame the loop

Before the first cycle, write down:

- **Scope** — the exact files, sections or components under review. "The docs folder" lets a
  reviewer skip parts silently; a list does not.
- **What good looks like** — the artefact's purpose and audience, in a sentence or two. Reviewers
  judge against this, not against generic quality.
- **Meaningful vs polish** — for a whole artefact, a meaningful issue would change what a reader,
  runner or user does, gets or understands; polish would not. State any artefact-specific line
  (for example, "any behaviour change is meaningful; naming preferences are polish").
- **Lenses** — a lens is one named class of problem to look for, such as a principle or recurring
  comment theme the owner has already given. Quote the owner's wording or point to where it lives.
  You may merge overlapping principles into one lens or split a bundled one; label that, and label
  anything you generalised, as your own expansion. A paraphrase that drifts and is then enforced as
  a rule is this loop's most expensive failure.
- **Shape** — a **whole-artefact loop** (the default) runs open reviewers, lens reviewers and a
  final coherence pass. A **single-lens loop**, when the caller scopes it that way ("keep doing
  verbosity passes until asymptote"), runs that lens's rounds only; say so in the hand-back, with
  the reason fewer reviewers sufficed. Draw its meaningful line inside the lens — for verbosity,
  a finding is meaningful if a reader would read materially more or more slowly because of it —
  otherwise the first round always looks converged.
- **Budget** — a cycle limit for each lens and a separate cycle limit for the open review (six
  each is a reasonable default unless stated), each counted across the whole loop: a cycle uses one
  unit however many reviewers ran it, and coherence re-runs count against the open-review budget.
  Name the checks too (tests, build, validators).
- **Record** — one directory or file holding the framing, each round's reports, dispositions,
  class searches and owner questions. Point reviewers to it, to open only after their own pass.

If the owner is present and scope or lenses are genuinely unclear, confirm them once here. Do not
check in again until the end.

## Run the cycle

**1. Review with two kinds of reviewer.** Each finds what the other misses. Run the checks before
dispatching: a round over a known-red state counts toward neither budget nor verdict; fix the
checks first.

- **Open reviewers find unknown classes.** Give them the artefact, what good looks like and the
  scope, and ask *why* the artefact might fail its purpose. Give them **no checklist**: a reviewer
  handed a list of things to check checks those things and stops. Use different model families and
  different high-level briefs where you can (a new user, a maintainer, an adversary, the runtime
  that will execute it); with one family, vary the briefs and note it. Each new class they find
  becomes a lens.
- **Lens reviewers cover known classes.** One reviewer per lens, carrying that lens only, over the
  full scope. This is how an owner's principles get applied everywhere rather than where someone
  happened to notice.

A lens reviewer starts with its own lens as its brief; an open reviewer starts with none. Only after
its own fresh pass does a reviewer read the full lens list, every earlier report for its lens or
role (not just the latest), and the latest open and coherence reports. Then it marks each finding as
a known or new class and, from the second cycle on, as **new**, **unfixed** (the same finding back
because an earlier fix did not take) or **spread** (the same pattern at a site no earlier report
named), and returns a verdict: *meaningful findings* or *polish only*.

**2. Adjudicate.** Check each finding against the current artefact. Accept, reject with a reason,
or route it to the owner (below). Reviewers are sometimes wrong; a rejection needs evidence from
the artefact, not a preference.

**3. Fix the class, not the site.** For each accepted finding, search for every other instance of
the same problem and fix them all; record the search you used, so the next reviewer can check it.
When a fix moves or consolidates content, point to the one canonical home rather than restating
it. Never make a finding go away by weakening a test, check or assertion. Give every finding a
disposition: fixed, already resolved, rejected with a reason, or needs an owner decision. A caller
that means to judge convergence dispatches the fixes rather than editing the artefact itself; if it
edits, it becomes a reviser and the verdict passes to an independent judge.

**4. Re-review the fixed state**, with reviewers who did not make the fixes. Return to step 1.

**5. Finish with a whole-artefact coherence pass** (whole-artefact loops). Per-lens rounds each
look at one thing, so clean lenses do not make a good artefact. Once every still-running lens and
the open review have returned polish only, run a reviewer with every lens live at once over the
full scope, asking specifically about seams between parts, duplication across them, and whether
the known-open items are still as described. Stopped lenses carry their honest partial into this
pass and the hand-back. Any meaningful finding goes back through fix and independent re-review.

## Asymptote, plateau, or budget reached

- **Asymptote** — the judge has seen independent rounds over the current state return polish only,
  from angles it considers sufficient, including the coherence pass in a whole-artefact loop.
- **Plateau** — a lens's accepted meaningful findings are non-zero and no fewer than the previous
  round's; a single non-decrease triggers it (e.g. 12 → 9 → 9, or 9 → 12). More of the same rounds
  will not help; the problem is usually structural and needs a different approach, or an owner
  decision. Stop that lens and report it as an **honest partial**, with a named follow-up — never
  as asymptote.
- **Budget reached** — stop and report as an honest partial, whatever the trend.

## Taste belongs to the owner

When a finding turns on what the owner wants rather than on the stated purpose, do not decide it.
Record it as a question with the finding that raised it and a concrete proposal, and continue the
loop around it. Deliver these together at the end. An unattended run never blocks on them and
never guesses.

## What to hand back

- Per lens: clean or honest partial (with its follow-up). Overall, including the coherence pass:
  one judge's verdict — **asymptote** or **honest partial** — naming the judge; or, where no judge
  ran, *ready for a convergence verdict*.
- The loop's shape and why, and the trajectory — meaningful findings per round — with the angles,
  models and briefs tried. This is what lets a judge spot a missing angle.
- Finding dispositions, including rejected findings with reasons.
- The owner questions, each with its proposal.
- Check results for the final state, re-run after any post-verdict polish, and a list of those
  polish edits.
- Any sign the loop did not really run, stated plainly: every lens clean on its first round (in a
  whole-artefact loop), a verdict resting on the reviser's own review, or a result clean only
  because nothing was exercised.

## By artefact

- **Code** — reviewers may run the code and tests; a failing check the fixer missed is a
  meaningful finding. Keep correctness verification (tests, builds, the project's own review tools)
  in every round; review to asymptote adds the loop and the independent stop, it does not replace
  them.
- **Text meant for agents or people** (skills, specs, docs) — every substantive fix changes the
  communication, so add clarity as a lens. Review by agent judgment; hard-coded
  string checks catch only the wording someone already thought of. Reach asymptote on the text
  before spending on behavioural testing of it.
- **Plans and designs** — include a reviewer who walks concrete cases through the plan end to end;
  gaps show at transitions.

If your environment provides review-campaign tooling, use it; nothing here depends on it.
