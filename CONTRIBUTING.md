# Contributing to Naia

You can contribute documentation, translation, bug reproduction, testing or code.
Discord, a shared server account and paid AI tools are optional.

1. For a change in one product, use that repository's issue tracker and contribution guide. See [the catalog](workspace/repos.json).
2. For community work or a change spanning repositories, open an issue here with the desired outcome, affected repositories and acceptance criteria. Link implementation issues as `owner/repo#number`.
3. Fork the repository you will change. For this repository, use `issue/<actual-issue-number>-<short-name>` and include `Refs #<actual-issue-number>` in the PR body. Other repositories retain their own rules.
4. Read `AGENTS.md` and the relevant project context. Run `npm test` and `npm run test:first-mission` for changes here. Report unavailable checks as NOT_RUN.
5. Request review with a summary, exact commits, reproduction steps and rollback. Repository maintainers merge; release owners separately approve releases. AI review does not grant authority or replace independent approval.

Browse-only documentation contributions need no full product workspace. For local product development, `node scripts/workspace.mjs plan shell` prints optional clone commands; read each product's README before building. This command does not install or certify a compatible product stack.

Use the [integration evidence template](docs/templates/INTEGRATION.md) for cross-repository work and [RFC template](docs/templates/RFC.md) for architectural changes. Keep private conversations, tokens and device data out of reports. Report security concerns through the affected repository's Security tab if private reporting is enabled; otherwise ask a maintainer for a private reporting channel without posting exploit details.

Be respectful, discuss changes rather than people, and avoid harassment or publishing personal information. Moderation concerns go to an available server moderator privately; moderation does not grant code approval rights. The repository owner handles unresolved process disputes and records public reasoning where privacy allows.

The detailed [Korean operating proposal](docs/ECOSYSTEM.ko.md), [Discord guide](docs/DISCORD.ko.md) and [first contribution guide](CONTRIBUTING.ko.md) describe the workflow. Responses depend on volunteer availability. Contributions use this repository's Apache-2.0 license; retain third-party notices and confirm rights to submitted material.
