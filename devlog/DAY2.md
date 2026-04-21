# DAY 2 — 지도 + 꽃집 리스트

> 2026-04-22

---

## 오늘 한 것

- Tailwind CSS, Zustand, react-kakao-maps-sdk 설치 및 세팅
- `mapStore`, `builderStore` Zustand 스토어 2개 생성
- Kakao Maps 풀스크린 + 꽃집 마커 5개 표시
- 하단 꽃집 리스트 Bottom Sheet 구현
- 마커 클릭 → 카드 하이라이트 연동

---

## 트러블슈팅

### 1. `APIProvider` import 에러
```
Module '"react-kakao-maps-sdk"' has no exported member 'APIProvider'
```
**원인:** react-kakao-maps-sdk는 APIProvider를 제공하지 않음  
**해결:** `useKakaoLoader` 훅으로 대체. 공식 exports 확인이 필요했음

---

### 2. 지도 로드 실패 (`[object Event]`)
**원인:** Kakao 개발자 콘솔에서 **카카오 지도 API 활성화**를 안 한 상태  
**해결:** 콘솔 → 카카오 지도 → 활성화 토글 ON  
**교훈:** 도메인 등록만으로는 부족하고, 사용할 API는 별도 활성화 필요

---

### 3. TypeScript `import type` 에러
```
'Shop' is a type and must be imported using a type-only import
when 'verbatimModuleSyntax' is enabled
```
**원인:** `tsconfig`에 `verbatimModuleSyntax: true` 설정 시 타입은 `import type`으로만 가능  
**해결:** `import { Shop }` → `import type { Shop }`

---

## 오늘 배운 개념

### Zustand
앱 전체에서 공유하는 상태를 관리하는 라이브러리.  
컴포넌트 간 prop drilling 없이 어디서든 상태를 읽고 쓸 수 있음.

```ts
// 스토어 정의
const useMapStore = create((set) => ({
  selectedShopId: null,
  setSelectedShopId: (id) => set({ selectedShopId: id }),
}));

// 어느 컴포넌트에서든
const { selectedShopId, setSelectedShopId } = useMapStore();
```

**persist 미들웨어:** `builderStore`에 적용. 앱을 닫았다 열어도 담은 꽃이 유지됨. 자동으로 LocalStorage에 직렬화해줌.

---

### Tailwind CSS
CSS 파일 없이 클래스 이름으로 스타일을 적용하는 방식.

```tsx
// 기존 CSS 방식
<div className="shop-card">

// Tailwind 방식
<div className="flex items-center gap-3 p-4 rounded-xl bg-white">
```

모바일 반응형을 `sm:` `md:` 접두사로 인라인에서 처리 가능.

---

### 환경변수 (Vite)
API 키 같은 민감한 정보는 코드에 직접 쓰지 않고 `.env` 파일에 분리.

```
# .env
VITE_KAKAO_MAP_KEY=xxxxxxxx
```

Vite에서는 반드시 `VITE_` 접두사가 있어야 클라이언트 코드에서 접근 가능.

```ts
import.meta.env.VITE_KAKAO_MAP_KEY
```

`.env` 파일은 `.gitignore`에 추가해서 GitHub에 올라가지 않게 관리.

---

### interface vs type (TypeScript)
| | interface | type |
|---|---|---|
| 객체 구조 정의 | ✅ 주로 사용 | 가능 |
| 유니온 타입 | ❌ | ✅ |
| extends 확장 | ✅ 직관적 | 가능하지만 복잡 |
| 선언 합치기 | ✅ | ❌ |

→ 객체 모델(`Flower`, `Shop`)은 `interface`, 제한된 값 목록(`Season`, `WrapOption`)은 `type` 유니온으로 구분해서 사용.

---

## 내일 할 것 (D3)

- S-02 꽃집 상세 화면 (보유 꽃 카드 그리드)
- S-03 꽃 상세 모달 (꽃말, 가격, 빌더에 추가)
