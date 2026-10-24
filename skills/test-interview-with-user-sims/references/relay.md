# Relay commands

Each side is a resumable CLI session started in its own scratch directory, outside the tested
skill's repository. Flags checked against `claude --help` and `codex exec --help` on 2026-09-23;
recheck them in your installed versions.

- **Claude:** `cd <scratch> && claude -p "<first message>" --output-format json` → read
  `session_id` from the JSON result → each later turn is
  `claude -p "<next message>" --resume <session_id> --output-format json`, run from the same
  directory; the reply is the `result` field. `--session-id <uuid>` lets you choose the id up front.
- **Codex:** `codex exec -C <scratch> --skip-git-repo-check --json "<first message>"` → read the
  thread id from the `thread.started` event → each later turn is
  `codex exec resume <id> --json "<next message>"`, run from `<scratch>`; the reply is the last
  agent message (or write it with `-o <file>`).

Notes:

- The sim is started with its brief as the first message (or appended system prompt) and receives
  each interviewer reply verbatim as a later turn. The interviewer is started with the sim's
  opening message and nothing else.
- Separate versions or accounts: set `CLAUDE_CONFIG_DIR` or `CODEX_HOME` per version so each has
  its own installed skill, and log the value with the run.
- Repository instruction files (`CLAUDE.md`, `AGENTS.md`) load from the working directory and its
  parents; a scratch directory under `/tmp` avoids the tested repo's. User-level instructions still
  load; record them as inherited context, or use a clean config home.
- Print and exec modes generally cannot answer structured question tools; decide before running
  whether the relay answers them from the sim's reply or those rows are INCONCLUSIVE.
- Permission prompts cannot be answered in these modes either. Give the interviewer the
  permissions a real user would grant in the scratch workspace, and record them.
