import type { HistogramBin } from '../../data/derived';
import type { CountyRecord } from '../../data/types';
import { formatDecimal, formatInteger } from '../../utils/format';

type GapDistributionChartProps = {
  bins: HistogramBin[];
  selectedCounty: CountyRecord | null;
};

const WIDTH = 760;
const HEIGHT = 310;
const MARGIN = { bottom: 40, left: 46, right: 24, top: 22 };
const THRESHOLD = 2;

function scale(value: number, domain: [number, number], range: [number, number]) {
  const ratio = (value - domain[0]) / (domain[1] - domain[0]);
  return range[0] + ratio * (range[1] - range[0]);
}

export function GapDistributionChart({ bins, selectedCounty }: GapDistributionChartProps) {
  if (!bins.length) return <div className="chart-empty-state">No distribution data is available.</div>;

  const min = bins[0].start;
  const max = bins[bins.length - 1].end;
  const maxCount = Math.max(...bins.map((bin) => bin.count), 1);
  const thresholdX = scale(THRESHOLD, [min, max], [MARGIN.left, WIDTH - MARGIN.right]);
  const selectedX =
    selectedCounty?.justiceGapScore !== null && selectedCounty?.justiceGapScore !== undefined
      ? scale(selectedCounty.justiceGapScore, [min, max], [MARGIN.left, WIDTH - MARGIN.right])
      : null;

  return (
    <div className="chart-svg-wrap">
      <svg className="chart-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Gap score histogram">
        {[min, 0, THRESHOLD, max].map((tick) => {
          const x = scale(tick, [min, max], [MARGIN.left, WIDTH - MARGIN.right]);
          return (
            <g key={tick}>
              <line className="chart-grid" x1={x} x2={x} y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} />
              <text className="chart-tick" x={x} y={HEIGHT - 15} textAnchor="middle">
                {formatDecimal(tick, 1)}
              </text>
            </g>
          );
        })}
        {bins.map((bin) => {
          const x1 = scale(bin.start, [min, max], [MARGIN.left, WIDTH - MARGIN.right]);
          const x2 = scale(bin.end, [min, max], [MARGIN.left, WIDTH - MARGIN.right]);
          const height = scale(bin.count, [0, maxCount], [0, HEIGHT - MARGIN.top - MARGIN.bottom]);
          return (
            <rect
              className="histogram-bar"
              height={height}
              key={`${bin.start}-${bin.end}`}
              width={Math.max(x2 - x1 - 1, 1)}
              x={x1}
              y={HEIGHT - MARGIN.bottom - height}
            >
              <title>
                {formatDecimal(bin.start, 2)} to {formatDecimal(bin.end, 2)}: {formatInteger(bin.count)} counties
              </title>
            </rect>
          );
        })}
        <line className="threshold-line" x1={thresholdX} x2={thresholdX} y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} />
        <text className="chart-value-label" x={thresholdX + 6} y={MARGIN.top + 12}>
          gap {formatDecimal(THRESHOLD, 0)}
        </text>
        {selectedX !== null ? (
          <>
            <line className="selected-line" x1={selectedX} x2={selectedX} y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} />
            <text className="chart-value-label" x={selectedX + 6} y={HEIGHT - MARGIN.bottom - 8}>
              selected
            </text>
          </>
        ) : null}
      </svg>
      {selectedCounty ? (
        <div className="chart-selection-note">
          Selected county gap: {formatDecimal(selectedCounty.justiceGapScore, 2)}
        </div>
      ) : (
        <div className="chart-selection-note">Use county lookup to show one county in the distribution.</div>
      )}
    </div>
  );
}
