# 🌸 Bloomer

동네 꽃집을 탐색하고, 나만의 꽃다발을 만들어보는 모바일 웹 앱

**[→ 배포 링크](https://bloomer-iota.vercel.app)**

---

## 주요 기능

- **지도 탐색** — 카카오맵 기반 주변 꽃집 마커 표시
- **꽃집 상세** — 꽃집 정보 및 판매 꽃 목록 확인
- **꽃다발 빌더** — 원하는 꽃과 포장을 선택해 꽃다발 구성
- **AI 추천** — GROQ API 기반 꽃 조합 추천
- **요약 & 연결** — 완성된 꽃다발 확인 후 꽃집으로 바로 연결

## 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| 상태 관리 | Zustand |
| 지도 | Kakao Maps JS API, react-kakao-maps-sdk |
| AI | GROQ API (Llama 3) |
| 배포 | Vercel |

## 로컬 실행

```bash
# 패키지 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env에 VITE_KAKAO_MAP_KEY, VITE_GROQ_API_KEY 입력

# 개발 서버 실행
npm run dev
```

## 환경 변수

| 키 | 설명 |
|----|------|
| `VITE_KAKAO_MAP_KEY` | 카카오 JavaScript SDK 키 |
| `VITE_GROQ_API_KEY` | GROQ API 키 |
