import dayjs from 'dayjs';
import type { CurrencyCodeType } from '@razorpay/i18nify-js/currency';
import type { TableCellType } from '../GenUIComponents';
import { getAmountByParts } from '~components/Amount/Amount';

/**
 * Default date format for GenUI table `DATE` cells. Shared with the renderer so
 * on-screen and CSV dates stay in sync (day.js format tokens).
 */
const DEFAULT_CELL_DATE_FORMAT = 'DD MMM YYYY, HH:mm';

/**
 * Formats an AMOUNT value to match the rendered `<Amount>`, reusing its
 * `getAmountByParts` helper (which is internally guarded and never throws).
 */
const formatAmountCellValue = (value?: number | string, currency?: string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (typeof numValue !== 'number' || Number.isNaN(numValue)) {
    return '';
  }

  // <Amount> renders integer + decimal(separator) + fraction + compact, in order.
  const parts = getAmountByParts({
    suffix: 'decimals',
    value: numValue,
    currency: (currency || 'INR') as CurrencyCodeType,
  });
  const digits = `${parts.integer ?? ''}${parts.decimal ?? ''}${parts.fraction ?? ''}${
    parts.compact ?? ''
  }`;
  const symbol = parts.currency ?? '';
  return (parts.isPrefixSymbol ?? true) ? `${symbol}${digits}` : `${digits}${symbol}`;
};

/**
 * Serializes one table cell to its CSV value — the on-screen string for every
 * type except LINK, which uses the underlying URL (not the display label).
 */
const getCellDisplayText = (cell?: Partial<TableCellType>): string => {
  if (!cell?.component) return '';

  // Cell is a discriminated union; cast to a permissive shape for simple access.
  const c = cell as {
    component: TableCellType['component'];
    value?: string | number;
    text?: string;
    currency?: string;
    dateFormat?: string;
    action?: { data?: { url?: string } };
  };

  // Maps each TableCellType to its CSV representation (covers all 6 types: TEXT, INDICATOR, BADGE, AMOUNT, DATE, LINK)
  switch (c.component) {
    case 'TEXT':
    case 'INDICATOR':
    case 'BADGE':
      return c.value != null ? String(c.value) : '';
    case 'AMOUNT':
      return formatAmountCellValue(c.value, c.currency);
    case 'DATE': {
      if (c.value == null || c.value === '') return '';
      const date = dayjs(c.value);
      return date.isValid()
        ? date.format(c.dateFormat ?? DEFAULT_CELL_DATE_FORMAT)
        : String(c.value);
    }
    case 'LINK':
      return c.action?.data?.url ?? c.text ?? '';
    default:
      return '';
  }
};

/** Escapes a CSV field per RFC 4180 (quoted if it contains `"`, `,`, or a newline). */
const escapeCsvField = (field: string): string =>
  /[",\r\n]/.test(field) ? `"${field.replace(/"/g, '""')}"` : field;

const toCsvRow = (fields: string[]): string => fields.map(escapeCsvField).join(',');

/** Serializes a table schema (`headers` + typed `rows`) into an RFC 4180 CSV string. */
const serializeTableToCsv = (
  headers: string[],
  rows: Array<Array<Partial<TableCellType>>>,
): string => {
  const headerLine = toCsvRow(headers);
  const bodyLines = rows.map((row) => toCsvRow(row.map((cell) => getCellDisplayText(cell))));
  return [headerLine, ...bodyLines].join('\r\n');
};

export { serializeTableToCsv, getCellDisplayText, DEFAULT_CELL_DATE_FORMAT };
