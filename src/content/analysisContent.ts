export type Kpi = {
  label: string;
  value: string;
  description: string;
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
    { id: 'map', label: 'County Gap Map' },
    { id: 'relationship', label: 'Burden vs. Representation' },
    { id: 'priority-counties', label: 'Priority Counties' },
    { id: 'state-summary', label: 'State Summary' },
    { id: 'party-comparison', label: 'Party Comparison' },
    { id: 'demographics', label: 'Demographics' },
    { id: 'distribution', label: 'Gap Score Distribution' },
    { id: 'method', label: 'Method' },
  ],
  hero: {
    eyebrow: 'Data science / environmental policy',
    title: 'Environmental Justice Gap Analysis',
    subtitle: 'County-level ranking of environmental burden, social vulnerability, and state-average environmental voting score.',
    summary:
      'This dashboard is built from processed county records derived from EJSCREEN tracts, CDC SVI, and League of Conservation Voters scorecard data. In the current extract, LCV values are state-level delegation averages merged back to counties rather than district-level county scores.',
    metadata: ['Geospatial policy analysis', 'County dashboard', 'Public data integration'],
  },
  overview: {
    title: 'What this analysis shows',
    sentences: [
      'The justice gap compares local environmental burden with the level of environmental voting support attached to each county.',
      'It combines tract-level EJSCREEN indicators, county social vulnerability measures, and League of Conservation Voters scorecard data.',
      'Higher gap scores indicate counties with higher burden and lower environmental voting support. Lower scores indicate closer alignment between burden and support.',
      'The current dashboard uses state-average LCV delegation scores, so counties in the same state share the same voting-score value.',
      'Use the map to inspect counties, then compare burden, ranking, and state-level representation patterns across the other views.',
    ],
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
      description: 'County records scored for environmental burden and the current representation proxy.',
    },
    {
      label: 'Extreme-gap counties',
      value: '197',
      description: 'Counties with Justice Gap 2.0 score above 2.',
    },
    {
      label: 'Top-priority population',
      value: '11.5M',
      description: 'Population represented in the high-priority county summary.',
    },
    {
      label: 'Lawmakers scored',
      value: '548',
      description: 'LCV scorecard records used to build state-average delegation scores.',
    },
  ],
  sections: {
    map: {
      title: 'County Gap Map',
      description:
        'County-level map of justice gap score. Select a county to inspect burden, vulnerability, population, and state-average LCV metrics.',
    },
    scatter: {
      title: 'Burden vs. State-Average Voting Score',
      description: 'County-level comparison of environmental burden score and the state-average LCV delegation score.',
    },
    priority: {
      title: 'Top Counties by Gap Score',
      description: 'Highest-ranked counties by Justice Gap 2.0 score. Table and bars share the selected county state.',
    },
    states: {
      title: 'State Summary',
      description: 'Average county gap score by state.',
      note: 'State values summarize county patterns and do not replace county-level detail.',
    },
    party: {
      title: 'Gap by Dominant Party',
      description: 'Compares average county burden, gap score, and state-average LCV score across dominant party groups.',
      note: 'In the current extract, burden differs modestly across D and R counties, while the state-average LCV proxy differs sharply. Counties inherit the same LCV value as other counties in their state.',
    },
    demographics: {
      title: 'Demographic Exposure',
      description: 'Summary of demographic burden and SVI fields currently available in the dashboard extract.',
      callouts: [
        {
          title: 'Available fields',
          text: 'The county extract includes demographic burden score and SVI.',
        },
        {
          title: 'Not surfaced',
          text: 'Race and income exposure rates are not included in the current dashboard extract.',
        },
        {
          title: 'Next data pass',
          text: 'Group-specific exposure should be computed from tract-level source fields.',
        },
      ],
    },
    distribution: {
      title: 'Gap Score Distribution',
      description: 'Distribution of county-level gap scores. A selected county is marked when active.',
      note: 'The vertical threshold marks a Justice Gap 2.0 score of 2.',
    },
    methodology: {
      title: 'Methodology',
      description: 'Pipeline summary for tract aggregation, state-level LCV merging, score normalization, and county ranking.',
    },
  },
  methodSteps: [
    {
      title: 'EJSCREEN tract indicators',
      description:
        'Load tract-level environmental and demographic indicators.',
    },
    {
      title: 'County aggregation',
      description:
        'Aggregate tract scores to counties using population weights.',
    },
    {
      title: 'SVI and state-level LCV merge',
      description:
        'Join county vulnerability measures to state-average LCV delegation scores.',
    },
    {
      title: 'Gap score ranking',
      description:
        'Normalize measures, calculate gap scores, and rank counties using the current representation proxy.',
    },
  ],
  footer: {
    title: 'Project files and sources',
    description: 'County-level analytical dashboard using processed project outputs and public datasets.',
    items: [
      'Tools: Python, Pandas, GeoPandas, React, TypeScript, D3',
      'Sources: EPA EJSCREEN, CDC SVI, LCV scorecard, Census county geometry',
      'Current representation measure: state-average LCV delegation score merged to counties',
    ],
  },
};
