---
name: define-ooda-loop
description: >-
  Define a standing OODA loop over something, so that it re-runs on a trigger without anyone
  remembering to start it. Use when the user asks to define, build or set up a standing or
  recurring improvement loop, or to check whether a claimed OODA cycle really ran. For one cycle
  on a miss or a problem, use run-ooda-loop.
---

# Define an agentic OODA loop

This skill does one of two jobs with an OODA loop (Observe, Orient, Decide, Act, and a fifth
part, Loop):

- **Define a standing loop** over one named object. The result is a saved loop definition with a
  trigger that starts each later cycle without anyone remembering to invoke it. A named agent or
  person runs each cycle the trigger starts, for example with `run-ooda-loop`; this skill is not
  run again for them. The rest of this page is for this job.
- **Check a claim** that a cycle ran or that a loop is live. Build nothing. Compare whatever
  record the claim rests on (a trace, a cycle log, commits, the conversation) with "What counts
  as a cycle, and a live loop" below. Report which pieces are there, which are missing and whose
  work each phase was, and stop.

Work from the object's own artifacts and from the goal, authority and reference frames the user
names. If the goal or the authority is missing and the user is there, ask them before you start.
Any other source that is missing is a gap. Record it as one and do not substitute whatever is
easy to find.

## Goal

Define a clear agent-improvement loop over a process, tool, skill, workflow, product, or any
"observable thing" that the user wants to be improved. Success looks like a loop that will
actually be executable by agents, as well as understandable by humans. Agents can:

- **observe** - what is happening with the object under loop? What is it doing?
- **orient** - is what is happening with the object and what the object is doing good or bad,
  or we don't know? What oracles and proxies do we use to decide? If we don't know, how could we
  find out? How could it be better?
- **decide** - what should we do about it?
- **act** - what is the plan for improving the object under loop? How and when do we execute it?
- **loop** - when do these steps run? On what cadence, and under what trigger?

The OODA loop itself is considered part of the object under loop - so a loop must always observe
itself as well as the user's defined object, and all five parts are up for improvement, so that
the overall system rapidly trends towards "good" in a self-orienting way.

## What counts as a cycle, and a live loop

Both OODA skills use these definitions.

**A cycle ran** when there is evidence for each phase: the observation artifact, the oracle it
was judged against, the decision and the authority behind it, and the act that landed, or the
recorded null decision, with its effect check named (what a later Observe should look at to tell
whether the act worked). A cycle whose act was delegated or escalated and has not come back is
waiting, not complete.

**A loop is live** when its trigger is installed and there is evidence that it fires.

If a piece is missing, say which one and do not make the claim. Taking something in and acting
on it, with no observation of the object and no judgement against an oracle, is not a cycle.
Reading outside material is not observing the object, so adopting outside advice with no prior
observation is a choice of taste. Phase work that a person supplied is credited to that person
and not to the loop's machinery.

## The five parts: meaning and tooling

For each part, the definition says what the part means for agents on this object, and what
tooling and preparation must exist before an agent can do it. Write this frame as a table with a
row for each part and those two columns. Whatever the second column lacks is a gap. For a small
object, a cell can be a single line.

An **oracle**, in the testing sense, is any source that can tell good from bad for this object. A
**proxy** is an indirect signal that stands in for one.

### Observe

**What it means.** Read the evidence classes that were declared in advance: the object's own
artifacts; any other declared class, such as behavioural traces, incidents that name the object,
friction reports, and reports of users or readers who gave up or came back confused; and the
loop itself. Evidence about the loop is its trigger firings, its cycle records and any effect
check from a past act that no later cycle has made. Observation looks *at* the system. Outside
reading is not observation and belongs in Orient.

**What it needs.** A way to capture each class and a baseline for it; measurements whose outputs
are saved; and a class list that is fixed when the loop is defined and changed only by a
recorded decision.

### Orient

**What it means.** Judge the observations against the goal and the oracles, classify each as a
defect, drift or an opportunity, and rank them by their effect on the goal. External best
practice and human expertise come in here, as lenses on what was observed. Ask why the existing
oracles did not catch a problem sooner; the answer is an observation about the loop.

**What it needs.** Oracles the agent can reach: stated intent, written standards, past
behaviour, comparable objects, and the reactions of the people who matter. Tools that compare
declared state with actual state and show what is missing. A judging agent or person, and
a named supplier of that context who refreshes it when what the judge holds may be stale.

### Decide

**What it means.** Choose to act, defer or escalate under the authority map. The definition
records this map: which kinds of decision the loop settles itself and which go to a named owner.
Unless the map says otherwise, a decision goes to the owner when it is irreversible, crosses
owners, is a matter of taste or makes an external commitment. A decision with no observation
behind it is taste, not OODA.

