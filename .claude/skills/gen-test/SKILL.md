---
name: gen-test
description: 지정한 파일에 대한 테스트 코드를 자동 생성합니다
---

# gen-test

지정한 소스 파일에 대한 Jest 테스트를 자동 생성합니다.

## 사용법

`/gen-test <파일경로>`

## 규칙

1. 대상 파일을 먼저 읽고 모든 export를 파악한다
2. 테스트 파일은 `__tests__/<원본파일명>.test.ts(x)` 에 생성한다
3. 각 export된 함수/컴포넌트에 대해 테스트를 작성한다
4. 엣지 케이스를 반드시 포함한다
5. 컴포넌트 테스트는 @testing-library/react-native 사용
6. 스토어 테스트는 act() 래핑
7. docs/testing-strategy.md 참고하여 우선순위 반영

## 테스트 패턴

- 순수 함수: input/output 검증
- Zustand 스토어: 액션 호출 → 상태 변경 검증
- React 컴포넌트: 렌더링 + 인터랙션 검증
- 상수 데이터: 구조/무결성 검증
