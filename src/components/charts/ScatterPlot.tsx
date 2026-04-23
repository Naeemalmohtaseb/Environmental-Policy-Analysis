import { useMemo, useState } from 'react';
import type { CountyRecord } from '../../data/types';
import { getRegressionLine } from '../../data/derived';
import { formatDecimal, formatInteger } from '../../utils/format';

type ScatterPlotProps = {
  colorMode: 'gap' | 'party';
  counties: CountyRecord[];
  onHover: (countyFips: string | null) => void;
  onSelect: (countyFips: string | null) => void;
  selectedFips: string | null;
  sizeMode: 'population' | 'uniform';
};

const WIDTH = 760;
const HEIGHT = 370;
const MARGIN = { bottom: 46, left: 58, right: 22, top: 20 };

function scale(value: number, domain: [number, number], range: [number, number]) {
  const ratio = (value - domain[0]) / (domain[1] - domain[0]);
  return range[0] + ratio * (range[1] - range[0]);
}

function gapColor(value: number | null) {
  if (value === null) return '#cfd6ce';
  if (value >= 2) return '#9f4f3f';
  if (value >= 1) return '#c38362';
  if (value >= 0) return '#d7c98f';
  return '#8fb6ad';
}

function partyColor(value: string | null) {
  if (value === 'D') return '#5f8ea5';
  if (value === 'R') return '#b98272';
  if (value === 'I') return '#7f9f86';
  return '#cfd6ce';
}

export function ScatterPlot({ colorMode, counties, onHover, onSelect, selectedFips, sizeMode }: ScatterPlotProps) {
  const [tooltip, setTooltip] = useState<{ county: CountyRecord; x: number; y: number } | null>(null);
  const selectedCounty = selectedFips ? counties.find((county) => county.countyFips === selectedFips) : null;

  const points = useMemo(
    () =>
      counties.filter(
        (county) =>
          county.lcvScore !== null &&
          county.environmentalBurdenScore !== null &&
          county.population !== null &&
          county.justiceGapScore !== null,
      ),
    [counties],
  );

  const regression = useMemo(() => getRegressionLine(points), [points]);
  const maxPopulation = Math.max(...points.map((point) => point.population ?? 0), 1);
  const yMax = Math.max(100, Math.ceil(Math.max(...points.map((point) => point.environmentalBurdenScore ?? 0)) / 10) * 10);

  if (!points.length) {
    return <div className="chart-empty-state">No scatter fields are available.</div>;
  }

  return (
    <div className="chart-svg-wrap">
      <svg className="chart-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Scatter plot of burden and state-average voting score">
        {[0, 25, 50, 75, 100].map((tick) => {
          const x = scale(tick, [0, 100], [MARGIN.left, WIDTH - MARGIN.right]);
          return (
            <g key={tick}>
              <line className="chart-grid" x1={x} x2={x} y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} />
              <text className="chart-tick" x={x} y={HEIGHT - 18} textAnchor="middle">
                {tick}
              </text>
            </g>
          );
        })}
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = scale(tick, [0, yMax], [HEIGHT - MARGIN.bottom, MARGIN.top]);
          return (
            <g key={tick}>
              <line className="chart-grid" x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y} y2={y} />
              <text className="chart-tick" x={MARGIN.left - 10} y={y + 4} textAnchor="end">
                {tick}
              </text>
            </g>
          );
        })}

        {regression ? (
          <line
            className="regression-line"
            x1={scale(regression.x1, [0, 100], [MARGIN.left, WIDTH - MARGIN.right])}
            x2={scale(regression.x2, [0, 100], [MARGIN.left, WIDTH - MARGIN.right])}
            y1={scale(regression.y1, [0, yMax], [HEIGHT - MARGIN.bottom, MARGIN.top])}
            y2={scale(regression.y2, [0, yMax], [HEIGHT - MARGIN.bottom, MARGIN.top])}
          />
        ) : null}

        {points.map((county) => {
          const x = scale(county.lcvScore ?? 0, [0, 100], [MARGIN.left, WIDTH - MARGIN.right]);
          const y = scale(county.environmentalBurdenScore ?? 0, [0, yMax], [HEIGHT - MARGIN.bottom, MARGIN.top]);
          const radius = sizeMode === 'uniform' ? 4.2 : 1.8 + Math.sqrt((county.population ?? 0) / maxPopulation) * 6.8;
          const selected = county.countyFips === selectedFips;

          return (
            <circle
              className={`scatter-point ${selected ? 'scatter-point-selected' : ''}`}
              cx={x}
              cy={y}
              fill={colorMode === 'party' ? partyColor(county.dominantParty) : gapColor(county.justiceGapScore)}
              key={county.countyFips}
              onClick={() => onSelect(selected ? null : county.countyFips)}
              onMouseEnter={(event) => {
                onHover(county.countyFips);
                setTooltip({ county, x: event.clientX, y: event.clientY });
              }}
              onMouseLeave={() => {
                onHover(null);
                setTooltip(null);
              }}
              onMouseMove={(event) => setTooltip({ county, x: event.clientX, y: event.clientY })}
              r={selected ? radius + 2 : radius}
              stroke={selected ? '#1f2933' : 'rgba(31, 41, 51, 0.22)'}
              strokeWidth={selected ? 2 : 0.35}
            />
          );
        })}

        <text className="chart-axis-label" x={WIDTH / 2} y={HEIGHT - 4} textAnchor="middle">
          State-average LCV score
        </text>
        <text className="chart-axis-label" textAnchor="middle" transform={`translate(14 ${HEIGHT / 2}) rotate(-90)`}>
          Environmental burden score
        </text>
      </svg>

      {selectedCounty ? (
        <div className="chart-selection-note">
          Selected: {selectedCounty.countyName}, {selectedCounty.stateAbbrev}
        </div>
      ) : null}

      {tooltip ? (
        <div className="map-tooltip" style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}>
          <p className="font-semibold text-ink">
            {tooltip.county.countyName}, {tooltip.county.stateAbbrev}
          </p>
          <p>Gap score: {formatDecimal(tooltip.county.justiceGapScore, 2)}</p>
          <p>Burden score: {formatDecimal(tooltip.county.environmentalBurdenScore, 1)}</p>
          <p>State-average LCV: {formatDecimal(tooltip.county.lcvScore, 1)}</p>
          <p>Population: {formatInteger(tooltip.county.population)}</p>
        </div>
      ) : null}
    </div>
  );
}
