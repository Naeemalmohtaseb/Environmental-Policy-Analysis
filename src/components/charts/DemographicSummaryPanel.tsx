import type { DemographicSummary } from '../../data/derived';
import { formatDecimal, formatInteger } from '../../utils/format';

export function DemographicSummaryPanel({ summary }: { summary: DemographicSummary }) {
  if (!summary.totalCounties) {
    return <div className="chart-empty-state">No demographic summary data is available.</div>;
  }

  return (
    <div className="demographic-summary-grid">
      <div className="metric-tile">
        <p className="panel-eyebrow">Mean demographic burden</p>
        <p className="mt-2 font-mono text-2xl font-semibold">{formatDecimal(summary.meanDemographicBurden, 1)}</p>
      </div>
      <div className="metric-tile">
        <p className="panel-eyebrow">Mean SVI score</p>
        <p className="mt-2 font-mono text-2xl font-semibold">{formatDecimal(summary.meanSvi, 3)}</p>
      </div>
      <div className="metric-tile">
        <p className="panel-eyebrow">Counties with SVI</p>
        <p className="mt-2 font-mono text-2xl font-semibold">
          {formatInteger(summary.countiesWithSvi)} / {formatInteger(summary.totalCounties)}
        </p>
      </div>
      <div className="compact-card md:col-span-3">
        <p className="text-sm leading-6 text-muted">
          Current extract includes county demographic burden and SVI. Group-specific race and income exposure rates require
          tract-level fields and are not charted here.
        </p>
      </div>
    </div>
  );
}