**What it needs.** Recorded grants of authority; a default for when the owner is absent; an
escalation route that puts the decision in front of the owner, because filing it somewhere they
might look does not reach them; and a decision record that cites its evidence.

### Act

**What it means.** Make the change in the place that governs the behaviour (instructions, code,
config), verified, and reversible where possible. Removing something that works badly is a valid
act. Each act names its effect check.

**What it needs.** A way of making changes that has pass/fail checks, and a place to record each
effect check.

### Loop

**What it means.** Closing the loop, which is the part most often forgotten. The trigger
actually fires, and each later cycle makes the effect checks still outstanding and observes the
loop's own health alongside the object's. A definition run sets that up.

**What it needs.** A timer or event trigger with a heartbeat, meaning a record each time it
fires; a dead man's switch, meaning an alert when an expected firing or cycle does not arrive,
so that a dead trigger cannot be mistaken for a quiet period; a cycle log; and a list of effect
checks that nobody has made yet.

## Choosing where Observe reads from

Ask *"where would I already see this?"* before *"how do I make this report?"*

1. **Evidence you already have beats evidence you build.** A component that "cannot report" is
   usually one whose existing record nobody has read. A command guard that blocks and records
   nothing is often visible in the calling session's log, and instrumenting the guard would put
   every guarded command at risk.
2. **Observe from outside (black-box monitoring).** A self-reporting component fails together
   with its report, and a failed component is the one least able to say so. Reach inside only
   when the signal does not survive the boundary.

## Procedure

1. **Name one object and its goal**, bounded tightly enough that an observation can point at it.
   An instance named together with its class ("this skill" and "our skills") is one object with
   more oracles; separate objects get separate definitions. Keep the definition next to the
   object, following the conventions of the object's home, and say where you put it.
2. **Declare the evidence classes**: the object's artifacts, every other class the loop may
   read, and the loop itself. Give each its capture route and its baseline, which is its state
   now, so that later cycles can see change.
3. **Fill the frame.** For each part, explain what it means for this object. For each thing it
   needs, name an existing artifact or tool, or record a gap.
4. **Turn gaps into build work.** Write each as `GAP — owner — follow-up — oracle`, where the
   oracle is a check that can fail. Mark a gap **blocking** if it stops any phase or the trigger
   from running; other gaps are improvements the loop can carry. Close the gaps within your
   authority and verify them. Some gaps are choices the evidence cannot settle. Ask the owner if
   they are there to ask; otherwise record the gap and continue, because blocking stalls the
   definition and guessing takes a decision that is theirs. If a gap's risk would rule the
   design out ("a fault here breaks every call"), that is a verdict on the design: change the
   design, and do not treat the risk as a reason to build it later.
5. **Install the trigger.** It is a timer or a named event, such as a merge or deploy, an
   incident, or a reader giving up on the object. Record the cycle it starts, the named agent or
   person who runs that cycle, its heartbeat, and the dead man's switch that shows when it has
   gone stale. A written intention to rerun is not a trigger. A cycle that starts unattended has
   no more authority than one a person starts: decisions the authority map gives to an owner
   still go to that owner.
6. **Run the first Observe.** Read only the declared classes, and write the result as the first
   entry of the loop's cycle log: object and goal, class baselines, trigger identity, timestamp,
   findings, and where later cycle records go. If a gap blocks the trigger or this Observe, save
   the partial definition and name the blocked step, so that the log never shows an Observe that
   did not run.
7. **Check before handing back** (below). Fix and recheck, or record the remaining gap and keep
   the loop labelled unfinished.

## Check before handing back

- Evidence classes were fixed before the first Observe, each with capture and baseline, including
  the loop itself; external material appears only in Orient.
- Every part has its meaning explained for this object, and each thing it needs is an existing
  artifact or tool, or a gap; every gap has an owner, a follow-up and an oracle that can fail.
- Any class that requires instrumenting the object says where the signal is already recorded and
  why that record is insufficient.
- Decide states what the loop may settle itself and what goes to whom.
- The definition says where each Act records its effect check, and Loop lists the ones nobody
  has made.
- The trigger is installed with its heartbeat and dead man's switch, or its absence is an owned gap.
- The first cycle-log entry exists, or the gap blocking it is named.

## Output

Hand back the definition's path, the evidence classes, the completed frame, the gap list, the
trigger's identity (or its gap), the location of the cycle log and its first entry (or the gap
blocking it), and one status:

- `OPERATIONAL` — no blocking gap is open, the trigger is live (a test firing counts as evidence
  that it fires, so a new event trigger need not wait for a real event) and the first cycle-log
  entry is written. List the non-blocking gaps.
- `UNFINISHED — DEFINED, NOT OPERATIONAL` — anything else, with each open gap in full.

A waiver or a note accepting the risk does not make missing machinery work, so it does not
change the status. If the frame or a check does not fit the object, tell the user rather than
quietly weakening the definition.
