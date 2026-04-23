# DAY 3 — 꽃집 상세 + 꽃 상세 모달 + 디자인 시스템

> 2026-04-22

---

## 오늘 한 것

- S-02 꽃집 상세 Bottom Sheet 구현 (`ShopDetailSheet.tsx`)
- S-03 꽃 상세 모달 구현 (`FlowerDetailModal.tsx`)
- 영업중 / 마감 실시간 판별 로직 (`isOpen` 함수)
- 디자인 토큰 CSS 변수 정의 (`--rose`, `--ink`, `--muted` 등)
- 꽃집 → 꽃 카드 탭 → 꽃 상세 모달 → 빌더 추가 흐름 연결

---

## 트러블슈팅

### 1. 모달 배경 클릭 시 카드 클릭도 같이 발동

모달 바깥 배경을 클릭해서 닫으려 했더니, 배경 `onClick`과 카드 `onClick`이 동시에 실행됨.

**원인:** 이벤트 버블링. 자식 요소 클릭 이벤트가 부모까지 올라감.  
**해결:** 모달 카드에 `e.stopPropagation()` 추가

```tsx
<div onClick={e => e.stopPropagation()}>
  {/* 모달 내용 */}
</div>
```

---

### 2. `filter`로 undefined 제거할 때 타입 에러

```ts
const shopFlowers = shop.flowerIds
  .map(id => flowers.find(f => f.id === id))
  .filter(f => f !== undefined); // ❌ 타입이 여전히 (Flower | undefined)[]
```

**원인:** TypeScript는 `filter`만으로는 타입을 좁혀주지 않음.  
**해결:** 타입 가드 함수로 명시

```ts
.filter((f): f is Flower => f !== undefined) // ✅ Flower[]
```

---

## 오늘 배운 개념

### 이벤트 버블링과 stopPropagation

DOM 이벤트는 발생한 요소에서 시작해서 부모 방향으로 계속 전달됨 (버블링).

```
클릭 발생 → 자식 → 부모 → 조상 → document
```

`e.stopPropagation()`은 이 전파를 그 자리에서 막음.  
모달, 드롭다운, Bottom Sheet처럼 "바깥 클릭으로 닫기" 패턴에서 필수.

---

### CSS 커스텀 프로퍼티 (디자인 토큰)

```css
:root {
  --rose: #d4637a;
  --ink: #1e1218;
  --muted: #9a7580;
}
```

색상, 폰트, 간격을 변수로 선언해두면:
- 디자인 변경 시 한 곳만 수정하면 전체 반영
- 컴포넌트마다 색상 코드 하드코딩 안 해도 됨
- 포트폴리오에서 "디자인 시스템 설계" 어필 포인트

```tsx
// 컴포넌트에서
color: 'var(--rose)'
background: 'var(--rose-light)'
```

---

### TypeScript 타입 가드 (Type Guard)

TypeScript가 스스로 타입을 좁히지 못할 때, 직접 "이 값은 이 타입이다"를 보장해주는 함수.

```ts
// 일반 filter — 타입 그대로
.filter(f => f !== undefined)  // (Flower | undefined)[]

// 타입 가드 — 컴파일러가 타입 좁힘
.filter((f): f is Flower => f !== undefined)  // Flower[]
```

`(f): f is Flower` 형태가 타입 가드 문법.  
배열에서 `undefined` / `null` 걸러낼 때 자주 씀.

---

### Record<K, V> 유틸리티 타입

특정 키 목록에 대해 값을 매핑하는 객체 타입을 간결하게 정의.

```ts
// 직접 쓰면 장황함
type ColorMap = {
  red: { bg: string; text: string; label: string };
  pink: { bg: string; text: string; label: string };
  // ... 8개 전부
}

// Record로 간결하게
const COLOR_MAP: Record<ColorTag, { bg: string; text: string; label: string }> = {
  red: { bg: '#fde8e8', text: '#c04060', label: '레드' },
  // ...
}
```

`ColorTag`의 모든 키를 빠짐없이 정의해야 컴파일 통과 → 실수로 빠뜨리는 것 방지.

---

## 내일 할 것 (D4)

- S-04 꽃다발 빌더 화면
- 꽃 선택 팔레트 + 미리보기 + 수량 조절 + 포장 옵션
- builderStore UI 연결
