# Reading results

Read when comparing a run against the previous accepted version.

## What degradation looks like

- A row that passed now fails, especially a row added for past feedback.
- The sim's debrief turns negative (not heard, pushed, bored, could not stop) while the
  transcript still "covers" every topic.
- The cap is hit, or endings no longer invite correction or offer to stop.
- The interviewer's debrief describes a new behaviour that contradicts a requirement.
- A row moves from PASS to INCONCLUSIVE: the harness no longer tests it; fix before trusting the
  rest.

## Model compensation

A strong interviewer model often does the sensible thing the text never asked for, so a pass can
mean "the text says to" or "the model would anyway". When you need to know the text carries a
behaviour, also run that row on a weaker interviewer model, and on a version known to lack the
behaviour (the pre-fix skill or a deliberately broken copy). A row that passes on the broken
version cannot detect its regression; say so in the report rather than counting it.

## Reporting

For each row: verdict, deciding quote, number of runs, runtimes and models, and whether the known-
lacking version failed it. List rows not run. Do not merge rows into a single score.
