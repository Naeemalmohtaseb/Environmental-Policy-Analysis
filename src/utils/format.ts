export function formatInteger(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '--';
  return Math.round(value).toLocaleString('en-US');
}

export function formatDecimal(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '--';
  return value.toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '--';
  return Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    notation: 'compact',
  }).format(value);
}

export function formatPercent(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '--';
  return `${formatDecimal(value, digits)}%`;
}

export function formatParty(value: string | null | undefined): string {
  if (!value) return '--';
  return value;
}

export function getGapLabel(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return 'No score';
  if (value >= 2) return 'High gap';
  if (value >= 0.75) return 'Moderate gap';
  return 'Lower gap';
}
