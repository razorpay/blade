import {
  NBSP,
  formatChartValue,
  formatDateTick,
  formatINRCompact,
  formatShare,
  getBarListRows,
  getDefaultShowBorder,
  resolveShowBorder,
  shouldShowBarList,
  getChartHeight,
  getDateStep,
  getDonutHeight,
  getDonutRadius,
  getLastLabelOverhang,
  getXLabelStep,
  isDateAxis,
  isWholeNumberChart,
  normalizeValueFormatType,
} from '../genUIChartUtils';

const day = (i: number): string => new Date(Date.UTC(2026, 9, 1 + i)).toISOString().slice(0, 10);

describe('genUIChartUtils', () => {
  describe('getChartHeight (B1)', () => {
    it.each([
      [256, 200],
      [360, 225],
      [400, 250],
      [520, 325],
      [560, 350],
      [1100, 350],
    ])('a %ipx box gives a %ipx chart', (width, height) => {
      expect(getChartHeight(width)).toBe(height);
    });

    it('keeps 350px, the height before this change, until the box is measured', () => {
      expect(getChartHeight(0)).toBe(350);
    });

    it('never puts a donut ring in a box under 260px', () => {
      expect(getDonutHeight(256)).toBe(260);
      expect(getDonutHeight(520)).toBe(325);
    });

    it('takes the small donut radius under 440px only', () => {
      expect(getDonutRadius(0)).toBe('medium');
      expect(getDonutRadius(400)).toBe('small');
      expect(getDonutRadius(440)).toBe('medium');
    });
  });

  describe('X labels (B2)', () => {
    it('finds ISO date axes and their step', () => {
      expect(isDateAxis([day(0), day(1)])).toBe(true);
      expect(isDateAxis(['Q1', 'Q2'])).toBe(false);
      expect(getDateStep([day(0), day(1)])).toBe('day');
      expect(getDateStep([day(0), day(7)])).toBe('week');
      expect(getDateStep(['2026-01-01', '2026-02-01'])).toBe('month');
    });

    it.each([
      // [points, width, step]: labels = ceil(points / step)
      [30, 256, 14],
      [30, 360, 7],
      [30, 520, 7],
      [30, 1100, 2],
      [14, 360, 3],
      [7, 256, 3],
      [7, 520, 1],
    ])('%i daily points at %ipx: every %i-th point', (count, width, step) => {
      expect(getXLabelStep(count, width, 'day')).toBe(step);
    });

    it('draws at least 2 labels, and every label in an unmeasured box', () => {
      expect(Math.ceil(30 / getXLabelStep(30, 100, 'day'))).toBeGreaterThanOrEqual(2);
      expect(getXLabelStep(30, 0, 'day')).toBe(1);
    });

    it('writes dates as "1 Oct" with a non-breaking space, months as "Oct 26"', () => {
      expect(formatDateTick('2026-10-01', 'day')).toBe(`1${NBSP}Oct`);
      expect(formatDateTick('2026-10-01', 'month')).toBe(`Oct${NBSP}26`);
      expect(formatDateTick('Q1', 'day')).toBe('Q1');
    });

    it('gives a centred last bar label room inside the plot, only when it sticks out', () => {
      // 30 bars at 360px: "29 Oct" is centred on a 10px bar, so it needs 8px past the edge.
      expect(
        getLastLabelOverhang({
          count: 30,
          labelStep: 7,
          lastLabel: `29${NBSP}Oct`,
          width: 360,
          chartType: 'bar',
        }),
      ).toBe(8);
      // 7 bars at 520px: each bar is 67px wide, so the label fits.
      expect(
        getLastLabelOverhang({
          count: 7,
          labelStep: 1,
          lastLabel: `7${NBSP}Oct`,
          width: 520,
          chartType: 'bar',
        }),
      ).toBe(0);
    });

    it('adds no room after a line label that ChartXAxis end-aligns', () => {
      expect(
        getLastLabelOverhang({
          count: 15,
          labelStep: 7,
          lastLabel: `15${NBSP}Oct`,
          width: 360,
          chartType: 'line',
        }),
      ).toBe(0);
    });
  });

  describe('Y ticks (B3)', () => {
    it.each([
      [0, '₹0'],
      [50000, '₹50K'],
      [100000, '₹1L'],
      [150000, '₹1.5L'],
      [280000, '₹2.8L'],
      [12000000, '₹1.2Cr'],
    ])('writes %i as %s', (value, text) => {
      expect(formatINRCompact(value)).toBe(text);
    });

    it('never repeats a tick on a ₹0 to ₹2L axis', () => {
      const ticks = [0, 50000, 100000, 150000, 200000].map(formatINRCompact);
      expect(new Set(ticks).size).toBe(ticks.length);
    });

    it('asks for whole ticks only on a count chart of whole values', () => {
      const counts = [
        { day: 'Mon', count: 0 },
        { day: 'Tue', count: 3 },
      ];
      expect(isWholeNumberChart(counts, ['count'], 'count')).toBe(true);
      // `number` is the older name of `count`.
      expect(isWholeNumberChart(counts, ['count'], 'number')).toBe(true);
      expect(isWholeNumberChart([{ day: 'Mon', count: 1.5 }], ['count'], 'number')).toBe(false);
      expect(isWholeNumberChart(counts, ['count'], 'currency')).toBe(false);
    });
  });
  describe('showBorder', () => {
    it.each([
      [0, true],
      [256, false],
      [640, false],
      [641, true],
      [1100, true],
    ] as const)('a %ipx box defaults to %s', (width, showBorder) => {
      expect(getDefaultShowBorder(width)).toBe(showBorder);
    });

    it('takes the node value over the width, and ignores a value that is not a boolean', () => {
      expect(resolveShowBorder(true, 360)).toBe(true);
      expect(resolveShowBorder(false, 1100)).toBe(false);
      expect(resolveShowBorder('lines', 360)).toBe(false);
      expect(resolveShowBorder(undefined, 1100)).toBe(true);
    });

    it('gives the last bar label less room when the Y axis takes no width', () => {
      const args = {
        count: 30,
        labelStep: 7,
        lastLabel: `29${NBSP}Oct`,
        width: 360,
        chartType: 'bar' as const,
      };
      expect(getLastLabelOverhang(args)).toBe(8);
      expect(getLastLabelOverhang({ ...args, yAxisWidth: 0 })).toBe(5);
    });
  });

  describe('full values for the tooltip and the bar list', () => {
    it.each([
      [123450, { type: 'currency', currency: 'INR' }, '₹1,23,450.00'],
      [123450.5, { type: 'currency' }, '₹1,23,450.50'],
      [12000000, { type: 'currency', currency: 'INR' }, '₹1,20,00,000.00'],
      [123450, { type: 'count' }, '1,23,450'],
      [1234.567, { type: 'count' }, '1,234.57'],
      [12.345, { type: 'percent' }, '12.3%'],
      [12.345, { type: 'percent', suffix: '%' }, '12.3%'],
      [42, { type: 'count', suffix: ' txns' }, '42 txns'],
      // The older names: `number` is `count`, `percentage` is `percent`.
      [123450, { type: 'number' }, '1,23,450'],
      [12.345, { type: 'percentage' }, '12.3%'],
      [12.345, { type: 'percentage', suffix: '%' }, '12.3%'],
      [42, { type: 'string' }, '42'],
    ] as const)('writes %p as %s', (value, formatter, text) => {
      expect(formatChartValue(value, formatter)).toBe(text);
    });

    it.each([
      ['number', 'count'],
      ['percentage', 'percent'],
      ['count', 'count'],
      ['percent', 'percent'],
      ['currency', 'currency'],
      ['string', 'string'],
      ['ratio', undefined],
    ])('reads the format type %p as %p', (type, name) => {
      expect(normalizeValueFormatType(type)).toBe(name);
    });

    it('keeps a value that is not a number as it is', () => {
      expect(formatChartValue('n/a', { type: 'number' })).toBe('n/a');
    });

    it('writes a share with 1 decimal', () => {
      expect(formatShare(57.4585)).toBe('57.5%');
      expect(formatShare(100)).toBe('100.0%');
    });
  });

  describe('bar list for a pie', () => {
    it.each([
      [4, 800, false],
      [5, 800, true],
      [3, 299, true],
      [3, 300, false],
      [3, 0, false],
      [7, 0, true],
    ])('%i slices in a %ipx box: bar list %p', (slices, width, expected) => {
      expect(shouldShowBarList(slices, width)).toBe(expected);
    });

    it('scales each row to the total, not to the largest row', () => {
      const list = getBarListRows(
        [
          { method: 'UPI', value: 520000 },
          { method: 'Card', value: 250000 },
          { method: 'Netbanking', value: 135000 },
        ],
        'method',
        'value',
      );
      expect(list.total).toBe(905000);
      expect(list.rows.map((row) => row.label)).toEqual(['UPI', 'Card', 'Netbanking']);
      expect(list.rows[0].share).toBeCloseTo(57.46, 2);
      expect(list.rows.reduce((sum, row) => sum + row.share, 0)).toBeCloseTo(100, 5);
    });

    it('counts a value under 0 as 0, and gives every row 0% of a 0 total', () => {
      expect(getBarListRows([{ m: 'A', v: -5 }], 'm', 'v')).toEqual({
        total: 0,
        rows: [{ label: 'A', value: 0, share: 0 }],
      });
    });
  });
});
