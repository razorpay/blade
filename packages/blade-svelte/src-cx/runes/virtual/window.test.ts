import { describe, it, expect } from 'vitest';
import { createVirtualWindow } from './window';

const keys = (count: number) =>
  Array.from({ length: count }, (_, i) => `k${i}`);

describe('createVirtualWindow', () => {
  it('predicts with the initial estimate until a row is measured', () => {
    const list = createVirtualWindow({ overscan: 0, initialEstimate: 50 });
    list.setKeys(keys(100));
    expect(list.range(0, 200)).toEqual({
      start: 0,
      end: 5,
      padTop: 0,
      padBottom: 4750,
      total: 5000,
    });
  });

  it('counts unmeasured rows as the mean of the measured ones', () => {
    const list = createVirtualWindow({ overscan: 0, initialEstimate: 50 });
    list.setKeys(keys(10));
    list.measure([
      ['k0', 40],
      ['k1', 80],
    ]);
    expect(list.estimate()).toBe(60);
    // 40 + 80 measured, eight rows predicted at 60.
    expect(list.range(0, 100).total).toBe(600);
  });

  it('the total converges on the exact sum as every row is seen', () => {
    const list = createVirtualWindow({ overscan: 0 });
    list.setKeys(keys(4));
    list.measure([
      ['k0', 10],
      ['k1', 20],
      ['k2', 30],
      ['k3', 40],
    ]);
    const range = list.range(25, 30);
    expect(range.total).toBe(100);
    // 25 falls in k1 (10–30); 55 falls in k2 (30–60).
    expect(range).toMatchObject({
      start: 1,
      end: 3,
      padTop: 10,
      padBottom: 40,
    });
  });

  it('keeps overscan rows mounted beyond both edges', () => {
    const list = createVirtualWindow({ overscan: 2, initialEstimate: 10 });
    list.setKeys(keys(100));
    expect(list.range(300, 50)).toMatchObject({ start: 28, end: 38 });
  });

  it('corrects the scroll for rows above the first visible one only', () => {
    const list = createVirtualWindow({ overscan: 0, initialEstimate: 50 });
    list.setKeys(keys(100));
    list.measure(keys(100).map((key) => [key, 50] as const));
    list.range(500, 200); // k10 is first in view

    // A row above grows by 30: what is in view moved down by 30.
    expect(list.measure([['k3', 80]])).toBe(30);
    // A row in or below the view moves nothing the user is looking at.
    expect(list.measure([['k12', 90]])).toBe(0);
  });

  it('a row a pixel off its last size is the same row: no correction', () => {
    const list = createVirtualWindow({ overscan: 0, initialEstimate: 50 });
    list.setKeys(keys(100));
    list.measure(keys(100).map((key) => [key, 50] as const));
    list.range(500, 200); // k10 is first in view

    // A hairline that comes and goes with a row's place in the slice.
    expect(list.measure([['k3', 49]])).toBe(0);
    expect(list.measure([['k3', 51]])).toBe(0);
    // A real change still counts.
    expect(list.measure([['k3', 52]])).toBe(2);
  });

  it('a better estimate shifts unseen rows above, and says so', () => {
    const list = createVirtualWindow({ overscan: 0, initialEstimate: 50 });
    list.setKeys(keys(100));
    list.range(500, 100); // k10 first in view, nothing measured yet
    // The first real row is 70: the ten unseen rows above are now 70 each.
    expect(list.measure([['k10', 70]])).toBe(200);
  });

  it('keeps sizes across filtering and ignores rows with no layout', () => {
    const list = createVirtualWindow({ overscan: 0, initialEstimate: 50 });
    list.setKeys(keys(3));
    list.measure([
      ['k2', 90],
      ['k1', 0],
    ]);
    list.setKeys(['k2']);
    expect(list.range(0, 100)).toMatchObject({ start: 0, end: 1, total: 90 });
    list.setKeys([]);
    expect(list.range(0, 100)).toMatchObject({ end: 0, total: 0 });
  });
});
