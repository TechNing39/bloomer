# DAY 4 — 꽃다발 빌더 (핵심 UX)

> 2026-04-23

---

## 오늘 한 것

- S-04 꽃다발 빌더 전체 화면 구현 (`BuilderScreen.tsx`)
- 꽃 선택 팔레트 — 색상 필터 + 15종 그리드 (`FlowerPalette.tsx`)
- 현재 구성 미리보기 — 수량 +/- 조절, 소계 표시 (`BouquetPreview.tsx`)
- 포장 옵션 선택 3종 (`WrapOptionSelector.tsx`)
- `mapStore`에 `'builder'` 스크린 타입 추가 및 `App.tsx` 라우팅 연결
- 꽃 상세 모달 → "빌더에 추가" 클릭 시 빌더 화면으로 자동 이동

---

## 트러블슈팅

### 특별한 에러 없음

`npx tsc --noEmit` 통과. 컴포넌트 분리와 store 연결이 설계대로 맞아떨어진 날.

---

## 오늘 배운 개념

### Zustand selector로 리렌더 최적화

Zustand 스토어 전체를 구독하면, 관련 없는 값이 바뀌어도 해당 컴포넌트가 리렌더됨.

```ts
// ❌ store 전체 구독 — wrapOption 바뀌어도 flowers 쓰는 컴포넌트가 리렌더
const store = useBuilderStore();

// ✅ 필요한 값만 구독 — flowers 바뀔 때만 리렌더
const flowers = useBuilderStore(s => s.flowers);
```

오늘 만든 모든 컴포넌트에서 `s => s.flowers` 패턴을 사용한 이유.  
React는 참조가 바뀌면 리렌더하기 때문에, 구독 범위를 좁히는 게 기본 습관.

---

### 파생 상태(Derived State)는 render에서 계산

다른 state로부터 계산 가능한 값은 `useState`로 따로 관리하지 않음.

```ts
// ❌ 이렇게 하면 flowers 바뀔 때마다 total도 직접 업데이트해야 함 → 동기화 버그 위험
const [total, setTotal] = useState(0);

// ✅ render 중에 계산 — flowers만 관리하면 total은 항상 정확
const total = flowers.reduce((sum, f) => sum + f.unitPrice * f.quantity, 0);
```

React 공식 문서도 강조하는 원칙: **"If you can calculate it during rendering, you don't need state."**

---

### Set으로 O(1) 조회

꽃 카드 15개를 렌더할 때마다 "이미 담긴 꽃인지" 확인해야 함.

```ts
// ❌ 카드마다 배열 전체 순회 — O(n * m)
const inCart = flowers.find(f => f.flowerId === flower.id);

// ✅ Set으로 한 번 만들어두고 O(1) 조회
const addedIds = new Set(added.map(f => f.flowerId));
const inCart = addedIds.has(flower.id);
```

리스트를 렌더링할 때 "포함 여부 체크"가 필요하면 Set을 먼저 떠올리기.

---

### disabled 버튼과 UX

꽃이 0개일 때 "요약 보기" 버튼을 그냥 막는 게 아니라, 이유를 알려주는 것이 중요.

```tsx
<button
  disabled={flowers.length === 0}
  style={{
    background: flowers.length === 0 ? 'var(--border)' : 'var(--rose)',
    cursor: flowers.length === 0 ? 'not-allowed' : 'pointer',
  }}
>
  {flowers.length === 0 ? '꽃을 선택해주세요' : '요약 보기 →'}
</button>
```

disabled 상태에서 텍스트, 색상, 커서까지 바꿔서 유저가 "왜 안 눌리지?"를 겪지 않게.

---

## 내일 할 것 (D5)

- S-05 꽃다발 요약 화면 (선택 꽃 목록 · 예상 가격 · 메모 입력)
- "요약 보기 →" 버튼과 실제 연결
