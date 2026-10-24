---
name: test-interview-with-user-sims
description: Regression-test an interview-style skill (one that questions a person or elicits their decisions) by running live conversations against simulated users built from an eval table. Use when an interviewing skill changes, before it ships, or to build its regression suite; not for reading reviews or single-shot skills.
---

# Test an interview skill with user sims

Status: draft, not yet forward-tested on a real interview skill.

An interview skill's output is a conversation, and a changed skill produces a different one. A
saved sample interview goes stale on the next edit, and a reading review or text checker sees
what the text says, not what an interviewer does with it. So have the conversation: a simulated
user (the *sim*) stands in for the person, a fresh agent runs the skill, and a separate judge
decides whether each requirement was met. Build cases from an eval table each run. For
requirements about how the conversation goes, do not substitute another instrument; if budget is
short, run fewer sim cases and name the untested rows.

Keep ordinary evaluation hygiene: isolation, frozen inputs, and honest n=1 limits.

## Roles

| Role | Runs as | Sees | Never sees |
|---|---|---|---|
| **Orchestrator** — usually you; installs, relays, records, compares | this session | anything, including the skill and diff | — but writes no rows, briefs or persona details |
| **Suite author** — writes the eval table, builds cases and briefs | subagent or fresh session | the skill's purpose and users, feedback, real sessions, the change's intent in words | the skill text or diff |
| **Sim** — plays one person | CLI session in a scratch directory | its brief; what a user would see | the skill, table, any rubric |
| **Interviewer** — runs the skill under test | CLI session in a scratch directory | the installed skill; the sim's replies | the table, brief, any rubric |
| **Judge** | subagent or fresh session | transcript, brief, both debriefs, the case's rows | — |

The suite author is blind to the skill because a suite written from the skill passes it by
construction. Brief it with the skill's purpose and intended users (from a README or the owner);
if even that is missing, ask the owner rather than read the skill. The owner decides whether the
skill ships, after their own interview; sim runs inform that and do not replace it.

## 1. Build or update the eval table

Keep the table in the tested skill's repository, outside anything the interviewer can read. One
row per requirement, stated as an outcome for the person, with its source, what the sim must hold,
and observable pass and fail; see [the eval table template](references/templates.md#eval-table).
Every piece of real feedback and every fix adds a row, so a later change cannot silently undo it.
Record requirements in words, not golden output, and mark superseded rows rather than deleting
them.

Include rows that only non-cooperative people exercise: someone who wants to stop early, is
terse, declines questions, corrects themselves, returns after a previous session, or holds a
concern they will not volunteer. Cooperative sims never reach the stopping routes.

## 2. Construct the cases live

At run time the suite author turns rows into cases: one sim brief plus the rows it tests, using
[the sim brief template](references/templates.md#sim-brief). A brief has a public side (who they
are, how they talk, their opening), a private side (facts, concerns and behaviours, and what would
draw each out), and an honest role-play contract.

- Give the person a concrete situation. If the skill reads files, give the sim a real scratch
  workspace matching the persona. The orchestrator checks each premise against the skill's
  preconditions and returns conflicts to the suite author without describing the skill.
- The sim must actually hold everything a pass condition depends on. Derive the judge's pass
  condition and the sim's private material from the same row; a run asking whether the
  interviewer surfaced a concern the sim was never given measures nothing.
- Keep rubric text and pass conditions out of the brief.
- Within one comparison (old version against new), use identical briefs and models. Between suite
  runs over time, vary persona details but keep each row's private material and behaviours.

## 3. Run the conversation

**Isolation.** Native subagents inherit the orchestrator's working directory, the repository's
instructions and access to the eval table, so they break the sim's and interviewer's blindness.
Run both as CLI sessions started in separate scratch directories outside the repository; see
[references/relay.md](references/relay.md) for the resumable Claude and Codex commands. Keep the
harness's paths and notes out of both prompts; a sim that sees test machinery tends to break
character.

**Installing versions.** Two versions cannot both sit at the runtime's normal skill location.
Either install them in turn and record the installed version on every run, or give each version
its own config home (`CLAUDE_CONFIG_DIR`, `CODEX_HOME`) with that version installed. Installing
into your normal location also changes the orchestrator's own session and any other session on
that account.

**Structured questions.** Print or exec-mode sessions generally cannot answer structured question
tools such as `AskUserQuestion`. Before running, decide: the relay answers them from the sim's
reply, or rows about question format are INCONCLUSIVE.

**The run.**

- Open with the sim's realistic first message and let the skill run its own setup. Add no harness
  instructions that shape the interviewer's behaviour, or those behaviours go unmeasured.
- Relay turns verbatim in both directions; do not paraphrase, filter or coach. Treat the sim's end
  marker as the end reason and do not forward it.
- Set a runaway cap in questions, well above a reasonable sitting, with room for the close-out
  outside it. Record why the run ended: sim ended, sim accepted a proposed close, interviewer
  closed, or cap. Reaching a generous cap is a finding; a cap that cuts off a normal ending makes
  every ending row INCONCLUSIVE.
- Save the [run record](references/templates.md#run-record), including any artifacts the
  interview writes.

## 4. Debrief both sides

Before judging, resume each session once more ([prompts](references/templates.md#debrief-prompts)).
Ask the sim, in character and before it sees any rubric, how it felt, whether it felt heard and
whether it wanted to stop and could not; only the person can report feeling understood. Ask the
interviewer why it asked, continued or closed at the key moments, so failures need no
reverse-engineering from the transcript.

## 5. Judge each row

The judge reads the whole run and gives each row a verdict with the quoted turns or debrief lines
that decide it, in the fixed format from [the judge prompt](references/templates.md#judge-prompt):

- **PASS** — the requirement was met.
- **FAIL** — always a skill defect: the run could test the row, and the interviewer did not meet it.
- **INCONCLUSIVE** — with the harness reason: the sim lacked the material, left its brief, the cap
  cut the ending, the relay broke, or a question tool could not be answered. Fix the case and rerun.

A capable model reading the whole run beats keyword or structural classifiers for conversational
requirements; keep deterministic checks for mechanical facts such as a record file existing.

## 6. Read the result as regression evidence

Compare row verdicts with the last accepted version's run. If none is saved, run the same cases on
the pre-change version in the same session. A pass counts only where the same case can fail: run
new or changed rows once on a version known to lack the behaviour. For what degradation looks
like, when to add a weaker interviewer model, and the report shape, read
[references/reading-results.md](references/reading-results.md). One run per case diagnoses; it
does not establish a rate.

## Sizing

- **Changed skill, quick check:** every row the change touches, plus one cooperative and one
  non-cooperative baseline case; one run each.
- **Before shipping:** every row at least once, on each runtime the skill ships for and the
  interviewer models users will run; repeat rows that flipped or were INCONCLUSIVE.
- The sim can usually run on a cheaper model than the interviewer; the judge needs enough
  capability to read a long transcript carefully. Record cost per case.

## Done

Done when each row has a verdict with quoted evidence on the named skill version, regressions
against the previous accepted run are listed, and transcripts, briefs and debriefs are saved where
the next run can find them. Report failures to the skill's owner; this skill does not edit the
skill under test. Call the result a simulated-user run, not a user test.

If your host has a local defaults note for this skill (execution location, model roles), read it
before dispatching runs.
