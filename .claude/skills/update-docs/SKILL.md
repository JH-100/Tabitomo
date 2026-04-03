---
name: update-docs
description: 코드 변경에 따라 관련 문서를 업데이트합니다
---

# update-docs

코드 변경 후 관련 문서를 자동으로 업데이트합니다.

## 사용법

`/update-docs`

## 규칙

1. git diff로 변경된 파일 목록 확인
2. 변경 내용에 따라 업데이트할 문서 판단:
   - 새 컴포넌트/라우트 → docs/architecture.md, CLAUDE.md
   - 새 기능 → docs/features.md
   - 의존성 변경 → CLAUDE.md, docs/development-guide.md
   - 테스트 변경 → docs/testing-strategy.md
   - 아키텍처 결정 → docs/adr/ 새 ADR 생성
3. 문서 내용이 현재 코드와 일치하도록 수정
4. README.md도 필요 시 업데이트

## 참고

- OpenSpec 형식 유지 (마크다운 테이블, 코드 블록)
- docs/README.md 인덱스 업데이트
