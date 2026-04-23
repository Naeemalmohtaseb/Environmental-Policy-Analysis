import { useMemo, useState, type ReactNode } from 'react';
import type { Kpi, MethodStepContent, NavItem } from '../content/analysisContent';
import type { CountyRecord } from '../data/types';
import { formatDecimal, formatInteger, formatParty, getGapLabel } from '../utils/format';

type DataPillProps = {
  children: ReactNode;
};

export function DataPill({ children }: DataPillProps) {
  return <span className="data-pill">{children}</span>;
}

type NavigationItemProps = {
  active: boolean;
  item: NavItem;
};

export function NavigationItem({ active, item }: NavigationItemProps) {
  return (
    <a className={`dashboard-nav-item ${active ? 'dashboard-nav-item-active' : ''}`} href={`#${item.id}`}>
      {item.label}
    </a>
  );
}

type DashboardNavProps = {
  activeId: string;
  items: NavItem[];
};

export function DashboardNav({ activeId, items }: DashboardNavProps) {
  return (
    <nav className="sticky-nav" aria-label="Dashboard sections">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-2 sm:px-8">
        {items.map((item) => (
          <NavigationItem active={activeId === item.id} item={item} key={item.id} />
        ))}
      </div>
    </nav>
  );
}

export function KpiCard({ label, value, description }: Kpi) {
  return (
    <article className="kpi-card">
      <p className="font-mono text-2xl font-semibold tracking-tight text-ink">{value}</p>
      <h3 className="mt-2 text-sm font-semibold text-ink">{label}</h3>
      <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
    </article>
  );
}

type SectionHeaderProps = {
  description: string;
  eyebrow?: string;
  title: string;
};

export function SectionHeader({ description, eyebrow, title }: SectionHeaderProps) {
  return (
    <header>
      {eyebrow ? <p className="panel-eyebrow">{eyebrow}</p> : null}
      <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </header>
  );
}

type DashboardPanelProps = {
  aside?: ReactNode;
  children: ReactNode;
  description: string;
  eyebrow?: string;
  id: string;
  title: string;
};

export function DashboardPanel({ aside, children, description, eyebrow, id, title }: DashboardPanelProps) {
  return (
    <section id={id} className="dashboard-panel subtle-fade">
      <div className="panel-copy">
        <SectionHeader description={description} eyebrow={eyebrow} title={title} />
        {aside ? <div className="mt-4 grid gap-3">{aside}</div> : null}
      </div>
      <div className="panel-visual">{children}</div>
    </section>
  );
}

type LegendProps = {
  items?: Array<{ color: string; label: string }>;
};

export function Legend({
  items = [
    { color: '#dbe7de', label: 'Lower' },
    { color: '#d7c98f', label: 'Middle' },
    { color: '#9f4f3f', label: 'Higher' },
  ],
}: LegendProps) {
  return (
    <div className="legend-row" aria-label="Placeholder legend">
      {items.map((item) => (
        <span className="flex items-center gap-1.5" key={item.label}>
          <span className="h-2.5 w-2.5 rounded-sm border border-line/60" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

type ChartContainerProps = {
  children: ReactNode;
  controls?: ReactNode;
  note?: ReactNode;
  selectionLabel?: string | null;
  legend?: ReactNode;
  title: string;
};

export function ChartContainer({ children, controls, legend, note, selectionLabel, title }: ChartContainerProps) {
  return (
    <article className="chart-container">
      <div className="chart-toolbar">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {controls}
      </div>
      {selectionLabel ? <div className="chart-selection-note border-b border-line pb-2 pt-0">{selectionLabel}</div> : null}
      {children}
      {note ? <div className="chart-note">{note}</div> : null}
      {legend ? <div className="chart-legend">{legend}</div> : null}
    </article>
  );
}

export function CountyDetailCard({ county, onClear }: { county: CountyRecord | null; onClear?: () => void }) {
  if (!county) {
    return (
      <aside className="compact-card">
        <p className="panel-eyebrow">Selected county</p>
        <h3 className="mt-2 text-lg font-semibold">No county selected</h3>
        <p className="mt-2 text-sm leading-6 text-muted">Select a county to inspect county-level burden and the current representation proxy.</p>
      </aside>
    );
  }

  const metrics = [
    { label: 'Gap score', value: formatDecimal(county.justiceGapScore, 2) },
    { label: 'National rank', value: `#${formatInteger(county.justiceGapRank)}` },
    { label: 'Population', value: formatInteger(county.population) },
    { label: 'Burden score', value: formatDecimal(county.environmentalBurdenScore, 1) },
    { label: 'Burden percentile', value: formatDecimal(county.burdenPercentile, 1) },
    { label: 'SVI score', value: formatDecimal(county.vulnerabilityScore, 3) },
    { label: 'State-average LCV score', value: formatDecimal(county.lcvScore, 1) },
    { label: 'Dominant party', value: formatParty(county.dominantParty) },
  ];

  return (
    <aside className="compact-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="panel-eyebrow">Selected county</p>
          <h3 className="mt-2 text-lg font-semibold">
            {county.countyName}, {county.stateAbbrev}
          </h3>
        </div>
        {onClear ? (
          <button className="control-button" onClick={onClear} type="button">
            Clear
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">{getGapLabel(county.justiceGapScore)}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div className="border-t border-line pt-2" key={metric.label}>
            <dt className="text-xs text-muted">{metric.label}</dt>
            <dd className="mt-1 font-mono text-sm text-ink">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export function StatNote({ children, title = 'Note' }: { children: ReactNode; title?: string }) {
  return (
    <div className="compact-card">
      <p className="panel-eyebrow">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{children}</p>
    </div>
  );
}

export function PriorityTable({
  onSelect,
  rows,
  selectedFips,
}: {
  onSelect?: (countyFips: string) => void;
  rows: CountyRecord[];
  selectedFips?: string | null;
}) {
  const [query, setQuery] = useState('');
  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter(
      (county) =>
        county.countyName.toLowerCase().includes(normalized) ||
        county.stateAbbrev.toLowerCase().includes(normalized) ||
        county.stateName.toLowerCase().includes(normalized),
    );
  }, [query, rows]);

  return (
    <div className="compact-card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold">County table</h3>
        <input
          aria-label="Search counties"
          className="table-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          type="search"
          value={query}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-2.5">Rank</th>
              <th className="px-4 py-2.5">County</th>
              <th className="px-4 py-2.5">State</th>
              <th className="px-4 py-2.5">Gap</th>
              <th className="px-4 py-2.5">Population</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((county) => (
              <tr
                className={`cursor-pointer border-t border-line/80 transition hover:bg-accent-pale/60 ${
                  selectedFips === county.countyFips ? 'selected-row' : ''
                }`}
                key={county.countyFips}
                onClick={() => onSelect?.(county.countyFips)}
              >
                <td className="px-4 py-2.5 font-mono text-xs">{formatInteger(county.justiceGapRank)}</td>
                <td className="px-4 py-2.5 font-medium">{county.countyName}</td>
                <td className="px-4 py-2.5 text-muted">{county.stateAbbrev}</td>
                <td className="px-4 py-2.5 font-mono">{formatDecimal(county.justiceGapScore, 2)}</td>
                <td className="px-4 py-2.5 text-muted">{formatInteger(county.population)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filteredRows.length ? <p className="border-t border-line px-4 py-3 text-sm text-muted">No matching counties.</p> : null}
    </div>
  );
}

export function MethodStep({ step, index }: { step: MethodStepContent; index: number }) {
  return (
    <article className="compact-card">
      <p className="font-mono text-xs text-accent-dark">0{index}</p>
      <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
    </article>
  );
}
