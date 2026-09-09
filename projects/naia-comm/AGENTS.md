# naia-comm project adapter

Read the repository root `AGENTS.md`, then `project.yaml` here.

Naia open-source community operations: kickoff meetup planning, participation
survey, organizer materials. The static survey is an archived local example,
not the desktop application; it does not currently accept responses. The
serverless relay contract is retained for a separately authorized future event.
No database, PII or secrets are committed to this repository.

- Local contributions require neither Discord nor a participant registry.
  The legacy server adapter is disabled by default. If separately enabled, keep
  participant IDs in ignored runtime configuration and credentials in the
  operator environment, never in tracked files.
- Record all work and validation in the GitHub issue. When deployment is
  requested, record development deployment, acceptance, production approval, and
  production deployment as required by the workflow. For a change that does
  not require deployment, use the workflow's integrator-reviewed
  non-deployment closure record instead.
- `project.yaml` roles are workflow declarations. Actual enforcement comes
  from GitHub repository permissions, branch protection, protected
  environments/reviewers, and repository variables such as
  `NAIA_COMM_RELEASE_OWNERS`. Issue approval records the requested scope but
  does not grant platform permissions, so maintainers must verify repository
  settings before operations.
