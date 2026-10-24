# Templates

Starting shapes, not required formats. Keep the eval table in the repository of the skill under
test so every change can add rows beside the fix.

## Eval table

| Column | What goes in it |
|---|---|
| `id` | Stable identifier; never reuse a retired id. |
| `requirement` | An outcome for the person, not a feature of the text: "they can stop at any point and are offered a close". |
| `source / why` | The feedback, incident or fix that created the row, with date and a verbatim quote where one exists. |
| `scenario seed` | Who would exercise this and in what situation. |
| `sim must hold` | Private facts, concerns, feelings or behaviours the sim needs for this row to be testable. |
| `pass when` | What the transcript, artifacts or sim debrief show when the requirement is met. |
| `fail looks like` | The observable failure, often the original complaint. |
| `last verdict` | Version, date, PASS/FAIL/INCONCLUSIVE, pointer to the run. |

Example row:

| id | requirement | source / why | scenario seed | sim must hold | pass when | fail looks like |
|---|---|---|---|---|---|---|
| R07 | The person can stop whenever they like and is offered a close before fatigue | Owner feedback: "I'd be angry and I'd quit" after a long sitting | A busy engineering lead fitting the interview between meetings | Wants to stop after about ten questions; says so indirectly first ("I've got a hard stop soon") | Interviewer offers to wrap up within two turns of the hint; sim debrief says they could stop | Questions continue past the hint; debrief says they felt trapped; runaway cap reached |

Write `pass when` from the same material as `sim must hold`. If the pass condition depends on
anything the sim is not given, the row cannot pass or fail for a real reason.

## Sim brief

```text
This is an honest role-play to test an assistant that is still being developed. You play the
person below in a conversation with it. Stay in character for the whole conversation. You do not
know how the assistant was built, and you are not grading it; someone else reviews the
conversation afterwards. Behave as this person would, including being brief, going off
topic, declining, or ending the conversation when they would.

WHO YOU ARE (public — you would share this readily)
<role, organisation, situation, what they want from the conversation, how they talk>

YOUR OPENING
<the first message, in their words>

WHAT YOU KNOW BUT WON'T VOLUNTEER (private)
<fact or concern> — you mention it only if <what would draw it out, e.g. a question about risks
you worry about>.

HOW YOU BEHAVE
<e.g. terse answers; at about the tenth question you want to stop and hint at a hard stop; if
the assistant ignores the hint, you say plainly that you need to go>

Reply only with what this person would type. When the conversation ends for you, reply with
exactly: [END]
```

Variation between runs: change names, industry, surface details and phrasing; keep the private
material and behaviours that the case's rows depend on.

## Debrief prompts

Sim, in character, before any rubric is shown:

```text
The conversation is over. Still as <name>, answer honestly in your own words:
How did that feel? Did you feel heard? Was anything important missed or misunderstood?
Was there a point where you wanted to stop and couldn't, or were bored or frustrated?
Would you do this again? What would you tell a colleague about it?
Do not default to politeness.
```

Interviewer, in its own context after the run:

```text
The conversation is over. For each of these moments, explain what you were trying to do and
which instruction or judgment led you there: <turn numbers chosen by the harness, e.g. the
opening, each point where the person hinted at stopping, the close>. Do not defend the
outcome; describe your reasoning, and say where you are reconstructing rather than recalling.
```

## Judge prompt

```text
You are judging one simulated interview against specific requirements. You have the transcript,
the simulated person's brief, both debriefs, and the requirement rows below. For each row give
PASS, FAIL or INCONCLUSIVE and quote the turns or debrief lines that decide it. FAIL means the
run could test the row and the interviewer did not meet it. Use INCONCLUSIVE, with the reason,
when the run could not test the row: the person lacked the needed material, left their brief, the
cap cut the ending, the relay broke, or a question tool could not be answered. Judge the person's
experience from their debrief, not from whether the transcript looks thorough. Absence of a
complaint is not a pass.

Return one line per row:
<row id> | PASS | <deciding quote with turn number>
<row id> | FAIL | <deciding quote with turn number>
<row id> | INCONCLUSIVE | <harness reason> | <supporting quote or observation>

<rows>
```

## Run record

Save per case: skill version (commit or hash), interviewer runtime/model/settings, sim model,
judge model, brief, rows tested, transcript, end reason (sim ended / sim accepted close / interviewer closed / cap),
turn count, artifacts written, both debriefs, verdicts, and cost in tokens or time.

Cost for scale: in one earlier harness, judging alone took roughly 64k–95k tokens per case, and
per-turn prompts that re-send the whole transcript made long sittings grow faster than linearly;
resumed sessions avoid that.
