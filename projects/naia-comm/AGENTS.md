# naia-comm project adapter

Read the repository root `AGENTS.md`, then `project.yaml` here.

Naia open-source community operations: kickoff meetup planning, participation
survey, organizer materials. A public-facing static survey page relays
submissions to a private Discord channel via a serverless webhook proxy — no
database, no PII or secrets committed to this repository.

- Keep secrets and participant IDs in the ignored `.runtime/` registry.
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
