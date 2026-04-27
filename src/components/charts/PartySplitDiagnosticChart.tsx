import type { PartyContrastSummary } from '../../data/derived';
import { formatDecimal } from '../../utils/format';

type PartySplitDiagnosticChartProps = {
  summary: PartyContrastSummary;
};

const WIDTH = 760;
const HEIGHT = 168;
const MARGIN = { bottom: 26, left: 168, right: 44, top: 16 };

const rows = [
  { key: 'burdenDifference', label: 'Burden score', color: '#7f9f86' },
  { key: 'lcvDifference', label: 'State-average LCV', color: '#5f8ea5' },
  { key: 'gapDifference', label: 'Gap score', color: '#b98272' },
] as const;

export function PartySplitDiagnosticChart({ summary }: PartySplitDiagnosticChartProps) {
  const values = rows.map((row) => Math.abs(summary[row.key] ?? 0));
  const maxValue = Math.max(...values, 1);
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;

  return (
    <div className="chart-svg-wrap">
      <svg className="chart-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Difference in party-group averages">
        {rows.map((row, index) => {
          const value = Math.abs(summary[row.key] ?? 0);
          const width = (value / maxValue) * plotWidth;
          const y = MARGIN.top + index * 42;
          return (
            <g key={row.key}>
              <text className="chart-tick" x={MARGIN.left - 14} y={y + 17} textAnchor="end">
                {row.label}
              </text>
              <rect className="diagnostic-bar-track" height={16} rx={2} width={plotWidth} x={MARGIN.left} y={y + 4} />
              <rect height={16} rx={2} width={width} x={MARGIN.left} y={y + 4} fill={row.color} />
              <text className="chart-value-label" x={Math.min(MARGIN.left + width + 8, WIDTH - MARGIN.right)} y={y + 17}>
                {formatDecimal(value, row.key === 'gapDifference' ? 2 : 1)}
              </text>
            </g>
          );
        })}
        <text className="chart-axis-label" x={MARGIN.left} y={HEIGHT - 6}>
          Absolute difference between D and R county averages
        </text>
      </svg>
    </div>
  );
}
