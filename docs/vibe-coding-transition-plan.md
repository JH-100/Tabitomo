# Vibe Coding Transition Plan

## 개요

Tabitomo 프로젝트를 바이브코딩(AI 협업 개발) 친화적 구조로 전환하는 계획.

## 현재 상태 → 목표 상태

| 영역      | AS-IS         | TO-BE                             |
| --------- | ------------- | --------------------------------- |
| 문서화    | README만 존재 | CLAUDE.md + OpenSpec 문서 체계    |
| 테스트    | 없음          | Unit + Integration + E2E + Lint   |
| CI/CD     | 없음          | GitHub Actions 풀 파이프라인      |
| 스킬      | 없음          | 프로젝트 맞춤 Claude 스킬 7종+    |
| Git Hook  | 없음          | pre-commit(lint) + pre-push(test) |
| 이슈 관리 | 없음          | Epic/Task 기반 GitHub Issues      |
| 코드 품질 | 수동          | 자동 lint + typecheck + 리뷰      |

## 전환 단계

### Phase 1: 문서화 (CLAUDE.md + OpenSpec)

- [x] CLAUDE.md 생성
- [x] docs/ OpenSpec 문서 체계 구축
- [x] 프로젝트 개요, 아키텍처, 기능 명세
- [x] 개발 가이드, 테스트 전략, 리팩토링 계획
- [x] ADR (Architecture Decision Records) — 3건 작성

### Phase 2: 이슈 체계화

- [x] Epic 이슈 생성 (#1 바이브코딩 마이그레이션)
- [x] 개별 Task 이슈 등록 (#2~#8, 인수조건 포함)
- [x] 보안/버그 이슈 등록 (#9~#13)
- [x] 의존 관계 및 병렬 가능 작업 명시

### Phase 3: Claude 스킬 구축

- [x] gen-test: 테스트 자동 생성
- [x] manage-issues: 이슈 관리/업데이트
- [x] review-code: 코드 리뷰
- [x] update-docs: 문서 업데이트
- [x] simplify-code: 코드 단순화
- [x] 스킬 설명 문서 작성 (docs/skills-guide.md)

### Phase 4: 테스트 인프라

- [x] Jest + Testing Library 설치/설정
- [x] ESLint + Prettier 설정
- [x] QuizUtils 유닛 테스트 (18개)
- [x] useUserStore 유닛 테스트 (9개)
- [x] 데이터 무결성 테스트 (7개)
- [x] TypeScript strict 검증 통과

### Phase 5: Git Hook + 자동화

- [x] pre-commit: lint-staged (ESLint --fix + Prettier)
- [x] pre-push: typecheck + test
- [x] GitHub Actions CI 워크플로우
- [ ] Claude hook: README 자동 업데이트 (CLAUDE.md에 /update-docs 안내)

### Phase 6: 리팩토링 준비

- [x] 리팩토링 대상 확정 (docs/refactoring-plan.md)
- [x] 안전망(테스트) 확인 — 34개 통과
- [x] Phase별 실행 계획 수립

### Phase 7: 코드 리뷰 + 보안

- [x] 전체 코드 리뷰 (docs/code-review-report.md)
- [x] 보안 취약점 점검 — CRITICAL 3건, HIGH 6건 발견
- [ ] Critical 이슈 수정 (후속 작업)

### Phase 8: 완료 검증

- [x] 인수조건 검증
- [x] 문서/스킬 최종 업데이트
- [x] 최종 보고서

## 병렬 가능 작업

```
Phase 1 (문서화) ──→ Phase 2 (이슈)
     │                    │
     └──→ Phase 3 (스킬) ─┘
              │
     Phase 4 (테스트) ←──┘
     Phase 5 (Hook) ←── Phase 4 완료 후
              │
     Phase 6 (리팩토링) ←── Phase 4+5 완료 후
     Phase 7 (리뷰) ←── 병렬 가능
              │
     Phase 8 (검증) ←── 전체 완료 후
```

## 성공 기준

1. `npm test` 통과 (커버리지 60%+)
2. `npm run lint` 경고 0개
3. `npm run typecheck` 에러 0개
4. GitHub Actions CI 그린
5. CLAUDE.md + docs/ 문서 완비
6. Claude 스킬 5종+ 동작 확인
7. Git hook 정상 동작
