# Bloomer — 제품 요구사항 문서 (PRD)

> **버전** v1.0 | **작성일** 2026-04-20 | **작성자** 이유진
> **상태** 🟡 작성 중

---

## 목차

1. [배경 및 목적](#1-배경-및-목적)
2. [사용자 정의](#2-사용자-정의)
3. [문제 정의](#3-문제-정의)
4. [해결 방향](#4-해결-방향)
5. [핵심 사용자 시나리오](#5-핵심-사용자-시나리오)
6. [기능 요구사항](#6-기능-요구사항)
7. [비기능 요구사항](#7-비기능-요구사항)
8. [기술 선택 근거](#8-기술-선택-근거)
9. [기능 명세서](#9-기능-명세서)
10. [화면 목록 및 플로우](#10-화면-목록-및-플로우)
11. [데이터 모델](#11-데이터-모델)
12. [로그 이벤트 설계](#12-로그-이벤트-설계)
13. [엣지케이스 체크리스트](#13-엣지케이스-체크리스트)
14. [범위 외 (Out of Scope)](#14-범위-외-out-of-scope)
15. [마일스톤](#15-마일스톤)

---

## 1. 배경 및 목적

### 1.1 프로젝트 배경

Bloomer는 동네 꽃집을 탐색하고, 원하는 꽃을 직접 골라 꽃다발을 구성한 뒤 꽃집과 연결되는 흐름을 모바일 웹으로 구현한 토이 프로젝트다.

### 1.2 목적

- 프론트엔드 포트폴리오 제작
- 지도 기반 로컬 탐색 UX 구현 역량 증명
- 상태 관리(Zustand), 로그 설계, AI 연동 등 실무 기술 스택 적용
- Cursor, GitHub Copilot, Claude Code를 활용한 AI 기반 개발 자동화 워크플로우 학습

---

## 2. 사용자 정의

### 주 타겟

| 속성 | 내용 |
|------|------|
| 연령 | 20–35세 |
| 상황 | 생일·기념일·감사 등 꽃이 필요한 순간 |
| 행동 패턴 | 모바일로 주변 꽃집을 검색하지만 어떤 꽃을 살지 몰라 막막함 |
| 불편 | 꽃집 재고를 사전에 알 수 없어 가서 실망하거나 급하게 선택함 |

### 페르소나

> **김지수 (27세, 직장인)**
> 친구 생일에 꽃다발을 주고 싶다. 퇴근 후 동네 꽃집에 들를 예정인데, 어떤 꽃이 있는지 미리 알고 조합을 생각해두고 싶다. 가격대도 가늠하고 싶고, 꽃집에 메모를 전달할 수 있으면 더 좋겠다.

---

## 3. 문제 정의

```
꽃을 사고 싶다
    │
    ├── 어떤 꽃집이 근처에 있는지 모른다
    ├── 꽃집에 어떤 꽃이 있는지 방문 전에 알 수 없다
    ├── 꽃에 대한 지식이 없어 선택이 어렵다
    └── 조합을 미리 구성해두고 꽃집에 전달할 수 없다
```

---

## 4. 해결 방향

| 문제 | 해결 |
|------|------|
| 근처 꽃집 탐색 어려움 | Kakao Maps 기반 주변 꽃집 지도 표시 |
| 재고 사전 확인 불가 | 꽃집별 보유 꽃 목록 제공 |
| 꽃 선택 어려움 | 꽃말·색상·가격 정보 제공 + AI 추천 |
| 구성 전달 불가 | 꽃다발 빌더 → 요약 → 꽃집 연결 |

---

## 5. 핵심 사용자 시나리오

### Happy Path

```
앱 진입 (지도 로드)
    │
    ▼
내 위치 주변 꽃집 마커 확인
    │
    ▼
꽃집 선택 → 보유 꽃 목록 확인
    │
    ▼
원하는 꽃 선택 → 꽃다발 빌더에 추가
    │
    ▼
수량·포장 옵션 결정 → 메모 입력
    │
    ▼
꽃다발 요약 확인 (예상 가격 포함)
    │
    ▼
전화 또는 카카오맵 길찾기로 꽃집 연결
```

---

## 6. 기능 요구사항

### 우선순위 정의

| 레벨 | 의미 |
|------|------|
| P0 | 없으면 서비스 불가 (Must Have) |
| P1 | 핵심 UX (Should Have) |
| P2 | 완성도 향상 (Nice to Have) |

### 기능 목록

| ID | 기능 | 우선순위 | 비고 |
|----|------|----------|------|
| F-01 | 현재 위치 기반 지도 표시 | P0 | 권한 거부 시 서울 중심 폴백 |
| F-02 | 주변 꽃집 마커 표시 | P0 | |
| F-03 | 꽃집 리스트 (하단 시트) | P0 | |
| F-04 | 꽃집 상세 (보유 꽃 목록) | P0 | |
| F-05 | 꽃 상세 모달 (꽃말·가격·색상) | P1 | |
| F-06 | 꽃다발 빌더 (추가/제거/수량) | P0 | 핵심 UX |
| F-07 | 포장 옵션 선택 | P1 | |
| F-08 | 꽃다발 요약 (예상 가격·메모) | P1 | |
| F-09 | 꽃집 전화 연결 (tel: 딥링크) | P0 | |
| F-10 | 카카오맵 길찾기 연결 | P1 | |
| F-11 | 꽃다발 저장 (LocalStorage) | P2 | 시간 여유 시 구현 |
| F-12 | 저장된 꽃다발 히스토리 | 제외 | 1주 범위 초과 |
| F-13 | AI 꽃 조합 추천 (Claude) | 제외 | 1주 범위 초과 |
| F-14 | 꽃집 검색 (키워드) | 제외 | 1주 범위 초과 |

---

## 7. 비기능 요구사항

| 항목 | 요구사항 |
|------|----------|
| 플랫폼 | 모바일 웹 (웹뷰 대응), iOS Safari / Android Chrome 우선 |
| 반응형 | 360px–430px 기준, 데스크탑은 최소 대응 |
| 성능 | 초기 로드 LCP 3초 이내 (Vercel CDN 기준) |
| 접근성 | 주요 인터랙션 요소 aria-label 제공 |
| 오프라인 | 네트워크 오프라인 시 에러 메시지 표시 |
| 보안 | Claude API 키 서버사이드 처리 (환경 변수) |

---

## 8. 기술 선택 근거

> 각 기술을 선택할 때 어떤 대안을 검토했고, 왜 해당 기술을 골랐는지 기록한다.
> 면접에서 "왜 이걸 썼나요?"라는 질문에 답할 수 있어야 한다.

---

### 지도 — Kakao Maps JS API

**선택 이유**
한국 동네 기반 서비스에서 가장 중요한 것은 주소·POI 데이터의 정확도다. Kakao Maps는 국내 도로명 주소, 건물명, 골목 단위 데이터가 가장 풍부하고, 한국어 검색 품질이 압도적으로 높다. 무료 티어로 충분하고, 별도 결제 수단 등록 없이 API 키만으로 시작할 수 있어 프로토타입에 적합하다.

**검토한 대안**

| 대안 | 탈락 이유 |
|------|-----------|
| Google Maps | 유료 (월 $200 무료 크레딧 초과 시 과금), 한국 골목 데이터 누락 많음, 결제 수단 등록 필수 |
| Naver Maps | 기업용 API 심사 절차가 있어 개인 프로젝트에서 발급 지연 가능성, 문서가 Kakao 대비 부족 |
| Mapbox | 글로벌 서비스에 적합하나 한국 로컬 POI 데이터가 약함, 커스터마이징 비용 높음 |

---

### 상태 관리 — Zustand (2개 스토어)

**선택 이유**
이 앱의 상태는 크게 두 가지로 나뉜다. **지도 상태**(선택된 꽃집, 뷰포트)는 페이지를 벗어나면 초기화되어도 되는 휘발성 상태고, **빌더 상태**(선택한 꽃, 수량, 포장)는 사용자가 앱을 잠깐 닫았다 돌아와도 유지되어야 하는 영속 상태다. 두 관심사를 하나의 스토어에 넣으면 LocalStorage 직렬화 범위를 제어하기 어렵고, 어느 쪽 변경이 리렌더링을 유발하는지 추적하기 어려워진다. Zustand는 스토어를 여러 개로 분리하는 비용이 낮고, `persist` 미들웨어로 특정 스토어만 LocalStorage에 직렬화하는 것이 간단하다.

**검토한 대안**

| 대안 | 탈락 이유 |
|------|-----------|
| Redux Toolkit | 보일러플레이트(action, reducer, selector 분리)가 이 규모의 앱에는 과함. 학습 비용 대비 얻는 이점이 적음 |
| Recoil | Facebook이 개발을 사실상 중단한 상태 (2023년 이후 메인테넌스 모드), 장기 의존성 리스크 |
| Jotai | atom 단위 분리는 좋지만 스토어 간 관계가 명시적이지 않아 이 앱처럼 두 도메인을 명확히 분리할 때 오히려 경계가 흐려짐 |
| Context API | 렌더링 최적화를 직접 해야 함 (useMemo, useCallback 수동 관리). 지도처럼 잦은 상태 변경이 있는 경우 성능 이슈 발생 가능 |

---

### 프레임워크 — React + TypeScript

**선택 이유**
컴포넌트 생태계가 가장 크고, Kakao Maps 서드파티 래퍼 라이브러리(`react-kakao-maps-sdk`)가 존재해 지도 연동 비용이 낮다. TypeScript는 꽃·꽃집 데이터 모델처럼 필드가 많은 객체를 다룰 때 자동완성과 타입 오류 조기 발견이 필수적이다.

**검토한 대안**

| 대안 | 탈락 이유 |
|------|-----------|
| Next.js | SSR/SSG가 필요 없는 클라이언트 전용 SPA. 불필요한 서버 복잡도가 추가됨 |
| Vue 3 | 기술 스택 친숙도 문제. React 생태계 경험을 쌓는 것이 현재 목표에 부합 |
| Svelte | 번들 크기·성능은 우수하나 Kakao Maps 연동 래퍼가 없어 바닐라 SDK를 직접 다뤄야 함 |

---

### 빌드 도구 — Vite

**선택 이유**
HMR(Hot Module Replacement) 속도가 Webpack 기반 CRA 대비 10배 이상 빠르다. 지도·꽃 이미지처럼 무거운 에셋이 있는 프로젝트에서 개발 중 저장할 때마다 기다리는 시간이 생산성에 직결된다. 설정 파일도 단순해 초기 세팅 부담이 없다.

**검토한 대안**

| 대안 | 탈락 이유 |
|------|-----------|
| Create React App | 2023년 공식 deprecated. 유지보수 중단, Webpack 기반으로 느린 HMR |
| webpack 직접 설정 | 설정 비용이 높고, 이 프로젝트 규모에서 얻는 이점이 없음 |

---

### 스타일 — Tailwind CSS

**선택 이유**
모바일 웹에서 반응형 레이아웃을 빠르게 구현할 때 유틸리티 클래스 방식이 가장 효율적이다. Bottom Sheet, 카드 그리드, 고정 하단 버튼 같은 패턴을 클래스 조합만으로 처리할 수 있어 별도 스타일 파일을 오가는 컨텍스트 스위칭이 없다.

**검토한 대안**

| 대안 | 탈락 이유 |
|------|-----------|
| styled-components | CSS-in-JS 런타임 오버헤드, 동적 스타일이 많지 않은 이 앱에서는 오버엔지니어링 |
| CSS Modules | 클래스명 관리 비용이 높고, 모바일 반응형 유틸리티를 직접 구현해야 함 |
| emotion | styled-components와 유사한 이유로 탈락 |

---

### AI 추천 — Claude API (Haiku)

**선택 이유**
꽃 조합 추천은 긴 응답이 필요 없다 (2–3가지 꽃 + 이유 한 줄). Haiku는 이런 짧고 구조화된 출력에서 Opus/Sonnet 대비 응답 속도가 빠르고 비용이 약 20배 저렴하다. 또한 추천 결과를 해당 꽃집 보유 목록 기준으로 후처리(필터링)하기 때문에 모델 성능보다 응답 파싱 안정성이 더 중요한데, Haiku도 간단한 JSON 출력에서 충분히 안정적이다.

**검토한 대안**

| 대안 | 탈락 이유 |
|------|-----------|
| GPT-4o mini | 성능은 유사하나 이미 Claude API를 프로젝트에서 쓰고 있어 SDK·인증 관리를 이중으로 할 이유가 없음 |
| Gemini Flash | 한국어 꽃말·감성 표현 품질 검증이 추가로 필요. 리스크 대비 이득이 불명확 |
| 직접 규칙 구현 | 키워드 → 꽃 매핑 테이블을 수동으로 관리해야 함. 상황 조합이 늘어날수록 유지보수 비용 증가 |

---

## 9. 기능 명세서

---

### F-01 · F-02 — 지도 및 꽃집 마커

**설명**
앱 진입 시 Kakao Maps를 풀스크린으로 표시하고, 현재 위치 주변의 꽃집을 마커로 나타낸다.

**동작 조건**

- 위치 권한 허용 시 → 현재 GPS 좌표를 지도 중심으로 설정
- 위치 권한 거부 시 → 서울 시청 좌표(37.5665° N, 126.9780° E)를 기본값으로 사용
- 마커 클릭 시 → 해당 꽃집의 Bottom Sheet 표시 + `marker_click` 이벤트 기록

**UI 명세**

| 요소 | 설명 |
|------|------|
| 지도 영역 | 화면 전체 (100dvh) |
| 꽃집 마커 | 커스텀 핀 아이콘 (꽃집명 말풍선 포함) |
| 내 위치 버튼 | 우하단 고정, 클릭 시 현재 위치로 이동 |
| 로딩 상태 | 지도 로드 전 스켈레톤 표시 |

**예외 처리**

- 주변 꽃집 0개: "주변에 등록된 꽃집이 없어요" 빈 상태 UI
- 지도 API 로드 실패: "지도를 불러올 수 없어요. 다시 시도해주세요" + 재시도 버튼

---

### F-03 — 꽃집 리스트 (하단 Bottom Sheet)

**설명**
지도 하단에 뷰포트 내 꽃집 목록을 스크롤 가능한 Bottom Sheet로 표시한다.

**동작 조건**

- 지도 뷰포트가 변경될 때마다 리스트 갱신
- 리스트 아이템 클릭 시 → 꽃집 상세 화면으로 이동 + `list_item_click` 이벤트 기록
- Bottom Sheet는 핸들 드래그로 높이 조절 (collapse / half / full)

**카드 표시 정보**

| 정보 | 필수 여부 |
|------|-----------|
| 꽃집명 | 필수 |
| 대표 꽃 태그 (최대 3개) | 필수 |
| 거리 (m/km) | 필수 |
| 영업 상태 (영업중 / 마감) | 필수 |
| 대표 이미지 | 선택, 없을 시 placeholder |

---

### F-04 — 꽃집 상세

**설명**
선택한 꽃집의 상세 정보와 보유 꽃 목록을 표시한다.

**동작 조건**

- 진입 시 `shop_detail_view` 이벤트 기록
- 꽃 카드 클릭 시 → 꽃 상세 모달 열기 + `flower_card_click` 이벤트 기록
- '꽃다발 만들기' CTA 클릭 시 → 꽃다발 빌더로 이동 + `builder_cta_click` 이벤트 기록

**표시 정보**

| 섹션 | 내용 |
|------|------|
| 헤더 | 꽃집명, 주소, 전화번호, 영업시간 |
| 꽃 목록 | 보유 꽃 카드 그리드 (2열) |
| CTA | '꽃다발 만들기' 고정 하단 버튼 |

---

### F-05 — 꽃 상세 모달

**설명**
꽃의 상세 정보를 모달로 표시하고, 빌더에 추가할 수 있다.

**표시 정보**

| 항목 | 내용 |
|------|------|
| 꽃 이름 (한/영) | 예: 장미 / Rose |
| 색상 | 컬러 스와치 + 이름 |
| 꽃말 | 텍스트 |
| 가격대 | 예: 2,000–4,000원/송이 |
| 제철 여부 | 현재 시즌 뱃지 표시 |

**액션**

- '빌더에 추가' 버튼 클릭 → `flower_added` 이벤트 기록 후 모달 닫기
- 이미 추가된 꽃이면 수량 조절 UI로 전환

---

### F-06 — 꽃다발 빌더

**설명**
사용자가 원하는 꽃을 선택·조합하여 꽃다발을 구성하는 핵심 화면.

**구성 요소**

| 영역 | 설명 |
|------|------|
| 꽃 팔레트 | 해당 꽃집 보유 꽃 전체 목록, 탭/필터로 정렬 |
| 꽃다발 미리보기 | 선택한 꽃·수량을 카드 형태로 표시 |
| 수량 조절 | − / + 버튼, 최소 1 / 최대 20 |
| 빈 상태 | "꽃을 추가해보세요" 안내 |

**제약 조건**

- 총 꽃 종류 최대 10가지 (`MAX_FLOWER_COUNT = 10`)
- 꽃 0개 상태에서 '요약 보기' 버튼 비활성화

**이벤트**

| 액션 | 이벤트 |
|------|--------|
| 꽃 추가 | `flower_added` |
| 꽃 제거 | `flower_removed` |
| 수량 변경 | `qty_changed` |
| 포장 옵션 선택 | `wrap_option_selected` |

---

### F-07 — 포장 옵션 선택

**설명**
꽃다발 포장 스타일을 선택한다.

**옵션 목록**

| 옵션 | 설명 | 추가 비용 |
|------|------|-----------|
| 기본 포장 | 크라프트지 | +0원 |
| 리본 포장 | 리본 추가 | +2,000원 |
| 고급 포장 | 플라워박스 | +5,000원 |

---

### F-08 — 꽃다발 요약

**설명**
최종 구성된 꽃다발 내용과 예상 가격, 메모를 확인하는 화면.

**표시 정보**

| 항목 | 내용 |
|------|------|
| 꽃 목록 | 꽃명, 수량, 단가, 소계 |
| 포장 옵션 | 선택된 옵션 + 비용 |
| 예상 합계 | 꽃 비용 합계 + 포장 비용 |
| 메모 입력 | 꽃집에 전달할 요청사항 (최대 100자) |
| 대상 꽃집 | 꽃집명 + 전화번호 |

**제약 조건**

- 꽃 0개 상태에서 이 화면으로 진입 불가 (라우터 레벨에서 차단)
- 예상 가격은 가격대 하한 기준으로 계산 (실제 가격과 다를 수 있음 안내)

---

### F-09 · F-10 — 꽃집 연결

**설명**
전화 또는 길찾기를 통해 꽃집과 실제 연결한다.

| 액션 | 구현 방식 | 이벤트 |
|------|-----------|--------|
| 전화 연결 | `tel:` 딥링크 | `call_click` |
| 길찾기 | 카카오맵 길찾기 URL 스킴 | `map_click` |

---

### F-11 · F-12 — 꽃다발 저장 및 히스토리

**설명**
완성한 꽃다발 구성을 LocalStorage에 저장하고, 히스토리로 다시 볼 수 있다.

**저장 데이터**

```typescript
interface SavedBouquet {
  id: string;           // nanoid
  createdAt: string;    // ISO 8601
  shopId: string;
  shopName: string;
  flowers: FlowerItem[];
  wrapOption: WrapOption;
  memo: string;
  estimatedPrice: number;
}
```

**제약 조건**

- 최대 저장 20개. 초과 시 가장 오래된 항목 자동 삭제
- 저장 시 `save_bouquet` 이벤트 기록

---

### F-13 — AI 꽃 조합 추천

**설명**
사용자가 입력한 상황·분위기 키워드를 바탕으로 Claude API가 꽃 조합을 추천한다.

**입력**

- 텍스트 입력: "생일 / 사랑 / 감사 / 위로" 등 감정·상황 키워드
- 예산 슬라이더 (선택)

**출력**

- 추천 꽃 2–3가지 + 추천 이유 한 줄
- 추천 결과를 빌더에 바로 적용하는 '적용하기' 버튼

**예외 처리**

- API 타임아웃(5초) 또는 오류 → "추천을 불러오지 못했어요" + 재시도 버튼
- 응답 검증: 추천된 꽃이 해당 꽃집 보유 목록에 없으면 필터링

**모델**

`claude-haiku-4-5` (저비용, 짧은 추천 응답에 최적)

---

## 10. 화면 목록 및 플로우

### 화면 목록

| ID | 화면명 | 경로 | 주요 컴포넌트 |
|----|--------|------|---------------|
| S-01 | 홈 — 지도 + 꽃집 목록 | `/` | `KakaoMap`, `ShopListSheet` |
| S-02 | 꽃집 상세 | `/shop/:id` | `ShopDetail`, `FlowerGrid` |
| S-03 | 꽃 상세 모달 | (S-02 위 모달) | `FlowerDetailModal` |
| S-04 | 꽃다발 빌더 | `/shop/:id/builder` | `FlowerPalette`, `BouquetPreview` |
| S-05 | 꽃다발 요약 | `/shop/:id/summary` | `BouquetSummary`, `MemoInput` |
| S-06 | 꽃집 연결 | `/shop/:id/connect` | `ShopConnectCard` |
| S-07 | 저장된 꽃다발 | `/saved` | `SavedBouquetList` |

### 화면 전환 플로우

```
S-01 홈
 ├─ 마커 클릭 ──────────────────┐
 └─ 리스트 아이템 클릭 ──────────▼
                            S-02 꽃집 상세
                             ├─ 꽃 카드 클릭 → S-03 꽃 상세 모달 (오버레이)
                             └─ '꽃다발 만들기' 클릭
                                        │
                                        ▼
                                   S-04 꽃다발 빌더
                                        │
                                   '요약 보기' 클릭
                                        │
                                        ▼
                                   S-05 꽃다발 요약
                                        │
                                   '꽃집 연결' 클릭
                                        │
                                        ▼
                                   S-06 꽃집 연결
                                    ├─ 전화 클릭 → tel: 딥링크 (OS 처리)
                                    └─ 길찾기 클릭 → 카카오맵 앱/웹
```

---

## 11. 데이터 모델

### Flower

```typescript
interface Flower {
  id: string;
  name: string;           // 한국어
  nameEn: string;         // 영어
  color: string[];        // 색상 코드 배열
  colorName: string[];    // 색상명 배열
  flowerMeaning: string;  // 꽃말
  priceMin: number;       // 최저 단가 (원/송이)
  priceMax: number;       // 최고 단가 (원/송이)
  season: Season[];       // 제철 계절
  imageUrl: string;
}

type Season = 'spring' | 'summer' | 'autumn' | 'winter';
```

### Shop

```typescript
interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  businessHours: BusinessHours;
  flowerIds: string[];    // 보유 꽃 ID 목록
  imageUrl?: string;
  tags: string[];         // 대표 꽃 태그
}

interface BusinessHours {
  open: string;           // "09:00"
  close: string;          // "20:00"
  closedDays: number[];   // 0=일, 6=토
}
```

### Builder State (Zustand)

```typescript
interface BuilderStore {
  flowers: FlowerItem[];
  wrapOption: WrapOption;
  targetShopId: string | null;
  memo: string;

  addFlower: (flower: Flower) => void;
  removeFlower: (flowerId: string) => void;
  updateQuantity: (flowerId: string, qty: number) => void;
  setWrapOption: (option: WrapOption) => void;
  setMemo: (memo: string) => void;
  reset: () => void;
}

interface FlowerItem {
  flowerId: string;
  name: string;
  quantity: number;
  color: string;
  unitPrice: number;
}

type WrapOption = 'basic' | 'ribbon' | 'premium';
```

---

## 12. 로그 이벤트 설계

> 로그는 `useAnalytics` 훅으로만 호출. 컴포넌트에 직접 삽입 금지.

### 이벤트 정의

| 단계 | 이벤트명 | 트리거 | 주요 파라미터 |
|------|---------|--------|---------------|
| 탐색 | `map_open` | 앱 첫 진입 | `timestamp` |
| 탐색 | `marker_click` | 마커 클릭 | `shop_id`, `shop_name` |
| 탐색 | `list_item_click` | 리스트 클릭 | `shop_id`, `position` |
| 탐색 | `search_keyword` | 검색어 입력 | `keyword` |
| 발견 | `shop_detail_view` | 꽃집 상세 진입 | `shop_id` |
| 발견 | `flower_card_click` | 꽃 카드 클릭 | `flower_id`, `flower_name` |
| 발견 | `builder_cta_click` | CTA 버튼 클릭 | `shop_id` |
| 빌더 | `flower_added` | 꽃 추가 | `flower_id`, `quantity` |
| 빌더 | `flower_removed` | 꽃 제거 | `flower_id` |
| 빌더 | `qty_changed` | 수량 변경 | `flower_id`, `old_qty`, `new_qty` |
| 빌더 | `wrap_option_selected` | 포장 선택 | `option` |
| 연결 | `summary_view` | 요약 진입 | `shop_id`, `flower_count`, `estimated_price` |
| 연결 | `call_click` | 전화 클릭 | `shop_id` |
| 연결 | `map_click` | 길찾기 클릭 | `shop_id` |
| 연결 | `save_bouquet` | 저장 | `shop_id`, `flower_count` |

### 이벤트 타입 정의

```typescript
type AnalyticsEvent =
  | { name: 'map_open' }
  | { name: 'marker_click'; shop_id: string; shop_name: string }
  | { name: 'list_item_click'; shop_id: string; position: number }
  | { name: 'search_keyword'; keyword: string }
  | { name: 'shop_detail_view'; shop_id: string }
  | { name: 'flower_card_click'; flower_id: string; flower_name: string }
  | { name: 'builder_cta_click'; shop_id: string }
  | { name: 'flower_added'; flower_id: string; quantity: number }
  | { name: 'flower_removed'; flower_id: string }
  | { name: 'qty_changed'; flower_id: string; old_qty: number; new_qty: number }
  | { name: 'wrap_option_selected'; option: WrapOption }
  | { name: 'summary_view'; shop_id: string; flower_count: number; estimated_price: number }
  | { name: 'call_click'; shop_id: string }
  | { name: 'map_click'; shop_id: string }
  | { name: 'save_bouquet'; shop_id: string; flower_count: number };
```

---

## 13. 엣지케이스 체크리스트

| 케이스 | 처리 방식 | 상태 |
|--------|-----------|------|
| 위치 권한 거부 | 서울 시청 좌표로 폴백 | ⬜ |
| 주변 꽃집 0개 | "주변에 꽃집이 없어요" 빈 상태 UI | ⬜ |
| 네트워크 오프라인 | 에러 배너 + 재시도 버튼 | ⬜ |
| 꽃 0개에서 요약 진입 | 라우터 레벨 가드로 빌더로 리다이렉트 | ⬜ |
| Claude API 타임아웃 | 5초 초과 시 에러 메시지 + 재시도 | ⬜ |
| iOS Safari 100vh 버그 | `100dvh` 단위 사용 | ⬜ |
| 이미지 로딩 실패 | 회색 placeholder 표시 | ⬜ |
| LocalStorage 용량 초과 | 가장 오래된 저장 항목 삭제 후 재시도 | ⬜ |
| 꽃집 전화번호 없음 | 전화 버튼 비활성화 + 안내 텍스트 | ⬜ |

---

## 14. 범위 외 (Out of Scope)

- 실제 결제 기능
- 꽃집 사장 관리자 페이지 (재고 직접 등록)
- 회원가입 / 로그인
- 리뷰·평점 시스템
- 실시간 재고 연동
- 푸시 알림

---

## 15. 마일스톤

| 단계 | 내용 | 목표 일정 |
|------|------|-----------|
| D1 | 프로젝트 세팅, Mock 데이터, 타입 정의 | Day 1 |
| D2 | S-01 홈 — 지도 + 꽃집 마커 + 리스트 | Day 2 |
| D3 | S-02 꽃집 상세 + S-03 꽃 상세 모달 | Day 3 |
| D4 | S-04 꽃다발 빌더 (핵심 UX) | Day 4 |
| D5 | S-05 요약 + S-06 꽃집 연결 + 로그 연동 | Day 5 |
| D6 | 엣지케이스 처리, 반응형 점검, F-11 저장 (시간 여유 시) | Day 6 |
| D7 | QA, 배포 (Vercel), 포트폴리오 정리 | Day 7 |

---

> 이 문서는 개발 진행에 따라 지속 업데이트됩니다.
> 변경 이력은 git commit 메시지로 관리합니다.
