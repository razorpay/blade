import { describe, it, expect } from 'vitest';
import { layoutDataRows, openingRow, optionKey } from './rows';

describe('layoutDataRows', () => {
  it('lays sections out flat: a heading row, then its options, framed by their place', () => {
    const layout = layoutDataRows<string>(undefined, [
      { key: 'top', title: 'Popular', items: ['a', 'b', 'c'] },
      { key: 'none', title: 'Empty', items: [] },
      { key: 'one', title: 'One', items: ['d'] },
    ]);
    expect(layout.keys).toEqual(['§top', 'a', 'b', 'c', '§one', 'd']);
    expect(layout.options).toEqual(['a', 'b', 'c', 'd']);
    expect(layout.rowOf).toEqual([1, 2, 3, 5]);
    expect(layout.rows.map((row) => (row.kind === 'option' ? row.frame : row.isFirst))).toEqual([
      true,
      'first',
      'middle',
      'last',
      false,
      'only',
    ]);
  });

  it('keys options by itemKey, else by themselves, else by place', () => {
    expect(layoutDataRows([{ id: 'x' }], undefined, (item) => item.id).keys).toEqual(['x']);
    expect(layoutDataRows([1, 2], undefined).keys).toEqual(['1', '2']);
    expect(optionKey(undefined, { id: 'x' }, 4)).toBe('#4');
  });

  it("opens at an option's heading when the option heads its section", () => {
    const layout = layoutDataRows<string>(undefined, [{ key: 's', title: 'S', items: ['a', 'b'] }]);
    expect(openingRow(layout, 0)).toBe(0);
    expect(openingRow(layout, 1)).toBe(2);
    expect(openingRow(layout, -1)).toBe(-1);
  });
});
