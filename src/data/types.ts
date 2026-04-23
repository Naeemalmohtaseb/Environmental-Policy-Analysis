export type CountyRecord = {
  burdenPercentile: number | null;
  countyFips: string;
  countyName: string;
  demographicBurdenWeighted: number | null;
  dominantParty: string | null;
  environmentalBurdenScore: number | null;
  environmentalBurdenWeighted: number | null;
  gapPercentile: number | null;
  justiceGapRank: number;
  justiceGapScore: number | null;
  lcvPercentile: number | null;
  lcvScore: number | null;
  lifetimeLcvScore: number | null;
  percentHighBurden: number | null;
  population: number | null;
  stateAbbrev: string;
  stateName: string;
  tractCount: number | null;
  vulnerabilityScore: number | null;
};

export type DashboardKpis = {
  countiesRanked: number;
  extremeGapCounties: number;
  lawmakersScored: number;
  residentsTop50Counties: number;
  sourceSummary?: Record<string, string>;
  tractsAnalyzed: number;
};

export type DashboardDataPayload = {
  counties: CountyRecord[];
  kpis: DashboardKpis;
  metadata: {
    generatedFrom: string[];
    recordCount: number;
  };
};

export type DashboardDataState = {
  counties: CountyRecord[];
  countyByFips: Map<string, CountyRecord>;
  error: string | null;
  kpis: DashboardKpis | null;
  loading: boolean;
};
