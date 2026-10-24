---
name: fork-and-merge
description: Run the same task as several blind, independent copies, usually on different models, then have a judge compare them and merge the best into one result with each copy's cost recorded. Use when asked to fork a task, fork-and-merge or fork-and-pick, or to have a task done multiple times and judged. Not for splitting work into different subtasks, or for forking a repository, conversation or session.
---

# Fork and merge

A fork takes a snapshot of the task at hand and runs multiple copies of it. A judge then compares
the copies (the *arms*) and either merges the best of each into one result (**fork-and-merge**) or
chooses one (**fork-and-pick**). The method applies to any class of prompt: design, requirements,
specs, reviews, bug hunts, test charters, research, fixes.

It works because independent attempts make different mistakes. Agreement between arms that could
not see each other is evidence; misses that do not overlap become coverage one pass lacks; and the
judge can combine strengths that no single arm had.

A `compare-candidates`-style skill is a
rubric arena for one design or implementation problem. This skill applies to any class of prompt
and adds shared snapshots, deliberate model mixing, forked judging and cost records.

## Decide whether to fork

**If the user asked for a fork,** run it. Raise cost only when the budget is unclear, and then ask
or propose a smaller fork. Fix the way you launch arms first if it is failing, because failed arms
waste the whole fork.

**If you are considering a fork on your own initiative,** fork only within spend the user has
already authorised, and only when a wrong or mediocre answer costs more than the extra runs and
good answers could plausibly differ. Examples are hard or deliberately vague problems,
consequential design or architecture choices, reviews and bug hunts where recall matters, and
decisions that gate later work. Run one attempt instead for small, mechanical or well-specified
work, or where a cheap deterministic check settles the answer. For a second opinion on existing
work, one independent reviewer is usually enough.

## 1. Write the snapshot

Write the task once as a self-contained artefact that every arm receives unchanged: goal, inputs
(pinned to a commit, file version or quoted text), constraints, success criteria, output format
and location, and the stopping point. Use an existing brief or task record as the snapshot when
one exists; otherwise write it to a file.

Give arms the snapshot, not the parent conversation. An inherited thread transfers the parent's
framing and assumptions, defeats independence and costs tokens. Put anything an arm needs into
the snapshot.

Write the success criteria before any arm runs. The judge scores against them, so criteria
invented after reading the outputs will favour whichever arm the judge read first. For a design,
include concrete cases the result must handle, such as sample queries for a schema or scenarios
for a flow.

## 2. Run the arms blind

- **Isolation.** Each arm writes to its own location (directory, branch, worktree or file). Tell
  every arm not to read other arms' outputs or earlier attempts, and give it no path to them.
- **Count.** Two or three arms by default. Use more only when the problem space is wide or the
  decision is especially consequential.
- **Mix.** Diversity is the active ingredient. Use different model families where available;
  otherwise use different models or fresh sessions, and record which you used. Several cheaper
  diverse models can beat one top model. Two runs of the same model can diverge usefully on
  generative work such as design, but they may share blind spots on review and fact-finding. If
  you repeat a model, record how much its arms' output overlaps.
- **Dropouts.** Record a failed or empty arm as a dropout, with its cost. Continue if at least two
  arms return usable work; otherwise fix the launch problem or tell the user.

Record each arm's identity: model, effort or reasoning setting, runtime and snapshot version.

## 3. Judge and merge

The judge is not the author of any arm. It may be the caller when the caller wrote no arm. If the
judge is from the same model family as an arm, note that in the record.

1. Read every surviving arm in full before scoring. Score each arm against every success criterion,
   citing evidence from the arm.
2. Sort the content into three groups: **convergent** (reached independently by several arms, so
   treat it as high confidence), **unique** (found by one arm) and **conflicting** (arms disagree).
3. Verify unique, contested and load-bearing claims rather than trusting any arm: run the example,
   check the source or reproduce the bug. An arm's confident claim is not a ruling.
4. Rule on each conflict and record the reason. Averaging incompatible positions produces a result
   that no arm would defend.
5. Look for what every arm missed. Shared misses are the blind spot that forking does not cover.
6. Merge:
   - **Artefacts** such as a design, spec, plan or code: choose the strongest arm as the base and
     graft in compatible strengths from the others. Rework the grafts until the result is coherent;
     pasting sections together does not merge them.
   - **Findings** such as reviews, bug hunts or research: take the deduplicated union, crediting
     the arm or arms that found each finding. Mark each finding verified, unverified or false
     positive. Keep unverified findings, labelled as such. Record every discarded finding and the
     reason for discarding it.
   - **Fork-and-pick:** choose one arm, give the reason, and note what the rejected arms did better.
7. Test the merged result against the snapshot's success criteria. Run a design against the
   snapshot's concrete cases, and run code against its checks. A merge of good parts can still
   break at the joins. If the arms diverged because the snapshot was underspecified, tighten the
   snapshot and fork again.

**Fork the judging** when the decision is high-stakes or the arms are close. Use two or more
independent judges from different model families, then reconcile their verdicts. A single judge's
ranking is provisional. Several judges from the same model can agree unanimously and still be
wrong.

## Output

1. **The merged result**, delivered where the task's output normally goes.
2. **A fork record**, stored alongside the merged result. If the result is not a file, put the
   record in the review's own output. The record contains:
   - the snapshot or a pointer to it;
   - arm identities, dropouts and judge identities, noting any judge from the same family as an
     arm;
   - the scoreboard: per-criterion scores for artefacts, or per-arm counts of verified,
     unverified and false-positive findings;
   - convergent, unique and conflicting items, with the ruling on each conflict;
   - what each arm contributed to the merge;
   - **cost** for every arm, judge and merge step: model and effort, input and output tokens, wall
     time, and currency where a price is known. Write `unknown` for any figure that was not
     measured; never estimate. Put each arm's cost beside its contribution, so the record answers
     "was this arm worth running?";
   - verification of the merged result.

The snapshot and arm configuration should be enough to rerun the fork later as a repeatable
comparison, for example to see how a new model compares with an old one.

Local conventions, such as a model-selection policy or an agreed place for fork records, override
these defaults where they exist.
