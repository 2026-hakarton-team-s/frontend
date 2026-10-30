import { useEffect, useState } from 'react';
import { fetchLatestAnalysis, uploadAnalysis, isMockMode } from './api/analysisApi.js';
import { mockDependencyGraph } from './mocks/mockAnalysis.js';
import UploadForm from './components/UploadForm.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import ReachabilityChart from './components/ReachabilityChart.jsx';
import FindingsTable from './components/FindingsTable.jsx';
import DependencyGraph from './components/DependencyGraph.jsx';
import Login from './components/login.jsx';

/**
 * 대시보드 전체 화면.
 *
 * 화면 구성 (위에서 아래로)
 *   1. 헤더
 *   2. 파일 업로드
 *   3. 요약 카드 (30 / 3 / 90%)
 *   4. 차트 + 의존성 그래프 (좌우)
 *   5. 취약점 표
 *
 * 상태(state)
 *   analysis : 서버에서 받은 분석 결과 (없으면 null)
 *   loading  : 업로드/조회 중 여부
 *   error    : 에러 메시지
 */
export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // TODO: 로그인 API 가 생기면 실제 인증 결과로 교체 (지금은 버튼만 누르면 통과)
  const [loggedIn, setLoggedIn] = useState(false);

  // 첫 화면 진입 시: 이전에 분석한 결과가 있으면 불러오기
  useEffect(() => {
    fetchLatestAnalysis()
      .then(setAnalysis)
      .catch((e) => setError(`서버에 연결할 수 없습니다: ${e.message}`));
  }, []);

  const handleUpload = async (staticReport, loadedJars) => {
    setLoading(true);
    setError('');
    try {
      const result = await uploadAnalysis(staticReport, loadedJars);
      setAnalysis(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false); // 성공/실패 상관없이 로딩 해제
    }
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="header__title">DepScan</h1>
          <p className="header__subtitle">실제로 실행되는 취약 라이브러리만 골라주는 스프링 보안 도구</p>
        </div>
        {isMockMode && <span className="mock-tag">MOCK 데이터</span>}
      </header>

      <UploadForm onSubmit={handleUpload} loading={loading} />

      {error && <div className="alert">{error}</div>}

      {analysis ? (
        <>
          <SummaryCards summary={analysis.summary} />

          <div className="grid-2">
            <ReachabilityChart summary={analysis.summary} />
            {/* TODO: 서버에 의존성 트리 API 가 생기면 mockDependencyGraph 대신 실제 데이터 전달 */}
            <DependencyGraph graph={mockDependencyGraph} />
          </div>

          <FindingsTable findings={analysis.findings} />
        </>
      ) : (
        !error && (
          <div className="card empty">
            아직 분석 결과가 없습니다. 위에서 파일 2개를 업로드하세요.
          </div>
        )
      )}
    </div>
  );
}
