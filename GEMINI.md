# naia-comm

`naia-comm` is a public community project. The project, rather than an individual contributor or tool, is the unit of context and authority.

## Repository Index

- `README.md` describes the public project and its first contribution mission.
- `.agents/context/` contains reusable project policy and workflow context.
- `projects/naia-comm/` contains project-specific declarations and the static site.
- `docs/` contains workflow, adoption, Discord, and asset notices.

## Mandatory Reads

Read these before acting:

1. `.agents/context/project-policy.yaml`
2. `.agents/context/workflow.yaml`
3. `.agents/context/discord.yaml` when Discord is involved
4. `projects/naia-comm/AGENTS.md` and `projects/naia-comm/project.yaml` before project work

## Context Routing

Use `.agents/context/` for generic contracts and `projects/naia-comm/` for project-specific facts. Record scope, acceptance, validation, review, and closure in the GitHub issue linked to the work.

## Session Boundaries

The files `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` are repository indexes. Work records and execution evidence belong in the linked GitHub issue.

## Safety Boundaries

The policy in `.agents/context/project-policy.yaml` governs merge, deployment, database, secret, production, and public-release authority. Do not put secrets, personal identifiers, private hosts, customer data, or production topology in tracked files, issues, or screenshots. Review the full tree, generated files, reachable history, workflows, and licenses before public release.

## Mirrors

`AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` must remain byte-identical. Update the canonical entrypoint and verify the mirrors before committing.
