---
name: run-ooda-loop
description: >-
  Run one OODA improvement cycle over a named object, such as a miss, regression, user correction
  or felt problem: one object under loop at a time, an explicit stack so deeper investigation
  returns to its caller, an exit check per phase and a trace kept as you go. Use when explicitly
  invoked. To set up a standing loop with its own trigger, use define-ooda-loop.
---

# Run an OODA loop

One cycle of John Boyd's OODA loop over one named object, in Qing Cheng's agent form: exactly one
object under loop at a time, a written stack that gives other objects a return address, an exit
check that must pass before leaving each phase, and a trace written while you work. The run stops
when the loop is restartable, not when everything is fixed. Hers are the on-ramps, the stack, the
phases and their exit checks, the act routing and the check; the glosses for readers outside her
workstation are the maintainers'.

**The object's home** is the directory, repository or document set that owns it; for a Miss, the
issue or pull-request thread where it was reported counts. The trace, decision records and any
loop definition live there, following its conventions; if it has none, keep them in a notes
location beside the object and say where. If the object already has a defined
loop (for example from `define-ooda-loop`), use that definition's evidence classes, oracles and
authority map as this cycle's inputs and log the cycle where it says.

**Authority.** Settle what is within your authority. Take choices that belong to the user or
another owner (taste, private context, external commitment, irreversible or cross-owner effects)
to them. If no one can answer now, record `GAP — owner — follow-up — oracle` in the trace, route the
decision, and carry on with the rest; do not take it yourself.

## On-ramps

- **Chosen** — you can already name the object. Name it in phase 0 and continue.
- **Felt** — you or the user feel confused or out of control and cannot name what is wrong. First
  unload valence-first (what feels wrong, stuck or worrying, before sorting facts) until the thing
  most in need of attention can be named. That name is the object. Do not use this ramp when
  Chosen applies.
- **Miss** — an agent error, a user correction, or an output that failed its reader, including a
  defect a user reports. The miss is the object and the observation, already pinned; phase 1 asks
  whether it is a class or a one-off. The process that let it through is a different object: push
  it if you need to work on it. If users are being harmed now, a small, safe stop-gap may go first;
  record it in the trace immediately and continue the loop.

## The object stack

At every moment exactly one object is under loop, and you say which.

**Push** when you need to investigate or change a *different* object: a deeper or more specific
one, or something your work depends on that is unclear or wrong for what you need; push it rather
than work around it. Announce "NEW
OBJECT UNDER LOOP: Y" and write it on the stack; X keeps its pending decision. When Y's loop
finishes, **pop** and resume X where you left it. The return address is the difference between
deep investigation and a rabbit hole. Learning that X is a class rather than a one-off is not a
push; it is part of observing X.

Naming both an instance and its class ("this skill" and "our skills") is fine and gives more
oracles. If the object turns out to be secretly several things, reclassify it by job before fixing,
and split into parallel loops; some may get no action. Never rename the object silently.

## Phase 0 — Define

"OBJECT UNDER LOOP: X." Every observation from here attaches to X alone.

## Phase 1 — Observe: get to the bottom of what is going on

- Pin the observation: what is the object actually doing? Prefer the freshest specific instance to
  the general complaint. How often it happens is part of the observation: class or one-off?
- If something seems odd, find out why before moving on. Ask: what is happening, what is *really*
  happening, why, what is the causal chain, and are there other classes of this failure? Keep
  asking why until you can point at a mechanism.
- Separate what you observed from what you hypothesise.
- If you are too busy to dig into as much detail as needed, delegate the dig to another agent and
  record what it returns.

**Exit check:** you can state what is really happening with evidence a fresh reader could
re-verify, and you know class or one-off. If not, gather more data another way.

## Phase 2 — Orient: judge against oracles, then diagnose

An oracle is any source that can tell good from bad for this object. Judge whether the observation
is good or bad, and in what way, against those available:

