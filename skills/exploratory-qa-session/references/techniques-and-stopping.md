# Exploratory techniques, target adaptations and stopping heuristics

Reference for `exploratory-qa-session`. Open when choosing probe angles, adapting to a non-web
product, getting unstuck mid-session, or deciding why to stop.

> Credits: stopping heuristics are Michael Bolton's (DevelopSense), developed with James Bach, with
> Cem Kaner's Mission Rejected and Joe Harter's split of Pause That Refreshes; SFDIPOT and SBTM
> (James & Jon Bach); FCC CUTS VIDS tours (Michael D. Kelly); attacks and RIMGEA (Cem Kaner);
> FAILURE (Ben Simo); data heuristics (Elisabeth Hendrickson, James Lyndsay, Dale Emery).

## Stopping heuristics

Each heuristic is fallible: answer its question honestly before relying on it, and name it in your
`Stopped because:` line. Stopping never signs off the product.

| Heuristic | Question / meaning | Lite rule |
|---|---|---|
| Mission Accomplished | Are the charter's questions answered, or did testing raise new ones? | Check each risk and "covered means" item first; do not use while the core is untested. |
| No More Interesting Questions | Is any remaining question worth its cost? Could a Black Swan be hiding? | Name the questions considered and why each is not worth more time. |
| Cost vs. Value | Does continuing cost more than the information is worth? | Foundation of the others; say what more testing would cost and might find. |
| Flatline | Same result whatever you do: crashed, hung, or rock-steady? | A crash or hang is a finding; stop a steady line after stating what you varied. |
| Dead Horse | Too broken to test further, or imminent changes will invalidate results? | Only with evidence (specific bugs or planned change), never "probably all broken". |
| Piñata | Hit a dramatic failure: is it the main issue, or is more inside? | Record it, then decide whether to continue unaffected work or stop and say why. |
| I Feel Stuck! | Actually blocked, or just feeling stuck? | Prove what is missing or label it unverified; try another angle before stopping. |
| Change Tack | Switch approach: is the new tack better, or just different? | Stops one line, not the session; note why you pivoted. |
| Pause That Refreshes | Pause because priorities changed or you are going through the motions. | Prefer pausing to ask when a missing resource or scope change would unblock you. |
| Time's Up! | An agreed deadline ran out: did you get what was needed? | Applies only to an explicit deadline; hand off what remains as next charters. |
| Mission Revoked | The caller or owner asked you to stop. | Stop and record remaining risk. |
| Mission Rejected (Kaner) | Continuing would cause harm or breach a hard line. | Stop that work immediately and explain why; never reject silently. |
| Customary Conclusion | Stopping only because usual checks passed. | Never enough on its own: passed checks are not testing. |
| Avoidance / Indifference | Is someone (or you) avoiding finding more problems? | Reassess or change tack instead of rationalising a stop. |

## Choosing angles and getting unstuck

Treat these as lenses chosen for this target's risks, not a quota.

- **Coverage (SFDIPOT):** Structure, Function, Data, Interfaces, Platform, Operations, Time.
  Structure and function are only the start; bugs hide in Data, Interfaces (persistence, external
  calls), Platform (OS, viewport, locale, terminal width), Operations (modes, multi-step flows),
  and Time (relaunch, concurrency, ordering, timeouts).
- **Tours (FCC CUTS VIDS):** Feature, Complexity, Claims (test every promise in copy/docs),
  Configuration, User, Testability, Scenario, Variability, Interoperability, Data, Structure.
- **Attacks & data heuristics (Kaner; Hendrickson et al.):** Goldilocks (too small / just right /
  too big), Zero-One-Many, boundaries, empty/null, very long strings, special characters and
  Unicode, paste vs keystrokes, CRUD with dependencies, out-of-order steps, double-submit, Back /
  reload mid-action, interrupt and resume, relaunch persistence. Remember: attacks through the
  normal interface model ordinary or careless users; tampering or injection models a hostile actor
  and needs an approved security scope.
- **Error handling (FAILURE, Ben Simo):** Functional (does it recover?), Appropriate, Impact,
  Log, UI (clear, honest, no leaked internals?), Recovery, Emotions (does it blame or trap the
  user?).
- **Bug advocacy (RIMGEA, Kaner):** Replicate, Isolate, Maximise (show the real worst-case impact
  honestly, never exaggerate), Generalise (check sibling controls and places), Externalise (state
  user impact clearly), And say it neutrally.
- **Stuck?** Ask "what haven't I varied?" (data, sequence, setting, actor), take an unused tour, or
  dig next to the last bug you found ("bugs cluster").

## Adapting to non-web targets

The principles, black-box default, actor fidelity, risky-probe gate, sceptical evidence review, and
honest reporting never change. Swap the driver, settings, and evidence to fit the target:

- **CLI:** drive real commands in a shell (use a pty for interactive prompts, resize terminal width,
  test pipes/non-TTY stdin/stdout). Actor means include flags from `--help`, env vars, config
  files, and scripts parsing stdout/stderr/exit codes. Evidence: exact command, exit code, and
  verbatim output. Run destructive tests only in a scratch directory you created.
- **API:** drive real HTTP/RPC requests as an agent or client actor (documented endpoints, auth
  roles, malformed payloads, pagination, idempotency, error schemas). Out-of-band oracle: response
  headers/status, persisted state, logs. Live writes are risky, so gate them.
- **Agent-consumed products:** test through the means the agent has (HTML without JS, RSS/JSON,
  API, CLI output, tool schema) using parseability and structural reliability as the oracle, not
  visual polish.
- **Docs, skills, or processes (reading targets):** "driving" means reading the exact version
  yourself and walking a concrete case through it line by line. Evidence: file version/commit,
  location, and exact quotation.
- **Other desktop or mobile apps:** use whatever real-input driver reaches the UI (emulated mobile
  devices must be labelled as emulated in findings); list unreachable interactions (for example,
  native drag or audio) under "Not tested".
