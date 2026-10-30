/**
 * 상단 요약 카드 3개: 전체 경고 / 실제 위험 / 감소율
 *
 * 발표의 핵심 메시지 "경고 30개 → 실제 위험 3개"를 숫자로 크게 보여줍니다.
 *
 * @param {{ totalCount: number, reachableCount: number, notLoadedCount: number }} summary
 */
export default function SummaryCards({ summary }) {
  const { totalCount, reachableCount, notLoadedCount } = summary;

  // 감소율: 전체 경고 중 "신경 쓰지 않아도 되는" 비율
  // 0 으로 나누는 경우(취약점 0개) 방지
  const reducedPercent = totalCount === 0 ? 0 : Math.round((notLoadedCount / totalCount) * 100);

  return (
    <section className="summary">
      <div className="card summary__card">
        <span className="summary__label">기존 도구 경고</span>
        <strong className="summary__value">{totalCount}</strong>
        <span className="summary__desc">정적 분석(Trivy)이 찾은 취약 라이브러리</span>
      </div>

      <div className="card summary__card summary__card--danger">
        <span className="summary__label">실제 실행되는 취약점</span>
        <strong className="summary__value">{reachableCount}</strong>
        <span className="summary__desc">Agent 가 실행 중 로드를 확인한 것 · 즉시 패치</span>
      </div>

      <div className="card summary__card">
        <span className="summary__label">줄어든 경고</span>
        <strong className="summary__value">{reducedPercent}%</strong>
        <span className="summary__desc">{notLoadedCount}개는 포함됐지만 실행되지 않음</span>
      </div>
    </section>
  );
}
