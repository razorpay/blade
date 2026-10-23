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
    expectClass(slides[0], 'snap-start');
    // Blade's slide gap: 12px, 16px from `d:` up.
    expectClass(slides[0].parentElement, 'gap-3');
    expectClass(slides[0].parentElement, 'd:gap-4');
  });

  it('a dot goes to its slide and becomes the current one', async () => {
    const onChange = vi.fn();
    const { getByRole, getAllByRole } = render(CarouselHarness, { props: { onChange } });
    const third = getByRole('tab', { name: 'Go to offer 3' });
    expect(getByRole('tablist').contains(third)).toBe(true);
    expect(third.getAttribute('aria-controls')).toBe(
      getAllByRole('tabpanel', { hidden: true })[2].id,
    );
    expectClass(third, 'bg-overlay-moderate');
    // Blade's indicators: 6px dots 4px apart; from `d:` up the current one
    // is an 18px pill.
    expectClass(third, 'd:w-1.5');
    expectClass(third, 'd:h-1.5');
    expectClass(third.parentElement, 'gap-1');
    await fireEvent.click(third);
    flushSync();
    expectClass(third, 'd:w-[18px]');
    expect(onChange).toHaveBeenCalledWith(2);
    expect(third.getAttribute('aria-selected')).toBe('true');
    expectClass(third, 'icon-interactive-gray-muted');
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

  it('auto-plays every 6s, wraps, and holds while the pointer is inside', async () => {
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

    await fireEvent.pointerEnter(getByTestId('offers'));
    flushSync();
    vi.advanceTimersByTime(30000);
    expect(onChange).toHaveBeenCalledTimes(3);
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

  it('the previous and next buttons step through the slides, wrapping', async () => {
    const onChange = vi.fn();
    const { getByRole } = render(CarouselHarness, { props: { onChange } });
    const previous = getByRole('button', { name: 'Previous Slide' });
    const next = getByRole('button', { name: 'Next Slide' });
    // Blade's filled NavigationButton, under the slides around the dots.
    expectClass(previous, 'bg-interactive-static-white-default');
    expectClass(previous, 'shadow-lowRaised');
    expect(previous.parentElement?.contains(getByRole('tablist'))).toBe(true);
    await fireEvent.click(previous);
    flushSync();
    await fireEvent.click(next);
    flushSync();
    expect(onChange.mock.calls.map(([index]) => index)).toEqual([2, 0]);
  });

  it('puts the buttons either side from `d:` up, and under the slides on phones', () => {
    const { getAllByRole } = render(CarouselHarness, {
      props: { navigationButtonPosition: 'side', navigationButtonVariant: 'stroked' },
    });
    const [sidePrevious, bottomPrevious] = getAllByRole('button', { name: 'Previous Slide' });
    expectClass(sidePrevious, 'd:flex');
    expectClass(sidePrevious, 'bg-interactive-static-white-faded');
    expectClass(bottomPrevious, 'd:hidden');
  });

  it('a swipe settles once the track is still: a fling reports only where it rests', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { getAllByRole } = render(CarouselHarness, { props: { onChange } });
    flushSync();
    const track = getAllByRole('tabpanel', { hidden: true })[0].parentElement!;
    Object.defineProperty(track, 'clientWidth', { configurable: true, value: 100 });
    for (const left of [60, 120, 180, 210]) {
      track.scrollLeft = left;
      track.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(20);
    }
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    flushSync();
    expect(onChange.mock.calls).toEqual([[2]]);
  });

  it('showNavigationButtons off hides the buttons at every width, in any position', () => {
    for (const navigationButtonPosition of ['bottom', 'side', 'side-overlap'] as const) {
      const { queryAllByRole, unmount } = render(CarouselHarness, {
        props: { showNavigationButtons: false, navigationButtonPosition },
      });
      expect(queryAllByRole('button', { name: /Slide$/ })).toHaveLength(0);
      unmount();
    }
  });

  it('with fewer than two slides (or none, while loading) there is nothing to step: no buttons, no dots', () => {
    for (const offers of [[], ['Only offer']]) {
      const { queryAllByRole, unmount } = render(CarouselHarness, { props: { offers } });
      expect(queryAllByRole('button', { name: /Slide$/ })).toHaveLength(0);
      expect(queryAllByRole('tab')).toHaveLength(0);
      unmount();
    }
  });
});
