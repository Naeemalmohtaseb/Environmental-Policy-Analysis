import { useEffect, useMemo, useState } from 'react';
import { analysisContent } from './content/analysisContent';
import {
  ChartContainer,
  CountyDetailCard,
  DashboardNav,
  DashboardPanel,
  DataPill,
  KpiCard,
  Legend,
  MethodStep,
  PriorityTable,
  StatNote,
} from './components';
import { CountyGapMap } from './components/CountyGapMap';
import { CountyRankChart } from './components/charts/CountyRankChart';
import { DemographicSummaryPanel } from './components/charts/DemographicSummaryPanel';
import { GapDistributionChart } from './components/charts/GapDistributionChart';
import { PartyComparisonChart } from './components/charts/PartyComparisonChart';
import { ScatterPlot } from './components/charts/ScatterPlot';
import { StateSummaryChart } from './components/charts/StateSummaryChart';
import { getDemographicSummary, getHistogramBins, getPartySummaries, getStateSummaries } from './data/derived';
import { useDashboardData } from './data/useDashboardData';
import { getMapScale, type MapMetric } from './utils/mapScale';
import { formatCompact, formatDecimal, formatInteger } from './utils/format';
type ScatterColorMode = 'gap' | 'party';
type ScatterSizeMode = 'population' | 'uniform';
type StateSortMode = 'gap' | 'population' | 'counties';
type PartyMeasure = 'meanGap' | 'meanLcv' | 'meanBurden';

