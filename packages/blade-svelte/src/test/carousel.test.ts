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
    expect(root.dataset.analyticsSection).toBe('offers');
    const slides = getAllByRole('tabpanel', { hidden: true });
    expect(slides).toHaveLength(3);
    expect(slides[0].getAttribute('aria-roledescription')).toBe('slide');
    expect(slides[0].getAttribute('aria-label')).toBe('Offer 1 of 3');
    expect((slides[0] as HTMLElement & { inert: boolean }).inert).toBe(false);
    expect((slides[1] as HTMLElement & { inert: boolean }).inert).toBe(true);
    expectClass(slides[0], 'snap-center');
  });

  it('a dot goes to its slide and becomes the current one', () => {
    const onChange = vi.fn();
    const { getByRole, getAllByRole } = render(CarouselHarness, { props: { onChange } });
    const third = getByRole('tab', { name: 'Go to offer 3' });
    expect(getByRole('tablist').contains(third)).toBe(true);
    expect(third.getAttribute('aria-controls')).toBe(
      getAllByRole('tabpanel', { hidden: true })[2].id,
    );
    expectClass(third, 'bg-overlay-moderate');
    // Figma's indicators: 6px dots, the current one an 18px pill, 4px apart.
    expectClass(third, 'w-1.5');
    expectClass(third, 'h-1.5');
    expectClass(third.parentElement, 'gap-1');
    return fireEvent.click(third).then(() => {
      expectClass(third, 'w-[18px]');
      expect(onChange).toHaveBeenCalledWith(2);
      expect(third.getAttribute('aria-selected')).toBe('true');
      expectClass(third, 'icon-interactive-gray-muted');
    });
  });

  it("names slides and dots in Blade's English by default", () => {
    const { getByRole, getAllByRole } = render(CarouselHarness, {
      props: { withLabels: false },
    });
    expect(getByRole('tablist', { name: 'Slides' })).toBeTruthy();
    expect(getAllByRole('tab').map((dot) => dot.getAttribute('aria-label'))).toEqual([
      'Slide 1',
      'Slide 2',
      'Slide 3',
    ]);
    expect(getAllByRole('tabpanel', { hidden: true })[1].getAttribute('aria-label')).toBe('2 of 3');
  });

  it('has no dots with showIndicators off', () => {
    const { queryAllByRole } = render(CarouselHarness, {
      props: { showIndicators: false },
    });
    expect(queryAllByRole('tab')).toHaveLength(0);
  });

  it('auto-plays every 6s, wraps, and holds while the pointer is inside', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { getByTestId } = render(CarouselHarness, {
      props: { autoPlay: true, onChange },
    });
    flushSync();
    vi.advanceTimersByTime(5999);
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(12001);
    expect(onChange.mock.calls.map(([index]) => index)).toEqual([1, 2, 0]);

    return fireEvent.pointerEnter(getByTestId('offers')).then(() => {
      vi.advanceTimersByTime(30000);
      expect(onChange).toHaveBeenCalledTimes(3);
    });
  });

  it('turning autoPlay on later starts at its pace, not at the pace it mounted with', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { rerender } = render(CarouselHarness, { props: { onChange } });
    flushSync();
    vi.advanceTimersByTime(10000);
    expect(onChange).not.toHaveBeenCalled();
    return rerender({ onChange, autoPlay: true }).then(() => {
      vi.advanceTimersByTime(100);
      expect(onChange).not.toHaveBeenCalled();
      vi.advanceTimersByTime(5900);
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
