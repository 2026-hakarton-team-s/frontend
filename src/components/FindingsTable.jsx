import { useMemo, useState } from 'react';
import SeverityBadge from './SeverityBadge.jsx';
import { severityRank } from '../utils/severity.js';

/** 필터 버튼 목록 */
const FILTERS = [
  { key: 'REACHABLE', label: '실제 위험만' },
  { key: 'ALL', label: '전체' },
  { key: 'NOT_LOADED', label: '미실행만' },
];

/**
 * 취약점 상세 표.
 *
 * - 기본 필터는 "실제 위험만" → 처음 화면에서 진짜 고쳐야 할 것만 보이게
 * - 정렬: 실제 실행된 것 먼저, 그다음 심각도 높은 순
 *
 * @param {Array} findings 서버 응답의 findings 배열
 */
export default function FindingsTable({ findings }) {
  const [filter, setFilter] = useState('REACHABLE');

  // findings 나 filter 가 바뀔 때만 다시 계산 (매 렌더링마다 정렬하지 않도록)
  const rows = useMemo(() => {
    return findings
      .filter((f) => filter === 'ALL' || f.reachability === filter)
      .toSorted((a, b) => {
        const reachDiff = (a.reachability === 'REACHABLE' ? 0 : 1) - (b.reachability === 'REACHABLE' ? 0 : 1);
        if (reachDiff !== 0) return reachDiff;
        return severityRank(a.severity) - severityRank(b.severity);
      });
  }, [findings, filter]);

  return (
    <section className="card">
      <div className="card__header">
        <h2 className="card__title">취약점 목록</h2>
        <div className="segmented" role="group" aria-label="실행 여부 필터">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`segmented__item ${filter === key ? 'is-active' : ''}`}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>실행 여부</th>
              <th>심각도</th>
              <th>CVE</th>
              <th>라이브러리</th>
              <th>현재 버전</th>
              <th>패치 버전</th>
              <th className="num">로드 클래스</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="table__empty">해당하는 취약점이 없습니다.</td>
              </tr>
            )}
            {rows.map((f) => (
              <tr key={`${f.cveId}-${f.library}`} className={f.reachability === 'REACHABLE' ? 'is-reachable' : ''}>
                <td>
                  {f.reachability === 'REACHABLE'
                    ? <span className="status status--reachable">실행됨</span>
                    : <span className="status">미실행</span>}
                </td>
                <td><SeverityBadge severity={f.severity} /></td>
                <td>
                  {f.referenceUrl
                    ? <a href={f.referenceUrl} target="_blank" rel="noreferrer">{f.cveId}</a>
                    : f.cveId}
                  {f.title && <div className="table__sub">{f.title}</div>}
                </td>
                <td className="mono">{f.library}</td>
                <td className="mono">{f.installedVersion}</td>
                <td className="mono">{f.fixedVersion || '-'}</td>
                <td className="num">{f.loadedClassCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
