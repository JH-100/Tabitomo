---
name: simplify-code
description: 변경된 코드의 재사용성, 품질, 효율성을 검토하고 개선합니다
---

# simplify-code

변경된 코드를 리뷰하고 단순화/개선합니다.

## 사용법

`/simplify-code`

## 규칙

1. git diff로 변경 사항 확인
2. 다음 관점에서 검토:
   - 중복 코드 → 공통 유틸/컴포넌트로 추출
   - 복잡한 로직 → 커스텀 훅/헬퍼로 분리
   - 불필요한 코드 → 제거
   - 매직 넘버 → 상수화
3. 개선 사항 적용
4. 테스트가 있다면 실행하여 동작 확인

## 참고

- CLAUDE.md 코드 컨벤션 준수
- docs/refactoring-plan.md 방향 참고
