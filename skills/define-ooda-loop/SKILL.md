---
name: define-ooda-loop
description: >-
  Define a standing agentic OODA loop over one named object: pre-declared evidence classes that
  include the loop itself, what each phase means for agents and the tooling it needs, owned gaps,
  an automatic re-run trigger and a first Observe. Use when asked to define, build or set up a
  standing loop, or to check whether a claimed OODA cycle really ran. A one-off "OODA loop this
  miss/problem" is run-ooda-loop.
---

# Define an agentic OODA loop

OODA (Observe, Orient, Decide, Act) is John Boyd's decision cycle; this skill is Qing Cheng's agent
version of it. Hers are the five-part frame with its meaning and tooling columns, the rule that
evidence classes are declared up front and include the loop itself, and the Goal below; the tooling
details and checks are the maintainers' elaboration.

The output is a persisted loop definition whose return edge fires without anyone remembering to
invoke it. Each firing runs a cycle (for example with `run-ooda-loop`) by a named agent or person;
later cycles are not repeat invocations of this skill.

## Goal

Define an agent-improvement loop over a process, tool, skill, workflow, product, or any observable
thing the user wants improved. The loop must be executable by agents and understandable by humans.
Agents can:

- **observe** — what is happening with the object under loop? What is it doing?
- **orient** — how do we tell whether that is good, bad, or unknown? If unknown, how could we find
  out? Which oracles and proxies do we use?
- **decide** — is it good or bad? How could it be better? What should we do about it?
- **act** — what is the plan for improving the object, and how and when is it executed?
- **loop** — when do these steps run, on what cadence, under what trigger?

The loop always observes itself as well as the object, and all five parts are open to improvement,
so the overall system rapidly trends towards "good" in a self-orienting way.

## The five parts: meaning and tooling

Fill both columns for the specific object. The right-hand column is what must exist before an
agent can do the left-hand one; anything missing becomes a gap. An **oracle** is any source that
can tell good from bad for this object; a **proxy** is an indirect signal standing in for one. For a
small object, each cell can be a single line.

| Phase | What it means for agents | Tooling and preparation it needs |
|---|---|---|
| **Observe** | Read the pre-declared evidence classes: the object's own artifacts, any other declared class (behavioural traces, incidents naming the object, reports of users or readers who gave up or came back confused, friction reports), and the loop itself (trigger firings, cycle records, and effect-markers — what each past act said a later Observe should check — not yet followed up). Observation looks *at* the system; outside reading is not observation. | A capture route and baseline for each class; measurements whose outputs are persisted artifacts; the class list fixed at definition and amended only by a recorded decision. |
| **Orient** | Judge observations against goals and oracles; classify (defect, drift, opportunity); rank by goal impact. External best practice and human expertise enter here, as lenses. Ask why the existing oracles did not catch a problem sooner; the answer is an observation about the loop. | Reachable oracles (stated intent, written standards, past behaviour, comparables, the reactions of the people who matter); tools that compare declared state with actual state and surface omissions; a judging agent or person given that context, refreshed when earlier context may be stale. |
| **Decide** | Choose act, defer, or escalate under the authority map, which the definition records: it says which decision classes the loop settles itself and which go to a named owner; irreversible, cross-owner, taste and external-commitment calls go to the owner by default. A decision with no preceding observation is taste, not OODA. | Recorded authority grants; a default for when the owner is absent; an escalation route that actively surfaces the decision to the owner, not passive storage; a decision record that cites its evidence. |
| **Act** | Land the change where it binds (instructions, code, config), verified and reversible where possible. Removing something that works badly is a valid act. Each act names its effect-marker. | Landing machinery with pass/fail checks; a place to record each effect-marker. |
| **Loop** | The return edge, and the part most often forgotten: the trigger actually fires, every effect-marker is checked on a later cycle, and the loop's own health is observed like the object's. | A timer or event trigger with liveness evidence (a record that it fired when it should), so a dead watcher cannot look like patience; a cycle log; an alert when a cycle is overdue; a check that surfaces unobserved effect-markers. |

## Choosing where Observe reads from

Ask *"where would I already see this?"* before *"how do I make this report?"*

