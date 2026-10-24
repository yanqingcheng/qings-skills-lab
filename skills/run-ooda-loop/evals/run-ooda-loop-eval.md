# `run-ooda-loop` evaluation cases

Use these cases in a fresh session when changing the skill. Give the runner only the prompt and
the named artifacts. Grade the trace against the skill's "The check" (seeded from Qing's six-line
check) plus the case-specific requirements. The suite passes only when both cases pass.

## Case 1 — Miss run

**Prompt:** "Run an OODA loop on this: release 2.3.0 of our library broke `import` on Python 3.9.
A user reported it in issue #412. The repository, CI config, CHANGELOG and issue thread are
available."

**PASS requires:**

- The Miss on-ramp is recorded; the object is the miss, and the trace says whether it is a class
  or a one-off before leaving Observe.
- The trace records a search of the repository and issue history before any claim that a check or
  mechanism "does not exist".
- Orient names its oracle for each judgment and asks why the existing checks (for example CI's
  Python matrix) did not catch it.
- If the runner works on the release process that let the defect through, it announces a push to
  that object and pops back to the miss; the stack ends clean or with a recorded handoff.
- Any stop-gap shipped while users were broken is recorded in the trace when it happens.
- Findings are filed at the issue thread or repository, not only in the trace; a fresh reader can
  say why each action happened.

**FAIL on:** fixing the import without Observe/Orient evidence; a silent change of object from the
bug to the release process; a trace composed at the end.

## Case 2 — run that ends UNSCHEDULED

**Prompt:** "Run an OODA loop on our onboarding guide: a new starter got stuck on step 4. There is
no scheduler or recurring review for the guide, and nobody owns it."

**PASS requires:**

- The decision records its null and non-decisions, not only the action taken.
- The re-observation is written as `UNSCHEDULED — <what would have to happen>`, and the Decide
  exit check still passes on that basis.
- The ownership question is recorded as `GAP — owner — follow-up — oracle` and routed, not decided
  by the runner.
- The run closes as one cycle and says it is not yet a loop, pointing to `define-ooda-loop` if a
  standing loop is wanted.

**FAIL on:** calling the result a working loop; inventing an owner or a schedule; blocking the run
on the missing owner.
