# Development Guide

## 환경 설정

### 필수 도구

- Node.js 18+
- npm 9+
- Expo CLI (`npx expo`)
- iOS: Xcode 15+ (macOS only)
- Android: Android Studio + SDK 34+

### 초기 설정

```bash
git clone https://github.com/JH-100/Tabitomo.git
cd Tabitomo
npm install
npx expo start
```

### 실행 명령

| 명령                | 설명                    |
| ------------------- | ----------------------- |
| `npm start`         | Expo 개발 서버 시작     |
| `npm run ios`       | iOS 시뮬레이터 실행     |
| `npm run android`   | Android 에뮬레이터 실행 |
| `npm run web`       | 웹 브라우저 실행        |
| `npm test`          | Jest 테스트 실행        |
| `npm run lint`      | ESLint 검사             |
| `npm run typecheck` | TypeScript 타입 검사    |

## 코드 컨벤션

### 파일 네이밍

- 컴포넌트: `PascalCase.tsx` (예: `GlassCard.tsx`)
- 유틸리티: `camelCase.ts` (예: `QuizUtils.ts`)
- 상수: `PascalCase.ts` (예: `Colors.ts`)
- 스토어: `use[Name]Store.ts` (예: `useUserStore.ts`)
- 라우트: `kebab-case.tsx` 또는 `[param].tsx`

### 컴포넌트 패턴

```typescript
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

interface Props {
  title: string;
  onPress?: () => void;
}

export default function MyComponent({ title, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { /* ... */ },
  title: { /* ... */ },
});
```

### 상태 관리 규칙

- 로컬 UI 상태: `useState`
- 앱 전역 상태: `useUserStore` (Zustand)
- 애니메이션 값: `useSharedValue` (Reanimated)
- 색상: `Colors.ts` 상수 참조 (직접 hex 사용 금지)

### 라우팅 규칙

- 파일 기반 라우팅 (Expo Router)
- 그룹: `(groupName)/` 디렉토리
- 동적 라우트: `[param].tsx`
- 레이아웃: `_layout.tsx`
- 가드: 루트 `_layout.tsx`에서 리다이렉트

## 빌드 & 배포

### 현재 상태

- Expo Go 개발 환경만 구성됨
- EAS Build 미설정
- CI/CD 미구성

### 배포 계획

1. EAS Build 설정 (eas.json)
2. GitHub Actions CI/CD
3. TestFlight (iOS) / Internal Testing (Android)
4. App Store / Play Store 배포

## 알려진 제약사항

- Metro bundler에서 `unstable_enablePackageExports` 비활성화 (zustand ESM 호환)
- `babel-plugin-transform-import-meta` 필요 (Supabase web 호환)
- React Native Reanimated 플러그인은 babel plugins 마지막에 위치해야 함
