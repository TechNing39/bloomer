# CLAUDE.md — Bloomer 프로젝트 컨텍스트

Claude Code가 이 파일을 읽고 프로젝트 전체 맥락을 파악합니다.
코드 작성, 리뷰, 데브로그 작성 시 항상 이 컨텍스트를 기반으로 동작해주세요.

---

## 프로젝트 한 줄 정의

내 동네 꽃집들이 보유한 꽃을 확인하고, 원하는 꽃을 직접 골라 꽃다발을 구성한 뒤
해당 꽃집에 연결해주는 모바일 웹(웹뷰) 서비스.

## 만드는 이유

당근 S&D(Search & Discovery) 팀 프론트엔드 인턴 포트폴리오용 토이 프로젝트.
팀 미션인 **탐색 → 발견 → 관심 → 방문** 흐름을 직접 구현하는 것이 목표.

---

## 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | React + TypeScript | 당근 기술 스택과 일치 |
| 빌드 | Vite | 빠른 HMR, 가벼운 설정 |
| 스타일 | Tailwind CSS | 모바일 대응 빠른 UI 구현 |
| 상태 관리 | Zustand | 지도 ↔ UI 상태 동기화 설계, 가볍고 직관적 |
| 지도 | Kakao Maps JS API | 한국 동네 데이터 최적, 무료 |
| AI 추천 | Claude API (claude-haiku) | 장소 추천 프롬프트, 저비용 |
| 배포 | Vercel | 빠른 배포, 라이브 링크 확보 |

---

## 폴더 구조

```
src/
├── components/       # UI 컴포넌트
│   ├── map/          # 지도 관련 (KakaoMap, Marker, etc.)
│   ├── shop/         # 꽃집 관련 (ShopCard, ShopDetail, etc.)
│   ├── builder/      # 꽃다발 빌더 관련 (FlowerPalette, BouquetPreview, etc.)
│   └── common/       # 공통 컴포넌트 (BottomSheet, Modal, Button, etc.)
├── hooks/            # 커스텀 훅
│   ├── useKakaoMap.ts
│   ├── useGeolocation.ts
│   └── useAnalytics.ts
├── store/            # Zustand 스토어
│   ├── mapStore.ts   # 지도 상태 (선택된 꽃집, 뷰포트)
│   └── builderStore.ts # 빌더 상태 (선택한 꽃, 수량, 포장) — LocalStorage persist
├── types/            # TypeScript 타입 정의
│   ├── flower.ts
│   └── shop.ts
├── data/             # Mock 데이터
│   ├── flowers.json  # 꽃 목록 (15종)
│   └── shops.json    # 꽃집 목록 (mock)
├── utils/            # 유틸 함수
│   └── analytics.ts  # 로그 이벤트 정의 및 전송
└── api/              # API 호출
    └── claude.ts     # Claude API 장소 추천 호출
```

---

## 화면 목록 (7개)

| ID | 화면명 | 설명 |
|----|--------|------|
| S-01 | 홈 — 지도 + 꽃집 목록 | Kakao Maps 풀스크린 + 하단 꽃집 리스트 |
| S-02 | 꽃집 상세 | Bottom Sheet, 보유 꽃 카드 그리드 |
| S-03 | 꽃 상세 모달 | 꽃 이름·색상·꽃말·가격대, 빌더에 추가 |
| S-04 | 꽃다발 빌더 | 꽃 선택 팔레트 + 현재 구성 미리보기 ← 핵심 UX |
| S-05 | 꽃다발 요약 | 선택 꽃 목록 · 예상 가격 · 메모 입력 |
| S-06 | 꽃집 연결 | 전화(tel: 딥링크) · 카카오맵 길찾기 |
| S-07 | 저장된 꽃다발 | LocalStorage 기반 히스토리 |

---

## 상태 관리 설계 원칙

