import { afterEach, describe, it, expect, vi } from 'vitest';
import { flushSync } from 'svelte';
import { fireEvent, render } from '@testing-library/svelte';
import CarouselHarness from './fixtures/CarouselHarness.svelte';
import { expectClass } from './classes';

afterEach(() => {
  vi.useRealTimers();
});

describe('Carousel', () => {
  it('is a named carousel of named slides; only the one on show is live', () => {
    const { getByTestId, getAllByRole } = render(CarouselHarness);
    const root = getByTestId('offers');
    expect(root.getAttribute('aria-roledescription')).toBe('carousel');
    expect(root.getAttribute('aria-label')).toBe('Offers');
    const slides = getAllByRole('group', { hidden: true });
    expect(slides).toHaveLength(3);
    expect(slides[0].getAttribute('aria-label')).toBe('Offer 1 of 3');
    expect((slides[0] as HTMLElement & { inert: boolean }).inert).toBe(false);
    expect((slides[1] as HTMLElement & { inert: boolean }).inert).toBe(true);
    expectClass(slides[0], 'snap-center');
  });

  it('a dot goes to its slide and becomes the current one', () => {
    const onChange = vi.fn();
    const { getByRole } = render(CarouselHarness, { props: { onChange } });
    const third = getByRole('button', { name: 'Offer 3 of 3' });
    expectClass(third, 'bg-overlay-moderate');
    // Figma's indicators: 6px dots, the current one an 18px pill, 4px apart.
    expectClass(third, 'w-1.5');
    expectClass(third, 'h-1.5');
    expectClass(third.parentElement, 'gap-1');
    return fireEvent.click(third).then(() => {
      expectClass(third, 'w-[18px]');
      expect(onChange).toHaveBeenCalledWith(2);
      expect(third.getAttribute('aria-current')).toBe('true');
      expectClass(third, 'icon-interactive-gray-muted');
    });
  });

  it('has no dots without a label to name them', () => {
    const { queryAllByRole } = render(CarouselHarness, {
      props: { withLabels: false },
    });
    expect(queryAllByRole('button')).toHaveLength(0);
  });

  it('advances by itself, wraps, and holds while the pointer is inside', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { getByTestId } = render(CarouselHarness, {
      props: { autoAdvance: 1000, onChange },
    });
    flushSync();
    vi.advanceTimersByTime(3000);
    expect(onChange.mock.calls.map(([index]) => index)).toEqual([1, 2, 0]);

    return fireEvent.pointerEnter(getByTestId('offers')).then(() => {
      vi.advanceTimersByTime(5000);
      expect(onChange).toHaveBeenCalledTimes(3);
    });
  });
});
