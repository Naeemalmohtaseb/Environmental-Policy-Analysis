import { geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { Topology } from 'topojson-specification';
import type { CountyRecord } from '../data/types';
import { formatDecimal, formatInteger } from '../utils/format';
import type { MapMetric, MapScale } from '../utils/mapScale';
import { getMapColor } from '../utils/mapScale';

type CountyGapMapProps = {
  countyByFips: Map<string, CountyRecord>;
  hoveredFips: string | null;
  metric: MapMetric;
  scale: MapScale;
  onHover: (countyFips: string | null) => void;
  onSelect: (countyFips: string | null) => void;
  selectedFips: string | null;
};

type CountyFeature = Feature<Geometry, { id?: string }>;

type TooltipState = {
  county: CountyRecord;
  x: number;
  y: number;
};

const WIDTH = 975;
const HEIGHT = 610;
const GEOMETRY_URL = '/data/us-counties-albers-10m.json';
const MIN_SCALE = 1;
const MAX_SCALE = 8;
const ZOOM_STEP = 1.25;

function getFeatureId(featureItem: CountyFeature): string {
  const id = featureItem.id ?? featureItem.properties?.id ?? '';
  return String(id).padStart(5, '0');
}

function getStrokeColor(isSelected: boolean, isHovered: boolean): string {
  if (isSelected) return '#1f2933';
  if (isHovered) return '#24564f';
  return '#ffffff';
}

export function CountyGapMap({ countyByFips, hoveredFips, metric, onHover, onSelect, scale, selectedFips }: CountyGapMapProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [topology, setTopology] = useState<Topology | null>(null);
  const [geometryError, setGeometryError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState<{ x: number; y: number } | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const didPanRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadGeometry() {
      try {
        const response = await fetch(GEOMETRY_URL);
        if (!response.ok) {
          throw new Error(`Geometry request failed with status ${response.status}`);
        }
        const topologyJson = (await response.json()) as Topology;
        if (!cancelled) {
          setTopology(topologyJson);
          setGeometryError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setGeometryError(err instanceof Error ? err.message : 'Unable to load county geometry');
        }
      }
    }

    loadGeometry();

    return () => {
      cancelled = true;
    };
  }, []);

  const features = useMemo(() => {
    if (!topology) return [];
    const counties = feature(topology, topology.objects.counties) as unknown as FeatureCollection<Geometry>;
    return counties.features as CountyFeature[];
  }, [topology]);

  const pathGenerator = useMemo(() => geoPath(), []);

  const unmatchedCount = useMemo(
    () => features.reduce((count, countyFeature) => count + (countyByFips.has(getFeatureId(countyFeature)) ? 0 : 1), 0),
    [countyByFips, features],
  );

  if (geometryError) {
    return (
      <div className="map-empty-state">
        <p>{geometryError}</p>
      </div>
    );
  }

  if (!topology || !countyByFips.size) {
    return (
      <div className="map-empty-state">
        <p>Loading county map.</p>
      </div>
    );
  }

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const adjustZoom = (direction: 'in' | 'out') => {
    setZoom((current) => {
      const next = direction === 'in' ? current * ZOOM_STEP : current / ZOOM_STEP;
      return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    });
  };

  const setTooltipFromPointer = (county: CountyRecord, clientX: number, clientY: number) => {
    const frameRect = frameRef.current?.getBoundingClientRect();
    if (!frameRect) {
      setTooltip({ county, x: clientX, y: clientY });
      return;
    }

    const tooltipWidth = 220;
    const tooltipHeight = 114;
    const x = Math.min(Math.max(clientX - frameRect.left + 14, 10), frameRect.width - tooltipWidth - 10);
    const y = Math.min(Math.max(clientY - frameRect.top + 14, 10), frameRect.height - tooltipHeight - 10);
    setTooltip({ county, x, y });
  };

  const endDrag = () => {
    window.setTimeout(() => {
      didPanRef.current = false;
    }, 0);
    setDragState(null);
  };

  return (
    <div className="county-map-frame" ref={frameRef}>
      <div className="map-inline-controls">
        <button aria-label="Zoom in map" className="control-button" onClick={() => adjustZoom('in')} type="button">
          Zoom in
        </button>
        <button aria-label="Zoom out map" className="control-button" onClick={() => adjustZoom('out')} type="button">
          Zoom out
        </button>
        <button className="control-button" onClick={resetView} type="button">
          Reset view
        </button>
      </div>
      <svg
        aria-label="County choropleth map"
        className="county-map"
        onMouseDown={(event) => {
          didPanRef.current = false;
          setDragState({ x: event.clientX, y: event.clientY });
        }}
        onMouseLeave={() => {
          if (dragState) endDrag();
          onHover(null);
          setTooltip(null);
        }}
        onMouseMove={(event) => {
          if (!dragState) return;
          didPanRef.current = true;
          setPan((current) => ({
            x: current.x + event.movementX,
            y: current.y + event.movementY,
          }));
        }}
        onMouseUp={endDrag}
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
          {features.map((countyFeature, index) => {
            const fips = getFeatureId(countyFeature);
            const county = countyByFips.get(fips);
            const path = pathGenerator(countyFeature);
            const isSelected = selectedFips === fips;
            const isHovered = hoveredFips === fips;

            if (!path) return null;

            return (
              <path
                className={`county-path ${county ? 'county-path-data' : 'county-path-missing'} ${isSelected ? 'county-path-selected' : ''}`}
                d={path}
                fill={getMapColor(county?.[metric] ?? null, scale)}
                key={`${fips}-${index}`}
                onClick={() => {
                  if (!county) return;
                  if (didPanRef.current) return;
                  onSelect(selectedFips === fips ? null : fips);
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onFocus={() => {
                  if (!county) return;
                  onHover(fips);
                }}
                onKeyDown={(event) => {
                  if (!county) return;
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect(selectedFips === fips ? null : fips);
                  }
                }}
                onMouseEnter={(event) => {
                  if (!county) return;
                  onHover(fips);
                  setTooltipFromPointer(county, event.clientX, event.clientY);
                }}
                onMouseLeave={() => {
                  onHover(null);
                  setTooltip(null);
                }}
                onMouseMove={(event) => {
                  if (!county) return;
                  setTooltipFromPointer(county, event.clientX, event.clientY);
                }}
                onBlur={() => {
                  onHover(null);
                }}
                stroke={getStrokeColor(isSelected, isHovered)}
                strokeWidth={isSelected ? 2.2 : isHovered ? 1.2 : 0.35}
                strokeLinecap="round"
                strokeLinejoin="round"
                tabIndex={county ? 0 : -1}
              />
            );
          })}
        </g>
      </svg>

      <div className="map-status">
        <span>{formatInteger(countyByFips.size)} counties with project data</span>
        <span>{formatInteger(unmatchedCount)} map geometries without project scores</span>
        <span>{formatDecimal(zoom, 1)}x zoom</span>
      </div>

      {tooltip ? (
        <div className="map-tooltip map-tooltip-contained" style={{ left: tooltip.x, top: tooltip.y }}>
          <p className="font-semibold text-ink">
            {tooltip.county.countyName}, {tooltip.county.stateAbbrev}
          </p>
          <p>Gap score: {formatDecimal(tooltip.county.justiceGapScore, 2)}</p>
          <p>Burden score: {formatDecimal(tooltip.county.environmentalBurdenScore, 1)}</p>
          <p>State-average LCV: {formatDecimal(tooltip.county.lcvScore, 1)}</p>
          <p>Population: {formatInteger(tooltip.county.population)}</p>
        </div>
      ) : null}
    </div>
  );
}
