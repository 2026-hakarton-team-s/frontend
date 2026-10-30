import { SEVERITY_LABEL } from '../utils/severity.js';

/**
 * 심각도 배지 (CRITICAL / HIGH / MEDIUM / LOW)
 * 색상은 index.css 의 .badge--critical 등에서 지정합니다.
 */
export default function SeverityBadge({ severity }) {
  const key = SEVERITY_LABEL[severity] ? severity : 'UNKNOWN';
  return (
    <span className={`badge badge--${key.toLowerCase()}`}>
      {SEVERITY_LABEL[key]}
    </span>
  );
}
