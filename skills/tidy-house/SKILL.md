---
name: tidy-house
description: Put a project back in order so anyone can see what is live, where things belong and what is finished. Use when asked to tidy, organise or clean up a project, or when its clutter is getting in the way of the work.
---

# Tidy house

A tidy project is one a newcomer, human or agent, can find their way around. Marie Kondo's
method carries over well: gather everything of one kind before deciding about any of it,
choose what to keep, and give everything that stays a home. Her test is whether a thing
sparks joy; here it is whether anyone still uses it.

This describes what tidy looks like and why. It is not a procedure: where something does
not fit the project in front of you, do what serves its readers.

## Start with the instruction files

The project's `CLAUDE.md` or `AGENTS.md` sets the tone for everyone. Every agent reads it
first and copies its habits, so a confused one produces mess faster than anyone can clear
it. If it is in bad shape, begin there. Where fixing it means deciding what the project is
for, bring that to the person you work for.

## What tidy looks like

- **Like with like.** Things of the same material, job or domain sit together, nested
  until each folder is a list of alike things. The test: could a reasonable reader find a
  thing's home in one guess?
- **One owner per fact.** Where a fact is needed twice, link to its owner. A link cannot
  drift; a copy does, even a generated one.
- **The live path holds what is live.** Retired things, and notices that they are gone,
  mislead a reader about the present. Thank them and let them go. If people need to search
  the project's history alongside current material, as in a knowledge vault, move them to
  a clearly marked archive in the tree. If git history is enough, as usually for code,
  remove them. Decision logs and audit trails are records, not clutter; keep them
  together.
- **Docs describe the project as it is now**, the README and index above all.
- **Nothing unfinished lying about.** Finished work is committed; landed branches,
  worktrees and stashes are gone; scratch leaves with its task.

## Reading it as someone else

It is hard to read your own writing as someone without your context. For the files that
matter most, give the file to a fresh agent, ask what it would do next and what confused
it, and fix what it trips on. For the most important human-facing pages, use a
communication review skill such as `comms-review` if one is installed.

## What cannot be undone

Removing committed files is safe; history keeps them. Untracked files, stashes and
unmerged branches exist nowhere else, so read them first, land what is worth keeping, and
ask the person you work for about anything that looks like work in progress. A
reorganisation of the project's layout has a large blast radius, so a second opinion on
the plan is worth having.

When you are done, say what you removed and what you left for them to decide.
