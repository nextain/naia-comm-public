# Integration evidence

Status: DRAFT / BLOCKED / VERIFIED (select one; DRAFT initially)
Coordination issue: owner/repo#number
Coordinator / reviewers / release owner: actual consenting handles or UNASSIGNED
User outcome and acceptance:

| Repository | Implementation issue / PR | Tested full SHA | Merged full SHA | Reviewer |
| --- | --- | --- | --- | --- |
| nextain/naia-shell | | | | |
| nextain/naia-agent | | | | |
| nextain/naia-memory | | | | |
| nextain/naia-kb-compiler | | | | |

Add every affected runtime/build dependency; give a reason for exclusions.
Shell pairing source: immutable URL at tested Shell SHA.
Agent/Memory pairing match: PASS / FAIL / NOT_RUN.
Proto hash, Memory package version and KB compatibility checks: commands + results.

| Required scenario | OS / architecture / toolchain | Command / procedure | Result: PASS, FAIL, NOT_RUN or justified N/A | Evidence |
| --- | --- | --- | --- | --- |
| Build and dependency checks | | | NOT_RUN | |
| Install / upgrade / launch | | | NOT_RUN | |
| Agent connection / user conversation | | | NOT_RUN | |
| Memory persistence / restart | | | NOT_RUN | |
| Voice input / output | | | NOT_RUN | |
| Failure recovery / data migration rollback | | | NOT_RUN | |

Merge order and compatibility between each step:
Post-merge revalidation at actual merged SHAs:
implementation_summary:
rollback_plan (including data compatibility):
Known failures and remaining checks:
Reviewer decision and evidence URL:
Release approval, package checksums/signatures and release URLs (separate from integration):

VERIFIED requires all required checks passed, real reviewers, and actual merged SHAs checked.
A dirty checkout, floating branch name, plan output, AI review, or successful community CI alone is insufficient.
Never paste credentials, personal conversation, memory databases, or unredacted device logs.
