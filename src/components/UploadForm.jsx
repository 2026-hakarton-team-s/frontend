import { useState } from 'react';

/**
 * 분석 파일 업로드 폼.
 *
 * - static.json      : Trivy 정적 분석 결과
 * - loaded-jars.txt  : DepScan Agent 동적 분석 결과
 *
 * 두 파일이 모두 선택되어야 [분석 시작] 버튼이 활성화됩니다.
 *
 * @param {(staticReport: File, loadedJars: File) => void} onSubmit  업로드 실행 함수
 * @param {boolean} loading  분석 중이면 true (버튼 비활성화)
 */
export default function UploadForm({ onSubmit, loading }) {
  const [staticReport, setStaticReport] = useState(null);
  const [loadedJars, setLoadedJars] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 입력 검증: 둘 중 하나라도 없으면 에러 표시 후 중단
    if (!staticReport || !loadedJars) {
      setError('두 파일을 모두 선택하세요.');
      return;
    }
    setError('');
    onSubmit(staticReport, loadedJars);
  };

  return (
    <form className="card upload" onSubmit={handleSubmit}>
      <h2 className="card__title">분석 파일 업로드</h2>

      <div className="upload__fields">
        <label className="upload__field">
          <span className="upload__label">① 정적 분석 결과 (Trivy)</span>
          <span className="upload__hint">trivy fs --format json -o static.json app.jar</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={(e) => {
              setStaticReport(e.target.files[0] ?? null);
              setError('');
            }}
          />
        </label>

        <label className="upload__field">
          <span className="upload__label">② 동적 분석 결과 (DepScan Agent)</span>
          <span className="upload__hint">java -javaagent:depscan-agent.jar -jar app.jar</span>
          <input
            type="file"
            accept=".txt,text/plain"
            onChange={(e) => {
              setLoadedJars(e.target.files[0] ?? null);
              setError('');
            }}
          />
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button className="button" type="submit" disabled={loading}>
        {loading ? '분석 중…' : '분석 시작'}
      </button>
    </form>
  );
}
