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
    { id: 'relationship', label: 'Burden vs. State LCV' },
    { id: 'priority-counties', label: 'Priority Counties' },
    { id: 'state-summary', label: 'State Pattern' },
    { id: 'party-comparison', label: 'Party Split' },
    { id: 'demographics', label: 'Demographics' },
    { id: 'distribution', label: 'Gap Score Distribution' },
    { id: 'method', label: 'Method' },
  ],
  hero: {
    eyebrow: 'Data science / environmental policy',
    title: 'Environmental Justice Gap Analysis',
    subtitle: 'County burden, social vulnerability, and a state-level environmental voting proxy.',
    summary:
      'This dashboard uses processed county records built from EJSCREEN tracts, CDC SVI, and League of Conservation Voters scorecard data. In the current extract, the LCV measure is a state-average delegation score merged back to counties, not a county- or district-level score.',
    metadata: ['Geospatial policy analysis', 'County dashboard', 'Public data integration'],
  },
  overview: {
    title: 'What this analysis shows',
    sentences: [
      'The justice gap compares county environmental burden with the environmental voting score attached to that county in the current extract.',
      'The burden side is county-level. The voting side is not: counties in the same state share the same state-average LCV delegation score.',
      'That matters for interpretation. In this dataset, burden varies within party geographies, while the LCV proxy is much more strongly structured by party and state.',
      'Higher gap scores indicate counties with higher burden and lower environmental voting support. Lower scores indicate closer alignment between burden and support.',
      'Use the map and comparison panels to separate county burden patterns from the state-level representation pattern.',
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
        'County map of the gap score, burden score, or the state-average LCV proxy. Use it to compare county burden patterns against the state-level voting structure.',
    },
    scatter: {
      title: 'Burden vs. State-Average LCV',
      description: 'County burden score against the state-average LCV delegation score. Vertical bands reflect the state-level merge.',
    },
    priority: {
      title: 'Top Counties by Gap Score',
      description: 'Highest-ranked counties by Justice Gap 2.0 score. The ranking combines county burden with the current state-level representation proxy.',
    },
    states: {
      title: 'State Pattern',
      description: 'Average county gap score by state. This view shows the state structure carried into the county results.',
      note: 'State means do not replace county detail, but they matter here because the current LCV measure is merged at the state level.',
    },
    party: {
      title: 'Representation Split by Party',
      description: 'Compares county burden, gap score, and the state-average LCV proxy across party groups. In the current extract, party is much more strongly associated with the LCV proxy than with burden.',
      note: 'This pattern is partly structural. Counties inherit the same LCV value as other counties in their state, so the party split reflects state-level delegation scores as much as county conditions.',
    },
    demographics: {
      title: 'Demographic Exposure',
      description: 'Summary of the demographic burden and SVI fields available in the current dashboard extract.',
      callouts: [
        {
          title: 'Available fields',
          text: 'The county extract includes a demographic burden score and SVI.',
        },
        {
          title: 'Missing fields',
          text: 'Race- and income-specific exposure rates are not included in the current dashboard extract.',
        },
        {
          title: 'Next step',
          text: 'Group-specific exposure measures would need to be computed from tract-level source fields.',
        },
      ],
    },
    distribution: {
      title: 'Gap Score Distribution',
      description: 'Distribution of county-level gap scores after combining county burden with the current state-level voting proxy.',
      note: 'The vertical threshold marks a Justice Gap 2.0 score of 2.',
    },
    methodology: {
      title: 'Methodology',
      description: 'Pipeline summary for tract aggregation, the state-level LCV merge, score normalization, and county ranking.',
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
        'Join county vulnerability measures to state-average LCV delegation scores. This is where the representation measure becomes state-level.',
    },
    {
      title: 'Gap score ranking',
      description:
        'Normalize the measures, calculate gap scores, and rank counties using the current representation proxy.',
    },
  ],
  footer: {
    title: 'Project files and sources',
    description: 'County dashboard for burden patterns, gap scores, and the current state-level representation proxy.',
    items: [
      'Tools: Python, Pandas, GeoPandas, React, TypeScript, D3',
      'Sources: EPA EJSCREEN, CDC SVI, LCV scorecard, Census county geometry',
      'Current representation measure: state-average LCV delegation score merged to counties',
    ],
  },
};