- How is this supposed to work? (the user's stated intention, a spec, inferable preferences)
- Have we written down what good looks like? (this object's loop definition, broader principles)
- Has it worked better before?
- Does something similar work better?
- Are the people who matter happy or unhappy, and about what?
- Is it good enough for the goals in play now?

If no oracle answers, push "the orientation process of this loop" with the question "do we have an
oracle that can help us orient on this observation?".

Then say how it could be different and better. With several issues, order them and name the reason:
biggest impact, biggest blocker, most immediate felt benefit, or the fix that makes other fixes
unnecessary.

**Diagnose.** With the oracles in hand, ask why it is failing, why it falls short of the standards
that exist, and **why the existing oracles did not catch it**. That last answer is an observation
about the loop itself; carry it into Document so the oracle set improves with every run.

**Exit check:** every judgment names its oracle; you know what better and good enough look like;
multiple issues have an ordered priority with a reason; the issue is diagnosed, including why the
oracles missed it.

## Phase 3 — Decide: make a plan

- Plan to address one or more of the top-priority issues from Orient.
- **Check the record before inventing.** Before accepting "X does not exist", search where the
  record would be (the object's home, its repository, the team's notes and decision logs) and write
  down what you searched. Inventing a mechanism the record already holds is the failure this loop
  exists to catch.
- Consider more than one action, then choose one or several. Check the choice against the phase 2
  oracles: does it actually improve the situation?
- Write every decision down at its weight, including the null decision ("no action needed if the loop restarts")
  and the non-decision ("left open"). A decision that changes what others may do also goes in the
  object's decision log.
- At what point will you know whether this plan is working? Name what you will look at, and when:
  a scheduled job, a trigger, or a named future event. If you cannot schedule it, write
  `UNSCHEDULED — <what would have to happen>`.

**Exit check:** the decision is an actionable plan, sized to the object and its issues; the record
was checked before anything was invented; the next observation is scheduled, its trigger named,
or recorded `UNSCHEDULED` with what would have to happen.

## Phase 4 — Act: act, document, review, close

1. **Act, delegate or escalate.** Small and safe → do it now (you can say what it could break and
   who would feel it). Mechanical → delegate. Big, irreversible, cross-owner or beyond your
   authority → escalate to the owner. Deleting something that works badly is a valid act. When you
   delegate or escalate, you are responsible for the record and the briefing that let you resume
   here when the work returns; give the recipient a callback pointer to this trace.
2. **Document** at the object's home, following its decision-logging convention.
   - Fold any expectation that triggered the observation into the oracles for that class of object:
     *where they looked is where it belongs; how they would have said it is how it should be
     written.*
   - Record any other oracles or decision-making principles that belong with the object.
   - File a lesson against the most general object it fits and point to it from the specific one.
     An object with no home gets one.
3. **Self-review** your actions and documentation: the steps were followed, the object is clearly
   better, and the record is readable cold. If you need a second opinion, have another agent review
   it adversarially.
4. **Closing decision:** another action (repeat this phase), new observations while acting (return
   to phase 1 or push them), or done.
5. **Pop** the object. If the stack is not empty, resume the object beneath it.

**Exit check (the stop condition):** the original object's action phase is closed; every action is
complete or routed with a way to resume when it returns; the stack popped clean or you are about to
re-run; every finding is filed where the user can open it; the run passes the check below.

A finished run is one cycle; without a scheduled re-observation it is not yet a loop. If the
re-observation is `UNSCHEDULED`, or the same object keeps coming back, set up a standing loop with
`define-ooda-loop`, which holds the shared definitions of a cycle and a live loop.

## Friction interrupt

When the user hits friction with the system itself (expected to find something and could not;
cannot read a surface meant for them), the friction usually is the finding. If it blocks the job in
hand, stop and push it. If not, write a brief (object, observation, why it matters, owner), delegate
its loop, and continue.

## Gates

- **Diagnose → design.** When the fix would change the object's purpose, its interfaces, or other
  owners' work rather than repair it, stop and start a separate design session with the context
  attached.
- **Adoption.** New principles, standards or doctrine an agent synthesises stay unadopted until the
  user edits or endorses them. Bounded fixes under Act are not doctrine.

## Trace

Write it as you go; a trace written at the end is a story, not a record. It holds the on-ramp, the
stack with every push and pop, each observation against its object, each decision with its nulls,
friction events, delegations with their results, and the check below.

## The check — a good run versus a vibe

- Every observation names its object.
- The stack popped clean, or each open frame has a recorded handoff.
- Every "does not exist" claim has a search recorded before any invention.
- Friction events carry the expectation harvested from them.
- The run stopped at the stop condition, with every finding filed where the user can open it.
- A fresh reader can tell *why* each action happened from the trace alone.
- The trace was written live: timestamps or interleaving show it.

Fix any failure and recheck. A run without this check is a vibe.

**Framework import** is the pitfall to watch in Orient: judging against generic best practice
instead of the user's intention. Their standard comes from them.

If a step does not fit the object, tell the user instead of quietly working around it. When
changing this skill, run the cases in `evals/run-ooda-loop-eval.md`.
