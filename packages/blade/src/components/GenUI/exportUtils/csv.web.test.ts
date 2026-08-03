import { serializeTableToCsv, getCellDisplayText } from './csv.web';
import type { TableCellType } from '../GenUIComponents';

// Deterministic amount formatting so the test doesn't depend on the i18n locale.
// Mirrors i18nify's formatNumberByParts shape (separate decimal separator +
// fraction). The `currency` part echoes the given code — this is a stand-in for
// the join logic, not a symbol lookup (that's i18nify's job), so it works for
// any currency instead of hardcoding a couple.
jest.mock('~components/Amount/Amount', () => ({
  getAmountByParts: jest.fn(({ value, currency }: { value: number; currency: string }) => ({
    integer: String(Math.trunc(value)),
    decimal: '.',
    fraction: '00',
    currency,
    isPrefixSymbol: true,
  })),
}));

describe('GenUI exportUtils/csv', () => {
  describe('getCellDisplayText', () => {
    it('returns the value for TEXT / INDICATOR / BADGE cells', () => {
      expect(getCellDisplayText({ component: 'TEXT', value: 'hello' })).toBe('hello');
      expect(
        getCellDisplayText({ component: 'INDICATOR', value: 'Active', color: 'positive' }),
      ).toBe('Active');
      expect(getCellDisplayText({ component: 'BADGE', value: 'Paid', color: 'positive' })).toBe(
        'Paid',
      );
    });

    it('returns the underlying URL for LINK cells, falling back to the label', () => {
      expect(
        getCellDisplayText({
          component: 'LINK',
          text: 'View Details',
          action: { type: 'CLICK', data: { url: 'https://example.com/x' } },
        }),
      ).toBe('https://example.com/x');
      // No URL → fall back to the display label.
      expect(getCellDisplayText({ component: 'LINK', text: 'View order' })).toBe('View order');
    });

    it('formats AMOUNT cells to the on-screen display string', () => {
      expect(getCellDisplayText({ component: 'AMOUNT', value: 1500, currency: 'INR' })).toBe(
        '₹1500.00',
      );
      expect(getCellDisplayText({ component: 'AMOUNT', value: 42, currency: 'USD' })).toBe(
        '$42.00',
      );
    });

    it('formats DATE cells using the provided or default format', () => {
      expect(getCellDisplayText({ component: 'DATE', value: '2024-01-15T10:30:00Z' })).toContain(
        '2024',
      );
      expect(
        getCellDisplayText({ component: 'DATE', value: '2024-01-15', dateFormat: 'YYYY' }),
      ).toBe('2024');
    });

    it('returns the raw value for an unparseable date', () => {
      expect(getCellDisplayText({ component: 'DATE', value: 'not-a-date' })).toBe('not-a-date');
    });

    it('returns an empty string for missing / incomplete cells', () => {
      expect(getCellDisplayText(undefined)).toBe('');
      expect(getCellDisplayText({})).toBe('');
      expect(getCellDisplayText({ component: 'TEXT' })).toBe('');
      // Intentionally malformed (non-numeric amount) to exercise the NaN guard.
      expect(
        getCellDisplayText(({ component: 'AMOUNT', value: 'abc' } as unknown) as TableCellType),
      ).toBe('');
    });
  });

  describe('serializeTableToCsv', () => {
    it('serializes headers and rows into RFC 4180 CSV', () => {
      const headers = ['Name', 'Status'];
      const rows: TableCellType[][] = [
        [
          { component: 'TEXT', value: 'Alice' },
          { component: 'BADGE', value: 'Paid', color: 'positive' },
        ],
        [
          { component: 'TEXT', value: 'Bob' },
          { component: 'BADGE', value: 'Failed', color: 'negative' },
        ],
      ];

      expect(serializeTableToCsv(headers, rows)).toBe(
        'Name,Status\r\nAlice,Paid\r\nBob,Failed',
      );
    });

    it('escapes fields containing commas, quotes, and newlines', () => {
      const headers = ['Description'];
      const rows: TableCellType[][] = [
        [{ component: 'TEXT', value: 'a, b' }],
        [{ component: 'TEXT', value: 'say "hi"' }],
        [{ component: 'TEXT', value: 'line1\nline2' }],
      ];

      expect(serializeTableToCsv(headers, rows)).toBe(
        'Description\r\n"a, b"\r\n"say ""hi"""\r\n"line1\nline2"',
      );
    });

    it('produces only a header line for an empty row set', () => {
      expect(serializeTableToCsv(['A', 'B'], [])).toBe('A,B');
    });
  });
});
