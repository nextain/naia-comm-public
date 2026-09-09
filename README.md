# naia-comm

`naia-comm`는 Naia 오픈소스 커뮤니티의 첫 기여, 여러 제품 저장소의 공동 작업, 통합 검증과 공개 운영 자료를 관리하는 공통 저장소입니다. 공개 참여자는 자신의 fork에서 작은 결과를 만들고, 이슈와 pull request로 재현 가능한 증거를 제출합니다.

저장소에서 지키는 기준은 다음과 같습니다.

- GitHub 이슈가 작업 범위, 완료 조건, 검증 결과와 권한 요청의 정본입니다.
- 개인 fork 또는 작업 브랜치에서 작업하고, 결과와 재현 절차를 pull request에 남깁니다.
- Discord는 이슈 스레드의 논의와 검수 요청을 돕습니다. Discord나 AI 대화가 병합·배포 권한을 만들지 않습니다.
- 비밀번호, 토큰, 개인 식별자, 사설 호스트·IP, 고객 자료와 운영 토폴로지는 저장소와 이슈에 기록하지 않습니다.
- 공개 후보는 전체 트리, 생성물, 도달 가능한 Git 이력, workflow, 라이선스를 검수하고 소유자가 정확한 커밋 SHA를 승인한 뒤 공개합니다.

## 여러 저장소에서 함께 개발하기

**[분산 협업 운영안과 역할](docs/ECOSYSTEM.ko.md)** · [English contribution guide](CONTRIBUTING.md) · [저장소 목록](workspace/repos.json) · [통합 검증 양식](docs/templates/INTEGRATION.md)

문서·번역은 이 저장소에서, 제품 코드는 각 제품 저장소에서 기여합니다. 여러 제품에 걸친 변경은 이곳의 coordination 이슈에서 연결합니다. 개발은 각자의 로컬 환경에서 진행하고 GitHub에 결정과 검증을 남깁니다. Discord 가입·공용 SSH 계정·유료 AI는 필수 조건이 아닙니다.

```bash
# 읽기 전용: 선택적 제품 clone 명령 안내
node scripts/workspace.mjs plan shell
# clone 후 HEAD와 Agent/Memory pairing 점검 (제품 빌드 검증과 별개)
node scripts/workspace.mjs doctor shell
```

원격 정본은 기존 `nextain/naia-comm-public`입니다. 로컬 이름은 `naia-comm`로 사용할 수 있습니다. 아래 참여 조사 사이트와 첫 미션은 그대로 이용할 수 있습니다.

## 이 프로젝트가 안내하는 일

참여자는 자신의 언어로 목적과 가능한 시작 시점을 설명하고 작은 미션 하나를 정해 시작합니다. 미션은 코드, 문서, 번역, 데모 또는 운영 자료가 될 수 있습니다. 이슈에는 결과, 담당 역할, 브랜치, 검증 명령, 재현 절차와 배포 필요 여부를 적습니다. 합의한 범위 안의 수정·검증·실패 후 재시도는 계속 진행할 수 있으며, 범위·역할·권한·배포 대상이 바뀔 때만 이슈에서 다시 합의합니다.

역할은 권한을 분리합니다. contributor는 이슈 브랜치에서 작업하고 검토를 요청합니다. reviewer는 contributor와 독립적으로 변경과 완료 조건을 확인하고 요청사항을 남깁니다. integrator는 확인된 결과를 바탕으로 정책에 맞는 병합과 비배포 종료 기록을 담당합니다. release owner는 별도 승인 뒤 production 배포와 rollback을 담당합니다. `project.yaml`의 역할은 workflow 선언이며 실제 강제는 GitHub 저장소 권한, branch protection, protected environment와 저장소 변수로 이뤄집니다. maintainer가 이슈에서 reviewer와 integrator를 지정하지만 응답 시간은 보장하지 않습니다. 연락 가능 시간은 선택적으로 적고, 공유 자원 변경이 있을 때만 별도 변경 시간창을 합의하며, 문서와 로컬 검증 명령이 이 권한 설정을 자동으로 강제한다고 주장하지 않습니다.

## 현재 확인된 상태

