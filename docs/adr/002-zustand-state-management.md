# ADR-002: Zustand 상태 관리 채택

## 상태

승인됨

## 맥락

앱 전역 상태 관리 솔루션 필요. Redux, Context API, Zustand, Jotai 비교.

## 결정

Zustand 5 + AsyncStorage 퍼시스턴스 채택.

## 이유

- 보일러플레이트 최소 (Redux 대비 90% 감소)
- React Native + AsyncStorage 연동 간편
- TypeScript 친화적
- 번들 사이즈 작음 (~1KB)
- 선택적 퍼시스턴스 (partialize)

## 결과

- 단일 스토어 `useUserStore.ts`로 모든 상태 관리
- `isLoading` 제외 나머지 자동 퍼시스턴스
- 액션 메서드로 상태 변경 캡슐화
