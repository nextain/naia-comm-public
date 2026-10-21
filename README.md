**English** | [한국어](README.ko.md)

# naia-comm

`naia-comm-public` is the public repository for the Naia open source community's first-contribution guide, public RFC discussions, participation surveys, and public operating material. Cross-repository coordination among core committers and per-device QA rounds run in the maintainers' private coordination repository, and the results are published as issues in each product repository. Public participants produce small results in their own fork and submit reproducible evidence through issues and pull requests.

The repository keeps these standards:

- GitHub issues are the source of truth for work scope, acceptance criteria, verification results, and permission requests.
- Work happens in a personal fork or work branch, and results and reproduction steps are recorded in the pull request.
- Discord supports discussion and review requests in issue threads. Discord or AI conversations do not create merge or deployment rights.
- Passwords, tokens, personal identifiers, private hosts and IPs, customer data, and operational topology are not recorded in the repository or issues.
- A public candidate is published only after the full tree, generated files, reachable Git history, workflows, and licenses are reviewed and the owner approves the exact commit SHA.

If this is your first time, follow issue → fork → first edit → PR submission in the **[English onboarding](CONTRIBUTING.md)** or the **[Korean onboarding](CONTRIBUTING.ko.md)**. You can also read and explore without an account or installation. The workspace commands below are run from the root after cloning this repository.

## Developing across repositories

[English contribution guide](CONTRIBUTING.md) · [Repository list](workspace/repos.json) · [Integration verification template](docs/templates/INTEGRATION.md)

Cross-repository coordination among committers runs in the maintainers' private coordination repository, and the results are published as issues in each product repository.

Contribute common operating documents and translations in this repository, and product documents, translations, and code in the corresponding product repository. Changes spanning several products are linked through a coordination issue here. Development happens in each person's local environment, and decisions and verification are recorded on GitHub. Joining Discord, a shared SSH account, and paid AI are not required.

```bash
# Read-only: shows optional product clone commands
node scripts/workspace.mjs plan shell
# After cloning, check HEAD and Agent/Memory pairing (separate from product build verification)
node scripts/workspace.mjs doctor shell
```

This repository's remote is `nextain/naia-comm-public`. `naia-comm-public` is the recommended local directory name; another name is easy to confuse with the private coordination repository. The participation survey site is an archived example that can be used for local learning and does not currently accept responses. For your first contribution, follow the onboarding below.

## What this project guides

Participants describe their goal and when they can start in their own language, then pick one small mission to begin. A mission can be code, documentation, translation, a demo, or operating material. The issue records the outcome, assigned roles, branch, verification commands, reproduction steps, and whether deployment is needed. Edits, verification, and retries after failure within the scope written in the issue can continue; only changes to scope, roles, permissions, or deployment target need to be agreed again in the issue.

Roles separate permissions. A contributor works on an issue branch and requests review. A reviewer checks the change and acceptance criteria independently of the contributor and leaves requests. An integrator handles policy-compliant merges and non-deployment closure records based on confirmed results. A release owner handles production deployment and rollback after separate approval. The roles in `project.yaml` are workflow declarations; actual enforcement comes from GitHub repository permissions, branch protection, protected environments, and repository variables. A maintainer assigns the reviewer and integrator in the issue, but response time is not guaranteed. Contact hours are optional, a separate change window is agreed only when shared resources change, and the documents and local verification commands do not claim to enforce these permission settings automatically.

## Current confirmed state

- The default branch and integration branch are `main`. The current public participation flow sends pull requests to `main` and does not assume a `dev` branch exists.
- No development deployment is declared. The production site workflow starts only from GitHub Actions `workflow_dispatch` and uses the `production` environment. Before the first production dispatch, the repository owner must set that environment's deployment branch policy to `main` and configure required reviewers; this repository does not claim that setup is already done. The repository owner must also configure `main` branch protection with at least one required approval and self-approval disallowed; this candidate's documentation alone does not claim the host setup is complete.
- A manual production run proceeds only when the entered lowercase 40-character commit SHA matches the current SHA of `main`, the workflow starts from the `main` ref, and both the executing actor and the triggering actor are listed in the repository variable `NAIA_COMM_RELEASE_OWNERS`. An unset variable, a mismatch for either actor, or a ref or SHA mismatch is rejected. Leading and trailing whitespace is trimmed from the variable's comma-separated values before comparison. The production API token must not be kept in repository files or ordinary variables; it must be configured only as a `production` environment secret. `production` is the environment name the workflow specifies, not evidence that protection rules are actually configured.
- `npm test` runs workspace planning and checkout check tests, structure validation, the site submission API contract, history-scan fixtures that use NUL paths, and the public-safety check. It does not prove YAML workflow execution, actual execution of the site or Azure Functions, Discord execution, or deployment success.
- The static pages can be checked with the local command below. `/api` paths need Azure Functions Core Tools or a deployed environment.

