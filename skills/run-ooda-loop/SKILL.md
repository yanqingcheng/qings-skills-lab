---
name: run-ooda-loop
description: >-
  Run one OODA improvement cycle on something. Use when the user asks for an OODA loop or to
  reflect on a process learning ("how do we do better next time"). Contains instructions to keep
  track of multiple things that need improvement as the first one is analysed. To set up a
  standing loop, use define-ooda-loop.
---

# Run an OODA loop

Run one OODA loop (Observe, Orient, Decide, Act) over one named object, delving into related
objects as necessary to resolve the original object's issue.

## Standing process instructions for this skill

**Trace.** Trace at moment of use, in a running log. An untraced process evaporates; a trace
written afterwards is retrospective rationalisation. The trace holds the on-ramp, the stack with
every push and pop, each observation against its object, each decision including the null ones,
friction events with the expectation behind each, delegations with their results, and the check
at the end of this page. A good trace prevents you from going round in circles and gives the user
a clear "why" on any decisions made.

**The object's home** is the directory, repository or document set that owns it. For a miss that
someone reported, the issue or pull-request thread where it was reported counts. Keep the trace,
the decision records and any loop definition there, following its conventions. If it has none,
keep them in a notes location beside the object and say where. If the object already has a loop
definition (for example one made with `define-ooda-loop`), use its evidence classes, its oracles
(the sources that tell good from bad for the object) and its authority map (which decisions the
loop may settle and which belong to an owner) as this cycle's inputs, and log the cycle where it
says.

**Decisions that are not yours.** A choice that belongs to the user or another owner goes to
them: a matter of taste, one that depends on private context, an external commitment, or an
effect that is irreversible or crosses owners. If they cannot answer now, record a gap in the
trace as `GAP — owner — follow-up — oracle`, where the follow-up is what will get the decision
answered and the oracle is how anyone will tell it has been settled. Route the decision to its
owner and carry on with the rest of the cycle.

## The object-under-loop stack

At every moment there is exactly **one named object under loop**, said out loud. Everything else
follows from that.

**Pushing or popping the object under loop.** If an observation reveals a deeper, or more
specific, object to investigate, push: "NEW OBJECT UNDER LOOP: Y". X stays on the stack with its
pending decision intact. When Y resolves, pop back to X. The stack has return addresses; that is
the entire difference between deep investigation and rabbit-holing. Maintain a written stack of
objects under loop as part of documenting your investigation.

Learning that X is a class rather than a one-off is not a push; it is part of observing X.

Each phase below ends at its exit check: pass it or stay in the phase.

## Phase 0 — Define: name the object under loop

**Name it.** "OBJECT UNDER LOOP: X." All observations from here attach to X and only X.

