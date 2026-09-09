# naia-comm 기여 안내

제품 코드·여러 저장소 공동 작업은 [분산 협업 운영안](docs/ECOSYSTEM.ko.md)을 먼저 확인하세요. 아래 절차는 이 공통 저장소 자체에 기여하는 안내입니다.

이 문서는 처음 참여하는 사람이 자신의 시간과 역할에 맞는 작은 일을 골라, 다른 사람이 재현할 수 있는 결과로 남기도록 안내합니다. 모든 작업은 GitHub 이슈에 연결합니다. 이슈·프로젝트 정책·저장소의 `AGENTS.md`가 이 문서보다 우선합니다.

## 시작 전 확인

GitHub에서 **Fork**를 눌러 자신의 계정을 소유자로 하는 fork를 먼저 만들고, 그 fork를 clone합니다. 정책과 프로젝트 사실도 함께 읽습니다.

처음 필요한 도구는 Node.js `20.11` 이상, npm, Git `2.50.0` 이상, Python 3과 POSIX shell입니다. 공개 안전성 검사는 Git `2.50.0` 이상의 NUL 구분 `rev-list --objects` 출력이 필요하며, 더 오래된 Git은 역사 검사를 실패 시 차단(fail-closed) 방식으로 거부합니다. 버전이 낮으면 [공식 Git 업그레이드 안내](https://git-scm.com/downloads)를 따릅니다. Windows에서는 Windows Subsystem for Linux(WSL) 환경을 지원 범위로 사용하며, Windows native shell 동작은 보장하지 않습니다.

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

SSH를 사용하려면 `git@github.com:<your-account>/naia-comm-public.git`와 `git@github.com:nextain/naia-comm-public.git`를 각각 fork와 upstream 주소로 사용합니다. 실제 이슈의 완료 조건, 기여 유형, 담당 역할, 배포 필요 여부와 대상을 먼저 기록합니다. 연락 가능 시간과 응답 기대 시간은 선택 사항이며 공유 자원을 변경할 때만 시간창을 합의합니다. 시간창 문서는 약속을 설명할 뿐 자동 권한 검사가 아닙니다. 역할 선언의 실제 enforcement는 GitHub 저장소 권한, branch protection, protected environment와 저장소 변수에서 확인하며, 이슈의 reviewer 지정은 권한을 부여하거나 응답 시간을 보장하지 않습니다.

## 시간·역할·연락 경로

첫 이슈 또는 기존 이슈 댓글에는 다음을 자신의 말로 적습니다.

- 해결하려는 목적과 이번에 만들 작은 결과
- 기여 유형과 담당 역할
- 연락 가능한 시간·요일·시간대와 응답을 기대하는 시간
- 실제 파일 수정·commit을 허용하는 시간창
- 처음 범위와 시작을 합의할 담당자
- 배포 필요 여부와 필요한 경우 대상 환경
- 검증할 명령, 화면 또는 문서 절차

연락·응답 창은 질문과 주간 공유를 조정하는 시간이고, 변경 활동(mutation) 창은 실제 파일 수정·commit을 허용하는 시간입니다. 둘을 구분해 서면으로 약속합니다. 이 안내와 현재 검증 명령은 시간창을 자동으로 강제하지 않으며, 이를 자동 집행한다고 주장하지 않습니다.

처음 실제 기여는 담당자와 1:1로 범위·역할·시간·배포 필요 여부를 합의하고 이슈에 배정한 뒤 시작합니다. 합의가 끝난 뒤 같은 범위의 수정·검증·실패 후 재시도는 추가 응답이나 재승인 때문에 중단하지 않습니다. 범위·역할·권한·배포 대상 또는 실제 변경 허용 시간이 바뀔 때만 이슈에 기록하고 다시 합의합니다. 개인 학습을 위한 읽기와 자신의 임시 브랜치에서 하는 로컬 실습은 별도 1:1 응답을 기다리지 않고 진행할 수 있지만, commit·push·병합·배포·공개 전환은 하지 않습니다.

진행 중 질문·결정·검토 요청은 같은 GitHub 이슈에 남기고, Discord를 사용하는 경우 해당 이슈 스레드 링크만 보조 채널로 공유합니다. Discord나 AI 대화는 권한·승인·완료를 대신하지 않습니다. 기여자는 contributor 역할로 작업하고, 다른 reviewer 또는 integrator가 정확한 SHA를 검토하며, integrator가 정책상 종료 기록을 남깁니다.

읽기·정책 확인·`npm test`·`git diff --check`·정적 화면의 로컬 확인은 외부 변경이 없는 활동입니다. 파일 수정·브랜치 생성·commit·push는 변경 활동입니다. 병합·배포·데이터베이스(DB) 변경·공개 전환은 운영 활동이며 역할과 별도 승인이 필요합니다.

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

먼저 자신의 fork에서 깨끗한 작업 상태와 최신 `main`을 확인합니다. 아래 명령은 실제 기여를 시작할 때의 준비·브랜치·검증·복구 절차입니다. `123`은 합의한 이슈 번호로 바꿉니다.

`npm run test:first-mission`은 `.git` 없는 임시 fixture에서 수행하는 자동 smoke test입니다. 아래 단계는 자신의 fork의 실제 이슈 브랜치에서 수행하는 수동 미션이며, 결과를 검토 요청에 사용한 뒤 필요하면 명령에 따라 되돌립니다. 자동 fixture의 통과는 실제 branch의 merge나 배포를 증명하지 않습니다.

```bash
if [ -n "$(git status --porcelain)" ]; then
  echo "working tree is not clean; stop before updating or creating the practice branch"
  exit 1
fi
git fetch upstream
git switch main
git pull --ff-only upstream main
if [ -n "$(git status --porcelain)" ]; then
  echo "working tree changed while updating; stop before creating the practice branch"
  exit 1
fi
git switch -c issue/123-docs-onboarding
```

실제 문서 미션은 다음 Python 블록으로 `README.md`의 기존 문장 뒤에 한 문장을 추가합니다.

```bash
python3 - <<'PY'
from pathlib import Path

path = Path("README.md")
anchor = "자세한 내용은 [운영 절차](docs/WORKFLOW.ko.md), [Discord 협업 설계](docs/DISCORD.ko.md), [도입 안내](docs/ADOPTION.ko.md)를 참고합니다."
addition = " 문서 미션의 결과는 같은 명령으로 다시 확인할 수 있어야 합니다."
text = path.read_text(encoding="utf-8")
if addition in text:
    raise SystemExit("this practice change is already present; stop to avoid a duplicate")
if anchor not in text:
    raise SystemExit("expected README anchor was not found; keep the CONTRIBUTING.ko.md:84 anchor contract in sync and ask the maintainer")
path.write_text(text.replace(anchor, anchor + addition, 1), encoding="utf-8")
PY
npm test
git diff --check
git diff -- README.md
git diff --stat
```

이 연습의 `anchor`는 `README.md` 마지막 안내 문장과 byte 단위로 결합된 계약입니다. 문장을 바꾸거나 위치를 옮기면 이 문서의 `CONTRIBUTING.ko.md:84` 대입값도 함께 갱신하고 `npm run test:first-mission`으로 중복·누락 검사를 다시 실행합니다.

`npm run test:first-mission`은 이 문서에서 Python 블록을 추출해 `.git` 없는 임시 fixture에서 자동으로 실행하는 별도 smoke test입니다. 그 자동 검사는 fixture에서만 동작하므로 실제 branch의 README를 바꾸지 않습니다. 위의 수동 절차는 자신의 작업 branch에서 실제 문서를 바꾸는 연습이므로, 끝난 뒤 다음 명령으로 결과를 확인하고 되돌립니다.

```bash
git status --short
git diff -- README.md
git restore -- README.md
git diff --check
git status --short
git switch main
git branch -d issue/123-docs-onboarding
```

`git branch -d`는 이미 병합됐거나 커밋이 남지 않은 브랜치만 지우며, 미병합 작업이 있으면 실패해 작업을 보존합니다. 미병합 작업은 브랜치를 유지하고 이슈에 인수인계합니다. 이 복구 실습에서 강제 삭제 옵션 `git branch -D`는 사용하지 않습니다.

예상 결과는 `npm test`의 구조·사이트 제출 API 계약·이력 검사 fixture·공개 안전성 검사 통과, `git diff --check`의 출력 없음·종료 코드 0, README 한 파일의 한정된 diff입니다. `npm test`는 YAML 상태 전이, 사이트·Azure Functions·Discord·배포를 실행하지 않습니다. 기준 anchor를 찾지 못하거나 이미 추가 문장이 있거나 검증이 실패하면 diff를 제출하지 않고 출력과 현재 SHA를 이슈에 기록합니다. 같은 합의 범위의 수정·재시도는 시작 합의가 이미 있으면 계속할 수 있습니다.

`npm run test:first-mission`은 성공 시 변환, 중복·누락 anchor 거부, fixture `npm test`, README-only 변경과 바이트 단위 동일 복구(byte-identical rollback)를 확인합니다. 이 명령은 작업 tree를 검사하는 도구이며 Git 이력, 공개 전환 검수, 원격 접근, 이슈·commit·제출을 증명하지 않습니다. 실제 기여 결과만 합의한 이슈에 제출합니다.

## 브랜치와 작업 기록

프로젝트가 실제로 제공하는 통합 브랜치와 권한을 확인한 뒤 이슈 브랜치를 만듭니다. 현재 기본 브랜치는 `main`이며, `dev`를 원격에 임의로 만들거나 존재한다고 가정하지 않습니다.

```bash
if [ -n "$(git status --porcelain)" ]; then
  echo "working tree is not clean; stop before creating an issue branch"
  exit 1
fi
git fetch upstream
git switch main
git pull --ff-only upstream main
git switch -c issue/123-docs-onboarding
# 작업
npm test
git status --short
git diff --check
```

커밋과 검토 요청에는 다음을 포함합니다.

1. 이슈 번호와 변경 목적
2. 실제 변경 파일과 변경하지 않은 범위
3. 실행한 검증 명령과 결과
4. 알려진 제한 사항과 재현 가능한 확인 방법
5. 배포 필요 여부, 필요할 때의 담당자·승인·되돌리기 정보

검증 실패나 범위 변경이 생기면 이슈에 기록합니다. 같은 합의 범위의 수정과 재시도는 새 승인 없이 계속하고, 범위를 바꾸거나 권한이 필요한 조치가 생길 때만 담당자와 다시 합의합니다. 실패를 숨기거나 완료 조건을 조용히 바꾸지 않습니다.

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

비밀번호, 토큰, 개인 ID, 사설 호스트·IP, 고객 데이터, 운영 토폴로지를 commit·이슈·Discord에 남기지 않습니다. 이미지·NVA(아바타 설명 형식)·VRM·상표·책 자료는 [NOTICE](docs/store-submission-v0.2.1/NOTICE.md)의 원자산 조건을 확인합니다. 저장소 공개 전환은 전체 트리·생성물·도달 가능한 이력까지 검수하고 소유자가 정확한 커밋 SHA를 승인한 뒤에만 진행합니다. 참여자는 이 절차를 우회해 공개 저장소나 외부 서비스에 복제·게시하지 않습니다.