function App() {
  const { hero, kpis: fallbackKpis, navigation, overview, sections, methodSteps, footer } = analysisContent;
  const { counties, countyByFips, error, kpis, loading } = useDashboardData();
  const [activeSection, setActiveSection] = useState(navigation[0].id);
  const [hoveredFips, setHoveredFips] = useState<string | null>(null);
  const [selectedFips, setSelectedFips] = useState<string | null>(null);
  const [mapMetric, setMapMetric] = useState<MapMetric>('justiceGapScore');
  const [scatterColorMode, setScatterColorMode] = useState<ScatterColorMode>('gap');
  const [scatterSizeMode, setScatterSizeMode] = useState<ScatterSizeMode>('population');
  const [stateSortMode, setStateSortMode] = useState<StateSortMode>('gap');
  const [partyMeasure, setPartyMeasure] = useState<PartyMeasure>('meanGap');
  const [topCountyCount, setTopCountyCount] = useState(10);
  const [distributionLookup, setDistributionLookup] = useState('');

  useEffect(() => {
    const observers = navigation.map((item) => {
      const element = document.getElementById(item.id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(item.id);
          }
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [navigation]);

  const displayedKpis = useMemo(() => {
    if (!kpis) return fallbackKpis;

    return [
      {
        label: 'Tracts analyzed',
        value: formatCompact(kpis.tractsAnalyzed),
        description: 'EJSCREEN tract records used for county aggregation.',
      },
      {
        label: 'Counties ranked',
        value: formatInteger(kpis.countiesRanked),
        description: 'County records with burden scores and the current representation proxy.',
      },
      {
        label: 'Extreme-gap counties',
        value: formatInteger(kpis.extremeGapCounties),
        description: 'Counties with Justice Gap 2.0 score above 2.',
      },
      {
        label: 'Residents in top 50',
        value: formatCompact(kpis.residentsTop50Counties),
        description: 'Total population across the 50 highest gap-score counties.',
      },
      {
        label: 'Lawmakers scored',
        value: formatInteger(kpis.lawmakersScored),
        description: 'LCV scorecard records parsed to build state-average delegation scores.',
      },
    ];
  }, [fallbackKpis, kpis]);

  const selectedCounty = selectedFips ? countyByFips.get(selectedFips) ?? null : null;
  const topCounties = useMemo(() => counties.slice(0, topCountyCount), [counties, topCountyCount]);
  const stateSummaries = useMemo(() => {
    const summaries = [...getStateSummaries(counties)];
    if (stateSortMode === 'population') {
      return summaries.sort((a, b) => b.population - a.population).slice(0, 15);
    }
    if (stateSortMode === 'counties') {
      return summaries.sort((a, b) => b.countyCount - a.countyCount).slice(0, 15);
    }
    return summaries.sort((a, b) => b.meanGap - a.meanGap).slice(0, 15);
  }, [counties, stateSortMode]);
  const partySummaries = useMemo(() => getPartySummaries(counties), [counties]);
  const histogramBins = useMemo(() => getHistogramBins(counties), [counties]);
  const demographicSummary = useMemo(() => getDemographicSummary(counties), [counties]);
  const mapScale = useMemo(() => getMapScale(counties, mapMetric), [counties, mapMetric]);
  const selectedCountyLabel = selectedCounty ? `Selected: ${selectedCounty.countyName}, ${selectedCounty.stateAbbrev}` : null;
  const distributionLookupOptions = useMemo(
    () => counties.map((county) => `${county.countyName}, ${county.stateAbbrev}`).sort((a, b) => a.localeCompare(b)),
    [counties],
  );
  const distributionCounty = useMemo(() => {
    const normalized = distributionLookup.trim().toLowerCase();
    if (!normalized) return null;
    return counties.find((county) => `${county.countyName}, ${county.stateAbbrev}`.toLowerCase() === normalized) ?? null;
  }, [counties, distributionLookup]);
  const distributionLabel = distributionCounty
    ? `Lookup: ${distributionCounty.countyName}, ${distributionCounty.stateAbbrev}`
    : distributionLookup.trim()
      ? 'No exact county match.'
      : null;
  const mapLegendItems = useMemo(() => {
    const digits = mapMetric === 'justiceGapScore' ? 2 : 1;
    const labels =
      mapMetric === 'lcvScore'
        ? ['Lowest state-average LCV', 'Low', 'Mid', 'High', 'Highest']
        : mapMetric === 'environmentalBurdenScore'
          ? ['Lowest burden', 'Low', 'Mid', 'High', 'Highest burden']
          : ['Lowest gap', 'Low', 'Mid', 'High', 'Highest gap'];

    const lowerBound = counties
      .map((county) => county[mapMetric])
      .filter((value): value is number => value !== null && value !== undefined && !Number.isNaN(value))
      .sort((a, b) => a - b)[0];

    const bounds = [lowerBound, ...mapScale.breaks].filter((value): value is number => value !== undefined);
    const items = mapScale.colors.map((color, index) => {
      const start = bounds[index];
      const end = mapScale.breaks[index];
      const rangeLabel =
        index === 0
          ? `<= ${formatDecimal(end, digits)}`
          : end !== undefined
            ? `${formatDecimal(start, digits)} to ${formatDecimal(end, digits)}`
            : `>= ${formatDecimal(bounds[index], digits)}`;
      return {
        color,
        label: `${labels[index]} (${rangeLabel})`,
      };
    });
    return [...items, { color: '#edf0ea', label: 'No data' }];
  }, [counties, mapMetric, mapScale]);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="max-w-5xl">
            <p className="panel-eyebrow">{hero.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              {hero.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">{hero.subtitle}</p>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">{hero.summary}</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8" aria-labelledby="overview-title">
        <div className="rounded-sm border border-line bg-panel p-4 sm:p-5">
          <p className="panel-eyebrow">Project summary</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink" id="overview-title">
            {overview.title}
          </h2>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {overview.sentences.map((sentence) => (
              <p className="text-sm leading-6 text-slate-700" key={sentence}>
                {sentence}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8" aria-label="Project metrics">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {displayedKpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </section>

      <DashboardNav activeId={activeSection} items={navigation} />

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <DashboardPanel
          description={sections.map.description}
          eyebrow="County Gap Map"
          id="map"
          title={sections.map.title}
          aside={
            <>
              {loading ? <StatNote title="Data">Loading county records.</StatNote> : null}
              {error ? <StatNote title="Data error">{error}</StatNote> : null}
              <CountyDetailCard county={selectedCounty} onClear={() => setSelectedFips(null)} />
            </>
          }
        >
          <ChartContainer
            title="County choropleth"
            controls={
              <div className="flex flex-wrap items-center gap-2">
                <label className="filter-select">
                  <span>Metric</span>
                  <select aria-label="Map metric" onChange={(event) => setMapMetric(event.target.value as MapMetric)} value={mapMetric}>
                    <option value="justiceGapScore">Gap score</option>
                    <option value="environmentalBurdenScore">Burden score</option>
                    <option value="lcvScore">State-average LCV score</option>
                  </select>
                </label>
                <button className="control-button" onClick={() => setSelectedFips(null)} type="button">
                  Reset selection
                </button>
              </div>
            }
            note="Map colors use metric-specific quintile breaks. Higher gap scores indicate counties with higher environmental burden and lower environmental voting support. LCV values in this dashboard are state-average delegation scores."
            selectionLabel={selectedCountyLabel}
            legend={<Legend items={mapLegendItems} />}
          >
            {error ? (
              <div className="map-empty-state">
                <p>Unable to load county map data.</p>
              </div>
            ) : (
              <CountyGapMap
                countyByFips={countyByFips}
                hoveredFips={hoveredFips}
                metric={mapMetric}
                onHover={setHoveredFips}
                onSelect={setSelectedFips}
                scale={mapScale}
                selectedFips={selectedFips}
              />
            )}
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.scatter.description}
          eyebrow="Burden vs. State-Average Voting Score"
          id="relationship"
          title={sections.scatter.title}
          aside={
            <StatNote title="View note">
              This compares county burden to a state-average LCV delegation score, so counties in the same state share the same x-axis value. The trend line is descriptive, not causal.
            </StatNote>
          }
        >
          <ChartContainer
            title="Burden vs. state-average LCV score"
            controls={
              <div className="flex flex-wrap items-center gap-2">
                <label className="filter-select">
                  <span>Color</span>
                  <select aria-label="Scatter color mode" onChange={(event) => setScatterColorMode(event.target.value as ScatterColorMode)} value={scatterColorMode}>
                    <option value="gap">Gap score</option>
                    <option value="party">Dominant party</option>
                  </select>
                </label>
                <label className="filter-select">
                  <span>Size</span>
                  <select aria-label="Scatter size mode" onChange={(event) => setScatterSizeMode(event.target.value as ScatterSizeMode)} value={scatterSizeMode}>
                    <option value="population">Population</option>
                    <option value="uniform">Uniform</option>
                  </select>
                </label>
              </div>
            }
            note={scatterSizeMode === 'uniform' ? 'Points use a uniform marker size.' : 'Point size represents population.'}
            selectionLabel={selectedCountyLabel}
            legend={
              scatterColorMode === 'party' ? (
                <Legend items={[{ color: '#5f8ea5', label: 'D' }, { color: '#b98272', label: 'R' }, { color: '#7f9f86', label: 'I' }]} />
              ) : (
                <Legend
                  items={[
                    { color: '#8fb6ad', label: 'Lower gap' },
                    { color: '#d7c98f', label: 'Middle' },
                    { color: '#9f4f3f', label: 'Higher gap' },
                  ]}
                />
              )
            }
          >
            <ScatterPlot
              colorMode={scatterColorMode}
              counties={counties}
              onHover={setHoveredFips}
              onSelect={setSelectedFips}
              selectedFips={selectedFips}
              sizeMode={scatterSizeMode}
            />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.priority.description}
          eyebrow="Top Counties by Gap Score"
          id="priority-counties"
          title={sections.priority.title}
          aside={<PriorityTable rows={topCounties} onSelect={setSelectedFips} selectedFips={selectedFips} />}
        >
          <ChartContainer
            title={`Top ${topCountyCount} counties by gap score`}
            controls={
              <label className="filter-select">
                <span>Rows</span>
                <select aria-label="Top county row count" onChange={(event) => setTopCountyCount(Number(event.target.value))} value={topCountyCount}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </label>
            }
            selectionLabel={selectedCountyLabel}
          >
            <CountyRankChart counties={topCounties} onSelect={setSelectedFips} selectedFips={selectedFips} />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.states.description}
          eyebrow="State Summary"
          id="state-summary"
          title={sections.states.title}
          aside={<StatNote title="Summary level">{sections.states.note}</StatNote>}
        >
          <ChartContainer
            title="State-level average gap"
            controls={
              <label className="filter-select">
                <span>Sort</span>
                <select aria-label="State summary sort" onChange={(event) => setStateSortMode(event.target.value as StateSortMode)} value={stateSortMode}>
                  <option value="gap">Gap score</option>
                  <option value="population">Population</option>
                  <option value="counties">County count</option>
                </select>
              </label>
            }
          >
            <StateSummaryChart states={stateSummaries} />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.party.description}
          eyebrow="Gap by Dominant Party"
          id="party-comparison"
          title={sections.party.title}
          aside={<StatNote title="Annotation">{sections.party.note}</StatNote>}
        >
          <ChartContainer
            title="Average gap by dominant party"
            controls={
              <label className="filter-select">
                <span>Measure</span>
                <select aria-label="Party comparison measure" onChange={(event) => setPartyMeasure(event.target.value as PartyMeasure)} value={partyMeasure}>
                  <option value="meanGap">Gap score</option>
                  <option value="meanLcv">State-average LCV score</option>
                  <option value="meanBurden">Burden score</option>
                </select>
              </label>
            }
            legend={
              <Legend
                items={[
                  { color: '#5f8ea5', label: 'D' },
                  { color: '#b98272', label: 'R' },
                  { color: '#7f9f86', label: 'I' },
                ]}
              />
            }
          >
            <PartyComparisonChart measure={partyMeasure} parties={partySummaries} />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.demographics.description}
          eyebrow="Demographic Exposure"
          id="demographics"
          title={sections.demographics.title}
          aside={sections.demographics.callouts.map((callout) => (
            <StatNote key={callout.title} title={callout.title}>
              {callout.text}
            </StatNote>
          ))}
        >
          <ChartContainer title="Available demographic fields">
            <DemographicSummaryPanel summary={demographicSummary} />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.distribution.description}
          eyebrow="Gap Score Distribution"
          id="distribution"
          title={sections.distribution.title}
          aside={<StatNote title="Threshold">{sections.distribution.note}</StatNote>}
        >
          <ChartContainer
            title="County gap score distribution"
            controls={
              <div className="flex flex-wrap items-center gap-2">
                <label className="filter-select">
                  <span>County lookup</span>
                  <input
                    aria-label="Distribution county lookup"
                    className="bg-transparent text-xs font-medium text-ink outline-none"
                    list="distribution-county-options"
                    onChange={(event) => setDistributionLookup(event.target.value)}
                    placeholder="County, ST"
                    type="text"
                    value={distributionLookup}
                  />
                </label>
                <datalist id="distribution-county-options">
                  {distributionLookupOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
                <button className="control-button" onClick={() => setDistributionLookup('')} type="button">
                  Clear lookup
                </button>
              </div>
            }
            note="Right tail represents counties with the highest gap scores."
            selectionLabel={distributionLabel}
            legend={<Legend items={[{ color: '#2f6f68', label: 'Counties' }, { color: '#9f4f3f', label: 'Threshold' }]} />}
          >
            <GapDistributionChart bins={histogramBins} selectedCounty={distributionCounty} />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.methodology.description}
          eyebrow="Method"
          id="method"
          title={sections.methodology.title}
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {methodSteps.map((step, index) => (
              <MethodStep key={step.title} step={step} index={index + 1} />
            ))}
          </div>
        </DashboardPanel>
      </div>

      <footer className="border-t border-line bg-panel">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <div>
            <p className="panel-eyebrow">Tools and sources</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">{footer.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{footer.description}</p>
          </div>
          <div className="flex flex-wrap content-start gap-2">
            {footer.items.map((item) => (
              <DataPill key={item}>{item}</DataPill>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
