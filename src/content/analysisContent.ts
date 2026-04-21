export type Kpi = {
  label: string;
  value: string;
  description: string;
};

export type CountyDetail = {
  name: string;
  description: string;
  metrics: Array<{ label: string; value: string }>;
};

export type MethodStepContent = {
  title: string;
  description: string;
};

export type NavItem = {
  id: string;
  label: string;
};

export type PriorityCounty = {
  county: string;
  gap: string;
  population: string;
  rank: string;
  state: string;
};

export const analysisContent = {
  navigation: [
    { id: 'map', label: 'Map' },
    { id: 'relationship', label: 'Relationship' },
    { id: 'priority-counties', label: 'Priority Counties' },
    { id: 'state-summary', label: 'State Summary' },
    { id: 'party-comparison', label: 'Party Comparison' },
    { id: 'demographics', label: 'Demographics' },
    { id: 'distribution', label: 'Distribution' },
    { id: 'method', label: 'Method' },
  ],
  hero: {
    eyebrow: 'Data science / environmental policy',
    title: 'Environmental Justice Gap Analysis',
    subtitle:
      'County-level gap between environmental burden, social vulnerability, and environmental voting score.',
    summary:
      'The project combines tract aggregation, vulnerability data, LCV scorecard records, and geospatial context. The interface is structured for inspection of map, ranking, relationship, and distribution views.',
    metadata: ['Python', 'GeoPandas', 'EJSCREEN', 'CDC SVI', 'LCV scorecard', 'React dashboard scaffold'],
  },
  kpis: [
    {
      label: 'Census tracts analyzed',
      value: '86K+',
      description: 'EJSCREEN tract records aggregated into county-level burden measures.',
    },
    {
      label: 'Counties ranked',
      value: '3.5K+',
      description: 'County records scored for environmental burden and representation.',
    },
    {
      label: 'Extreme-gap counties',
      value: '197',
      description: 'Counties above the current placeholder threshold.',
    },
    {
      label: 'Top-priority population',
      value: '11.5M',
      description: 'Population represented in the high-priority county summary.',
    },
    {
      label: 'Lawmakers scored',
      value: '548',
      description: 'LCV scorecard records used for environmental voting context.',
    },
  ],
  sections: {
    map: {
      title: 'County Gap Map',
      description:
        'County-level choropleth shell for gap score, burden score, and representation score. Filters and county detail are placeholders for the next data pass.',
    },
    scatter: {
      title: 'Burden vs. Representation',
      description:
        'Scatter shell comparing environmental burden with environmental voting score. Color and size controls are reserved for later wiring.',
    },
    priority: {
      title: 'Top Counties by Gap Score',
      description:
        'Ranked view for counties with the highest gap scores. The table is a structural placeholder for filtering and row selection.',
    },
    states: {
      title: 'State Summary',
      description:
        'State-level summary of county gap scores. This is a grouping layer, not a substitute for county-level inspection.',
      note:
        'Future wiring can link state selections to county filters and map focus.',
    },
    party: {
      title: 'Gap by Dominant Party',
      description:
        'Grouped comparison shell for average gap score by dominant party representation.',
      note:
        'Reserved for statistical annotation such as confidence intervals or test results.',
    },
    demographics: {
      title: 'Demographic Exposure',
      description:
        'Placeholder comparison of high-burden exposure rates by demographic group.',
      callouts: [
        {
          title: 'Exposure rate',
          text: 'Reserved for high-burden exposure percentages by group.',
        },
        {
          title: 'Disparity ratio',
          text: 'Reserved for relative exposure ratios against the baseline population.',
        },
        {
          title: 'Interpretation',
          text: 'Use descriptive wording and avoid unsupported causal claims.',
        },
      ],
    },
    distribution: {
      title: 'Gap Score Distribution',
      description:
        'Histogram shell for the full gap score range, including the threshold used for high-gap classification.',
      note:
        'The threshold marker will use the final cutoff once real data is wired in.',
    },
    methodology: {
      title: 'Methodology',
      description:
        'Pipeline overview for tract aggregation, data joins, score normalization, and county ranking.',
    },
  },
  priorityCounties: [
    { rank: '01', county: 'Muskogee County', state: 'OK', gap: '3.92', population: '66,606' },
    { rank: '02', county: 'Buffalo County', state: 'SD', gap: '3.87', population: '1,859' },
    { rank: '03', county: 'Todd County', state: 'SD', gap: '3.84', population: '9,353' },
    { rank: '04', county: 'Seminole County', state: 'OK', gap: '3.81', population: '23,592' },
    { rank: '05', county: 'Texas County', state: 'OK', gap: '3.80', population: '21,144' },
  ],
  countyDetailPlaceholder: {
    name: 'Selected county',
    description:
      'Hover and click details will appear here once the county map and linked interactions are implemented.',
    metrics: [
      { label: 'Gap score', value: '--' },
      { label: 'Burden score', value: '--' },
      { label: 'LCV score', value: '--' },
      { label: 'Population', value: '--' },
    ],
  },
  methodSteps: [
    {
      title: 'EJSCREEN tract indicators',
      description:
        'Load tract-level environmental and demographic indicators from EPA EJSCREEN.',
    },
    {
      title: 'County aggregation',
      description:
        'Aggregate tract scores to counties using population-weighted burden measures.',
    },
    {
      title: 'SVI and LCV merge',
      description:
        'Join social vulnerability measures and environmental voting scores using consistent geography.',
    },
    {
      title: 'Gap score ranking',
      description:
        'Normalize burden and representation metrics, calculate gap scores, and rank counties.',
    },
  ],
  footer: {
    title: 'Project files and sources',
    description:
      'Single-page dashboard scaffold prepared for map implementation, chart wiring, and data integration.',
    items: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Python',
      'Pandas',
      'GeoPandas',
      'Plotly Dash',
      'EPA EJSCREEN',
      'CDC SVI',
      'LCV scorecard',
      'Census shapefiles',
    ],
  },
};
