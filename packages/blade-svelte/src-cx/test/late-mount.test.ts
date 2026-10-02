import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import LateMountHarness from './fixtures/LateMountHarness.svelte';
import { expectClass, expectNoClass } from './classes';

// Groups read their members in document order, not mount order: a member
// that mounts late, ahead of the others, takes its place.
describe('members that mount late', () => {
  it("a segment mounted ahead moves the picked segment's thumb (B3)", async () => {
    const { container, rerender } = render(LateMountHarness);
    const thumb = () =>
      container.querySelector<HTMLElement>('[style*="--segment-index"]')!;
    expect(thumb().style.getPropertyValue('--segment-index')).toBe('0');
    await rerender({ showFirst: true });
    expect(thumb().style.getPropertyValue('--segment-index')).toBe('1');
    expect(thumb().style.getPropertyValue('--segment-count')).toBe('2');
  });

  it('an InputGroup member mounted ahead takes the top corners (B4)', async () => {
    const { getByTestId, rerender } = render(LateMountHarness);
    const frame = (id: string) => getByTestId(id).parentElement;
    expectClass(frame('city'), 'rounded-tl-small');
    await rerender({ showFirst: true });
    expectClass(frame('line1'), 'rounded-tl-small');
    expectNoClass(frame('city'), 'rounded-tl-small');
    expectClass(frame('city'), 'rounded-bl-small');
  });
});
