# DAY 6 — 엣지케이스 처리 + 반응형 점검

> 2026-04-26

---

## 오늘 한 것

- `useGeolocation` 훅 구현 — 위치 권한 허용 시 실제 위치로 지도 이동, 거부/미지원 시 서울 중심 폴백
- AI 추천 실패 시 오프라인 여부 감지 + 에러 메시지 구분 + 재시도 버튼
- ListScreen 꽃집 0개 빈 상태 UI
- iOS Safari `100dvh` 전체 적용 확인 ✅
- 꽃 0개 요약 진입 방지 확인 ✅
- 이미지 없는 항목 emoji placeholder 처리 확인 ✅

---

## 트러블슈팅

### 특별한 에러 없음

기존 코드가 이미 `dvh`, `disabled` 처리, emoji placeholder를 갖추고 있어서
추가 구현이 필요한 항목은 3개뿐이었다. `npx tsc --noEmit` 통과.

---

## 오늘 배운 개념

### Geolocation API + 폴백 패턴

브라우저의 위치 정보 API는 권한 거부, 기기 미지원, 타임아웃 세 가지 실패 케이스가 있음.
`getCurrentPosition`의 두 번째 인자(에러 콜백)에서 모두 폴백 처리.

```ts
navigator.geolocation.getCurrentPosition(
  (pos) => {
    setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
  },
  () => {
    setMapCenter(SEOUL_CENTER); // 거부, 미지원, 타임아웃 모두 여기로
  },
  { timeout: 5000 }
);
```

실패 케이스를 세분화하면 코드가 복잡해지고, 유저 입장에서는 그냥 지도가 뜨면 됨.
실패는 항상 안전한 기본값으로 처리하는 게 UX상 낫다.

---

### `navigator.onLine`으로 오프라인 감지

API 요청 실패 시 에러 종류를 구분하면 더 정확한 메시지를 줄 수 있음.

```ts
} catch (e) {
  if (!navigator.onLine) {
    setAiError('네트워크 연결을 확인해주세요.');
  } else {
    setAiError('추천에 실패했어요. 다시 시도해주세요.');
  }
}
```

네트워크 에러와 서버 에러를 같은 메시지로 처리하면 유저가 뭘 해야 할지 모름.
`navigator.onLine`으로 오프라인인지 먼저 확인하고 메시지를 나누는 게 좋은 UX.

---

### 빈 상태 UI (Empty State) 패턴

데이터가 없을 때 아무것도 안 보여주면 버그처럼 보임.
일러스트(또는 emoji) + 짧은 안내 문구로 구성하는 게 기본 패턴.

```tsx
{shops.length === 0 && (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 12 }}>
    <span style={{ fontSize: 48 }}>🌿</span>
    <div style={{ fontFamily: 'var(--ff-kr)', fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>
      주변에 꽃집이 없어요<br />
      <span style={{ fontSize: 12 }}>위치를 변경하거나 나중에 다시 시도해주세요</span>
    </div>
  </div>
)}
```

---

### `100dvh` vs `100vh` — iOS Safari 대응

`100vh`는 iOS Safari에서 주소창 높이를 포함해서 계산하는 버그가 있음.
페이지 첫 진입 시 하단이 잘리거나 스크롤이 생기는 문제가 발생.

```css
/* ❌ iOS Safari에서 주소창 높이 포함 → 하단 잘림 */
height: 100vh;

/* ✅ Dynamic Viewport Height — 실제 보이는 영역 기준 */
height: 100dvh;
```

`dvh`는 주소창이 나타나고 사라지는 것에 따라 동적으로 계산됨.
모바일 웹 프로젝트에서 `vh` 대신 `dvh`를 쓰는 게 기본.

---

## 내일 할 것 (D7)

- QA — 전체 플로우 최종 점검
- Vercel 배포 — 라이브 링크 확보
- README 작성
