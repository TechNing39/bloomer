# DAY 7 — QA + Vercel 배포 + README 작성

> 2026-04-27

---

## 오늘 한 것

- 전 화면 QA 완료 (지도, 리스트, 꽃집 상세, 꽃 상세 모달, 빌더, 요약 모두 통과)
- Vercel 프로덕션 배포 (`https://bloomer-iota.vercel.app`)
- README.md 프로젝트 문서 작성, `.env.example` 추가

---

## 트러블슈팅

### 배포 후 "불러오는 중" 무한 로딩

Vercel 배포 직후 앱이 로딩 상태에서 멈추는 현상. `curl`로 Referer 헤더 포함해서 카카오 SDK URL 요청했더니 401 반환 → 카카오 서버가 도메인 기준으로 SDK 응답을 막는 구조.

카카오 개발자 콘솔에서 JS 키가 여러 개였는데, 앱이 사용 중인 키("bloomer" 키)와 도메인이 등록된 키("vercel" 키)가 달랐던 게 원인. `VITE_KAKAO_MAP_KEY`를 도메인이 등록된 키로 교체 후 재배포해서 해결.

---

## 오늘 배운 개념

### 카카오 Maps SDK의 도메인 체크 방식

`useKakaoLoader`가 로딩에서 안 풀리는 원인이 항상 env 변수 누락인 건 아님. 카카오 SDK는 브라우저 Referer 헤더 기준으로 서버에서 401을 반환하고, `onerror`가 반복 발화되면서 retry 루프에 빠짐. 콘솔 에러 없이 조용히 걸리는 케이스라 디버깅이 어려웠음.

```bash
# Referer 포함해서 직접 확인하는 방법
curl -s "https://dapi.kakao.com/v2/maps/sdk.js?appkey=<key>" \
  -H "Referer: https://your-domain.vercel.app/" \
  -o /dev/null -w "%{http_code}"
# 200이면 정상, 401이면 도메인 미등록
```

---

