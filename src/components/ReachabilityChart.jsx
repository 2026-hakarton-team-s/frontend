import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';

// Chart.js 는 필요한 부품만 등록해서 써야 합니다 (번들 크기 절약)
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

/**
 * "기존 도구 경고 vs 실제 위험" 비교 막대 차트.
 * 발표에서 30 → 3 으로 줄어드는 장면을 한눈에 보여주는 용도입니다.
 */
export default function ReachabilityChart({ summary }) {
  const data = {
    labels: ['기존 도구 경고', '실제 실행되는 취약점'],
    datasets: [
      {
        data: [summary.totalCount, summary.reachableCount],
        backgroundColor: ['#9ca3af', '#dc2626'], // 회색(경고 전체) / 빨강(실제 위험)
        borderRadius: 6,
        barThickness: 56,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 부모 div 높이에 맞춤
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y}개` } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } }, // 정수 눈금만
      x: { grid: { display: false } },
    },
  };

  return (
    <section className="card">
      <h2 className="card__title">경고 감소 효과</h2>
      <div className="chart">
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}
