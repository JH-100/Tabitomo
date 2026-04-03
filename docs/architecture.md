# Architecture

## 시스템 구조

```
┌─────────────────────────────────────────────┐
│                  Expo Router                 │
│  ┌──────────────┐  ┌────────────────────┐   │
│  │  Onboarding  │  │    Main Tabs       │   │
│  │  - Welcome   │  │  - Home            │   │
│  │  - Passport  │  │  - Lessons         │   │
│  └──────┬───────┘  │  - Practice        │   │
│         │          │  - Profile         │   │
│         │          └────────┬───────────┘   │
│         │                   │               │
│  ┌──────┴───────────────────┴────────────┐  │
│  │           useUserStore (Zustand)      │  │
│  │  - profile, level, xp, streak        │  │
│  │  - lessonsCompleted, practiceHistory  │  │
│  └──────────────────┬───────────────────┘   │
│                     │                       │
│  ┌──────────────────┴───────────────────┐   │
│  │         AsyncStorage (로컬)           │   │
│  └──────────────────────────────────────┘   │
│                     ↕ (추후)                 │
│  ┌──────────────────────────────────────┐   │
│  │         Supabase (클라우드)            │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## 라우팅 구조

| 경로                     | 화면        | 설명              |
| ------------------------ | ----------- | ----------------- |
| `/(onboarding)/welcome`  | 웰컴 캐러셀 | 앱 소개 3페이지   |
| `/(onboarding)/passport` | 여권 생성   | 프로필 입력       |
| `/(tabs)/`               | 홈 대시보드 | 진행도, 퀵 액션   |
| `/(tabs)/lessons`        | 레슨 목록   | 히라가나/카타카나 |
| `/(tabs)/practice`       | 연습 모드   | 4가지 모드 선택   |
| `/(tabs)/profile`        | 프로필      | 통계, 리셋        |
| `/lesson/[id]`           | 레슨 상세   | 플래시카드 퀴즈   |
| `/practice/quiz`         | 4지선다     | 방향 랜덤         |
| `/practice/input`        | 입력 퀴즈   | 로마지 타이핑     |
| `/practice/matching`     | 매칭 게임   | 카드 짝 맞추기    |
| `/practice/handwriting`  | 필기 연습   | SVG 드로잉        |

## 상태 관리

### Zustand Store (useUserStore)

```typescript
interface UserState {
  // 인증
  isLoading: boolean;
  hasCompletedOnboarding: boolean;

  // 프로필
  profile: UserProfile; // id, displayName, birthdate, gender

  // 진행도
  currentLevel: number; // 0~2 (자동 계산)
  xp: number;
  streak: number;
  lessonsCompleted: string[]; // 완료한 레슨 ID 배열

  // 기록
  practiceHistory: PracticeRecord[]; // 최근 100개
  flashcardResults: Record<string, { correct: number; total: number }>;
}
```

### 레벨 계산 로직

```
Lv.0 = 온보딩 완료
Lv.1 = 히라가나 전체 완료 (10레슨)
Lv.2 = 카타카나 전체 완료 (10레슨)
Lv.3+ = 미구현
```

## 컴포넌트 계층

### 공통 컴포넌트

| 컴포넌트        | 용도                       | Props                          |
| --------------- | -------------------------- | ------------------------------ |
| ScreenContainer | 화면 래퍼, 그라디언트 배경 | style, children                |
| GlassCard       | 글래스모피즘 카드          | depth(0-3), onPress, noPadding |
| Avatar3D        | 3D 아바타 렌더링           | size, showGlow, accessory      |
| JourneyMap      | 여행 진행 지도             | currentLevel                   |
| DrawingCanvas   | SVG 필기 캔버스            | width, height, referenceChar   |

### 디자인 시스템

- **테마:** 다크 전용 (딥스페이스 그라디언트)
- **색상:** Colors.ts 중앙 관리
- **Primary:** #FF6B6B (코랄)
- **Accents:** Mint, Blue, Purple, Amber
- **서피스:** 반투명 레이어 (opacity 기반)
- **타이포:** 시스템 폰트 (커스텀 폰트 미적용)

## 데이터 모델

### 레슨 데이터 (상수)

```typescript
interface HiraganaChar {
  char: string; // "あ"
  romaji: string; // "a"
  example: string; // "あめ"
  exampleRomaji: string; // "ame"
  meaning: string; // "비"
}

interface HiraganaLesson {
  id: string; // "hiragana-1"
  title: string; // "あ행"
  titleJa: string; // "あ行"
  description: string;
  characters: HiraganaChar[];
  xpReward: number; // 20~25
}
```

### 여행 단계 (상수)

9단계: 여권발급 → 항공권 → 짐싸기 → 공항 → 비행기 → 나리타 → 시부야 → 교토 → 오사카
