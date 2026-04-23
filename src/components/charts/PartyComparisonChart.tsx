import { useState } from 'react';
import type { PartySummary } from '../../data/derived';
import { formatDecimal, formatInteger } from '../../utils/format';

type PartyComparisonChartProps = {
  measure: 'meanGap' | 'meanLcv' | 'meanBurden';
  parties: PartySummary[];
};

const WIDTH = 760;
const HEIGHT = 310;
const MARGIN = { bottom: 44, left: 58, right: 24, top: 22 };

function scale(value: number, domain: [number, number], range: [number, number]) {
  const ratio = (value - domain[0]) / (domain[1] - domain[0]);
  return range[0] + ratio * (range[1] - range[0]);
}

function partyColor(party: string) {
  if (party === 'D') return '#5f8ea5';
  if (party === 'R') return '#b98272';
  if (party === 'I') return '#7f9f86';
  return '#9ca3af';
}

export function PartyComparisonChart({ measure, parties }: PartyComparisonChartProps) {
  const [tooltip, setTooltip] = useState<{ party: PartySummary; x: number; y: number } | null>(null);
  const data = parties.filter((party) => party.party !== 'Unknown');
  const values = data.map((party) => party[measure]);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 0);
  const yZero = scale(0, [minValue, maxValue], [HEIGHT - MARGIN.bottom, MARGIN.top]);
  const barWidth = 42;
  const groupStep = (WIDTH - MARGIN.left - MARGIN.right) / Math.max(data.length, 1);

  if (!data.length) return <div className="chart-empty-state">No party comparison data is available.</div>;

  return (
    <div className="chart-svg-wrap">
      <svg className="chart-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Party comparison chart">
        {[minValue, 0, maxValue].map((tick) => {
          const y = scale(tick, [minValue, maxValue], [HEIGHT - MARGIN.bottom, MARGIN.top]);
          return (
            <g key={tick}>
              <line className="chart-grid" x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y} y2={y} />
              <text className="chart-tick" x={MARGIN.left - 10} y={y + 4} textAnchor="end">
                {formatDecimal(tick, 1)}
              </text>
            </g>
          );
        })}
        {data.map((party, index) => {
          const x = MARGIN.left + groupStep * index + groupStep / 2 - barWidth / 2;
          const value = party[measure];
          const y = scale(value, [minValue, maxValue], [HEIGHT - MARGIN.bottom, MARGIN.top]);
          const height = Math.abs(yZero - y);
          return (
            <g
              key={party.party}
              onMouseEnter={(event) => setTooltip({ party, x: event.clientX, y: event.clientY })}
              onMouseLeave={() => setTooltip(null)}
              onMouseMove={(event) => setTooltip({ party, x: event.clientX, y: event.clientY })}
            >
              <rect
                className="party-bar"
                fill={partyColor(party.party)}
                height={height}
                rx={2}
                width={barWidth}
                x={x}
                y={Math.min(y, yZero)}
              />
              <text className="chart-tick" x={x + barWidth / 2} y={HEIGHT - 18} textAnchor="middle">
                {party.party}
              </text>
              <text className="chart-value-label" x={x + barWidth / 2} y={value >= 0 ? y - 8 : y + 16} textAnchor="middle">
                {formatDecimal(value, 2)}
              </text>
            </g>
          );
        })}
      </svg>
      {tooltip ? (
        <div className="map-tooltip" style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}>
          <p className="font-semibold text-ink">Party {tooltip.party.party}</p>
          <p>
            {measure === 'meanLcv' ? 'Mean state-average LCV' : measure === 'meanBurden' ? 'Mean burden' : 'Mean gap'}:{' '}
            {formatDecimal(tooltip.party[measure], 2)}
          </p>
          <p>Counties: {formatInteger(tooltip.party.countyCount)}</p>
          <p>Mean state-average LCV: {formatDecimal(tooltip.party.meanLcv, 1)}</p>
          <p>Mean burden: {formatDecimal(tooltip.party.meanBurden, 1)}</p>
        </div>
      ) : null}
    </div>
  );
}