1. **Evidence you already have beats evidence you build.** A component that "cannot report" is
   usually one whose existing record nobody has read. A command guard that blocks and records
   nothing is often visible in the calling session's log; instrumenting the guard would put every
   guarded command at risk.
2. **Observe from outside.** A self-reporting component fails together with its report, and a
   failed component is the one least able to say so. Reach inside only when the signal does not
   survive the boundary.

## Procedure

Work from the object's own artifacts and the goal, authority and reference frames the user names.
A missing source is a gap, not permission to substitute whatever is easy to find.

1. **Name one object and its goal**, bounded tightly enough that an observation can point at it.
   Naming an instance together with its class ("this skill" and "our skills") is one object with
   more oracles; genuinely separate objects get separate definitions. Choose where the definition
   lives: next to the object, following its home's conventions, or say where you put it.
2. **Declare the evidence classes**: the object's artifacts, every other class the loop may read,
   and the loop itself, each with its capture route and baseline (its state now, so later cycles
   can see change).
3. **Fill the frame.** All ten cells (five phases × two columns) name a concrete existing artifact
   or tool, or a gap.
4. **Turn gaps into build work.** Write each as `GAP — owner — follow-up — oracle`, where the oracle
   is a check that can fail, and mark it **blocking** if it stops any phase or the return edge from
   running; other gaps are improvements the loop can carry. Close gaps within your authority and
   verify them. In a live run, ask the owner to settle choices the evidence cannot; in an
   unattended run, record the gap and continue rather than block or guess. If a gap's risk would
   disqualify the design ("a fault here breaks every call"), that is a verdict on the design, not a
   scheduling note: settle it before deciding when to build.
5. **Install the return edge.** A timer or named event (a landing, meaning a merge or deploy; an
   incident; a reader bounce, meaning someone gave up on the object), the cycle it starts and the
   named agent or person who runs it, its liveness evidence and what surfaces staleness. A prose
   intention to rerun is not a trigger. Unattended firing does not widen authority: the Decide split
   still gates.
6. **Run the first Observe.** Read only the declared classes and write the loop's birth
   certificate as the first entry of its cycle log: object and goal, class baselines, trigger
   identity, timestamp, findings, and where later cycle records go. If a gap blocks the trigger or
   this Observe, persist the partial definition and name the blocked step; never simulate it.
7. **Check before handing back** (below). Fix and recheck, or record the residual gap and keep the
   loop labelled unfinished.

## What counts as a cycle, and a live loop

Both OODA skills use these definitions. **A cycle ran** when there is evidence for each phase: the
observation artifact, the orienting oracle, the decision and the authority behind it, and the
landed act (or recorded null decision) with its effect-marker. **A loop is live** when its return
edge is installed and shows liveness. If any piece is missing, say which instead of making the
claim. Taking something in and acting on it without observing and orienting is a pipe, not a
cycle; adopting outside advice with no prior observation is taste. Phase work a human supplied is
credited to that human, not claimed by the machinery.

## Check before handing back

- Evidence classes were fixed before the first Observe, each with capture and baseline, including
  the loop itself; external material appears only in Orient.
- Every one of the ten cells is concrete or a gap; every gap has an owner, a follow-up and a
  falsifiable oracle.
- Any class that requires instrumenting the object says where the signal is already recorded and
  why that record is insufficient.
- Decide states what the loop may settle itself and what goes to whom.
- Each Act names an effect-marker, and Loop checks for unobserved ones.
- The return edge is installed with liveness and staleness evidence, or its absence is an owned gap.
- The birth certificate exists, or the gap blocking it is named.

## Output

Hand back the definition's path, the evidence classes, the completed frame, the gap list, the
trigger identity (or its gap), the birth-certificate path (or its gap), the cycle-log location, and
one status:

- `OPERATIONAL` — no blocking gap open, the return edge live, the birth certificate written;
  non-blocking gaps listed.
- `UNFINISHED — DEFINED, NOT OPERATIONAL` — anything else, with each open gap in full.

A waiver or residual-risk note never turns missing machinery into a working loop. If the frame or a
check does not fit the object, tell the user rather than quietly weakening the definition.

When changing this skill, run the cases in `evals/define-ooda-loop-eval.md`.
