import type { CountyRecord } from './types';

export type StateSummary = {
  countyCount: number;
  meanBurden: number;
  meanGap: number;
  meanLcv: number;
  population: number;
  stateAbbrev: string;
  stateName: string;
};

export type PartySummary = {
  countyCount: number;
  meanBurden: number;
  meanGap: number;
  meanLcv: number;
  party: string;
  population: number;
};

export type HistogramBin = {
  count: number;
  end: number;
  start: number;
};

export type DemographicSummary = {
  countiesWithSvi: number;
  meanDemographicBurden: number | null;
  meanSvi: number | null;
  totalCounties: number;
};

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function validNumber(value: number | null | undefined): value is number {
  return value !== null && value !== undefined && !Number.isNaN(value);
}

export function getStateSummaries(counties: CountyRecord[]): StateSummary[] {
  const grouped = new Map<string, CountyRecord[]>();

  counties.forEach((county) => {
    const key = county.stateAbbrev || county.stateName;
    grouped.set(key, [...(grouped.get(key) ?? []), county]);
  });

  return Array.from(grouped.values())
    .map((rows) => ({
      countyCount: rows.length,
      meanBurden: mean(rows.map((row) => row.environmentalBurdenScore).filter(validNumber)),
      meanGap: mean(rows.map((row) => row.justiceGapScore).filter(validNumber)),
      meanLcv: mean(rows.map((row) => row.lcvScore).filter(validNumber)),
      population: rows.reduce((sum, row) => sum + (row.population ?? 0), 0),
      stateAbbrev: rows[0].stateAbbrev,
      stateName: rows[0].stateName,
    }))
    .sort((a, b) => b.meanGap - a.meanGap);
}

export function getPartySummaries(counties: CountyRecord[]): PartySummary[] {
  const grouped = new Map<string, CountyRecord[]>();

  counties.forEach((county) => {
    const key = county.dominantParty ?? 'Unknown';
    grouped.set(key, [...(grouped.get(key) ?? []), county]);
  });

  const order = ['D', 'R', 'I', 'Unknown'];

  return Array.from(grouped.entries())
    .map(([party, rows]) => ({
      countyCount: rows.length,
      meanBurden: mean(rows.map((row) => row.environmentalBurdenScore).filter(validNumber)),
      meanGap: mean(rows.map((row) => row.justiceGapScore).filter(validNumber)),
      meanLcv: mean(rows.map((row) => row.lcvScore).filter(validNumber)),
      party,
      population: rows.reduce((sum, row) => sum + (row.population ?? 0), 0),
    }))
    .sort((a, b) => order.indexOf(a.party) - order.indexOf(b.party));
}

export function getHistogramBins(counties: CountyRecord[], binCount = 28): HistogramBin[] {
  const values = counties.map((county) => county.justiceGapScore).filter(validNumber);
  if (!values.length) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (max - min) / binCount;

  return Array.from({ length: binCount }, (_, index) => {
    const start = min + step * index;
    const end = index === binCount - 1 ? max : start + step;
    const count = values.filter((value) => (index === binCount - 1 ? value >= start && value <= end : value >= start && value < end)).length;
    return { count, end, start };
  });
}

export function getDemographicSummary(counties: CountyRecord[]): DemographicSummary {
  const demographicValues = counties.map((county) => county.demographicBurdenWeighted).filter(validNumber);
  const sviValues = counties.map((county) => county.vulnerabilityScore).filter(validNumber);

  return {
    countiesWithSvi: sviValues.length,
    meanDemographicBurden: demographicValues.length ? mean(demographicValues) : null,
    meanSvi: sviValues.length ? mean(sviValues) : null,
    totalCounties: counties.length,
  };
}

export function getRegressionLine(counties: CountyRecord[]) {
  const points = counties
    .filter((county) => validNumber(county.lcvScore) && validNumber(county.environmentalBurdenScore))
    .map((county) => ({
      x: county.lcvScore as number,
      y: county.environmentalBurdenScore as number,
    }));

  if (points.length < 2) return null;

  const xMean = mean(points.map((point) => point.x));
  const yMean = mean(points.map((point) => point.y));
  const numerator = points.reduce((sum, point) => sum + (point.x - xMean) * (point.y - yMean), 0);
  const denominator = points.reduce((sum, point) => sum + (point.x - xMean) ** 2, 0);

  if (!denominator) return null;

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  return {
    x1: 0,
    x2: 100,
    y1: intercept,
    y2: slope * 100 + intercept,
  };
}
