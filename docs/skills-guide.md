# Skills Guide

Tabitomo 프로젝트에서 사용할 수 있는 Claude Code 스킬 목록입니다.

## 스킬 목록

| 스킬          | 설명                                                 | 사용법                         |
| ------------- | ---------------------------------------------------- | ------------------------------ |
| gen-test      | 지정한 파일에 대한 테스트 코드를 자동 생성           | `/gen-test <파일경로>`         |
| manage-issues | GitHub 이슈를 생성, 업데이트, 닫기                   | `/manage-issues <명령> <인자>` |
| review-code   | 코드를 리뷰하고 개선점을 제안                        | `/review-code [파일경로]`      |
| update-docs   | 코드 변경에 따라 관련 문서를 업데이트                | `/update-docs`                 |
| simplify-code | 변경된 코드의 재사용성, 품질, 효율성을 검토하고 개선 | `/simplify-code`               |

---

## gen-test

지정한 소스 파일에 대한 Jest 테스트를 자동 생성합니다.

### 사용 예시

```
/gen-test store/useUserStore.ts
/gen-test constants/KatakanaData.ts
/gen-test components/DrawingCanvas.tsx
```

### 동작

- 대상 파일의 모든 export를 파악
- `__tests__/<원본파일명>.test.ts(x)` 에 테스트 파일 생성
- 순수 함수, Zustand 스토어, React 컴포넌트, 상수 데이터 각각에 맞는 테스트 패턴 적용
- 엣지 케이스 포함

---

## manage-issues

GitHub Issues를 gh CLI로 관리합니다.

### 사용 예시

```
/manage-issues create 카타카나 드로잉 캔버스 구현
/manage-issues update 5 드로잉 인식 로직 완료
/manage-issues close 5
```

### 동작

- **create**: 배경, 작업 개요, 인수조건, 의존 관계를 포함한 이슈 생성
- **update**: 이슈에 진행 상황 코멘트 추가
- **close**: 인수조건을 하나씩 확인 후 모두 충족 시에만 닫기

---

## review-code

코드 리뷰를 수행하고 심각도별로 분류된 개선점을 제안합니다.

### 사용 예시

```
/review-code app/(tabs)/lessons.tsx
/review-code components/
/review-code
```

### 동작

- 보안, 성능, 코드 품질, 에러 처리, 접근성, 타입 안전 관점에서 검토
- CRITICAL / HIGH / MEDIUM / LOW 심각도로 분류하여 결과 출력
- docs/architecture.md 및 CLAUDE.md 컨벤션 준수 여부 확인

---

## update-docs

코드 변경 후 관련 문서를 자동으로 업데이트합니다.

### 사용 예시

```
/update-docs
```

### 동작

- git diff로 변경된 파일 목록 확인
- 변경 유형에 따라 적절한 문서(architecture.md, features.md, CLAUDE.md 등) 업데이트
- 필요 시 새 ADR 생성
- docs/README.md 인덱스 업데이트

---

## simplify-code

변경된 코드를 리뷰하고 단순화 및 개선합니다.

### 사용 예시

```
/simplify-code
```

### 동작

- git diff로 변경 사항 확인
- 중복 코드 추출, 복잡한 로직 분리, 불필요한 코드 제거, 매직 넘버 상수화
- 개선 사항 적용 후 테스트 실행으로 동작 확인