- 기본 브랜치와 통합 브랜치는 `main`입니다. 현재 공개 참여 흐름은 `main`으로 pull request를 보내는 방식이며, `dev` 브랜치를 존재한다고 가정하지 않습니다.
- 개발 배포는 선언하지 않습니다. production 사이트 workflow는 GitHub Actions의 `workflow_dispatch`에서만 시작되고 `production` environment를 사용합니다. 첫 production dispatch 전에 저장소 소유자가 해당 environment의 배포 브랜치 정책을 `main`으로 두고 required reviewers를 구성해야 하며, 이 저장소는 그 설정이 이미 완료됐다고 주장하지 않습니다. 저장소 소유자는 `main` branch protection에도 required approval 1개 이상과 self-approval 금지를 설정해야 하며, 이 후보의 문서만으로 호스트 설정 완료를 주장하지 않습니다.
- 수동 production 실행은 입력한 소문자 40자리 commit SHA가 `main`의 현재 SHA와 같고, workflow가 `main` ref에서 시작되며, 실행 actor와 triggering actor가 각각 저장소 변수 `NAIA_COMM_RELEASE_OWNERS`에 있을 때만 진행됩니다. 변수 미설정, 두 actor 중 하나의 불일치, ref·SHA 불일치는 거부됩니다. 변수의 쉼표 구분 값은 비교 전에 앞뒤 공백을 제거합니다. production API token은 저장소 파일이나 일반 변수에 두지 않고 `production` environment secret으로만 구성해야 합니다. `production`은 workflow가 지정하는 environment 이름이며, 보호 규칙이 실제로 구성됐다는 증거가 아닙니다.
- `npm test`는 구조 검증, 사이트 제출 API 계약, NUL 경로를 쓰는 이력 검사 fixture와 공개 안전성 검사를 실행합니다. YAML workflow 실행, 사이트·Azure Functions의 실제 실행, Discord 실행 또는 배포 성공을 증명하지 않습니다.
- 정적 화면은 아래 로컬 명령으로 확인할 수 있습니다. `/api` 경로는 Azure Functions Core Tools 또는 배포된 환경이 필요합니다.

