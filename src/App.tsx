import { useEffect, useState } from 'react';
import { analysisContent } from './content/analysisContent';
import {
  ChartContainer,
  CountyDetailCard,
  DashboardNav,
  DashboardPanel,
  DataPill,
  FilterControls,
  KpiCard,
  Legend,
  MethodStep,
  PlaceholderViz,
  PriorityTable,
  StatNote,
} from './components';

function App() {
  const { hero, kpis, navigation, sections, priorityCounties, methodSteps, footer } = analysisContent;
  const [activeSection, setActiveSection] = useState(navigation[0].id);

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

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div>
              <p className="panel-eyebrow">{hero.eyebrow}</p>
              <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
                {hero.title}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">{hero.subtitle}</p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{hero.summary}</p>
            </div>

            <div className="rounded-sm border border-line bg-panel p-4">
              <div className="flex flex-wrap gap-2">
                {hero.metadata.map((item) => (
                  <DataPill key={item}>{item}</DataPill>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-12 gap-1.5" aria-label="Map preview placeholder">
                {Array.from({ length: 48 }).map((_, index) => (
                  <span className={`map-cell shade-${index % 5}`} key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-5 sm:px-8" aria-label="Project metrics">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </section>

      <DashboardNav activeId={activeSection} items={navigation} />

      <div className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <DashboardPanel
          description={sections.map.description}
          eyebrow="Map"
          id="map"
          title={sections.map.title}
          aside={
            <>
              <FilterControls
                filters={[
                  { label: 'Metric', options: ['Gap score', 'Burden score', 'LCV score'] },
                  { label: 'Region', options: ['All states', 'South', 'Midwest', 'West', 'Northeast'] },
                ]}
              />
              <CountyDetailCard county={analysisContent.countyDetailPlaceholder} />
            </>
          }
        >
          <ChartContainer title="County choropleth placeholder" legend={<Legend />}>
            <PlaceholderViz variant="map" label="U.S. county map placeholder" />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.scatter.description}
          eyebrow="Relationship"
          id="relationship"
          title={sections.scatter.title}
          aside={
            <FilterControls
              filters={[
                { label: 'Color', options: ['Dominant party', 'Region', 'Gap threshold'] },
                { label: 'Size', options: ['Population', 'Tract count'] },
              ]}
            />
          }
        >
          <ChartContainer
            title="Burden score and voting score"
            legend={
              <Legend
                items={[
                  { color: 'bg-accent', label: 'Lower gap' },
                  { color: 'bg-burden-high', label: 'Higher gap' },
                ]}
              />
            }
          >
            <PlaceholderViz variant="scatter" label="Scatter plot placeholder" />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.priority.description}
          eyebrow="Priority counties"
          id="priority-counties"
          title={sections.priority.title}
          aside={<PriorityTable rows={priorityCounties} />}
        >
          <ChartContainer
            title="Ranked counties"
            controls={<FilterControls filters={[{ label: 'Rows', options: ['Top 10', 'Top 25', 'Top 50'] }]} />}
            legend={<Legend items={[{ color: 'bg-accent', label: 'Gap score' }]} />}
          >
            <PlaceholderViz variant="bars" label="Horizontal bar ranking placeholder" />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.states.description}
          eyebrow="State summary"
          id="state-summary"
          title={sections.states.title}
          aside={<StatNote title="Summary level">{sections.states.note}</StatNote>}
        >
          <ChartContainer
            title="State-level average gap"
            controls={<FilterControls filters={[{ label: 'Sort', options: ['Gap descending', 'Population', 'County count'] }]} />}
            legend={<Legend items={[{ color: 'bg-accent', label: 'State average' }]} />}
          >
            <PlaceholderViz variant="bars" label="State summary placeholder" />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.party.description}
          eyebrow="Party comparison"
          id="party-comparison"
          title={sections.party.title}
          aside={<StatNote title="Annotation">{sections.party.note}</StatNote>}
        >
          <ChartContainer
            title="Average gap by dominant party"
            controls={<FilterControls filters={[{ label: 'Measure', options: ['Mean gap', 'Median gap'], type: 'toggle' }]} />}
            legend={
              <Legend
                items={[
                  { color: 'bg-accent', label: 'Group A' },
                  { color: 'bg-burden-high', label: 'Group B' },
                ]}
              />
            }
          >
            <PlaceholderViz variant="grouped" label="Grouped comparison placeholder" />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.demographics.description}
          eyebrow="Demographics"
          id="demographics"
          title={sections.demographics.title}
          aside={sections.demographics.callouts.map((callout) => (
            <StatNote key={callout.title} title={callout.title}>
              {callout.text}
            </StatNote>
          ))}
        >
          <ChartContainer
            title="Exposure rate comparison"
            controls={<FilterControls filters={[{ label: 'Group', options: ['Race / ethnicity', 'Income', 'Combined'] }]} />}
            legend={
              <Legend
                items={[
                  { color: 'bg-accent', label: 'Baseline' },
                  { color: 'bg-burden-high', label: 'High burden' },
                ]}
              />
            }
          >
            <PlaceholderViz variant="dumbbell" label="Demographic exposure placeholder" />
          </ChartContainer>
        </DashboardPanel>

        <DashboardPanel
          description={sections.distribution.description}
          eyebrow="Distribution"
          id="distribution"
          title={sections.distribution.title}
          aside={<StatNote title="Threshold">{sections.distribution.note}</StatNote>}
        >
          <ChartContainer
            title="County gap score distribution"
            controls={<FilterControls filters={[{ label: 'Threshold', options: ['> 2 SD', 'Top decile', 'Top quartile'] }]} />}
            legend={<Legend items={[{ color: 'bg-accent', label: 'Counties' }, { color: 'bg-burden-high', label: 'Threshold' }]} />}
          >
            <PlaceholderViz variant="histogram" label="Distribution placeholder" />
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
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[0.7fr_1.3fr]">
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
