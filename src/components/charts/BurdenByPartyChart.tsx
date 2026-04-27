import type { PartyContrastSummary } from '../../data/derived';
import { formatDecimal } from '../../utils/format';

type BurdenByPartyChartProps = {
  summary: PartyContrastSummary;
};

const WIDTH = 360;
const HEIGHT = 210;
const MARGIN = { bottom: 34, left: 48, right: 20, top: 18 };

function scale(value: number, domain: [number, number], range: [number, number]) {
  const ratio = (value - domain[0]) / (domain[1] - domain[0]);
  return range[0] + ratio * (range[1] - range[0]);
}

function getCorrelationLabel(value: number | null) {
  if (value === null) return 'Not available';
  const magnitude = Math.abs(value);
  if (magnitude < 0.1) return 'Weak';
  if (magnitude < 0.3) return 'Modest';
  return 'Stronger';
}

export function BurdenByPartyChart({ summary }: BurdenByPartyChartProps) {
  const dem = summary.burdenMeanDem ?? 0;
  const rep = summary.burdenMeanRep ?? 0;
  const maxValue = Math.max(dem, rep, 1);
  const domain: [number, number] = [0, maxValue * 1.1];
  const barWidth = 58;
  const centers = [MARGIN.left + 88, WIDTH - MARGIN.right - 88];
  const labels = [
    { key: 'D', color: '#5f8ea5', value: dem, x: centers[0] },
    { key: 'R', color: '#b98272', value: rep, x: centers[1] },
  ];

  return (
    <div className="compact-card">
      <p className="panel-eyebrow">Burden vs. party</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">Average county burden score by dominant party group.</p>
      <div className="mt-3 chart-svg-wrap">
        <svg className="chart-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Burden score by dominant party">
          {[0, maxValue / 2, maxValue].map((tick) => {
            const y = scale(tick, domain, [HEIGHT - MARGIN.bottom, MARGIN.top]);
            return (
              <g key={tick}>
                <line className="chart-grid" x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y} y2={y} />
                <text className="chart-tick" x={MARGIN.left - 10} y={y + 4} textAnchor="end">
                  {formatDecimal(tick, 1)}
                </text>
              </g>
            );
          })}
          {labels.map((entry) => {
            const y = scale(entry.value, domain, [HEIGHT - MARGIN.bottom, MARGIN.top]);
            const height = HEIGHT - MARGIN.bottom - y;
            return (
              <g key={entry.key}>
                <rect fill={entry.color} height={height} rx={2} width={barWidth} x={entry.x - barWidth / 2} y={y} />
                <text className="chart-value-label" textAnchor="middle" x={entry.x} y={y - 8}>
                  {formatDecimal(entry.value, 2)}
                </text>
                <text className="chart-tick" textAnchor="middle" x={entry.x} y={HEIGHT - 12}>
                  {entry.key}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">
        Party-burden correlation in this extract: {getCorrelationLabel(summary.burdenCorrelation)} (
        {formatDecimal(summary.burdenCorrelation, 2)}).
      </p>
    </div>
  );
}
