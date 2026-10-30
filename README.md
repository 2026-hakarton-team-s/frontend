# DepScan 대시보드 (Frontend)

DepScan 분석 결과를 보여주는 웹 대시보드입니다.
**"기존 도구 경고 30개 → 실제 실행되는 취약점 3개"**를 한눈에 보여주는 것이 목표입니다.

## 화면 구성

| 영역 | 컴포넌트 | 설명 |
|---|---|---|
| 파일 업로드 | `UploadForm.jsx` | `static.json`(Trivy) + `loaded-jars.txt`(Agent) 업로드 |
| 요약 카드 | `SummaryCards.jsx` | 전체 경고 / 실제 위험 / 감소율 |
| 비교 차트 | `ReachabilityChart.jsx` | 30 vs 3 막대 차트 (Chart.js) |
| 의존성 경로 | `DependencyGraph.jsx` | 취약 라이브러리가 들어온 경로 그래프 (Cytoscape.js) — **현재 mock 데이터** |
| 취약점 표 | `FindingsTable.jsx` | 실제 위험 / 전체 / 미실행 필터, 심각도 정렬 |

## 실행 방법

> Node.js 20 이상 필요

```bash
npm install

# 1) 백엔드 없이 가짜 데이터로 화면 개발
npm run dev:mock

# 2) 백엔드(localhost:8080)와 연결해서 실행
npm run dev
```

브라우저에서 http://localhost:5173 접속

`npm run dev` 모드에서는 `/api` 요청이 Vite proxy 를 통해 `localhost:8080`(분석 서버)으로 전달됩니다.

## 프로젝트 구조

```
frontend/
├── index.html
├── vite.config.js            # 개발 서버 + /api → 8080 프록시
├── .env.mock                 # npm run dev:mock 시 VITE_USE_MOCK=true
└── src/
    ├── main.jsx              # 앱 시작점
    ├── App.jsx               # 전체 화면 조립 + 상태 관리
    ├── index.css             # 공통 스타일 (색상은 :root 변수에서 수정)
    ├── api/
    │   └── analysisApi.js    # 백엔드 API 호출 (mock 모드 전환 포함)
    ├── mocks/
    │   └── mockAnalysis.js   # 가짜 분석 결과 + 가짜 의존성 그래프
    ├── utils/
    │   └── severity.js       # 심각도 정렬 순서, 한글 이름
    └── components/
        ├── UploadForm.jsx
        ├── SummaryCards.jsx
        ├── ReachabilityChart.jsx
        ├── DependencyGraph.jsx
        ├── FindingsTable.jsx
        └── SeverityBadge.jsx
```

## 백엔드 API 약속

`src/api/analysisApi.js` 가 아래 API 를 호출합니다. 형식이 바뀌면 백엔드와 같이 수정하세요.

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/analyses` | multipart: `staticReport`, `loadedJars` |
| GET | `/api/analyses/latest` | 최근 결과 (없으면 404) |

응답 형식은 `src/mocks/mockAnalysis.js` 의 `mockAnalysis` 와 같습니다.

## TODO

- [ ] **의존성 그래프 실제 데이터 연결**: 백엔드에 의존성 트리 API 추가 후 `App.jsx` 에서 `mockDependencyGraph` 교체
- [ ] 발표용 디자인 다듬기 (색상, 폰트, 로고)
- [ ] 취약점 행 클릭 시 상세 정보 (공격 시나리오, 패치 방법) 표시
- [ ] mock 데이터의 CVE 를 실제 Trivy 결과로 교체 (현재 일부는 화면 확인용 예시)