If you (or the user you're working with) feel confused, out of control and can't name what's
wrong, run the valence-first unload *first*: say what feels wrong, stuck or worrying before
sorting any facts, until the thing most in need of attention can be named.

- The object under loop may be a single instance of an object (for example, a specific skill), or
  a class of objects (for example, the user's skills in general, or some category of skills).
- If there is more than one object under loop, it's ok to name both: it doesn't affect the loop
  and just provides more oracles to work from.
- If at some point during investigation the object clarifies, we can split into parallel loops
  for the parallel objects (some of which may receive no actions). When an object resists repair
  because it is secretly several things, reclassify by job before fixing.
- However, if at some point during the investigation we begin investigating a *different*
  object, we add a new OODA loop to the stack for the new object.

Whenever the object changes, by a push, a split or a better name, announce the change and record
it in the trace, because an observation attached to the wrong object misleads whoever reads the
trace later.

## Phase 1 — Observe: get to the bottom of what's going on

- **Pin down the observation(s).** What is happening with X? What is X doing?
  Being precise about the observation helps with orientation.
- **Notice if you are confused.** If something seems weird, interrogate: "what is actually going
  on? how can I find out?" Prefer the freshest specific instance over the general complaint. How
  often the observation is happening is a part of the observation. Is it happening as a class of
  issues, or a one-off?
- **Go to the bottom.** Before leaving Observe, ask:
  - What's happening?
  - What's *really* happening?
  - Why is it happening?
  - What's the causality chain behind this happening? (5 Whys)
  - Are there other classes of this failure? Do you have the full picture?
- **Chase mechanics.** Keep asking why until you can point at a mechanism.
- **Ask for a second opinion.** Delegate to another agent if appropriate for level of detail, and
  record what it returns.
- **Be clear about epistemic status.** Separate concrete observations from hypotheses.

If there's some information that would be really useful but you just can't get it, record the
shortfall. The output of the OODA loop may be to strengthen what is observable.

**Exit check:** you can state what is really happening with X, supplying evidence a fresh reader
could re-verify, and you know whether it is a class or a one-off.

## Phase 2 — Orient: judge against oracles, then diagnose the deviation

An oracle, in the testing sense, is any source that can tell good from bad for this object.

**Orient against oracles.** Work out whether the observation is good or bad against the oracles
we have available, and in what way it is good or bad. Oracles to consider:

- "How is X supposed to be working?" Documentation of the user's intention, specifications,
  or inferable user preferences.
- "Have we written down what good looks like?" Existing object-specific documentation of its
  OODA loop, or more general high-level documentation of principles and thesis.
- "Has this worked better before?" Historical documentation of previous operation.
- "Is there something else similar to X that works better?" Internal or external comparable
  references.
- "Are the people who matter happy or unhappy? What are they happy or unhappy about?"
  Deriving quality-as-value from first principles.
- "Is it good enough?" Many things aren't perfect but are good enough. Is this an impediment to
  the goals we are trying to achieve now?

The user's own stated preferences matter as much as standard best practice, and may override it.
Don't be dogmatic either way - oracles are proxies for good and bad, not base truth.

If we don't know, push "the orientation process for X" onto the object stack, with
"does it help us orient on this observation?" as the oracle, to try to find one.

If we really can't orient, record the situation. The output of the OODA loop may be to ask for
more oracles.

*Once you have oracles:*

Work out ways in which the observation could be different and better, using the oracles
found: for example, clear "should"s that are not being followed, or specific ways we can address
user happiness or unhappiness.

**Prioritisation.** If there are multiple issues, prioritisation is part of orientation. You
will need to use your judgement. Example principles for prioritisation include:

- biggest impact first
- biggest blocker first
- most immediate felt benefit first
- the thing that's going to make other fixes irrelevant first.

**Diagnosis.** Once the oracles are in hand, a second layer of diagnosis opens that observation
alone could not reach. Ask questions such as:

- Why is it failing?
- Why is it not living up to the existing standards?
- Why did the oracles in our existing processes not catch this?

The last question audits the instrument itself. Carry its answer into Document so the oracle set
improves with every incident. Where the oracles say the object is good enough, there is no
failure to diagnose. Instead ask why it was raised, because the expectation behind the report is
often worth recording as an oracle.

**Exit check:** every good/bad judgement names its oracle; you know what better looks like; you
know what good enough looks like; plural issues carry an ordered priority with a stated reason;
and the issue is diagnosed, including why the existing oracles missed it, or the object is
judged good enough against a named oracle. A shortfall whose cause waits on an observation you
could not get is recorded as undiagnosed, with that observation named.

## Phase 3 — Decide: make a plan for action

**Decide what to do.** Make a plan to improve the situation, addressing one or more of the
top-priority issues found in Orient.

- If, as part of your decision, any dependent object is unclear, or "not right" for what you
  need it to achieve, prefer to **push** that object onto the stack and run an OODA loop over
  it, rather than try to work around it.
- **Check the record before inventing.** Search where the record would be (the object's home,
  its repository, the team's notes and decision logs) before accepting "X doesn't exist", and
  write down what you searched. Improvising a new mechanism where the record already holds one
  is the exact failure this loop exists to catch.
- **Consider multiple solutions.** Start with the most obvious potential actions, but don't
  limit yourself to one idea. Decide whether to choose the best idea, or take multiple actions
  at once.
- **Review against best practices and oracles.** Does your idea actually improve the situation?
- **Write it down** at its weight, including the null decision ("no action needed if the loop
  restarts") and the non-decision ("left open"). A decision that changes what others may do also
  goes in the object's decision log.
- **When will you observe again?** At what point will you know whether this plan is working?
  Document it or, even better, schedule an action or create an action trigger. Also name what
  that observation should look at to tell whether the plan worked. If none of these can be
  arranged, write `UNSCHEDULED — <what would have to happen>`.

**Exit check:** the decision is written as an actionable plan, or as a decision to take no
action with the oracle that supports it; the record was checked before anything was invented;
the decision is appropriate in scope for the object and the issues at hand. The next observation
is scheduled or a trigger decided, or it is recorded `UNSCHEDULED` with what would have to
happen.

## Phase 4 — Act: act, document, review, close

1. **Act, delegate, or escalate.** Small and safe → do it now. Mechanical → delegate. Big →
   escalate. An action is safe when you can state its blast radius: what it could break and who
   would feel it. Big includes irreversible, cross-owner and beyond your authority. Deleting
   something that works badly is a valid act. Make sure the next observe phase is scheduled (may
   be a no-op if the existing schedule suffices). If delegating or escalating, it is your
   responsibility to take adequate records and pass on suitable briefing such that you can return
   to this point when the action completes. You may, for example, give a callback pointer: a
   reference to a task or document for the person receiving your briefing to pass to you when
   they are done. A null decision has nothing to act on; go on to Document.
2. **Document.**
   - Record any user expectations which triggered the observation by incorporating them into the
     oracles for the relevant class of object: *where they looked is where it belongs; how
     they'd have said it is how it should be written.*
   - Record any other oracles or decision-making principles that should be associated with the
     object.
   - If there are multiple objects or classes under loop, pick the most general and appropriate
     one that applies, and add a pointer to the general instance from the specific one if
     needed.
   - Follow any decision-logging conventions of the object's home. If the object does not
     currently have a home, find one for it.
3. **Self-review.** Review your actions and documentation. If you need a second opinion,
   delegate an agent to adversarially review it. Make sure that you followed the steps properly;
   that your actions make sense and clearly improve the object, or the decision to take none
   rests on a named oracle; and that your documentation is clean, follows conventions, coherent,
   and readable to a fresh reader.
4. **Closing decision.** Decide whether to:
   - do another action
   - re-run the loop, or push another layer (if more observations happened when the action was
     happening)
   - continue.
5. **Pop** the live object from the object-under-loop stack. If the stack is not empty, resume
   the object beneath it.

**Exit check (the stop condition):** you've exited the action phase of the original object under
loop; all actions are complete, or routed to someone else, and you have a mechanism for
completing this level of the stack once the routed actions complete. The stack popped clean, or
you are about to re-run a loop; every finding is filed to a home the user can navigate to; the
run passes the check below.

## Closing the run

Tell the user which of these the run reached, because they are different claims:

- **Cycle complete.** The act landed, or a null decision is recorded with its oracle, and the
  next observation is named.
- **Waiting on routed work.** A delegated or escalated action has not come back. Say what is
  out, with whom, and where the pointer back to the trace is. The cycle is complete when the
  work returns and you have resumed.
- **Unresolved.** The evidence or an oracle could not be had. Say what is missing and what would
  supply it, and do not present the diagnosis as complete, even where an action landed.

With it, give the trace's location and the next observation, scheduled or `UNSCHEDULED`.

One cycle is not yet a loop; it becomes one when something starts the next cycle. If the next
observation is `UNSCHEDULED`, or the same object keeps coming back, tell the user that a
standing loop would cover it and that `define-ooda-loop` sets one up, and set one up only if
they ask. That skill also holds the definitions of a cycle and a live loop that both skills use.

## The interrupt — friction fixes first

Event-triggered, pre-empts whatever is running: the user hits friction with the system itself
(expected to find a thing and couldn't; can't read a surface meant for them). Stop the main
action if the friction has immediate impact; the friction usually *is* the finding. Record what
they expected, so that Document can fold it into the oracles. Push the friction onto the stack
for its own OODA loop.

If the problem is an observation in passing but does not actually block the job at hand, write
a brief (object, observation, why it matters, owner) and delegate the loop instead.

## Gates

- **Diagnose → design.** When fixing threatens to become redesigning, stop and spawn a design
  session with the right context attached; do not slide on. Fixing has become redesigning when
  it would change the object's purpose, its interfaces or other owners' work.
- **Adoption.** Agent synthesis (new principles, standards or doctrine) stays unadopted until
  the user edits or endorses it. Extraction ≠ doctrine. A bounded fix made under Act is not
  doctrine.

## The check — how to tell a good run from a bad one

- Every observation in the trace attaches to a named object; no orphan observations.
- The stack popped clean: no abandoned objects with pending decisions. An open frame has a
  recorded handoff.
- Each "missing mechanism" claim carries a record-check before any inventing began.
- Friction events appear in the trace with their harvested expectation.
- The run ended at the stop condition and reported which closing state it reached, with each
  finding filed to a home the user can navigate to.
- A reader can reconstruct *why* each action happened from the trace alone.
- The trace was written live: timestamps or interleaving show it.

If a step does not fit the object, tell the user instead of quietly working around it.
