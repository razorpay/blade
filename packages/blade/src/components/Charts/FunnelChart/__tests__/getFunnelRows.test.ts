import { getFunnelRows } from '../getFunnelRows';

const rowsOf = (...counts: unknown[]): ReturnType<typeof getFunnelRows> =>
  getFunnelRows(
    counts.map((count, index) => ({ count, step: `Step ${index + 1}` })),
    'count',
    'step',
  );

describe('getFunnelRows', () => {
  it('should label each step with its count and its share of the first step', () => {
    expect(rowsOf(34, 19, 19, 5)).toEqual([
      expect.objectContaining({ name: 'Step 1', value: 34, label: 'Step 1 · 34 · 100%' }),
      expect.objectContaining({ name: 'Step 2', value: 19, label: 'Step 2 · 19 · 56%' }),
      expect.objectContaining({ name: 'Step 3', value: 19, label: 'Step 3 · 19 · 56%' }),
      expect.objectContaining({ name: 'Step 4', value: 5, label: 'Step 4 · 5 · 15%' }),
    ]);
  });

  it('should keep a step that everyone dropped at 0%', () => {
    expect(rowsOf(4200, 1800, 0)[2]).toMatchObject({ value: 0, label: 'Step 3 · 0 · 0%' });
  });

  it('should treat missing, negative and non-numeric counts as 0', () => {
    expect(rowsOf(10, undefined, -4, 'abc', '5').map((row) => row.value)).toEqual([10, 0, 0, 0, 5]);
  });

  it('should show a tiny share as <1%', () => {
    expect(rowsOf(10000, 4)[1].label).toBe('Step 2 · 4 · <1%');
  });

  it('should leave out the share when the first step is 0', () => {
    expect(rowsOf(0, 5)[1].label).toBe('Step 2 · 5');
  });

  it('should draw nothing when every count is 0 or there is no data', () => {
    expect(rowsOf(0, 0)).toEqual([]);
    expect(rowsOf()).toEqual([]);
  });

  it('should drop only the keys it needs from each row', () => {
    const [row] = getFunnelRows([{ step: 'Visited', count: 3, x: 99, width: 1 }], 'count', 'step');
    expect(Object.keys(row)).toEqual(['name', 'value', 'label', 'role', 'aria-label']);
    expect(row['aria-label']).toBe('Visited · 3 · 100%');
  });
});
