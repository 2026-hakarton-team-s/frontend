// =====================================================================
// 분석 서버 API 호출 모음
//
// 백엔드(server 모듈)의 AnalysisController 와 1:1 대응합니다.
//   POST /api/analyses          파일 2개 업로드 → 분석 결과
//   GET  /api/analyses/latest   가장 최근 결과
//   GET  /api/analyses/{id}     특정 결과
//
// VITE_USE_MOCK=true 이면 서버 대신 가짜 데이터를 돌려줍니다. (npm run dev:mock)
// =====================================================================
import { mockAnalysis } from '../mocks/mockAnalysis.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const BASE_URL = '/api/analyses';

/**
 * 서버 응답을 확인하고 JSON 으로 변환합니다.
 * 실패하면 서버가 보낸 에러 메시지(ProblemDetail 의 detail)를 담아 예외를 던집니다.
 */
async function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }
  let message = `요청 실패 (HTTP ${response.status})`;
  try {
    const body = await response.json();
    if (body.detail) message = body.detail;
  } catch {
    // JSON 이 아닌 에러 응답이면 기본 메시지 사용
  }
  const error = new Error(message);
  error.status = response.status;
  throw error;
}

/** 가짜 네트워크 지연 (mock 모드에서 로딩 화면 확인용) */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Trivy 결과 + Agent 기록 파일을 업로드해서 교차 분석을 요청합니다.
 * @param {File} staticReport  static.json
 * @param {File} loadedJars    loaded-jars.txt
 */
export async function uploadAnalysis(staticReport, loadedJars) {
  if (USE_MOCK) {
    await delay(600);
    return mockAnalysis;
  }

  // 서버의 @RequestPart 이름과 반드시 같아야 함: staticReport, loadedJars
  const formData = new FormData();
  formData.append('staticReport', staticReport);
  formData.append('loadedJars', loadedJars);

  const response = await fetch(BASE_URL, { method: 'POST', body: formData });
  return handleResponse(response);
}

/** 가장 최근 분석 결과. 아직 분석한 적이 없으면 null 을 반환합니다. */
export async function fetchLatestAnalysis() {
  if (USE_MOCK) {
    await delay(300);
    return mockAnalysis;
  }

  const response = await fetch(`${BASE_URL}/latest`);
  if (response.status === 404) {
    return null; // 정상 상황: 아직 업로드한 파일이 없음
  }
  return handleResponse(response);
}

export const isMockMode = USE_MOCK;
