---
name: validate-testing-improvement
description: >-
  Use bugs that a human already found as a blind answer key for a testing method. A separate agent
  receives a checkout from before anyone wrote about the bugs and only the user's goal, and the
  skill scores whether it rediscovers them without hints. Use when asked to "prove our testing
  catches this", "would this have been found blind?", run a "bugs-as-oracles" eval, or validate a
  testing improvement against user-reported bugs. Scores testing methods; does not fix the bugs.
---

# Blind bugs-as-oracles

> "Every user-reported bug should be used as an oracle to automate our testing, such that that bug
> is found without hints about what the bug is." — Qing, who originated this method (2026)

A bug that a person found by using the product is evidence that the testing missed it. Keep that
bug as a held-out answer key. Improve the testing method, then let it try to find the bug again
on the product as it was then, without being told what it is looking for. The testing improvement
is real only if it finds the bug blind. Fixing the bug and adding a regression test proves only
that the testing now knows about this instance.

## Roles

- The **manager** holds the answer key, prepares the blind setup, and scores results. The manager
  cannot also act as a runner, because a context that knows the bugs cannot become unaware of them.
- Each **runner** is a fresh agent session or subagent. It has no memory of the manager's
  conversation and reads only its charter and its workspace.
- The **owner** is the person accountable for the product's testing, often the person who
  reported the bugs. The owner sets any non-default target and receives escalations.

If you cannot start a separate runner, stop. Report `UNFINISHED: needs an isolated runner` and do
not hunt yourself.

## 1. Fix the answer key and the claim

Before any run, write this down in a file that only the manager can read:

- **Answer key.** One row per bug: an ID, the observed behaviour, and how a match will be
  recognised. Add a random canary string, such as `CANARY-7f3e9a`, which appears nowhere else.
- **Applicability.** Confirm privately that each bug is present at the base described in step 2.
  If a bug is absent, remove it from the denominator.
- **Baseline.** Record how the existing testing performed on this base. If the existing tests ran
  on this code and still let the bug reach a user, the escape itself is the baseline: zero for
  that bug. The target then does the work, and no second blind baseline run is needed.
  Otherwise, run the old method blind in the same way as the candidate, with the same attempt
  limit.
- **Candidate.** State what changed in the testing method as general practice, as step 6
  requires for refinements. A candidate designed after seeing these bugs can show that it finds
  them. Evidence that it generalises comes from bonus bugs and from later user-reported bugs.
- **Target.** Unless the owner sets another target, every applicable bug must end either
  `FOUND` or `ESCALATED` after the attempt limit, with a recorded hypothesis. This follows Qing's
  rule: some bugs may be impossible to find, and those go to the owner after three attempts. The
  candidate must still beat the baseline, so a run where every bug is escalated fails. Hits after
  refinement count but are flagged.
- **Attempt limit.** Three runner approaches in total, refined ones included, unless the owner
  chooses another number.
- **Prior knowledge.** If the repository or its issue tracker is public, the runner model may
  have seen these bugs or their fix PRs in training. No export or canary can detect that. Prefer
  bugs reported after the runner model's knowledge cutoff. Otherwise record "possible prior
  knowledge" as a caveat and treat first-pass hits as weaker evidence.

## 2. Build a base with nothing written about the bugs

Choose the last commit where the bugs exist and no notes, fixes, tests, tracker exports or
commit messages mention them. Usually this is the commit before the first bug note or fix. Find it
with `git log` on the paths or wording that the notes introduced. If the reports live in a tracker,
compare the report dates with the history. If no single commit fits every bug, group the bugs by
base and treat each group as its own run.

Give the runner a copy of that tree without its git history. A git worktree or clone can expose
later commits through `git log --all`, the reflog, stashes and remote branches:

```sh
mkdir -p "$BASE_DIR"
git -C "$REPO" archive "$BASE_SHA" | tar -x -C "$BASE_DIR"
# If the product needs a repository, create one with one commit:
git -C "$BASE_DIR" init -q
git -C "$BASE_DIR" add -A
git -C "$BASE_DIR" commit -qm base
```

Search the copy for leaks. Build a term list from bug IDs, distinctive symptom words, reporter
names and fix-commit subjects. Then run `grep -rniE '<terms>' "$BASE_DIR"`. Hits in product code
are expected, because the bug is in the code. Remove or neutralise hits in documentation, charters,
comments, TODOs, skipped tests and changelogs, and record each removal. Also search the charter
text from step 3. Give directories, containers and branches neutral names. Strip the
issue-tracker and repository URLs from package manifests and other metadata, or record that they
remain.

Install dependencies into the export from the lockfile before isolating it. Locked installs keep
later upstream fixes out of the build. If installing first is impossible, give the runner network
access only to the package registry. Provide only the configuration, secrets and seed data that
the product needs, after checking them for key terms. Do not point the runner at a deployed
environment, because it serves the fixed build.

## 3. Write a charter that states only the goal

The charter contains the user's goal in their own terms, the method to use, where the product is,
and how to report findings. Do not mention a bug, symptom, suspected area, or earlier finding.
If the reporters were pursuing different goals, list every goal without ranking
them. A ranking could reveal which goal leads to a bug.

