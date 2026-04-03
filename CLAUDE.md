# Tabitomo (タビトモ / 旅友)

일본 여행자를 위한 일본어 회화 학습 앱. 여행 여정 컨셉의 게이미피케이션으로 동기부여.

## Tech Stack

- **Runtime:** Expo SDK 54 + React Native 0.81 + React 19
- **Language:** TypeScript (strict mode)
- **Routing:** Expo Router v6 (파일 기반)
- **State:** Zustand 5 + AsyncStorage (로컬 퍼시스턴스)
- **Animation:** React Native Reanimated v4
- **Backend:** Supabase (아직 미연동, placeholder 상태)
- **Graphics:** React Native SVG, Expo Linear Gradient
- **Platform:** iOS + Android + Web

## Project Structure

```
app/
  _layout.tsx          # 루트 레이아웃 (온보딩 가드)
  (onboarding)/        # 온보딩 플로우
    welcome.tsx        # 3페이지 캐러셀 소개
    passport.tsx       # 여권 생성 (이름/생년월일/성별)
  (tabs)/              # 메인 탭 네비게이션
    index.tsx          # 홈 대시보드
    lessons.tsx        # 레슨 목록
    practice.tsx       # 연습 모드 선택
    profile.tsx        # 프로필/통계
  lesson/[id].tsx      # 동적 레슨 상세
  practice/            # 연습 모드들
    quiz.tsx           # 4지선다 퀴즈
    input.tsx          # 로마지 입력
    matching.tsx       # 카드 매칭 게임
    handwriting.tsx    # 필기 연습
components/
  Avatar3D.tsx         # 3D 스타일 아바타 (View 레이어링)
  DrawingCanvas.tsx    # SVG 드로잉 캔버스
  GlassCard.tsx        # 글래스모피즘 카드
  JourneyMap.tsx       # 여행 진행도 지도
  ScreenContainer.tsx  # 화면 래퍼 (그라디언트 배경)
  scenes/
    PassportScene.tsx  # 여권 시각화 씬
constants/
  Colors.ts            # 컬러 팔레트 (다크 테마)
  KatakanaData.ts      # 카타카나 레슨 데이터
  LessonData.ts        # 히라가나 레슨 데이터
  QuizUtils.ts         # 퀴즈 생성 유틸
  TravelStages.ts      # 여행 진행 단계 (9레벨)
store/
  useUserStore.ts      # Zustand 글로벌 상태
lib/
  supabase.ts          # Supabase 클라이언트 (미연동)
```

## Build & Run

```bash
npm start          # Expo 개발 서버
npm run ios        # iOS 시뮬레이터
npm run android    # Android 에뮬레이터
npm run web        # 웹 브라우저
npm test           # 테스트 실행
npm run lint       # ESLint 실행
npm run typecheck  # TypeScript 타입 체크
```

## Code Conventions

- **컴포넌트:** PascalCase 함수 컴포넌트 (export default)
- **파일명:** 컴포넌트는 PascalCase.tsx, 유틸은 camelCase.ts
- **스타일:** StyleSheet.create 인라인 (파일 하단)
- **상태:** Zustand store (useUserStore) 중앙 관리
- **라우팅:** Expo Router 파일 기반, 그룹은 (groupName)
- **애니메이션:** Reanimated useSharedValue + useAnimatedStyle
- **색상:** Colors.ts 상수 참조 (하드코딩 금지)
- **커밋:** conventional commits (feat:, fix:, chore: 등)
- **언어:** 코드/변수명은 영어, UI 텍스트는 한국어+일본어

## Architecture Decisions

- 오프라인 우선: AsyncStorage 로컬 저장 → 추후 Supabase 동기화
- 선형 레슨 진행: 이전 레슨 완료 필수 → 다음 레슨 해금
- 레벨 시스템: 레슨 완료 기반 자동 계산 (Lv.0~2, 확장 예정)
- 다크 테마 전용: 딥스페이스 그라디언트 배경
- 크로스 플랫폼: Expo 단일 코드베이스로 iOS/Android/Web

## Known Issues

- Supabase 연동 미완성 (placeholder 자격증명)
- 에러 바운더리 없음
- 생년월일 입력 유효성 검증 없음
- 레벨 3+ 컨텐츠 미구현
- 테마 토글 없음 (다크 모드 고정)

## CI/CD & Git Hooks

- **Pre-commit:** lint-staged (ESLint --fix + Prettier on staged files)
- **Pre-push:** typecheck + tests must pass
- **GitHub Actions:** CI on push/PR to master (typecheck, lint, test with coverage)
- **Hook manager:** Husky v9

After significant changes, run `/update-docs` to keep README updated.

## Testing

- **Unit:** Jest + React Native Testing Library
- **E2E:** 추후 Detox 또는 Maestro 도입 예정
- **Lint:** ESLint (Expo 프리셋)
- **Type:** tsc --noEmit

## Dependencies (핵심)

| 패키지                         | 용도             |
| ------------------------------ | ---------------- |
| expo ~54.0.33                  | 앱 플랫폼        |
| react-native 0.81.5            | UI 프레임워크    |
| expo-router ~6.0.23            | 파일 기반 라우팅 |
| zustand ^5.0.12                | 상태 관리        |
| react-native-reanimated ~4.1.1 | 애니메이션       |
| @supabase/supabase-js ^2.100.1 | 백엔드 (미연동)  |
| react-native-svg ^15.12.1      | 벡터 그래픽      |
