---
name: analyse-bug-report
description: >-
  Analyse a user-reported bug as four findings: why this bug was introduced and why it escaped
  testing and review, each for this instance and for its class (the bug 2x2). Use for "analyse
  this bug", "2x2 this defect", "why did this escape testing?", or a postmortem of a bug a user
  found. Produces the analysis; does not implement fixes or tests.
---

# Analyse a bug report (the bug 2x2)

Every bug a user finds is secretly four findings. The bug had to be written, and it had to get
past testing and review; each happened both in this particular case and because of something
more general. If any of the four boxes had been adequate, the user would not have met the bug, so
each box normally yields a finding. Go through the grid for every user-reported bug, not only
the ones that look serious.

| | **Specific — this instance** | **Systemic — the class** |
|---|---|---|
| **Design and code — why it was introduced** | ① What in this design or implementation produced the bug? | ② What pattern, rule or structure makes this class of bug possible? |
| **Testing and review — why it escaped** | ③ What in this test or review path let it through? | ④ What gap in the detection system would let this class escape again? |

Each box records a finding (the why, with evidence) and its corrective action. Several findings
may share one action, but keep the findings distinct. The systemic column is the point of the
method: a point fix and a regression test repair this bug, while ② and ④ change what produces
and catches the next one.

## Inputs and evidence

Work from the verbatim report, the product or repository, the version or commit that misbehaved,
any reproduction evidence and the existing tests and review record. Stay within that scope.

Label each claim `OBSERVED` (seen in code, logs, a run or a record), `INFERRED` (reasoned from
observations) or `UNRESOLVED` (the missing input and who could supply it). A plausible mechanism
is `INFERRED` until something confirms it. Do not fill a box with a guess to complete the grid:
an `UNRESOLVED` box that names the next investigation is a legitimate result.

## Procedure

1. **Pin the bug.** Keep the report verbatim. Record expected and actual behaviour, the exact
   reproduction, the evidence and the misbehaving version. If the cause is still unknown, diagnose
   it before filling ①; the grid assumes a mechanism. If you cannot establish it, record the
   competing mechanisms with the observation that would tell them apart; the systemic boxes can
   often proceed from what the candidates have in common.
2. **① Specific, introduced.** Name the mechanism in the design or code that produced this bug,
   including a design or requirement decision if the code faithfully implemented a wrong idea.
   Describe the smallest repair that removes this instance.
3. **② Systemic, introduced.** Name the shared primitive, pattern, convention, missing rule or
   architectural choice that made this bug easy to write. Then sweep for siblings: search the
   repository or product in scope for other uses of that mechanism (and past bugs, if a bug history
   is available), state what you searched, and list each site as affected, cleared or unresolved,
   with evidence. The corrective action may be a code change or a change to the guidance people and
   agents write code from, such as a design rule, checklist or tooling.
4. **③ Specific, escaped.** Find the tests and reviews that should have covered this behaviour and
   explain why each missed it. Inspect an existing check before proposing a new one; repairing its
   fixture or assertion is often better. Specify the regression check: setup, action, expected
   outcome justified independently of the current code, and how it fails on the buggy version. Mark
   the check `RAN` when you executed it against the misbehaving version and it failed for the
   intended reason (an uncommitted scratch check is fine), otherwise `PROPOSED`; note separately
   whether it passed on a fixed version, if one exists.
5. **④ Systemic, escaped.** Ask what the escape proves about the test system. A bug in text a user
   typed into a field may mean there was no way at all to exercise keyboard input — a missing test
   surface rather than a missing test. Name the class-level cause: absent coverage of a surface or
   interaction type, fixtures that never reach realistic states, a wrong or missing oracle, mocks
   that stand in for the behaviour, checks not executed, or review that does not look for this
   class. Say what would catch a new sibling of this bug, and at what level. The corrective action
   may be a new test surface, a better oracle, a review rule, consolidating checks, or removing a
   misleading check; name the protection that remains for any removal. ④ must explain more than
   this instance; if it only restates ③, keep looking.
6. **Route the systemic findings.** A postmortem that only gets filed changes nothing. If the
   project keeps standing quality records (a risk map, test charters, testing heuristics, design
   rules, a process-improvement backlog), name where each of ② and ④ belongs and what should change
   there. Edit those records only when the caller authorised it.
7. **Write and check the analysis.** Run the checks below and revise rather than pad.

If you conclude a box was adequate, explain how the bug still reached the user. That explanation is
usually the finding.

## Output

One analysis containing the verbatim report, the four boxes with evidence labels and corrective
actions, the sibling list from ②, the regression check from ③ with its failure condition, where
each systemic finding belongs, and follow-up work (defect fixes, tests, test surfaces, process
changes), each labelled by type. Save it where the caller asked; with no destination, return it
whole. This skill does not edit product code or tests.

## Check the analysis

- Each box has its own evidence and finding. Copying the instance explanation into four boxes is
  not an analysis; a shared cause needs a shared mechanism.
- ② names a mechanism, not just a list of similar-looking bugs, and its sweep covers the scope.
- ③ would fail on the reported bug for the intended reason.
- ④ covers siblings that do not exist yet, not only this bug.
- Proposed checks are distinguished from results you observed. Unknowns remain `UNRESOLVED`.

## Optional: blind validation of a testing change

When ④ proposes a new testing method or surface and someone wants to know whether it finds
bugs, the strong test is blind: run the new method against the buggy version with a goal-only
charter that does not describe this bug, and see whether it rediscovers it. Keep bug details out
of whatever the test runner sees. Hand this to a validation workflow if one exists (for example a
`validate-testing-improvement` skill); otherwise list it as a follow-up. Do not claim it ran.

## Boundaries

- This is analysis. Implementing the repair or the tests is separate work.
- The same two questions (why was it made, why was it not caught; this time and in general) apply
  to process mistakes and agent failures. This skill's evidence steps assume a software defect;
  for other failures use the grid, not the test-specific procedure.
