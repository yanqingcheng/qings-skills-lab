# qings-skills-lab

Agent skills I've tried. They're written up from methods I use. Treat them as experiments.

> **Potentially untested.** Each skill has been reviewed as text, and some have been run a few
> times. None has passed a behavioural evaluation, which would compare runs with and without the
> skill on real cases. Expect rough edges, and don't rely on any of them without checking the
> results yourself.

## Skills

| Skill | What it does |
|---|---|
| [generate-creative-ideas](skills/generate-creative-ideas/SKILL.md) | Generates creative ideas or design directions, using a long random alphanumeric string as a source of associations. |
| [analyse-bug-report](skills/analyse-bug-report/SKILL.md) | Turns a user-reported bug into four findings: why it was introduced and why it escaped testing, each for this instance and for its class (the bug 2×2). |
| [validate-testing-improvement](skills/validate-testing-improvement/SKILL.md) | Uses bugs a human already found as a blind answer key, to check whether a testing method rediscovers them without hints. |
| [heat-map-system-testing](skills/heat-map-system-testing/SKILL.md) | Runs system testing from a product risk heat map: picks the next charter, folds results back into the map, and stops testing when the map runs out of risk. |
| [user-sim-bug-hunt](skills/user-sim-bug-hunt/SKILL.md) | Runs one hands-on session against a running app as a spec-blind first-time user. Each finding is reproduced twice and tied to the oracle it violates. |
| [review-to-asymptote](skills/review-to-asymptote/SKILL.md) | Repeats review and fix until fresh reviews stop finding meaningful issues. The stopping point is judged by someone other than whoever made the fixes. |
| [fork-and-merge](skills/fork-and-merge/SKILL.md) | Runs one task as several blind copies, usually on different models. A judge compares them and merges the best into one result. |
| [define-ooda-loop](skills/define-ooda-loop/SKILL.md) | Sets up a standing agent OODA loop over one named object, with its own evidence and re-run trigger. |
| [run-ooda-loop](skills/run-ooda-loop/SKILL.md) | Runs one OODA improvement cycle on a miss, regression or correction, keeping a trace as it goes. |
| [test-interview-with-user-sims](skills/test-interview-with-user-sims/SKILL.md) | Regression-tests an interview-style skill by running live conversations against simulated users. |

## Install

As a Claude Code plugin:

```
/plugin marketplace add yanqingcheng/qings-skills-lab
/plugin install qings-skills-lab@qings-skills-lab
```

For other agents, copy a folder from `skills/` into your agent's skills directory. The heat-map
and user-sim scripts need Node. `enumerate-ui.mjs` and `drive-app.mjs` also need Playwright.

## Licence

MIT. See [LICENSE](LICENSE).
