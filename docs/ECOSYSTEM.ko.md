# Naia 분산 협업 운영안

상태: 도입 제안 · 2026-09-09. 이 문서는 호스트 권한 설정이나 제품 통합 테스트 완료를 의미하지 않는다.

## 선택과 근거

이 저장소 [nextain/naia-comm-public](https://github.com/nextain/naia-comm-public)은 커뮤니티 참여자를 위한 공개 안내와 공개 RFC 논의의 자리다. 제품 소스와 릴리스는 각 제품 저장소에 있다. 핵심 커미터 사이의 저장소 간 조율, 기기별 QA 회차, 세션 인계는 maintainer 들의 비공개 조율 저장소에서 운영하며, 그 결과는 각 제품 저장소의 이슈와 이 저장소의 공개 문서로 나온다. 이 문서는 공개 참여자가 알아야 할 절차만 적는다.

| 선택지 | 장점 | 비용과 판단 |
| --- | --- | --- |
| 공용 서버의 공유 개발 환경 | 운영자가 환경을 통일하기 쉽다 | 데스크톱 OS·GPU·오디오·권한 차이를 재현하기 어렵고 자원과 계정 관리가 집중된다 |
| 모든 제품을 모노레포로 이관 | 하나의 변경으로 원자적 병합 가능 | 기존 이슈·릴리스·권한·CI 이관 비용이 크다. 이번 범위에서는 채택하지 않는다 |
| Git submodule로 전체 제품 고정 | 정확한 조합 기록 가능 | 첫 기여에 불필요한 clone과 중첩 Git 관리 부담이 생긴다 |
| 공통 안내 + 선택적 로컬 clone + 통합 증거 | 작은 기여와 여러 저장소 변경을 모두 지원 | 조합 검증과 병합 순서를 명시해야 한다. 현재 채택한다 |

서버형 프로젝트에서 이어받을 것은 이슈 정본, 역할 분리, 검증 증거, 실패 후 재시도다. 공유 SSH 계정, 수정 시간창, 공용 DB, 중앙 AI 게이트웨이는 로컬 기여의 전제에서 제외한다. 기존 참여 조사 사이트의 배포 절차는 [WORKFLOW](WORKFLOW.ko.md)를 유지한다. 이 운영안이 다른 제품 저장소의 정책을 자동 변경하지는 않는다. 각 maintainer가 해당 저장소에서 채택해야 효력이 생긴다.

## 어디에서 무엇을 하는가

| 작업 | 정본 |
| --- | --- |
| Shell 버그·UI·데스크톱 동작 | `nextain/naia-shell`의 이슈와 PR |
| Agent 실행·도구·통신 | `nextain/naia-agent` |
| 기억 저장·검색 | `nextain/naia-memory` |
| 지식 컴파일 | `nextain/naia-kb-compiler` |
| OS 이미지·패키징 | `nextain/naia-os` (해당 작업자만 clone) |
| 첫 기여 안내·공개 RFC 논의·공개 운영 자료 | `nextain/naia-comm-public` |
| 핵심 커미터의 저장소 간 조율·기기별 QA 회차·세션 인계 | maintainer 들의 비공개 조율 저장소 (결과는 제품 이슈로 공개) |

전체 확인 목록은 [repository catalog](../workspace/repos.json)에 둔다. 단일 저장소 작업에는 comm 이슈를 중복 생성하지 않는다. 잘못 접수된 이슈는 권한이 있으면 transfer하고, 그렇지 않으면 담당 저장소 링크를 남겨 연결한다. 이슈 키는 항상 `owner/repo#number`다. Discord 스레드와 통합 문서에서는 `#123`만 사용하지 않는다.

## 참여와 역할

문서·번역·재현 보고는 브라우저만으로 시작할 수 있다. 코드 기여는 대상 저장소만 fork/clone하고 그 저장소의 안내를 따른다. 여러 구성요소를 실행할 때만 아래 workspace를 준비한다. Discord 가입, 유료 AI, 서버 계정은 기여 필수 조건이 아니다. 공개 이슈에 개인정보, 원본 대화·음성·기억 DB를 첨부하지 않고 합성 재현 자료를 사용한다.

| 역할 | 책임 | 권한 경계 |
| --- | --- | --- |
| Contributor | 작은 범위 구현, 재현·테스트, PR 응답 | fork로 시작. merge/release 권한 없음 |
| Triager / Community steward | 분류·첫 미션·Discord 논의 요약·참여자 응대 | 필요 시 GitHub Triage. 제품 승인권과 별개 |
| Reviewer | 코드·사용자 동작·OS별 증거 검토 | 일반 리뷰와 required approval 자격은 다르다 |
| Repository maintainer (integrator) | 해당 저장소의 범위 결정, reviewer 지정, 병합 | 다른 저장소에 대한 권한을 암묵적으로 갖지 않음 |
| Integration coordinator | 여러 PR 의존 관계·조합·누락 테스트 추적 | 각 maintainer의 병합권과 release owner의 배포권을 대체하지 않음 |
| Release owner | 검증된 조합·서명·배포·복구 판단 | 보호된 릴리스 환경에서만 실행 |

초기에는 현재 maintainer가 triage·조율·release owner를 겸할 수 있다. 문서로 가상의 운영진이나 승인자를 만들지 않는다. 자기 PR의 독립 승인을 AI 리뷰로 대체하지 않는다. reviewer가 없으면 기여 모집·draft·테스트 결과 공유는 계속하되 독립 승인 조건이 있는 병합은 기다린다. 참여자가 반복 기여·리뷰·응답 의사를 보이면 공개 nomination 이슈에서 범위와 책임을 합의하고 소유자가 최소 권한을 실제 설정한다. 비활동 시 사전 통지 후 인계하며 역할 명단은 당사자가 공개에 동의한 handle만 기록한다.

자원봉사자에게 SLA나 평일 근무시간을 요구하지 않는다. 주 1회 triage를 운영 목표로 삼고 첫 응답·첫 PR 소요 시간, reviewer 대기, 새 참여자의 다음 기여 여부를 월 1회 살핀다. 수치는 순위나 참여자 평가가 아니라 병목 개선용이다. 7일간 응답이 없으면 담당자에게 1회 확인하고, 14일 뒤에는 사전 안내 후 재배정 가능 상태로 전환한다. 이슈 자체를 자동 폐쇄하지 않는다.

## 작업 절차

1. 단일 저장소의 작은 수정은 그 이슈에서 완료 조건·재현 방법을 정한다. 여러 저장소나 호환성 변경은 comm에 coordination 이슈를 만들고 각 구현 이슈를 연결한다.
2. coordinator와 각 repo reviewer/maintainer를 실제로 지정한다. 일정은 약속 가능한 범위만 기록한다. 미정 담당자는 미정으로 두며 gate를 통과한 것으로 보지 않는다.
3. fork의 이슈 브랜치에서 작은 PR을 만든다. 이 저장소 PR은 실제 comm 이슈 번호를 쓴 `issue/<number>-<name>`과 `Refs #<number>`를 유지한다. 다른 repo 작업은 그 repo 규칙을 따른다. 교차 링크는 추가로 완전한 키를 적는다.
4. 작성자는 실행 명령·환경·정확한 SHA·PASS/FAIL/NOT_RUN·rollback을 남긴다. AI 생성 변경도 작성자가 설명하고 라이선스·테스트를 확인한다. 다른 AI가 승인했다고 사람의 책임이나 권한이 생기지 않는다.
5. reviewer가 변경과 증거를 확인하고 해당 maintainer가 병합한다. comm의 승인은 제품 PR의 승인을 대체하지 않는다.
6. 단일 저장소는 기존 종료 절차를 따른다. coordination 이슈는 모든 필수 제품 PR과 병합 후 조합 검증이 끝나야 닫는다. 제품 릴리스는 release owner의 별도 절차다.

아키텍처·호환성·개인정보·라이선스 정책 변경은 [RFC 템플릿](templates/RFC.md)을 사용한다. 제안자는 대안·영향 repo·전환/복구를 적고 최소 7일 의견 기간을 권장한다. affected maintainer의 명시적 결정을 남긴다. 침묵을 승인으로 보지 않는다. 의견 불일치는 선택 근거·반대 의견·재검토 조건을 기록하고, 권한이 걸린 변경은 각 소유자의 결정을 기다린다. 긴급 보안 수정은 비공개 조율 후 공개 가능한 사후 요약을 남긴다.

## 여러 저장소를 동시에 바꾸는 방법

예: Agent 프로토콜과 Shell 사용 코드를 변경한다면 comm 이슈에 Agent PR → Shell PR → 조합 검증 → 릴리스 순서를 적는다. 저장소를 넘는 원자적 merge는 없으므로 Agent가 기존 호출도 지원하는 확장부터 병합하고, Shell을 전환한 뒤 다음 릴리스에서 이전 인터페이스 제거를 검토한다. 호환 상태를 만들 수 없다면 아직 지원되는 조합은 유지하고 후보 PR SHA로 격리 검증한다. 깨진 `main`을 전제로 일정을 맞추지 않는다.

`packages/shell/agent-pairing.json`을 Shell의 Agent/Memory 요구 버전 정본으로 삼는다. comm은 이를 복사해 독립적인 최신 버전표로 운영하지 않는다. 통합 기록에는 해당 파일을 포함한 Shell SHA와 실제 모든 component SHA를 적는다. KB Compiler·OS·웹 연동 등 파일에 없는 의존성은 별도로 기록한다. `main`끼리 맞추거나 clone 성공만으로 호환성을 선언하지 않는다.

PR head로 한 검증은 병합 후 SHA의 검증과 구분한다. 변경된 SHA가 있으면 영향을 받는 검사를 다시 수행한다. [통합 기록](templates/INTEGRATION.md)을 이슈에 붙이거나 `integrations/`에 검토 가능한 문서로 제출한다(첫 기록을 제출할 때 디렉터리를 만든다). 원시 로그 대신 민감정보를 제거한 근거를 연결한다. 필수 OS·하드웨어 검사가 NOT_RUN이면 통합 승인/릴리스 완료로 표시하지 않는다.

릴리스 후보는 기존 제품의 지원 OS 목록을 기준으로 설치/업데이트, 실행, Agent 연결, 기억 저장·재시작, 음성 입출력, 실패 복구를 확인한다. 변경과 관련 없는 항목은 이유 있는 N/A로 기록할 수 있다. maintainer는 제품별 빌드·의존성·라이선스 검사를 수행하고 release owner는 패키지 SHA/서명과 배포 대상을 확인한다. 기억 스키마 변경은 백업·이전 버전 호환·복구를 함께 확인하며 바이너리 다운그레이드만으로 데이터 복구를 약속하지 않는다.

## 로컬 workspace

```text
naia-comm/
  docs/                  공통 절차와 템플릿
  workspace/repos.json   공개 저장소 목록 (버전 lock 아님)
  projects/naia-comm/     기존 참여 조사 사이트 (추적)
  projects/naia-shell/    선택적 로컬 clone (무시)
  projects/naia-agent/    선택적 로컬 clone (무시)
  projects/naia-memory/   선택적 로컬 clone (무시)
  projects/naia-kb-compiler/  선택적 로컬 clone (무시)
  projects/naia-os/       OS 작업자만 선택적 로컬 clone (무시)
```

```bash
node scripts/workspace.mjs plan shell
node scripts/workspace.mjs doctor shell
```

`plan`은 읽기 전용으로 clone 명령을 출력한다. 원하는 명령을 실행한 뒤 각 repo README/AGENTS를 읽는다. 기존 디렉터리를 덮어쓰거나 checkout하지 않는다. 기본 clone은 이동하는 main의 탐색용이므로 Shell pairing에 따라 Agent/Memory를 해당 SHA로 별도 준비하고, 제품별 도구 설치와 빌드는 각 repo 안내를 따른다. 명령은 POSIX shell 기준이며 이 공통 저장소의 Windows 명령 지원 범위는 WSL이다. WSL에서 실제 검사를 실행했다는 의미는 아니다. 이것이 Windows 네이티브 제품 빌드 검증을 대신하지 않는다.

제품을 수정하려면 대상 저장소를 GitHub에서 fork한다. `plan`의 clone은 공식 원격을 `origin`으로 갖기 때문에, 해당 clone 안에서 `git remote rename origin upstream` 후 `git remote add origin https://github.com/YOUR_GITHUB_HANDLE/대상저장소.git`으로 자신의 fork를 연결한다. 계정명과 저장소명을 실제 값으로 바꾸고 `git remote -v`로 확인한다. 이미 fork 원격이 구성돼 있으면 이 작업을 반복하지 않는다. 제품 PR의 base는 공식 저장소이며 브랜치·이슈 규칙은 제품 안내를 따른다.

새 main clone의 pairing이 맞지 않으면 다음 순서로 확인한다.

1. Shell의 `packages/shell/agent-pairing.json`을 읽고 `agentCommit`·`memoryCommit`을 확인한다.
2. Agent와 Memory 각각 `git status --short`가 비어 있는지 확인한다. 작업이 있으면 먼저 보존하고 checkout을 멈춘다.
3. 각 clone 안에서 공식 원격을 fetch한 뒤 `git switch --detach 실제요구SHA`로 정확한 커밋을 준비한다. 위에서 원격을 바꿨다면 `git fetch upstream`, 바꾸지 않았다면 공식 `origin`을 fetch한다. 커밋을 찾을 수 없으면 담당 저장소에 문의하고 임의의 main으로 대체하지 않는다.
4. 공통 저장소 루트에서 `node scripts/workspace.mjs doctor shell`을 다시 실행한다. 제품 변경을 시작할 때는 제품 정책에 맞는 작업 브랜치를 별도로 만든다. dirty 상태를 숨기려고 작업을 삭제하지 않는다.

`doctor`는 clone 유무·Git root·HEAD·dirty 상태·Agent/Memory pairing을 확인한다. 제품 코드를 실행하거나 변경하지 않는다. 누락/불일치/dirty는 실패하고, 성공해도 제품 빌드·proto 내용·Memory package 버전·KB 호환성·실행 검증은 NOT_RUN이다. 이 결과와 OS 검증을 함께 통합 기록에 적는다. `community` profile은 제품 clone이 필요 없고 `os`는 OS 작업에 필요한 단일 repo만 안내한다.

## 적용 순서

첫 단계는 공통 repo의 안내·Discord 규칙·첫 미션을 정비하고 실제 maintainer/reviewer 연락 창구를 지정하는 것이다. 다음으로 작은 Shell+Agent 변경 하나로 coordination 절차를 시범 운영한다. 그 결과를 보고 제품 repo에 선택적으로 채택 PR을 낸다. 자동화는 누락과 반복 비용이 확인된 뒤 늘린다. 초기에는 봇·프로젝트 보드·상시 회의를 만들 필요가 없다.

호스트 설정은 별도 운영 작업이다. required checks/approval, 최신 commit에 대한 재승인, 직접 push/force push 제한, release environment 보호를 각 repo에서 확인하고 결과 URL을 운영 이슈에 남긴다. 공개 fork CI는 GitHub-hosted runner와 최소 읽기 권한을 사용한다. 외부 PR 코드를 secrets·서명 키·self-hosted runner와 결합하지 않는다. 이 문서와 role 선언만으로 설정 완료를 주장하지 않는다.

## 조사 근거

2026-09-09 공개 자료 기준. 저장소 상태와 버전은 변하므로 통합 시 정확한 SHA로 다시 확인한다.

- [Shell 개발 안내](https://github.com/nextain/naia-shell)와 [pairing 파일](https://github.com/nextain/naia-shell/blob/main/packages/shell/agent-pairing.json): 로컬 다중 repo 구조와 Agent/Memory 결합 근거.
- [naia-adk](https://github.com/nextain/naia-adk)는 template 프로젝트로 통합된 보관 저장소다. 활성 필수 clone 목록에 넣지 않는다.
- [GitHub fork 모델](https://docs.github.com/en/pull-requests/reference/forks): 기여자의 독립 작업 경로.
- [GitHub repository 역할](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization): 역할과 실제 권한 구분.
- [GitHub Actions 설정](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository): fork CI 권한·secret 분리 근거.

공용 서버 방식과의 비교는 운영 모델에 대한 설계 판단이다. 특정 비공개 서비스의 운영 구조를 공개 근거로 복제하지 않는다.
