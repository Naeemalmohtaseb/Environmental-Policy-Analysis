import type { CountyRecord } from '../../data/types';
import { formatDecimal, formatInteger } from '../../utils/format';

type CountyRankChartProps = {
  counties: CountyRecord[];
  onSelect: (countyFips: string | null) => void;
  selectedFips: string | null;
};

const WIDTH = 760;
const ROW_HEIGHT = 25;
const MARGIN = { bottom: 18, left: 156, right: 36, top: 12 };

export function CountyRankChart({ counties, onSelect, selectedFips }: CountyRankChartProps) {
  const maxGap = Math.max(...counties.map((county) => county.justiceGapScore ?? 0), 1);
  const height = MARGIN.top + MARGIN.bottom + counties.length * ROW_HEIGHT;

  if (!counties.length) return <div className="chart-empty-state">No ranked counties are available.</div>;

  return (
    <div className="chart-svg-wrap">
      <svg className="chart-svg" viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label="Top counties by gap score">
        {counties.map((county, index) => {
          const y = MARGIN.top + index * ROW_HEIGHT;
          const width = ((county.justiceGapScore ?? 0) / maxGap) * (WIDTH - MARGIN.left - MARGIN.right);
          const selected = county.countyFips === selectedFips;
          return (
            <g className="bar-row" key={county.countyFips} onClick={() => onSelect(selected ? null : county.countyFips)}>
              <text className="chart-tick" x={MARGIN.left - 10} y={y + 16} textAnchor="end">
                {county.countyName}, {county.stateAbbrev}
              </text>
              <rect className={selected ? 'bar-fill-selected' : 'bar-fill'} height={14} rx={2} width={width} x={MARGIN.left} y={y + 4} />
              <text className="chart-value-label" x={Math.min(MARGIN.left + width + 6, WIDTH - MARGIN.right - 26)} y={y + 16}>
                {formatDecimal(county.justiceGapScore, 2)}
              </text>
              <title>
                Rank {formatInteger(county.justiceGapRank)}: {county.countyName}, {county.stateAbbrev}
              </title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
