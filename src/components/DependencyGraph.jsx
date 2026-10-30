import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

/**
 * 의존성 트리 그래프.
 *
 * "내 앱 → spring-boot-starter → snakeyaml(취약)" 처럼
 * 취약 라이브러리가 어떤 경로로 들어왔는지 보여줍니다.
 *
 * - 빨강: 취약 + 실제 실행됨
 * - 주황 테두리: 취약하지만 실행 안 됨
 * - 회색: 취약점 없음
 *
 * TODO(백엔드/프론트): 지금은 mock 데이터만 사용합니다.
 *   서버에 의존성 트리 API 가 생기면 App.jsx 에서 실제 데이터를 넘겨주세요.
 *
 * @param {{ nodes: Array, edges: Array }} graph
 */
export default function DependencyGraph({ graph }) {
  // Cytoscape 는 React 가 아니라 직접 DOM 에 그리는 라이브러리라서 ref 로 div 를 넘겨줌
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...graph.nodes.map((n) => ({ data: n })),
        ...graph.edges.map((e) => ({ data: { id: `${e.source}->${e.target}`, ...e } })),
      ],
      // 위에서 아래로 내려가는 트리 모양 배치
      layout: { name: 'breadthfirst', directed: true, roots: '[?root]', spacingFactor: 1.1, padding: 16 },
      userZoomingEnabled: false,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'font-size': 10,
            'text-valign': 'bottom',
            'text-margin-y': 5,
            // 긴 라이브러리 이름이 옆 노드와 겹치지 않도록 줄바꿈
            'text-wrap': 'wrap',
            'text-max-width': 112,
            'text-overflow-wrap': 'anywhere',
            color: '#374151',
            'background-color': '#d1d5db',
            width: 18,
            height: 18,
          },
        },
        { selector: 'node[?root]', style: { 'background-color': '#1f2937', width: 24, height: 24 } },
        {
          selector: 'node[?vulnerable]',
          style: { 'background-color': '#fff', 'border-width': 3, 'border-color': '#f59e0b' },
        },
        {
          selector: 'node[?reachable]',
          style: { 'background-color': '#dc2626', 'border-color': '#dc2626', color: '#b91c1c', 'font-weight': 'bold' },
        },
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': '#d1d5db',
            'target-arrow-color': '#d1d5db',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
    });

    // 컴포넌트가 사라지거나 graph 가 바뀌면 이전 그래프 정리 (메모리 누수 방지)
    return () => cy.destroy();
  }, [graph]);

  return (
    <section className="card">
      <div className="card__header">
        <h2 className="card__title">의존성 경로</h2>
        <ul className="legend">
          <li><span className="legend__dot legend__dot--reachable" />취약 · 실행됨</li>
          <li><span className="legend__dot legend__dot--vulnerable" />취약 · 미실행</li>
          <li><span className="legend__dot" />정상</li>
        </ul>
      </div>
      <div ref={containerRef} className="graph" />
    </section>
  );
}
