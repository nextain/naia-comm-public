# Contributing to Naia

Start with a small documentation fix, translation, bug reproduction, test or code change. Discord, a shared server account and paid AI tools are optional. Public questions and proposals need no prior one-to-one approval.

## Choose the repository

Use the affected product's issue tracker and contribution guide for a change confined to one product, including its documentation and translations. Find repositories in [the catalog](workspace/repos.json). Community documentation and changes spanning repositories start in [this repository's issues](https://github.com/nextain/naia-comm-public/issues). Cross-repository references use `owner/repo#number`.

Open an issue with a small outcome, acceptance criteria and reproduction steps. Use your public GitHub handle as contributor; the branch may be `undecided` until GitHub assigns the issue number. Availability is optional. Maintainers assign an independent reviewer and integrator; missing assignments stay `UNASSIGNED`. You may work in your fork and submit a draft PR while waiting. Coordinate large designs, overlapping work and compatibility changes with the affected maintainers before investing in implementation.

## Contribute in your browser

For a small documentation edit, no local tool installation or product clone is required. Create the issue in the upstream repository, then **Fork → your fork's branch menu → create `issue/ACTUAL-NUMBER-short-name` → edit the file with the pencil button → commit to that branch**. Replace `ACTUAL-NUMBER`; GitHub's automatically named edit branches may fail this repository's CI rule. Follow the PR instructions below. Report local tests as `NOT_RUN` and wait for GitHub Actions and review; do not claim local execution. A maintainer may need to approve Actions execution for a first fork PR; this is separate from permission to begin contributing.

## Set up a local contribution

This community repository needs Node.js **20.11 or newer**, npm, Git **2.50 or newer**, Python 3 and a POSIX shell. The history scanner rejects older Git versions; see [Git downloads](https://git-scm.com/downloads). On Windows, use WSL for these commands. Native Windows shell execution is not supported here. Product build requirements are separate and belong to each product's README. There are no npm dependencies to install for the community checks.

Create a fork with **Fork → Create new fork** on GitHub. Replace `YOUR_GITHUB_HANDLE` before running:

```bash
git clone https://github.com/YOUR_GITHUB_HANDLE/naia-comm-public.git naia-comm-public
cd naia-comm-public
git remote add upstream https://github.com/nextain/naia-comm-public.git
```

Read [AGENTS.md](AGENTS.md), [project policy](.agents/context/project-policy.yaml), [workflow](.agents/context/workflow.yaml), [site adapter entrypoint](projects/naia-comm/AGENTS.md) and [project facts](projects/naia-comm/project.yaml). The tracked `projects/naia-comm/site` directory is an archived participation survey example and does not currently accept responses; the Naia desktop application lives in its product repository.

Run `npm test` and `npm run test:first-mission` to check your environment. The latter performs a documented README edit in a temporary fixture, rejects duplicate/missing anchors and rolls it back without modifying your working files. Remove the manual practice sentence before running it, or its duplicate check will fail. It is a practice check; do not submit its repeated sample sentence as a contribution. Pick a real typo, missing instruction or other useful improvement for your PR.

Before updating, `git status --short` must be empty. Save unrelated work separately if it is not. Stop on command errors; do not force-reset or force-push to get past them. Replace `123` with the actual **upstream** issue number:

```bash
git fetch upstream
git switch main
git pull --ff-only upstream main
git switch -c issue/123-docs-onboarding
```

If the issue branch already exists, use it instead of creating it again. Edit the selected file, then validate:

```bash
npm test
npm run test:first-mission
git diff --check
git status --short
git diff
```

Fix failures before requesting approval. If a check cannot run, record `NOT_RUN` and its reason. These checks cover community structure, workspace planning/checkout checks, site API contracts and public-safety/history fixtures. They do not demonstrate a deployed site or working desktop product.

## Commit, push and open a PR

Check `git config user.name` and `git config user.email`: commit author information becomes public history. Configure them in this clone if absent. For email privacy, use your own noreply address from GitHub **Settings → Emails**. Never put authentication tokens in remote URLs or logs.

For a README change, run the following after successful validation. Stage only the files you actually changed, and replace `123` with your issue number:

```bash
git add README.md
git diff --cached
git commit -m "docs: clarify onboarding (Refs #123)"
git remote -v
# Verify origin points to YOUR fork before pushing.
git push -u origin HEAD
git rev-parse HEAD
```

If you edited in the browser, your commit is already in the fork and no local push is needed. In the [upstream Pull requests page](https://github.com/nextain/naia-comm-public/pulls), select **New pull request → compare across forks**. Set **base repository** to `nextain/naia-comm-public`, **base** to `main`, **head repository** to your fork, and **compare** to your `issue/NUMBER-name` branch.

Fill in the PR template. Its body must contain `Refs #123` with the actual upstream issue number. Include the purpose, exact commit SHA, changed scope, commands/results, reproduction steps, deployment need and rollback. Select **Create pull request** or **Create draft pull request**. This repository's CI checks the issue branch name and `Refs` field. Other product repositories keep their own rules. Follow-up commits on the same branch update the PR.

A maintainer merges after independent review; contributors do not merge or deploy. Release owners separately approve releases. AI review does not grant permissions or replace required human approval. A response time is not guaranteed; leave a public issue/PR link when requesting help, without private data.

## Optional product workspace

From the community clone root, `node scripts/workspace.mjs plan shell` prints optional clone commands. It does not execute them. Follow the workspace commands documented in the [README](README.md), read each product's entrypoint and use its setup instructions. Fresh `main` clones may disagree with Shell's `agent-pairing.json`; this is not a tested version lock. `doctor shell` checks clean checkouts and pairing SHAs, not builds, protocols, memory versions or runtime compatibility. Use each target product's fork for contribution pushes.

Use the [integration evidence template](docs/templates/INTEGRATION.md) for cross-repository work and [RFC template](docs/templates/RFC.md) for architectural changes. Keep private conversations, tokens, device data and memory databases out of reports. Report security concerns through the affected repository's Security tab if private reporting is enabled; otherwise ask a maintainer for a private channel without disclosing exploit details publicly.

Be respectful, discuss changes rather than people, and avoid harassment or sharing personal information. Send moderation concerns privately to an available server moderator; repository process questions can use [public issues](https://github.com/nextain/naia-comm-public/issues). The repository owner handles unresolved process disputes with privacy in mind.

See the [Korean onboarding guide](CONTRIBUTING.ko.md) and [Discord guide](docs/DISCORD.ko.md). Cross-repository coordination is run in the maintainers' private hub; results are published as issues on each product repository. Code and documentation use [Apache-2.0](LICENSE); trademarks and third-party assets have separate terms in the [public asset notices](NOTICE-PUBLIC-ASSETS.md). Retain notices and confirm rights to submitted material.
