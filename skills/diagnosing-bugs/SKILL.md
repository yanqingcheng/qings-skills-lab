---
name: diagnosing-bugs
description: Diagnose a concrete software defect or performance regression whose cause is unknown. Use for explicit debugging or investigation of failing software behavior, not process criticism or a straightforward repair with a known cause.
---

# Diagnosing Bugs

A discipline for hard bugs. Skip phases only when explicitly justified.

When exploring the codebase, read `CONTEXT.md` (if it exists) for the relevant modules, and check ADRs in the area you're touching.

## The lab notebook

Keep a durable record of what you tried, which hypotheses you held, and what evidence each probe returned. At the start of Phase 1, reuse an existing issue, investigation log, or notebook when it records those facts and can be retrieved by the next debugger. That record is the "notebook" throughout this skill.

If no adequate record exists, open a notebook file (prefer a path the user names; otherwise `.scratch/diagnose-<short-slug>.md` or the repo's usual scratch location). Update the chosen record **before** leaving each phase and **after every probe**. Completion requires the diagnostic evidence below in that record; a separate file is unnecessary when an existing record contains it.

Each entry is one of:

- **Try** — what you ran or changed while building/tightening the loop (command or action, redacted result, what it taught).
- **Hypothesis** — ranked, falsifiable claim and its prediction (Phase 3); status `open` / `supported` / `ruled-out`.
- **Evidence** — observation from a probe or the loop (what you saw, which hypothesis it bears on, verdict).

Keep it chronological and short. Redact secrets (`<REDACTED>`). The notebook is what a later debugger, a handoff, or a compacted session reads to avoid re-doing ruled-out work.

## Redact

Show commands, outputs, and captured artifacts only after redacting secrets. Build loops against env vars so credentials stay in the environment. Quote only the lines that carry signal.

## Phase 1: Build a feedback loop

If you have a **tight** pass/fail signal for _this_ bug, you will find the cause; bisection, hypothesis-testing, and instrumentation all consume it. Without one, staring at code will not save you.

Spend disproportionate effort here. Be aggressive. Be creative. Refuse to give up. Log every substantial try in the notebook.

### Ways to construct one (rough order)

1. Failing test at the seam that reaches the bug.
2. Curl / HTTP script against a running server.
3. CLI with a fixture, diffing against known-good output.
4. Headless browser script asserting on DOM/console/network.
5. Replay a captured trace through the path in isolation.
6. Throwaway harness around the failing path.
7. Property / fuzz loop for "sometimes wrong" bugs.
8. Bisection harness between two known-good/bad states.
9. Differential loop (old vs new, or two configs).
10. HITL script as last resort: copy the bundled [template](scripts/hitl-loop.template.sh), edit its steps for the symptom, and run the copy with `bash` in a terminal where the user can respond. Capture observations; leave signing in to the user. Treat the captured verdict as the loop's evidence, not the template's exit status.

### Tighten the loop

Once you have _a_ loop: make it faster, sharper (assert the exact symptom), and more deterministic. A flaky 30s loop is barely better than none; a tight 2s loop is the debugging superpower.

Non-deterministic bugs: raise reproduction rate until the bug is debuggable; log the rate in the notebook.

### When you cannot build a loop

Use source inspection and tentative hypotheses to design the next probe; label them unconfirmed.
If execution is unavailable, report the missing prerequisite and the evidence already gathered.
Ask for access or production instrumentation only when the next useful probe actually needs it.

### Done when

You can name **one command** you have already run (show invocation + redacted output) that is red-capable on the user's exact symptom, deterministic (or high pinned repro rate), fast, and agent-runnable. No red-capable command, no Phase 2. Tentative hypotheses may guide probe design; do not present an untested theory as the established cause.

## Phase 2: Reproduce + minimise

Run the loop until it goes red on the **user's** failure mode. Capture the exact symptom in the notebook. Shrink the repro one cut at a time until every remaining element is load-bearing; log cuts that mattered.

## Phase 3: Hypothesise

Record the plausible hypotheses supported by the evidence, ranked when several compete. Each
names a prediction and a probe that could rule it out. One strong hypothesis needs no invented
alternatives to fill a quota.

Show the ranked list to the user before testing (cheap re-rank). Don't block if they're AFK — proceed with your ranking and keep the notebook current.

## Phase 4: Instrument

Each probe maps to one notebook hypothesis. Change one variable at a time. Prefer debugger/REPL, then tagged targeted logs (`[DEBUG-a4f2]`); never log-everything. After each probe, append an **Evidence** entry and update that hypothesis's status.

Perf branch: measure first (baseline harness/profiler/query plan), then bisect; log measurements as evidence.

## Phase 5: Fix + regression test

First inspect why existing checks missed the reproduced defect: absent coverage, an ineffective
fixture or assertion, a mock that bypasses the behavior, or a check that did not run. Repair the
existing check when it can own the regression; add one only when protection is missing. The
expectation must come from the intended outcome, and the check must fail on the reproduced fault.
If no correct test boundary exists, record the architectural limitation.

Then: failing test → fix → pass → re-run the Phase 1 loop on the original scenario. Record the supported hypothesis and the decisive evidence in the notebook.

## Phase 6: Cleanup

Before declaring done:

- [ ] Phase 1 loop is green on the original repro
- [ ] Regression test passes (or missing seam is documented in the notebook)
- [ ] `[DEBUG-...]` instrumentation removed
- [ ] Throwaways deleted or clearly marked
- [ ] Lab notebook is complete: every material try, hypothesis, and evidence entry is present; the supported hypothesis is obvious
- [ ] Commit/PR (when authorized) names the supported hypothesis and points at the notebook path or issue/log reference

Adapted from Matt Pocock's `diagnosing-bugs`; see [PROVENANCE.md](PROVENANCE.md).
