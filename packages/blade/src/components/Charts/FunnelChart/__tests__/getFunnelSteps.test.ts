import { formatPercent, getFunnelSteps } from '../getFunnelSteps';

const stepsOf = (...counts: unknown[]): ReturnType<typeof getFunnelSteps> =>
  getFunnelSteps(
    counts.map((count) => ({ count })),
    'count',
  );

describe('getFunnelSteps', () => {
  it('should measure each step against the first and the previous step', () => {
    const [first, second, third, fourth] = stepsOf(34, 19, 19, 5);

    expect(first).toEqual({
      count: 34,
      dropped: null,
      reachedPercentOfPrevious: null,
      droppedPercentOfPrevious: null,
      reachedPercentOfFirst: 100,
      droppedPercentOfFirst: 0,
    });
    expect(second.dropped).toBe(15);
    expect(formatPercent(second.reachedPercentOfPrevious!)).toBe('56%');
    expect(formatPercent(second.droppedPercentOfPrevious!)).toBe('44%');
    expect(second.reachedPercentOfFirst + second.droppedPercentOfFirst).toBe(100);
    expect(third.dropped).toBe(0);
    expect(third.reachedPercentOfPrevious).toBe(100);
    expect(formatPercent(fourth.reachedPercentOfPrevious!)).toBe('26%');
    expect(formatPercent(fourth.droppedPercentOfPrevious!)).toBe('74%');
  });

  it('should draw a 100% drop as a hatched column only', () => {
    const [, second] = stepsOf(40, 0);

    expect(second.reachedPercentOfFirst).toBe(0);
    expect(second.droppedPercentOfFirst).toBe(100);
    expect(second.droppedPercentOfPrevious).toBe(100);
  });

  it('should not drop anyone on a step larger than the previous one', () => {
    const [, second, third] = stepsOf(10, 8, 12);

    expect(third.dropped).toBe(0);
    expect(third.droppedPercentOfFirst).toBe(0);
    expect(third.reachedPercentOfPrevious).toBe(150);
    expect(third.reachedPercentOfFirst).toBe(120);
    expect(second.reachedPercentOfFirst).toBe(80);
  });

  it('should draw every column at 0% when the first step is 0', () => {
    const [first, second] = stepsOf(0, 5);

    expect(first.reachedPercentOfFirst).toBe(0);
    expect(second.reachedPercentOfFirst).toBe(0);
    expect(second.reachedPercentOfPrevious).toBeNull();
  });

  it('should treat missing, negative and non-numeric counts as 0', () => {
    expect(stepsOf(undefined, -4, 'abc', '12').map((step) => step.count)).toEqual([0, 0, 0, 12]);
  });

  it('should handle a single step and no steps', () => {
    expect(stepsOf(7)).toHaveLength(1);
    expect(stepsOf(7)[0].reachedPercentOfFirst).toBe(100);
    expect(stepsOf()).toEqual([]);
  });

  it('should print a decimal only under 10%', () => {
    expect(formatPercent(0.46)).toBe('0.5%');
    expect(formatPercent(9.94)).toBe('9.9%');
    expect(formatPercent(38.4)).toBe('38%');
  });

  it('should not round a small share to 0% or a near-total share to 100%', () => {
    const [, second] = stepsOf(10000, 9996);
    expect(formatPercent(second.droppedPercentOfPrevious!)).toBe('<0.1%');
    expect(formatPercent(second.reachedPercentOfPrevious!)).toBe('>99%');
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(100)).toBe('100%');
  });
});
