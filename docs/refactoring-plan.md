# Refactoring Plan

## 현재 코드 분석 결과

### 리팩토링 포인트

| 우선순위 | 파일/영역                       | 문제                   | 방향                        |
| -------- | ------------------------------- | ---------------------- | --------------------------- |
| HIGH     | `lesson/[id].tsx` (461줄)       | 모놀리식, 로직+UI 혼재 | 커스텀 훅 분리              |
| HIGH     | `practice/matching.tsx` (405줄) | 상태 관리 복잡         | 커스텀 훅 + 컴포넌트 분리   |
| HIGH     | `practice/input.tsx` (400줄)    | 반복 패턴              | 공통 Practice 레이아웃 추출 |
| HIGH     | `practice/quiz.tsx` (381줄)     | 반복 패턴              | 공통 Practice 레이아웃 추출 |
| MED      | `useUserStore.ts`               | 레벨 계산 하드코딩     | 설정 기반으로 변경          |
| MED      | `Avatar3D.tsx` (370줄)          | 스타일 하드코딩        | 테마 시스템 연동            |
| MED      | 여러 화면의 스타일 중복         | DRY 위반               | 공유 스타일 모듈            |
| LOW      | `welcome.tsx` (297줄)           | 페이지 데이터 하드코딩 | 상수 분리                   |
| LOW      | `PassportScene.tsx` (289줄)     | 매직 넘버 다수         | 상수화                      |

## 리팩토링 원칙

1. **테스트 먼저:** 리팩토링 전 해당 영역 테스트 작성
2. **점진적 변경:** 한 번에 하나의 파일/모듈만 변경
3. **동작 보존:** 리팩토링은 기능 변경 없이 구조만 개선
4. **검증:** 각 단계마다 테스트 + 수동 확인

## 단계별 계획

### Phase 1: 공통 패턴 추출

1. Practice 화면 공통 레이아웃 (진행바, 결과화면, XP 표시)
2. 퀴즈 로직 커스텀 훅 (`usePracticeSession`)
3. 공유 애니메이션 프리셋

### Phase 2: 대형 파일 분할

1. `lesson/[id].tsx` → 훅(useLesson) + UI(LessonScreen) + 완료화면(LessonComplete)
2. `matching.tsx` → 훅(useMatchingGame) + MatchCard 컴포넌트 분리
3. `Avatar3D.tsx` → 파트별 서브 컴포넌트 (선택적)

### Phase 3: 상태 관리 개선

1. 레벨 계산을 설정 기반으로 변경 (TravelStages 활용)
2. XP 시스템 일관성 확보
3. 에러 바운더리 추가

### Phase 4: 인프라 개선

1. 환경 변수 설정 (Supabase 키 등)
2. Supabase 실제 연동
3. 에러 로깅/모니터링

## 호환성 전략

- **추천:** Feature branch 기반 점진적 머지
- 각 Phase를 별도 PR로 관리
- 기존 API/컴포넌트 시그니처 유지 → 한 번에 변경하지 않음
- 테스트 통과 확인 후 머지