```
mapStore
├── selectedShopId       # 선택된 꽃집 ID
├── mapCenter            # 현재 지도 중심 좌표
└── visibleShops         # 뷰포트 내 꽃집 목록

builderStore (LocalStorage persist)
├── flowers[]            # { flowerId, name, quantity, color }
├── wrapOption           # 포장 옵션
├── targetShopId         # 어느 꽃집 기준인지
└── memo                 # 꽃집에 전달할 메모
```

두 스토어는 독립적으로 관리. 컴포넌트에서 직접 교차 참조하지 않고
필요한 경우 selector로만 접근.

---

## 로그 이벤트 목록

```typescript
// 탐색 단계
'map_open'              // 앱 첫 진입
'marker_click'          // 지도 마커 클릭
'list_item_click'       // 꽃집 리스트 아이템 클릭
'search_keyword'        // 검색어 입력

// 발견 단계
'shop_detail_view'      // 꽃집 상세 진입
'flower_card_click'     // 꽃 카드 클릭
'builder_cta_click'     // '꽃다발 만들기' 버튼 클릭

// 빌더 단계
'flower_added'          // 꽃 추가
'flower_removed'        // 꽃 제거
'qty_changed'           // 수량 변경
'wrap_option_selected'  // 포장 옵션 선택

// 연결 단계
'summary_view'          // 꽃다발 요약 진입
'call_click'            // 전화 연결 클릭
'map_click'             // 길찾기 클릭
'save_bouquet'          // 꽃다발 저장
```

로그는 `useAnalytics` 훅으로만 호출. UI 컴포넌트에 직접 analytics 코드 넣지 않기.

---

## 코딩 컨벤션

- 컴포넌트: PascalCase (`FlowerCard.tsx`)
- 훅: camelCase + use 접두사 (`useKakaoMap.ts`)
- 스토어: camelCase + Store 접미사 (`builderStore.ts`)
- 타입: PascalCase, interface 우선 (`interface Flower {}`)
- 상수: UPPER_SNAKE_CASE (`MAX_FLOWER_COUNT`)
- 커밋: `feat:` `fix:` `refactor:` `chore:` `docs:` 접두사

**절대 하지 말 것**
- 컴포넌트 안에 직접 API 호출 (훅으로 분리)
- prop drilling 3단계 이상 (스토어 사용)
- any 타입 사용
- console.log 커밋 (console.error는 허용)

---

## 엣지케이스 체크리스트 (개발 완료 후 반드시 확인)

- [ ] 위치 권한 거부 시 기본 위치(서울 중심)로 폴백
- [ ] 주변 꽃집 0개 — 빈 상태 UI 표시
- [ ] 네트워크 오프라인 — 에러 메시지 표시
- [ ] 꽃 0개 상태에서 요약 페이지 진입 방지
- [ ] Claude API 타임아웃/에러 — 재시도 버튼 표시
- [ ] iOS Safari 100vh 버그 — dvh 단위 사용
- [ ] 이미지 로딩 실패 — placeholder 표시

---

## 데브로그 작성 방법

하루 작업 끝나면 아래 형식으로 `devlog/DAY{n}.md` 생성 요청:

```
오늘 한 것   —
막힌 것      —
해결 방법    —
내일 할 것   —
느낀 것      —
```

Claude Code에게 "오늘 데브로그 작성해줘" 라고 하면
변경된 파일 기반으로 자동 작성.

---

## 포트폴리오 어필 포인트 (면접 연결)

이 프로젝트에서 반드시 설명할 수 있어야 하는 것들:

1. **왜 Zustand 두 개의 slice로 분리했는가** — 지도 상태와 빌더 상태의 관심사가 다르기 때문
2. **로그 이벤트를 왜 먼저 설계했는가** — 수집할 데이터를 모르면 제품을 개선할 수 없기 때문
3. **iOS Safari dvh 이슈를 어떻게 해결했는가** — 모바일 웹뷰 개발 경험 어필
4. **AI 추천에서 어떤 판단을 직접 했는가** — AI 출력을 그대로 쓰지 않고 검토·수정한 부분
