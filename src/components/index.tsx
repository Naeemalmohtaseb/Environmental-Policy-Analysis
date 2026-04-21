import type { ReactNode } from 'react';
import type { CountyDetail, Kpi, MethodStepContent, NavItem, PriorityCounty } from '../content/analysisContent';

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

type FilterControlsProps = {
  filters: Array<{ label: string; options?: string[]; type?: 'select' | 'toggle' }>;
};

export function FilterControls({ filters }: FilterControlsProps) {
  return (
    <div className="filter-row" aria-label="Placeholder filters">
      {filters.map((filter) =>
        filter.type === 'toggle' ? (
          <div className="segmented-control" key={filter.label}>
            {(filter.options ?? ['On', 'Off']).map((option, index) => (
              <button className={index === 0 ? 'segmented-active' : ''} key={option} type="button">
                {option}
              </button>
            ))}
          </div>
        ) : (
          <label className="filter-select" key={filter.label}>
            <span>{filter.label}</span>
            <select defaultValue={filter.options?.[0] ?? 'All'}>
              {(filter.options ?? ['All']).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        ),
      )}
    </div>
  );
}

type LegendProps = {
  items?: Array<{ color: string; label: string }>;
};

export function Legend({
  items = [
    { color: 'bg-burden-low', label: 'Lower' },
    { color: 'bg-burden-mid', label: 'Middle' },
    { color: 'bg-burden-high', label: 'Higher' },
  ],
}: LegendProps) {
  return (
    <div className="legend-row" aria-label="Placeholder legend">
      {items.map((item) => (
        <span className="flex items-center gap-1.5" key={item.label}>
          <span className={`h-2.5 w-2.5 rounded-sm ${item.color}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

type ChartContainerProps = {
  children: ReactNode;
  controls?: ReactNode;
  legend?: ReactNode;
  title: string;
};

export function ChartContainer({ children, controls, legend, title }: ChartContainerProps) {
  return (
    <article className="chart-container">
      <div className="chart-toolbar">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {controls}
      </div>
      {children}
      {legend ? <div className="chart-legend">{legend}</div> : null}
    </article>
  );
}

type PlaceholderVizProps = {
  label: string;
  variant: 'map' | 'scatter' | 'bars' | 'grouped' | 'dumbbell' | 'histogram';
};

export function PlaceholderViz({ label, variant }: PlaceholderVizProps) {
  return (
    <div className={`placeholder-viz placeholder-${variant}`}>
      <span className="placeholder-label">{label}</span>
      {variant === 'scatter' ? <ScatterMarks /> : null}
      {variant === 'bars' ? <BarMarks /> : null}
      {variant === 'grouped' ? <GroupedMarks /> : null}
      {variant === 'dumbbell' ? <DumbbellMarks /> : null}
      {variant === 'histogram' ? <HistogramMarks /> : null}
      {variant === 'map' ? <MapMarks /> : null}
    </div>
  );
}

function ScatterMarks() {
  return (
    <div className="absolute inset-8">
      {Array.from({ length: 28 }).map((_, index) => (
        <span
          className="absolute h-2.5 w-2.5 rounded-full bg-accent/55 transition hover:bg-accent-dark"
          key={index}
          style={{ left: `${8 + ((index * 17) % 82)}%`, top: `${12 + ((index * 29) % 74)}%` }}
        />
      ))}
    </div>
  );
}

function BarMarks() {
  return (
    <div className="absolute inset-x-8 bottom-8 top-14 flex flex-col justify-end gap-2.5">
      {[84, 76, 64, 57, 43, 35, 28].map((width) => (
        <span className="h-4 rounded-sm bg-accent/45 transition hover:bg-accent" key={width} style={{ width: `${width}%` }} />
      ))}
    </div>
  );
}

function GroupedMarks() {
  return (
    <div className="absolute inset-x-8 bottom-8 top-14 grid grid-cols-4 items-end gap-5">
      {[65, 40, 72, 38].map((height, index) => (
        <div className="flex items-end justify-center gap-1" key={height}>
          <span className="w-5 rounded-t-sm bg-accent/55" style={{ height: `${height}%` }} />
          <span className="w-5 rounded-t-sm bg-burden-high/70" style={{ height: `${index % 2 ? 62 : 35}%` }} />
        </div>
      ))}
    </div>
  );
}

function DumbbellMarks() {
  return (
    <div className="absolute inset-x-8 bottom-10 top-14 flex flex-col justify-around">
      {[22, 37, 51].map((start, index) => (
        <div className="relative h-px bg-line" key={start}>
          <span className="absolute -top-1.5 h-3 w-3 rounded-full bg-accent" style={{ left: `${start}%` }} />
          <span className="absolute -top-1.5 h-3 w-3 rounded-full bg-burden-high" style={{ left: `${start + 28 - index * 4}%` }} />
        </div>
      ))}
    </div>
  );
}

function HistogramMarks() {
  return (
    <div className="absolute inset-x-8 bottom-8 top-14 flex items-end gap-1.5">
      {[18, 30, 44, 64, 78, 70, 56, 38, 25, 16, 10, 8].map((height) => (
        <span className="flex-1 rounded-t-sm bg-accent/45 transition hover:bg-accent" key={height} style={{ height: `${height}%` }} />
      ))}
      <span className="absolute bottom-0 top-0 left-[78%] border-l border-dashed border-burden-high" />
    </div>
  );
}

function MapMarks() {
  return (
    <div className="absolute inset-6 grid grid-cols-12 gap-1.5">
      {Array.from({ length: 108 }).map((_, index) => (
        <span className={`rounded-[2px] map-cell shade-${index % 5}`} key={index} />
      ))}
    </div>
  );
}

export function CountyDetailCard({ county }: { county: CountyDetail }) {
  return (
    <aside className="compact-card">
      <p className="panel-eyebrow">Selected county</p>
      <h3 className="mt-2 text-lg font-semibold">{county.name}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{county.description}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {county.metrics.map((metric) => (
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

export function PriorityTable({ rows }: { rows: PriorityCounty[] }) {
  return (
    <div className="compact-card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold">County table</h3>
        <input className="table-search" placeholder="Search" type="search" />
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
            {rows.map((county) => (
              <tr className="border-t border-line/80 transition hover:bg-accent-pale/60" key={county.rank}>
                <td className="px-4 py-2.5 font-mono text-xs">{county.rank}</td>
                <td className="px-4 py-2.5 font-medium">{county.county}</td>
                <td className="px-4 py-2.5 text-muted">{county.state}</td>
                <td className="px-4 py-2.5 font-mono">{county.gap}</td>
                <td className="px-4 py-2.5 text-muted">{county.population}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
