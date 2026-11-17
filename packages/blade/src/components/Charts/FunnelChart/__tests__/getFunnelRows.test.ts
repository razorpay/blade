import { formatPercent, getFunnelRows } from '../getFunnelRows';

const rowsOf = (...counts: unknown[]): ReturnType<typeof getFunnelRows> =>
  getFunnelRows(
    counts.map((count, index) => ({ count, step: `Step ${index + 1}` })),
    'count',
    'step',
  );

describe('getFunnelRows', () => {
  it('should label each step with its share of the first step', () => {
    expect(rowsOf(34, 19, 19, 5)).toEqual([
      expect.objectContaining({ name: 'Step 1', value: 34, label: 'Step 1 · 100%' }),
      expect.objectContaining({ name: 'Step 2', value: 19, label: 'Step 2 · 56%' }),
      expect.objectContaining({ name: 'Step 3', value: 19, label: 'Step 3 · 56%' }),
      expect.objectContaining({ name: 'Step 4', value: 5, label: 'Step 4 · 15%' }),
    ]);
  });

  it('should keep a step that everyone dropped at 0%', () => {
    expect(rowsOf(4200, 1800, 0)[2]).toMatchObject({ value: 0, label: 'Step 3 · 0%' });
  });

  it('should treat missing, negative and non-numeric counts as 0', () => {
    expect(rowsOf(10, undefined, -4, 'abc', '5').map((row) => row.value)).toEqual([10, 0, 0, 0, 5]);
  });

  it('should leave out the share when the first step is 0', () => {
    expect(rowsOf(0, 5)[1].label).toBe('Step 2');
  });

  it('should draw nothing when every count is 0 or there is no data', () => {
    expect(rowsOf(0, 0)).toEqual([]);
    expect(rowsOf()).toEqual([]);
  });

  it('should drop only the keys it needs from each row', () => {
    const [row] = getFunnelRows([{ step: 'Visited', count: 3, x: 99, width: 1 }], 'count', 'step');
    expect(Object.keys(row)).toEqual(['name', 'value', 'label', 'role', 'aria-label']);
    expect(row['aria-label']).toBe('Visited · 100%, 3');
  });
});

describe('formatPercent', () => {
  it('should keep tiny and near-total shares off 0% and 100%', () => {
    expect(formatPercent(0.04)).toBe('<0.1%');
    expect(formatPercent(99.7)).toBe('>99%');
    expect(formatPercent(4.25)).toBe('4.3%');
    expect(formatPercent(55.9)).toBe('56%');
    expect(formatPercent(100)).toBe('100%');
  });
});