처음 준비할 도구는 Node.js `20.11` 이상, npm, Git `2.50.0` 이상, Python 3과 POSIX shell입니다. 공개 안전성 검사는 Git `2.50.0` 이상의 NUL 구분 `rev-list --objects` 출력이 필요하며, 더 오래된 Git은 역사 검사를 실패 시 차단(fail-closed) 방식으로 거부합니다. 버전이 낮으면 [공식 Git 업그레이드 안내](https://git-scm.com/downloads)를 따릅니다. Windows에서는 Windows Subsystem for Linux(WSL) 환경을 지원 범위로 사용하며, Windows native shell 동작은 이 저장소가 보장하지 않습니다.

## 공개 검토 요청

검토 요청과 질문은 [GitHub 공개 이슈](https://github.com/nextain/naia-comm-public/issues)에 남깁니다. 역할 선언은 실제 권한 부여 기록이 아니며, GitHub 저장소 권한·branch protection·protected environment·저장소 변수의 설정이 실제 enforcement입니다. maintainer가 이슈에서 contributor와 다른 reviewer 및 integrator를 지정하고, reviewer가 같은 SHA와 완료 조건을 독립적으로 확인한 뒤 integrator가 그 결과를 바탕으로 종료 기록을 남깁니다. 이슈에서 검토를 요청할 수 있지만 응답 시간은 보장하지 않습니다.

## AI 도구와 게이트웨이 범위

개인 로컬 환경에서 원하는 AI 도구를 선택적으로 사용할 수 있습니다. 도구와 모델의 가용성은 각자의 계정에 따릅니다. 작성자는 AI가 만든 변경도 직접 설명하고 검증하며, AI 리뷰는 독립적인 사람의 승인이나 배포 권한을 대신하지 않습니다.

## 첫 기여 시작하기

GitHub 저장소 화면에서 **Fork → Create new fork**를 눌러 자신의 계정에 공개 저장소의 fork를 만든 뒤 HTTPS 또는 SSH로 복제하고 정책, 프로젝트 사실, 프로젝트 안내를 읽습니다.

```bash
git clone https://github.com/<your-account>/naia-comm-public.git
cd naia-comm-public
git remote add upstream https://github.com/nextain/naia-comm-public.git
sed -n '1,220p' AGENTS.md
sed -n '1,220p' .agents/context/project-policy.yaml
sed -n '1,220p' .agents/context/workflow.yaml
sed -n '1,220p' projects/naia-comm/project.yaml
npm test
```

GitHub 이슈에는 작은 미션과 완료 조건, 기여 유형, 담당 역할, 이슈 브랜치, 연락·응답 시간, 실제 변경 허용 시간창, 배포 필요 여부, 검증 명령과 재현 절차를 적습니다. 이슈 브랜치에서 작업한 뒤 `main`으로 pull request를 만들고 다른 reviewer에게 정확한 SHA의 독립 검토를 요청합니다. integrator가 검토 결과를 확인해 `main`에 merge한 뒤, 비배포 작업이면 `main_merge_requested → closed` 전이에 `merged_sha`, 비배포 사유와 closure record를 남깁니다. 기여자가 직접 merge, production 배포, database 변경 또는 공개 전환을 실행하지 않습니다.

## 작업과 검증

```bash
npm test
npm run test:first-mission
git diff --check
git status --short
```

검증 결과, 변경 파일, 제한 사항, 재현 명령을 이슈와 pull request에 기록합니다. 배포하지 않는 문서·번역·데모·운영 자료는 로컬 증거와 독립 검토 결과를 남긴 뒤 비배포 종료 경로를 사용합니다.

개발 환경은 현재 선언하지 않으므로, 로컬 `npm test`, `npm run test:first-mission`과 정적 화면 확인이 acceptance 경로입니다. reviewer가 동일한 commit SHA, 이 로컬 증거와 제한 사항을 독립적으로 확인하고, integrator가 먼저 `main`에 merge한 뒤 `main_merge_requested → closed` 비배포 종료 기록을 남깁니다. 이 절차는 개발 배포나 production 성공을 뜻하지 않습니다. production 실패나 취소 뒤에는 revert commit을 `main`에 merge하고 새 `main` tip의 정확한 SHA로 다시 dispatch하며, workflow는 이전 SHA를 거부합니다.

정적 화면을 확인하려면 다음을 실행합니다.

```bash
cd projects/naia-comm/site
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080/`을 열면 정적 HTML·CSS·이미지 경로를 확인할 수 있습니다. 이 명령은 API, Discord 또는 Azure 배포를 검증하지 않습니다.

## 실행 가능한 첫 문서 미션

처음에는 [한국어 기여 안내](CONTRIBUTING.ko.md)의 문서 미션을 실행합니다. 자동 smoke test는 `.git` 없는 임시 fixture에서 README 한 파일만 수정해 중복·anchor 실패·검증·rollback을 확인합니다. 실제 기여는 자신의 fork와 이슈 브랜치에서 같은 절차를 따라 수행하고, 결과를 검토 요청으로 제출하며 자동 fixture의 성공을 실제 merge나 배포의 증거로 해석하지 않습니다.

```bash
npm run test:first-mission
```

## 라이선스

공개 대상으로 승인되는 소스와 문서는 [Apache License 2.0](LICENSE)에 따라 배포합니다. Apache 권한은 이 저장소의 코드와 문서 범위에만 적용되며 Naia·Nextain 상표, 스토어 문안·출판물 또는 제3자 이미지·NVA(아바타 설명 형식)·VRM(3D 아바타 파일 형식)의 권리를 부여하지 않습니다. 별도 조건은 [NOTICE](docs/store-submission-v0.2.1/NOTICE.md)의 범위와 원자산 고지를 함께 확인합니다. 공개된 캐릭터와 로고의 승인 범위는 [공개 자산 고지](NOTICE-PUBLIC-ASSETS.md)에 기록합니다.

자세한 내용은 [운영 절차](docs/WORKFLOW.ko.md), [Discord 협업 설계](docs/DISCORD.ko.md), [도입 안내](docs/ADOPTION.ko.md)를 참고합니다.
