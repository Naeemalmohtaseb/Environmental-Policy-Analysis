import { useEffect, useMemo, useState } from 'react';
import type { CountyRecord, DashboardDataPayload, DashboardDataState } from './types';

const DATA_URL = '/data/dashboard-counties.json';

function normalizeCounty(record: CountyRecord): CountyRecord {
  return {
    ...record,
    countyFips: record.countyFips.padStart(5, '0'),
  };
}

export function useDashboardData(): DashboardDataState {
  const [payload, setPayload] = useState<DashboardDataPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch(DATA_URL);

        if (!response.ok) {
          throw new Error(`Data request failed with status ${response.status}`);
        }

        const data = (await response.json()) as DashboardDataPayload;

        if (!cancelled) {
          setPayload({
            ...data,
            counties: data.counties.map(normalizeCounty),
          });
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load dashboard data');
          setPayload(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const countyByFips = useMemo(() => {
    const lookup = new Map<string, CountyRecord>();
    payload?.counties.forEach((county) => lookup.set(county.countyFips, county));
    return lookup;
  }, [payload]);

  return {
    counties: payload?.counties ?? [],
    countyByFips,
    error,
    kpis: payload?.kpis ?? null,
    loading,
  };
}
