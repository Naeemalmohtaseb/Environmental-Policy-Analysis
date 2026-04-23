import type { CountyRecord } from '../data/types';

export type MapMetric = 'justiceGapScore' | 'environmentalBurdenScore' | 'lcvScore';

export type MapScale = {
  breaks: number[];
  colors: string[];
};

const GAP_COLORS = ['#dbe7de', '#aac6bd', '#d7c98f', '#c38362', '#9f4f3f'];
const BURDEN_COLORS = ['#f3efe4', '#e6d6b8', '#d7b27c', '#bb7c52', '#7f4a32'];
const LCV_COLORS = ['#edf2f4', '#d3dfe3', '#a7c0c8', '#6f9caa', '#2f5d69'];

function getMetricValue(county: CountyRecord, metric: MapMetric): number | null {
  return county[metric] ?? null;
}

function getQuantile(values: number[], percentile: number): number {
  if (!values.length) return 0;
  const index = Math.min(values.length - 1, Math.max(0, Math.floor((values.length - 1) * percentile)));
  return values[index];
}

function dedupeAscending(values: number[]): number[] {
  const rounded = values.map((value) => Number(value.toFixed(6)));
  return rounded.filter((value, index) => index === 0 || value > rounded[index - 1]);
}

export function getMapScale(counties: CountyRecord[], metric: MapMetric): MapScale {
  const values = counties
    .map((county) => getMetricValue(county, metric))
    .filter((value): value is number => value !== null && value !== undefined && !Number.isNaN(value))
    .sort((a, b) => a - b);

  const colors = metric === 'lcvScore' ? LCV_COLORS : metric === 'environmentalBurdenScore' ? BURDEN_COLORS : GAP_COLORS;

  if (!values.length) {
    return { breaks: [], colors };
  }

  const breaks = dedupeAscending([0.2, 0.4, 0.6, 0.8].map((percentile) => getQuantile(values, percentile)));
  return { breaks, colors };
}

export function getMapColor(value: number | null | undefined, scale: MapScale): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '#edf0ea';
  const index = scale.breaks.findIndex((threshold) => value <= threshold);
  return scale.colors[index === -1 ? scale.colors.length - 1 : index];
}
