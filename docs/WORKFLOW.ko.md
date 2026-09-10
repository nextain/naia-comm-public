# 팀 개발 운영 절차

이 문서는 `naia-comm`의 현재 프로젝트 정책을 실행 가능한 순서로 설명합니다. 저장소의 `AGENTS.md`, `.agents/context/project-policy.yaml`, `.agents/context/workflow.yaml`, `projects/naia-comm/project.yaml`이 사실과 권한의 기준입니다. 이 문서의 예시 번호는 실제 GitHub 이슈 번호로 바꿉니다.

처음 필요한 도구는 Node.js `20.11` 이상, npm, Git `2.50.0` 이상, Python 3과 POSIX shell입니다. 공개 안전성 검사는 Git `2.50.0` 이상의 NUL 구분 `rev-list --objects` 출력이 필요하며, 더 오래된 Git은 역사 검사를 실패 시 차단(fail-closed) 방식으로 거부합니다. 버전이 낮으면 [공식 Git 업그레이드 안내](https://git-scm.com/downloads)를 따릅니다. Windows에서는 Windows Subsystem for Linux(WSL) 환경을 지원 범위로 사용하며, Windows native shell 동작은 보장하지 않습니다.

## 시작 전 확인

GitHub에서 자신의 fork를 만든 뒤 저장소를 복제하고 정책과 프로젝트 사실을 읽습니다.

`YOUR_GITHUB_HANDLE`을 자신의 GitHub 계정명으로 바꾼 뒤 실행합니다.

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

읽기, 정책 확인, `npm test`, `npm run test:first-mission`, `git diff --check`, 정적 화면의 로컬 확인은 외부 변경이 없는 활동입니다. 정적 화면은 `cd projects/naia-comm/site && python3 -m http.server 8080`으로 띄우고 브라우저에서 `http://localhost:8080/`을 확인합니다. 이 확인은 정적 HTML·CSS·이미지 경로에 한정하며 `/api`나 배포 성공을 증명하지 않습니다.

공개 자료를 자신의 로컬 환경·fork에서 수정·검증·commit·push하고 PR로 제안하는 데 1:1 시작 승인이나 작업 시간창은 필요하지 않습니다. 실제 제출은 GitHub 이슈에 작은 범위·완료 조건·담당자·배포 여부를 연결합니다. 중복 작업, 큰 설계 변경과 저장소 간 호환성 변경은 해당 maintainer와 조율합니다. 범위 안의 수정·검증·실패 후 재시도는 계속 진행할 수 있습니다.

연락 가능한 시간과 응답 기대 시간은 선택입니다. 공유 자원을 실제로 변경할 때만 권한자와 대상·시간창을 합의합니다. `main` 병합·배포·DB 변경·비공개 자료 공개에는 해당 역할과 승인이 필요합니다. 상세한 초보자 명령과 문제 해결은 [온보딩](../CONTRIBUTING.ko.md)을 따릅니다.

현재 `project.yaml`은 기본 브랜치와 통합 브랜치를 모두 `main`으로 선언합니다. fork의 `origin`과 원본 저장소를 가리키는 `upstream`에서 확인한 정책을 기준으로 하며, `dev` 브랜치를 만들거나 존재한다고 가정하지 않습니다. 원격 브랜치 정책이 바뀌면 `project.yaml`과 이 문서를 함께 갱신합니다.

## 이슈와 첫 작업

1. 작은 미션과 완료 조건을 이슈에 적습니다. 코드, 문서, 번역, 데모, 운영 자료 중 하나를 고릅니다.
2. 담당자의 공개 handle을 적습니다. 연락 시간은 선택이고, 변경 시간창은 공유 자원 작업에만 해당합니다. reviewer가 미정이면 미정으로 둡니다.
3. 배포 필요 여부와 대상 환경을 적습니다. `project.yaml`에 명령이 없으면 배포 명령을 발명하지 않습니다.
4. 생성된 실제 이슈 번호로 기본 브랜치에서 이슈 브랜치를 만듭니다. 먼저 깨끗한 작업 상태인지 확인하고, 같은 브랜치가 이미 있으면 재생성하지 않습니다.

```bash
git fetch upstream
git switch main
git pull --ff-only upstream main
git switch -c issue/123-docs-onboarding
```

위 `123`은 실행할 때 실제 이슈 번호로 교체합니다. 작업 중에는 변경 범위를 이슈의 완료 조건 안에 둡니다. Discord는 이슈 스레드 링크와 논의를 보조하며, Discord나 AI 대화가 권한을 대신하지 않습니다.

## 로컬 검증과 제출

작업 뒤 실제 명령을 실행하고 결과를 같은 이슈에 기록합니다.

```bash
npm test
git diff --check
git status --short
git diff --stat
```

제출 기록에는 이슈 번호, 커밋 SHA, 변경 파일과 범위, 실행 명령과 결과, 알려진 제한 사항, 다른 사람이 따를 재현 절차, 배포 필요 여부를 포함합니다. 검증이 실패하면 원인과 현재 상태를 적고 이슈에 적은 범위 안에서 수정·재시도합니다. 범위나 권한이 바뀌면 담당자와 다시 합의합니다.

현재 `npm test`는 workspace 계획·checkout 점검 테스트, `scripts/validate.mjs`의 구조 검사, `scripts/test-site-submit.mjs`의 사이트 제출 API 계약, NUL 경로를 쓰는 이력 검사 fixture와 `scripts/public-safety-scan.mjs`의 공개 안전성 검사를 실행합니다. `npm run test:first-mission`은 신규 참여자 문서의 성공·실패·복구 경로를 fixture에서 실행합니다. 두 명령 모두 `.agents/context/*.yaml`의 상태 전이와 독립 검토자 조건을 실행하거나 Discord·사이트·Azure Functions·배포를 검증하는 명령은 아닙니다. YAML 정책 선언은 integrator가 이슈 증거와 함께 확인해야 합니다.

## 배포가 필요한 변경

배포가 필요한 변경은 다음 상태를 순서대로 밟습니다.

`issue_open → branch_active → implementation_ready → main_merge_requested → acceptance_requested → production_approved → production_deployed → closed`

기여자는 이슈에 완료 조건·검증·되돌리기 계획과 정확한 커밋을 남긴 뒤 `main` 병합을 요청합니다. integrator는 reviewer의 독립 검토 결과를 확인하고 권한이 있는 경우에만 `main` 병합과 개발 환경 검증 결과를 기록합니다. release owner만 운영 승인과 운영 배포를 수행합니다. 운영 배포에는 승인된 정확한 SHA, 환경, 결과와 rollback reference를 남깁니다. 실패한 검증은 `branch_active`로 돌아갑니다.

참여 조사 사이트는 응답을 받지 않는 보관 예제이며, 이 저장소에는 운영 배포 workflow가 포함되지 않습니다. 이 프로젝트에는 개발·운영 배포가 선언되지 않았으므로, 배포가 필요한 변경은 `main_merge_requested → acceptance_requested`를 거쳐 진행하고 배포하지 않는 변경은 아래의 merged closure 경로를 사용합니다. 사이트를 다시 배포해야 한다면 소유자가 별도 절차로 배포 environment와 branch protection, 담당자를 구성한 뒤 진행합니다. 이 clone의 문서나 검증만으로 그 보호 설정이 구성됐거나 배포가 실행됐다고 말하지 않으며, 실제 환경 규칙과 담당자는 이슈에서 소유자에게 확인합니다.

개발 환경을 선언하지 않은 배포 필요 변경은 `main_merge_requested → acceptance_requested` 전이를 사용할 수 있습니다. 이때 integrator는 `review_result`, `merged_sha`, `no_development_environment_reason`을 이슈에 남기고, acceptance 증거와 알려진 제한 사항을 이어 기록합니다. 개발 환경을 실제로 선언한 별도 프로젝트만 `main_merge_requested → development_deployed → acceptance_requested` 전이를 사용합니다.

## 배포가 필요 없는 변경

문서·번역·데모·운영 자료처럼 배포가 필요 없는 변경은 `implementation_ready → main_merge_requested → closed` 경로를 사용합니다. integrator가 먼저 변경을 `main`에 merge하고 `merged_sha`, 검토 결과, 비배포 사유와 closure record를 남겨야 합니다. 이 경로는 배포를 건너뛰는 임의 종료가 아니라, 병합된 변경에 대한 비배포 종료 기록입니다.

1. contributor가 이슈 브랜치의 정확한 커밋 SHA, 변경 범위와 로컬 검증을 기록합니다.
2. 배포하지 않는 이유, 남은 제한 사항, 다른 사람이 재현할 명령 또는 문서 경로를 기록합니다.
3. contributor와 다른 `independent_reviewer` 또는 integrator가 같은 SHA와 완료 조건을 검토합니다. `review_result`에는 검토자와 정확한 SHA를 명시하며, 자기 검토만으로 종료하지 않습니다.
4. integrator가 변경을 `main`에 merge한 뒤 `merged_sha`와 검토 결과, `non_deployment_review_and_closure` closure record를 이슈에 남기고 종료 상태로 전환합니다.

필수 증거는 `commit_sha`, `changed_scope`, `implementation_summary`, `rollback_plan`, `local_validation`, `non_deployment_reason`, `independent_reviewer`, `review_result`, `merged_sha`, `reproducibility_steps`, `closure_record`입니다. 이후 배포가 필요해지면 새 범위와 배포 요청을 이슈에 기록하고 배포 경로로 다시 시작합니다.

## 주간 공유와 인수인계

주간 공유에는 이번 주에 가능한 범위, 완료한 결과, 검증 명령과 결과, 재현 절차, 남은 제한 사항, 다음 담당자가 이어갈 위치를 적습니다. 인수인계는 GitHub 이슈를 기준으로 하고 Discord에는 이슈 링크만 전달합니다. 운영 권한이나 비공개 자료를 전달해야 할 때는 프로젝트 소유자가 정한 별도 절차를 사용합니다. 이미지·NVA(아바타 설명 형식)·VRM·상표·책 자료의 조건은 `NOTICE-PUBLIC-ASSETS.md`에서 확인합니다.

## 금지 사항

- 타인의 작업을 덮어쓰거나 이슈 범위를 조용히 바꾸지 않습니다. 자신의 로컬 작업과 fork 제출은 사전 1:1 승인 없이 진행할 수 있습니다.
- contributor 브랜치에서 운영 서버로 직접 배포하지 않습니다.
- Discord 요청만으로 병합·배포·DB 변경·공개 전환을 실행하지 않습니다.
- 비밀번호, 토큰, 개인 ID, 사설 호스트·IP, 고객 데이터와 운영 토폴로지를 기록하지 않습니다.
- 비공개 자료의 신규 공개·저장소 공개 전환은 정확한 SHA 검수와 소유자 승인 없이 하지 않습니다. 이미 공개된 자료의 fork 기여는 온보딩 절차를 따릅니다.