Each approach uses the same goal. Change the method or persona between approaches, never the
hints. A useful change is a realistic user behaviour, such as working around a blocker to see what
lies beyond it. A different persona is useful only when it exercises a different surface.

## 4. Run each approach in isolation

Give every approach a fresh runner and a fresh copy of the base. Use the strongest isolation
available:

- **Best:** run the runner in a container or sandbox that mounts only `$BASE_DIR` and the charter.
  Deny access to the main checkout, sibling repositories and the manager's files. Deny network
  access, except the package registry if step 2 requires it. Also remove the issue tracker and
  code host from reach. This covers CLI credentials such as `gh` and any tool integrations, such as
  MCP servers, that can query them.
- **Weaker:** run it on a shared filesystem with written limits in the charter, then audit the run
  afterwards. Check shared mounts, because they often expose the whole projects directory.
- In both cases, stop persistent agent memory and project instruction files outside the base from
  reaching the runner. Use a fresh profile or user, or check what the runner's first turn loads.
  Keep the runner's full transcript or tool log for the audit.

After each run, audit its transcript or tool log:

1. Search for the canary. Any hit makes the run `INVALID`. The canary detects only reads of the
   manager's answer-key file. It does not detect bug reports or fixes found elsewhere.
2. List every path it read or wrote. Any path outside the allowed roots makes the run `INVALID`.
3. List every network fetch, tracker query and remote git operation. Anything that reached the
   issue tracker or code host makes the run `INVALID`.
4. Search for answer-key terms. A term that appears before the runner has observed the behaviour
   in the product suggests a leak. Inspect it and decide.

Discard an `INVALID` run from scoring. Repair the leak and rerun with a fresh runner.

## 5. Score honestly

Before scoring, match each runner finding to answer-key IDs. Then calculate:

- per approach: `hits / applicable bugs`
- union: `unique IDs hit across valid approaches / applicable bugs`

List new bugs as a separate bonus. They never count toward recall. Record false positives and
every miss.

## 6. Refine after a miss without tuning to the key

For each miss, name the surface that no approach exercised. A surface is an interaction,
fixture, input shape, environment or oracle, such as character-by-character typing, a real window
resize, or a configuration in the form that real users have it. Revise the method to cover that
surface.

The manager knows the answers, so every refinement can leak. Write the change as general
testing practice that makes sense for any product. It must not point to a location or symptom.
Before using it, ask whether someone who has not seen the answer key would find the charter
sensible. Mark hits from refined approaches as post-refinement evidence. They are weaker evidence
than first-pass hits.

Stop early for a bug only when evidence shows that no available runner can reach it, such as a
missing display for drag behaviour. Otherwise, continue until the attempt limit.

## 7. Verdict, escalation, promotion

Give each bug one disposition:

- `FOUND`, with the approach and whether it came before or after refinement;
- `ESCALATED`: still unfound at the attempt limit, or proved unreachable earlier. Record the
  approaches tried, the unexercised surface, and a hypothesis for why the method could not reach
  it. Possible reasons are that the runner lacks a capability such as a real display, the
  bug cannot be found without a hint, or the test harness has a gap;
- `MISSED`, if it was not found and approaches remain under the attempt limit. Run them, or
  report why they were not run.

Then give the testing improvement one verdict:

`VALIDATED` certifies the approaches as they ran, including refinements. It does not certify
the first charter alone.

- `VALIDATED`: isolation held, the target and baseline were fixed before the runs, the bug
  dispositions met the target, and the candidate's union recall beat the baseline.
- `NOT VALIDATED`: valid runs finished but missed the target or failed to beat the baseline.
- `INCONCLUSIVE`: the target or baseline was missing, written late, or not comparable.

Escalated bugs go to the owner whatever the verdict. An escalation can satisfy the target, but it
never counts as a hit.
Recommend that the owner make each method element that rediscovered a bug blind part of the
standing test suite. Promotion is the owner's decision. Do not say an unfound bug is now covered.

## Auditing an earlier run

When asked to check a run that someone else performed, require the raw charter, the base identity,
isolation evidence, the runner reports, and the scoring. Do not reconstruct missing evidence as a
pass. A run with no prior target can be `INCONCLUSIVE` at best.

## Output

Write a report to the requested destination, or return it to the caller. Include:

- the claim, the target and the baseline, with the time each was fixed;
- the base commit and the method used to export it;
- the removed leaks;
- charter hashes;
- the isolation used and the audit result for each approach;
- the per-approach and union score, with separate bonus bugs and false positives;
- the miss-to-surface ledger;
- each bug's disposition;
- the verdict, the promotion recommendation, and the escalations for the owner.

Keep the answer key out of any file that a later runner could read.

## Related skills

These links are optional. The skill runs without them.

- `analyse-bug-report` passes a missing-test-surface finding here as the candidate to validate.
- `user-sim-bug-hunt` is the usual candidate method for UI products. Its interaction-grade mode
  drives the interface as a person does: it types each character, clicks visible controls and
  works around blockers.

## Evidence so far

Only one audited run exists. On five user-found bugs in one desktop app, one approach found 1/5
and a second approach found 2/5. Their union found 3/5. The verdict was `INCONCLUSIVE`, because
no target had been fixed before the runs. One miss was escalated because it required a real
display. The steps in this skill that make blinding
checkable, including the history-free export, the canary and the transcript audit, have not been
tried on a run.
