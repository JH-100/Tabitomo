# ADR-001: Expo Router 파일 기반 라우팅 채택

## 상태

승인됨

## 맥락

React Native 앱의 네비게이션 솔루션 선택이 필요했음.
React Navigation (수동) vs Expo Router (파일 기반) 비교.

## 결정

Expo Router v6 (파일 기반 라우팅) 채택.

## 이유

- 파일 구조 = 라우트 구조로 직관적
- 웹/모바일 동일 라우팅 패턴
- Deep linking 자동 지원
- Expo SDK와 네이티브 통합

## 결과

- app/ 디렉토리 구조가 곧 라우트 맵
- 그룹 `(tabs)`, `(onboarding)` 으로 논리적 분리
- 동적 라우트 `[id].tsx` 활용
