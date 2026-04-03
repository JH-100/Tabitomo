# Testing Strategy

## 목표

리팩토링 안전망 구축: 코드 변경 시 기존 기능이 깨지지 않음을 보장

## 테스트 피라미드

```
        ┌───────┐
        │  E2E  │  소수 핵심 플로우
       ┌┴───────┴┐
       │ Integration │  컴포넌트 + 스토어 연동
      ┌┴───────────┴┐
      │   Unit Tests  │  유틸, 스토어, 순수 로직
     ┌┴───────────────┴┐
     │  Static Analysis  │  TypeScript, ESLint
     └──────────────────┘
```

## 테스트 범위

### 1. Static Analysis (즉시)

- **TypeScript:** `tsc --noEmit` (strict mode)
- **ESLint:** Expo 프리셋 + 커스텀 룰
- **Prettier:** 코드 포매팅 일관성
- **목표:** PR 머지 전 필수 통과

### 2. Unit Tests (우선)

- **프레임워크:** Jest + @testing-library/react-native
- **대상:**
  - `constants/QuizUtils.ts` — 퀴즈 생성, XP 계산
  - `store/useUserStore.ts` — 상태 변경 액션들
  - `constants/LessonData.ts` — 데이터 무결성
  - `constants/KatakanaData.ts` — 데이터 무결성
  - `constants/TravelStages.ts` — 단계 정합성
- **커버리지 목표:** 핵심 로직 80%+

### 3. Integration Tests (중기)

- **대상:**
  - 레슨 완료 → 레벨 업 → 다음 레슨 해금 플로우
  - 온보딩 완료 → 메인 화면 리다이렉트
  - 연습 모드 → 결과 → XP 적립
- **커버리지 목표:** 핵심 플로우 70%+

### 4. E2E Tests (후기)

- **프레임워크:** Maestro (크로스 플랫폼, 설정 간편)
- **대상:**
  - 온보딩 전체 플로우
  - 레슨 1개 완료 플로우
  - 연습 모드 1개 완료 플로우
- **커버리지 목표:** 핵심 사용자 시나리오 3개+

### 5. 회귀 테스트

- 모든 버그 수정에 대응하는 테스트 추가
- CI에서 전체 테스트 스위트 실행
- 실패 시 PR 머지 차단

## 우선순위

| 순위 | 대상                     | 이유                                |
| ---- | ------------------------ | ----------------------------------- |
| 1    | QuizUtils 유닛 테스트    | 가장 복잡한 로직, 엣지 케이스 다수  |
| 2    | useUserStore 유닛 테스트 | 전체 앱 상태 의존, 리팩토링 시 핵심 |
| 3    | 데이터 무결성 테스트     | 레슨/카타카나 데이터 정합성 보장    |
| 4    | ESLint + TypeScript CI   | 코드 품질 자동 검증                 |
| 5    | 온보딩 E2E               | 첫 사용자 경험 보호                 |

## 테스트 실행

```bash
npm test                    # 전체 테스트
npm test -- --watch         # 와치 모드
npm test -- --coverage      # 커버리지 리포트
npm run lint                # ESLint
npm run typecheck           # TypeScript
```
