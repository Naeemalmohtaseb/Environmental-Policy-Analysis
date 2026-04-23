import { useState } from 'react';
import type { StateSummary } from '../../data/derived';
import { formatDecimal, formatInteger } from '../../utils/format';

type StateSummaryChartProps = {
  states: StateSummary[];
};

const WIDTH = 760;
const ROW_HEIGHT = 23;
const MARGIN = { bottom: 22, left: 228, right: 42, top: 12 };

function scale(value: number, domain: [number, number], range: [number, number]) {
  const ratio = (value - domain[0]) / (domain[1] - domain[0]);
  return range[0] + ratio * (range[1] - range[0]);
}

export function StateSummaryChart({ states }: StateSummaryChartProps) {
  const [tooltip, setTooltip] = useState<{ state: StateSummary; x: number; y: number } | null>(null);
  const topStates = states;
  const minGap = Math.min(...topStates.map((state) => state.meanGap), 0);
  const maxGap = Math.max(...topStates.map((state) => state.meanGap), 0);
  const domain: [number, number] = minGap === maxGap ? [Math.min(minGap, -1), Math.max(maxGap, 1)] : [minGap, maxGap];
  const xZero = scale(0, domain, [MARGIN.left, WIDTH - MARGIN.right]);
  const height = MARGIN.top + MARGIN.bottom + topStates.length * ROW_HEIGHT;

  if (!topStates.length) return <div className="chart-empty-state">No state summary data is available.</div>;

  return (
    <div className="chart-svg-wrap">
      <svg className="chart-svg" viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label="State summary bar chart">
        <line className="state-zero-line" x1={xZero} x2={xZero} y1={MARGIN.top - 2} y2={height - MARGIN.bottom + 2} />
        {topStates.map((state, index) => {
          const y = MARGIN.top + index * ROW_HEIGHT;
          const valueX = scale(state.meanGap, domain, [MARGIN.left, WIDTH - MARGIN.right]);
          const width = Math.abs(valueX - xZero);
          const x = Math.min(valueX, xZero);
          const isNegative = state.meanGap < 0;
          return (
            <g
              className="bar-row"
              key={state.stateAbbrev}
              onMouseEnter={(event) => setTooltip({ state, x: event.clientX, y: event.clientY })}
              onMouseLeave={() => setTooltip(null)}
              onMouseMove={(event) => setTooltip({ state, x: event.clientX, y: event.clientY })}
            >
              <text className="chart-tick" x={MARGIN.left - 18} y={y + 15} textAnchor="end">
                {state.stateName}
              </text>
              <rect className={isNegative ? 'state-bar-negative' : 'state-bar-positive'} height={14} rx={2} width={width} x={x} y={y + 3} />
              <text
                className="chart-value-label"
                x={
                  isNegative
                    ? Math.max(x - 10, MARGIN.left - 14)
                    : Math.min(x + width + 6, WIDTH - MARGIN.right - 28)
                }
                y={y + 15}
                textAnchor={isNegative ? 'end' : 'start'}
              >
                {formatDecimal(state.meanGap, 2)}
              </text>
            </g>
          );
        })}
      </svg>
      {tooltip ? (
        <div className="map-tooltip" style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}>
          <p className="font-semibold text-ink">{tooltip.state.stateName}</p>
          <p>Mean gap: {formatDecimal(tooltip.state.meanGap, 2)}</p>
          <p>Counties: {formatInteger(tooltip.state.countyCount)}</p>
          <p>Population: {formatInteger(tooltip.state.population)}</p>
        </div>
      ) : null}
    </div>
  );
}
