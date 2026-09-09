# naia-comm 기여 안내

제품 코드·여러 저장소 공동 작업은 [분산 협업 운영안](docs/ECOSYSTEM.ko.md)을 먼저 확인하세요. 아래 절차는 이 공통 저장소 자체에 기여하는 안내입니다.

이 문서는 처음 참여하는 사람이 자신의 시간과 역할에 맞는 작은 일을 골라, 다른 사람이 재현할 수 있는 결과로 남기도록 안내합니다. 모든 작업은 GitHub 이슈에 연결합니다. 이슈·프로젝트 정책·저장소의 `AGENTS.md`가 이 문서보다 우선합니다.

## 설치 없이 시작하기

제품 문제는 해당 제품의 이슈에, 커뮤니티 안내 문제는 [공개 이슈](https://github.com/nextain/naia-comm-public/issues)에 남깁니다. 작은 결과와 확인 방법을 적으면 시작할 수 있습니다. Discord나 maintainer의 사전 응답은 필요하지 않습니다.

브라우저로 문서를 고칠 때는 이슈를 먼저 만들어 번호를 받은 뒤 **Fork → 자신의 fork의 브랜치 선택 메뉴 → `issue/실제번호-short-name` 생성 → 파일의 연필 버튼 → 해당 브랜치에 commit** 순서로 진행합니다. GitHub의 기본 자동 브랜치 이름은 이 저장소 CI 규칙에 맞지 않을 수 있습니다. 이후 아래 **커밋·push·PR 제출** 절차의 웹 화면 안내를 따릅니다. 실행하지 못한 로컬 검사는 `NOT_RUN`으로 적고 PR의 GitHub Actions 결과를 기다립니다. 첫 fork PR의 Actions 실행에는 maintainer의 실행 승인이 필요할 수 있습니다. 이는 로컬 기여 시작 승인과 별개입니다. 제품 전체 clone은 필요하지 않습니다.

## 시작 전 확인

GitHub에서 **Fork**를 눌러 자신의 계정을 소유자로 하는 fork를 먼저 만들고, 그 fork를 clone합니다. 정책과 프로젝트 사실도 함께 읽습니다.

처음 필요한 도구는 Node.js `20.11` 이상, npm, Git `2.50.0` 이상, Python 3과 POSIX shell입니다. 공개 안전성 검사는 Git `2.50.0` 이상의 NUL 구분 `rev-list --objects` 출력이 필요하며, 더 오래된 Git은 역사 검사를 실패 시 차단(fail-closed) 방식으로 거부합니다. 버전이 낮으면 [공식 Git 업그레이드 안내](https://git-scm.com/downloads)를 따릅니다. Windows에서는 Windows Subsystem for Linux(WSL) 환경을 지원 범위로 사용하며, Windows native shell 동작은 보장하지 않습니다.

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

추적된 `projects/naia-comm/site`는 보관된 참여 조사 사이트 예제입니다. Naia 데스크톱 앱은 대상 제품 저장소에서 개발합니다.

SSH를 사용하려면 `git@github.com:YOUR_GITHUB_HANDLE/naia-comm-public.git`와 `git@github.com:nextain/naia-comm-public.git`를 각각 fork와 upstream 주소로 사용합니다. 실제 이슈의 완료 조건, 기여 유형, 담당 역할, 배포 필요 여부와 대상을 먼저 기록합니다. 연락 가능 시간과 응답 기대 시간은 선택 사항이며 공유 자원을 변경할 때만 시간창을 합의합니다. 시간창 문서는 약속을 설명할 뿐 자동 권한 검사가 아닙니다. 역할 선언의 실제 enforcement는 GitHub 저장소 권한, branch protection, protected environment와 저장소 변수에서 확인하며, 이슈의 reviewer 지정은 권한을 부여하거나 응답 시간을 보장하지 않습니다.

## 범위·역할·연락 경로

이슈에는 목적, 작은 결과, 확인 방법, 담당자의 공개 GitHub handle, 배포 여부를 적습니다. 이슈를 만들기 전 브랜치 번호는 `미정`으로 쓰고 생성 후 실제 번호로 갱신합니다. 같은 작업자가 있는지 확인하고 중복 작업이면 이슈에서 조율합니다.

공개 자료를 자신의 로컬 환경과 fork에서 수정·검증·commit·push하고 PR을 제출하는 데 1:1 시작 승인이나 수정 시간창은 필요하지 않습니다. maintainer 응답 전에도 draft PR로 제안할 수 있습니다. 큰 설계 변경이나 여러 저장소의 호환성 변경은 구현에 앞서 해당 maintainer들과 범위를 조율합니다. 범위 안의 수정·실패 후 재시도는 반복 승인 없이 진행합니다.

연락 가능한 시간·응답 기대 시간은 선택입니다. 공유 서버·DB·배포 자원을 실제로 변경할 때만 담당 권한자와 대상·시간창을 합의합니다. `main` 병합·배포·DB 변경·비공개 자료 공개에는 해당 역할과 승인이 필요하며, 자신의 fork에 접근할 수 있다는 사실이 그 권한을 주지 않습니다.

질문과 검토 요청은 같은 GitHub 이슈에 남깁니다. Discord는 선택적 논의 채널이며 결정은 이슈에 요약합니다. maintainer가 contributor와 다른 reviewer 및 integrator를 지정합니다. 미정이면 `UNASSIGNED`로 남기고 승인을 받았다고 쓰지 않습니다. 응답은 자원봉사자의 여건에 따르며 보장하지 않습니다.

## 기여 유형별 첫 미션

작은 미션 하나만 선택하고 완료 조건을 한 문장으로 씁니다.

| 유형 | 시작 가능한 미션 | 검증 결과 |
| --- | --- | --- |
| 코드 | `projects/naia-comm/site`의 작은 화면·접근성·오류 표시 개선 | `npm test`와 변경 전후 재현 절차 |
| 문서 | 시작 안내나 운영 절차의 누락된 단계 보완 | 명령·경로·정책 링크를 처음부터 따라 한 기록 |
| 번역 | 기존 안내 한 절을 한국어 또는 합의된 언어로 번역 | 원문 위치, 번역 범위, 용어 확인 |
| 데모 | 현재 기능으로 반복 가능한 짧은 사용 시나리오 작성 | 입력, 기대 결과, 캡처 또는 재현 단계 |
| 운영 자료 | 주간 공유·설문·온보딩 자료의 구조 개선 | 샘플 데이터로 검토한 결과와 개인정보 없음 확인 |

코드가 아닌 작업도 동일한 검토 경로를 사용합니다. 배포가 필요 없는 작업은 실제 배포를 흉내 내지 말고, 로컬 검증과 결과 재현에 집중합니다. 배포가 필요한 작업은 이슈에 대상 환경과 배포 담당자를 적고, contributor 권한으로 직접 배포하지 않습니다. 현재 `project.yaml`의 배포 명령이 비어 있으면 운영 명령을 만들어 실행하지 말고 소유자에게 환경 사실을 확인받습니다.

## 실행 가능한 첫 문서 미션

먼저 자신의 fork에서 깨끗한 작업 상태와 최신 `main`을 확인합니다. 아래 명령은 실제 기여를 시작할 때의 준비·브랜치·검증·복구 절차입니다. `123`은 실제로 생성한 이슈 번호로 바꿉니다. 이미 그 브랜치에 있다면 준비 블록을 반복 실행하지 않습니다.

`npm run test:first-mission`은 `.git` 없는 임시 fixture에서 수행하는 자동 smoke test입니다. 아래 단계는 자신의 fork의 실제 이슈 브랜치에서 수행하는 수동 미션이며, 결과를 검토 요청에 사용한 뒤 필요하면 명령에 따라 되돌립니다. 자동 fixture의 통과는 실제 branch의 merge나 배포를 증명하지 않습니다.

```bash
(
  set -e
  mission_status=$(git status --porcelain)
  if [ -n "$mission_status" ]; then
    echo "working tree is not clean; stop before updating or creating the practice branch"
    exit 1
  fi
  git fetch upstream
  git switch main
  git pull --ff-only upstream main
  mission_status=$(git status --porcelain)
  if [ -n "$mission_status" ]; then
    echo "working tree changed while updating; stop before creating the practice branch"
    exit 1
  fi
  git switch -c issue/123-docs-onboarding
)
```

준비 블록은 괄호 안의 별도 shell에서 실행되므로 실패하면 그 블록만 멈춥니다. 사용 중인 터미널은 종료하지 않습니다.

아래 한 문장 추가는 로컬 연습입니다. 동일한 연습 문장을 매번 PR로 제출하지 않습니다. 제출할 첫 기여는 실제로 발견한 오타·누락 안내 등 유용한 수정으로 고릅니다. 다음 Python 블록으로 `README.md`의 기존 문장 뒤에 한 문장을 추가합니다.

```bash
python3 - <<'PY'
from pathlib import Path

path = Path("README.md")
anchor = "자세한 내용은 [운영 절차](docs/WORKFLOW.ko.md), [Discord와 GitHub를 함께 쓰는 방법](docs/DISCORD.ko.md), [도입 안내](docs/ADOPTION.ko.md)를 참고합니다."
addition = " 문서 미션의 결과는 같은 명령으로 다시 확인할 수 있어야 합니다."
text = path.read_text(encoding="utf-8")
if addition in text:
    raise SystemExit("this practice change is already present; stop to avoid a duplicate")
if anchor not in text:
    raise SystemExit("expected README anchor was not found; keep the Python anchor in CONTRIBUTING.ko.md in sync and ask the maintainer")
path.write_text(text.replace(anchor, anchor + addition, 1), encoding="utf-8")
PY
npm test
git diff --check
git diff -- README.md
git diff --stat
```

이 연습의 `anchor`는 `README.md` 안내 문장과 byte 단위로 결합된 계약입니다. 문장을 바꾸면 위 Python 블록의 `anchor` 대입값도 함께 갱신하고 `npm run test:first-mission`으로 중복·누락 검사를 다시 실행합니다. 자동 검사는 이 절 제목, `bash` 코드 블록과 Python의 `anchor`·`addition` 대입문을 찾아 실행하므로 구조를 바꾸면 `scripts/test-first-mission.mjs`도 함께 확인합니다. 수동 연습 문장이 남아 있으면 중복 검사에서 실패하므로 아래 복구 후 실행합니다.

`npm run test:first-mission`은 이 문서에서 Python 블록을 추출해 `.git` 없는 임시 fixture에서 자동으로 실행하는 별도 smoke test입니다. 그 자동 검사는 fixture에서만 동작하므로 실제 branch의 README를 바꾸지 않습니다. 위의 수동 연습을 끝내면 diff를 확인합니다. README에 이 연습 변경만 있을 때 다음 명령으로 되돌립니다. 다른 변경이 섞여 있으면 restore하지 말고 편집기로 연습 문장만 제거합니다.

```bash
git status --short
git diff -- README.md
git restore -- README.md
git diff --check
git status --short
git branch --show-current
```

이슈 브랜치를 유지한 채 실제 기여할 내용을 수정해 아래 제출 절차로 이어갑니다. `main`으로 이동하거나 브랜치를 삭제할 필요는 없습니다.

예상 결과는 `npm test`의 workspace·구조·사이트 제출 API 계약·이력 검사 fixture·공개 안전성 검사 통과, `git diff --check`의 출력 없음·종료 코드 0, README 한 파일의 한정된 diff입니다. `npm test`는 YAML 상태 전이, 사이트·Azure Functions·Discord·배포를 실행하지 않습니다. 기준 anchor를 찾지 못하거나 이미 추가 문장이 있거나 검증이 실패하면 제출 준비를 멈추고 민감정보를 제거한 출력과 현재 SHA를 이슈에 기록합니다. 범위 안의 수정·재시도는 별도 시작 승인 없이 계속할 수 있습니다.

`npm run test:first-mission`은 성공 시 변환, 중복·누락 anchor 거부, fixture `npm test`, README-only 변경과 바이트 단위 동일 복구(byte-identical rollback)를 확인합니다. 이 명령은 작업 tree를 검사하는 도구이며 Git 이력, 공개 전환 검수, 원격 접근, 이슈·commit·제출을 증명하지 않습니다.

## 커밋·push·PR 제출

위 연습 변경을 되돌렸는지 확인하고, 실제로 제출할 개선을 이슈 브랜치에서 수정합니다. `git branch --show-current`가 실제 이슈 번호의 `issue/번호-name`인지 확인합니다. 처음부터 연습을 건너뛰었다면 위 브랜치 준비 블록부터 진행하며, 이미 만든 브랜치는 다시 생성하지 않습니다.

커밋 전 `git config user.name`과 `git config user.email`을 확인합니다. 커밋 작성자 정보는 공개 Git 이력에 남습니다. 이메일 노출을 원하지 않으면 GitHub **Settings → Emails**의 자신의 noreply 주소를 해당 clone의 `git config user.email`에 설정합니다. 이름·이메일이 미설정이면 Git의 안내에 따라 이 clone에 설정합니다.

```bash
npm test
npm run test:first-mission
git diff --check
git status --short
git diff -- README.md
# 실제 변경한 파일만 지정합니다. 아래는 README 수정 예시입니다.
git add README.md
git diff --cached
# 123을 실제 이슈 번호로 바꿉니다.
git commit -m "docs: clarify onboarding (Refs #123)"
git remote -v
# origin이 자신의 fork인지 확인한 다음 실행합니다.
git push -u origin HEAD
git rev-parse HEAD
```

테스트가 실패하면 제출 준비를 멈추고 원인을 수정합니다. 명령 실패 후 다음 줄을 무조건 실행하지 않습니다. 미실행 검사는 이유와 함께 `NOT_RUN`으로 기록하며, 로컬 미실행 자체를 성공으로 쓰지 않습니다. `git add .`로 관련 없는 파일을 포함하지 않습니다.

GitHub의 [원본 저장소 Pull requests](https://github.com/nextain/naia-comm-public/pulls)에서 **New pull request → compare across forks**를 선택합니다. **base repository: `nextain/naia-comm-public`, base: `main`, head repository: 자신의 fork, compare: 실제 `issue/번호-name` 브랜치**를 확인합니다. 브라우저 편집으로 이미 commit했다면 로컬 push는 필요하지 않습니다.

PR 본문의 `Refs #` 뒤에 원본 저장소의 실제 이슈 번호를 적습니다(예: `Refs #123`). branch 이름과 본문 양식을 CI가 확인합니다. 목적, 변경 범위, 정확한 SHA, 실행 명령과 결과, 재현 방법, 배포 여부, 되돌리기 방법을 채우고 **Create pull request** 또는 **Create draft pull request**를 선택합니다. fork의 이슈 번호와 혼동하지 않습니다. reviewer가 지정되지 않았으면 이슈에 검토 요청을 남기고 기다립니다. 수정 요청에는 같은 브랜치에 후속 commit을 push하면 PR이 갱신됩니다.

문제가 생기면 다음을 확인합니다.

| 증상 | 다음 행동 |
| --- | --- |
| `git clone`에서 저장소 없음 | fork 생성 여부와 `YOUR_GITHUB_HANDLE` 치환 확인 |
| Git 버전 때문에 역사 검사 실패 | `git --version` 확인 후 Git 2.50 이상으로 업그레이드 |
| `working tree is not clean` 또는 fast-forward 실패 | 작업을 보관하고 diff·이력을 확인. 강제 reset/push하지 않음 |
| 브랜치가 이미 있음 | `git branch --show-current` 확인 후 기존 이슈 브랜치 사용 |
| push 권한 거부 | `origin`이 자신의 fork인지와 GitHub 인증 확인. 토큰을 URL·로그에 넣지 않음 |
| PR contract CI 실패 | 브랜치 `issue/실제번호-name`, 본문 `Refs #실제번호` 확인 |
| 질문할 곳이나 reviewer가 없음 | [공개 이슈](https://github.com/nextain/naia-comm-public/issues)에 민감정보 없는 질문·PR 링크 남기기 |

## 검토와 종료

검토자는 이슈의 범위와 완료 조건, 변경 내용을 확인하고 같은 이슈에 결과를 남깁니다. contributor 본인의 확인만으로 종료하지 않습니다. `independent_reviewer`에는 contributor와 다른 reviewer 또는 integrator를 명시하고, `review_result`에는 그 검토자가 확인한 정확한 커밋 SHA와 결과를 적습니다.

배포가 필요한 변경은 현재 workflow의 `main` 병합, 환경 검토·검증, 승인·배포 단계를 따릅니다. 운영 배포는 release owner의 명시적 승인과 정확한 커밋, 되돌리기 정보를 요구합니다. 현재 `project.yaml`에 선언된 production 작업은 workflow 실행이며 실제 배포 성공은 이 문서가 증명하지 않습니다.

배포가 필요 없는 문서·번역·데모·운영 자료는 `implementation_ready → main_merge_requested → closed` 비배포 경로를 사용합니다. integrator가 먼저 변경을 `main`에 merge한 뒤 다음 증거를 이슈에 남기고, 종료 기록을 작성할 때만 닫습니다.

- 변경 파일과 커밋 SHA
- `implementation_summary`와 이번 구현의 범위
- 실패 시 되돌릴 `rollback_plan`
- `main`에 병합된 정확한 `merged_sha`
- 실행한 로컬 검증과 결과
- 다른 사람이 따라 할 수 있는 재현 절차 또는 문서 경로
- 배포하지 않는 이유와 남은 제한 사항
- contributor와 다른 `independent_reviewer`, 검토 결과와 정확한 SHA
- `non_deployment_review_and_closure` 기록

정책에 정의된 증거가 없거나 독립 검토자·integrator가 정해지지 않으면 종료를 주장하지 않고 이슈를 응답 대기로 남깁니다. 이후 배포가 필요해지면 새 범위와 배포 요청을 기록하고 배포 경로로 다시 시작합니다.

## 주간 공유와 인수인계

주간 공유에는 가능한 범위, 완료한 결과, 검증 명령과 결과, 재현 절차, 남은 제한 사항, 다음 담당자가 이어갈 위치를 적습니다. 결과는 코드, 문서, 번역, 데모, 운영 자료 어느 것이든 다른 사람이 다시 사용할 수 있어야 합니다. 인수인계는 GitHub 이슈를 기준으로 하고 Discord에는 이슈 링크만 전달합니다.

## 보안과 공개 범위

비밀번호, 토큰, 개인 ID, 사설 호스트·IP, 고객 데이터, 운영 토폴로지를 commit·이슈·Discord에 남기지 않습니다. 이미지·NVA(아바타 설명 형식)·VRM·상표·책 자료는 [NOTICE](docs/store-submission-v0.2.1/NOTICE.md)의 원자산 조건을 확인합니다. 저장소 공개 전환은 전체 트리·생성물·도달 가능한 이력까지 검수하고 소유자가 정확한 커밋 SHA를 승인한 뒤에만 진행합니다. 이미 공개된 이 저장소의 fork·기여 제출은 위 온보딩 경로를 따릅니다. 비공개 자료의 신규 공개나 저장소 공개 전환은 별도 검수·승인 대상입니다.