Tools to prepare first: Node.js `20.11` or later, npm, Git `2.50.0` or later, Python 3, and a POSIX shell. The public-safety check needs NUL-separated `rev-list --objects` output from Git `2.50.0` or later; older Git versions are rejected by the history check in a fail-closed manner. If your version is older, follow the [official Git upgrade guide](https://git-scm.com/downloads). On Windows, the supported environment is Windows Subsystem for Linux (WSL); this repository does not guarantee behavior in a native Windows shell.

## Public review requests

Leave review requests and questions in [GitHub public issues](https://github.com/nextain/naia-comm-public/issues). Role declarations are not records of actual permission grants; the settings of GitHub repository permissions, branch protection, protected environments, and repository variables are the actual enforcement. A maintainer assigns, in the issue, a reviewer and an integrator distinct from the contributor; the reviewer independently checks the same SHA and acceptance criteria, and the integrator then leaves the closure record based on that result. You can request review in the issue, but response time is not guaranteed.

## AI tools and gateway scope

You may optionally use any AI tool you like in your personal local environment. Availability of tools and models depends on your own accounts. Authors explain and verify AI-generated changes themselves, and AI review does not replace independent human approval or deployment rights.

## Starting your first contribution

On the GitHub repository page, select **Fork → Create new fork** to create a fork of the public repository in your account, clone it over HTTPS or SSH, and read the policy, project facts, and project guide.

Replace `YOUR_GITHUB_HANDLE` with your GitHub account name before running:

```bash
git clone https://github.com/YOUR_GITHUB_HANDLE/naia-comm-public.git naia-comm-public
cd naia-comm-public
git remote add upstream https://github.com/nextain/naia-comm-public.git
sed -n '1,220p' AGENTS.md
sed -n '1,220p' .agents/context/project-policy.yaml
sed -n '1,220p' .agents/context/workflow.yaml
sed -n '1,220p' projects/naia-comm/AGENTS.md
sed -n '1,220p' projects/naia-comm/project.yaml
npm test
```

In the GitHub issue, write a small mission and its acceptance criteria, the contribution type, the assignee, the issue branch, whether deployment is needed, and the verification commands and reproduction steps. Contact and response hours are optional, and a change window applies only to work on shared resources. Local edits to public material, commits, pushes to your own fork, and PR submission can proceed without one-to-one start approval. After working on the issue branch, open a pull request to `main` and ask a different reviewer for an independent review of the exact SHA. After the integrator checks the review result and merges into `main`, a non-deployment task records `merged_sha`, the non-deployment reason, and a closure record on the `main_merge_requested → closed` transition. Contributors do not run merges, production deployments, database changes, or public releases themselves.

## Work and verification

```bash
npm test
npm run test:first-mission
git diff --check
git status --short
```

Record verification results, changed files, limitations, and reproduction commands in the issue and pull request. Documentation, translations, demos, and operating material that are not deployed use the non-deployment closure path after leaving local evidence and the independent review result.

Since no development environment is currently declared, local `npm test`, `npm run test:first-mission`, and the static page check are the acceptance path. The reviewer independently checks the same commit SHA, this local evidence, and the limitations; the integrator first merges into `main` and then leaves the `main_merge_requested → closed` non-deployment closure record. This procedure does not mean a development deployment or production success. After a production failure or cancellation, merge a revert commit into `main` and dispatch again with the exact SHA of the new `main` tip; the workflow rejects the previous SHA.

To check the static pages, run:

```bash
cd projects/naia-comm/site
python3 -m http.server 8080
```

Open `http://localhost:8080/` in a browser to check the static HTML, CSS, and image paths. This command does not verify the API, Discord, or Azure deployment.

## A runnable first documentation mission

Start with the documentation mission in the [Korean contribution guide](CONTRIBUTING.ko.md). Revert the manual practice sentence, then run the automated check. The automated smoke test edits a single README file in a temporary fixture without `.git` to check duplicates, anchor failures, verification, and rollback. Do real contributions with the same procedure in your own fork and issue branch and submit the result as a review request; do not interpret the success of the automated fixture as evidence of an actual merge or deployment.

```bash
npm run test:first-mission
```

## License

Source and documentation approved for publication are distributed under the [Apache License 2.0](LICENSE). The Apache grant applies only to this repository's code and documentation, and does not grant rights to the Naia or Nextain trademarks, store copy or publications, or third-party images, NVA (avatar description format), or VRM (3D avatar file format). See the [public asset notice](NOTICE-PUBLIC-ASSETS.md) for the separate terms for trademarks and third-party material and the approved scope of published characters and logos.

For details, see the [operating procedure](docs/WORKFLOW.ko.md) (Korean), [how to use Discord and GitHub together](docs/DISCORD.ko.md) (Korean), and the [adoption guide](docs/ADOPTION.ko.md) (Korean).
