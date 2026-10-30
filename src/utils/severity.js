// =====================================================================
// 심각도 관련 공통 값
// 여러 컴포넌트(배지, 표, 필터)에서 같은 기준을 쓰도록 한곳에 모았습니다.
// =====================================================================

/** 정렬 순서: 숫자가 작을수록 위험 */
export const SEVERITY_ORDER = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  UNKNOWN: 4,
};

/** 화면에 보여줄 한글 이름 */
export const SEVERITY_LABEL = {
  CRITICAL: '치명',
  HIGH: '높음',
  MEDIUM: '중간',
  LOW: '낮음',
  UNKNOWN: '미상',
};

export function severityRank(severity) {
  return SEVERITY_ORDER[severity] ?? SEVERITY_ORDER.UNKNOWN;
}
