# DAY 5 — AI 추천 + 요약 + 꽃집 연결 + 로그 연동

> 2026-04-26

---

## 오늘 한 것

- AI 꽃 추천 API 선택 및 연동 (Groq, `llama-3.1-8b-instant`)
- S-05 꽃다발 요약 화면 (`SummaryScreen.tsx`) — 꽃 목록, 합계, 메모, 꽃집 정보 카드
- S-06 꽃집 연결 — 전화 `tel:` 딥링크 + 카카오맵 길찾기 URL
- 전체 AI 버튼 → 빌더 + AI 패널 자동 오픈 (`openBuilderWithAi`)
- 지도 카테고리 필터 실제 동작 (장미/튤립/부케 `flowerIds` 기반 필터링)
- `useAnalytics` 훅 + 전체 플로우 로그 이벤트 연동

---

## 트러블슈팅

### 1. AI API 3개 연속 실패 → Groq으로 최종 결정

**Gemini (Google AI Studio)**  
**원인:** 한국 IP에서 무료 tier가 차단돼 있음. `limit: 0` 에러 리턴.  
`gemini-2.0-flash`, `gemini-2.0-flash-lite` 모두 동일.  

**GPT (OpenAI)**  
**원인:** 계정 크레딧 소진 상태. 충전 시도했으나 결제가 안 됨.  

**Claude (Anthropic)**  
**원인:** 크레딧 구매 시 BRN(사업자등록번호) 필드가 필수로 요구되고 세금 금액이 `$--`로 계산 안 돼 결제 불가.  

**→ Groq 선택:** 무료 API 키 발급, 한국 IP 접근 가능, OpenAI 호환 포맷.  
`llama-3.1-8b-instant`로 테스트 결과 응답 533ms, JSON 유효 확인.

---

### 2. `.env` 키가 한 줄에 붙어버린 파싱 버그

```
GROQ_API_KEY=gsk_xxxVITE_GROQ_API_KEY=gsk_xxx
```

**원인:** `>>` 리다이렉트로 append할 때 앞 줄 끝에 개행이 없었음. 키 값 뒤에 공백 5개도 함께 붙어서 API 인증 실패.  
**해결:** Python으로 `.env` 전체를 읽어 각 줄 strip 후 다시 저장.

```python
with open('.env') as f:
    lines = f.readlines()
fixed = [line.strip() + '\n' for line in lines if line.strip()]
with open('.env', 'w') as f:
    f.writelines(fixed)
```

**교훈:** `.env`는 쉘 append 말고 에디터에서 직접 편집하는 게 안전.

---

### 3. `onClick`이 `style` 객체 안에 들어가 있던 파싱 에러

```tsx
// ❌ onClick이 style 객체 안에 끼어 있음 — 버튼이 눌려도 반응 없음
<button
  style={{
    onClick={() => doSomething()},
    padding: '12px 0',
  }}
>
```

**원인:** `style`은 CSS 프로퍼티만 받는 객체. TypeScript가 에러를 잡지 못하고 런타임에 조용히 무시됨.  
`SearchScreen`, `ListScreen`, `MapScreen` 세 곳에서 동일한 패턴으로 발생.  
**해결:** `onClick`을 `style` 밖 JSX 어트리뷰트로 분리.

```tsx
// ✅
<button
  onClick={() => doSomething()}
  style={{ padding: '12px 0' }}
>
```

---

## 오늘 배운 개념

### Groq API — `response_format: { type: 'json_object' }`

LLM에게 JSON을 달라고 해도 마크다운 코드블록이나 설명 문장을 섞어서 주는 경우가 많음.
`response_format`을 명시하면 순수 JSON만 리턴하도록 강제할 수 있음.

```ts
body: JSON.stringify({
  model: 'llama-3.1-8b-instant',
  response_format: { type: 'json_object' },
  messages: [{ role: 'user', content: prompt }],
})
```

JSON.parse 전에 별도 파싱 처리가 필요 없어져서 에러 가능성이 줄어듦.

---

### useState 초기값 + useEffect로 플래그 리셋

앱 곳곳의 AI 버튼 → 빌더 이동 시 AI 패널을 자동으로 열려면 "어떤 경로로 진입했는지"를 BuilderScreen이 알아야 함. Zustand 플래그로 해결.

```ts
// mapStore
openBuilderWithAi: () => set({ screen: 'builder', builderOpenAi: true }),
resetBuilderOpenAi: () => set({ builderOpenAi: false }),
```

```tsx
// BuilderScreen
const builderOpenAi = useMapStore(s => s.builderOpenAi);
const [showAi, setShowAi] = useState(builderOpenAi); // 마운트 시점에 한 번만 읽음

useEffect(() => {
  if (builderOpenAi) resetBuilderOpenAi(); // 읽은 뒤 즉시 리셋
}, []);
```

`useState`의 초기값은 마운트 시 한 번만 평가되기 때문에, 플래그를 읽자마자 리셋해도 `showAi` 값에 영향 없음.

---

### 카테고리 필터 — 함수 배열 패턴

카테고리 인덱스마다 다른 필터 조건을 switch-case 대신 함수 배열로 표현.

```ts
const CATEGORY_FILTER: ((shop: Shop) => boolean)[] = [
  () => true,                               // 전체
  (s) => s.flowerIds.includes('flower-01'), // 장미
  (s) => s.flowerIds.includes('flower-02'), // 튤립
  (s) => s.tags.includes('부케'),            // 부케
  () => false,                              // AI추천 → 별도 처리
];

const filteredShops = shops.filter(CATEGORY_FILTER[selCat]);
```

카테고리가 추가돼도 배열에 함수 하나만 넣으면 되고, 컴포넌트 내부 분기는 건드릴 필요가 없음.

---

### Analytics — localStorage에 이벤트 누적 저장

DEV 콘솔 출력만으로는 "로그가 실제로 쌓이는지" 보여주기 어려움.
localStorage에 저장해두면 DevTools → Application → Local Storage에서 이벤트 스택을 직접 시연할 수 있음.

```ts
export function logEvent(event: AnalyticsEvent, params?: Record<string, unknown>) {
  const payload = { event, ts: Date.now(), ...params };
  const stored = JSON.parse(localStorage.getItem('bloomer_analytics') ?? '[]');
  stored.push(payload);
  localStorage.setItem('bloomer_analytics', JSON.stringify(stored.slice(-200)));
  if (import.meta.env.DEV) console.info('[analytics]', event, params ?? '');
}
```

최대 200개로 제한해 localStorage 용량이 넘치지 않게 함.

---

## 내일 할 것 (D6)

- 엣지케이스 처리 (위치 권한 거부, 빈 상태 UI, 네트워크 오프라인)
- AI API 타임아웃 시 재시도 버튼
- 이미지 로딩 실패 placeholder
- iOS Safari 100vh 대응 확인
