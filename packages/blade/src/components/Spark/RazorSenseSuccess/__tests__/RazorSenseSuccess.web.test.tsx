import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { RazorSenseSuccess } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme';

const root = (container: HTMLElement): HTMLElement => {
  const el = container.querySelector<HTMLElement>('[data-blade-component="razorsense-success"]');
  if (!el) throw new Error('not there');
  return el;
};
const hasCheck = (container: HTMLElement): boolean =>
  Boolean(root(container).querySelector('svg:not([viewBox="0 0 100 100"])'));
const badgeOf = (container: HTMLElement): HTMLElement => {
  const el = root(container).querySelector<HTMLElement>('[role="img"]');
  if (!el) throw new Error('no badge');
  return el;
};
const labelOf = (container: HTMLElement): HTMLElement | null =>
  root(container).querySelector<HTMLElement>('[role="img"] + div');

const reduceMotion = (on: boolean): void => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({
      matches: on && query.includes('reduce'),
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
    }),
  });
};

describe('<RazorSenseSuccess /> (jsdom has no WebGL2)', () => {
  afterEach(() => reduceMotion(false));

  it('is the badge’s size in the layout (an image named Success), and forwards ref, className, style and testID', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = renderWithTheme(
      <RazorSenseSuccess ref={ref} className="tick" style={{ margin: 8 }} testID="ok" />,
    );
    const el = root(container);
    expect(el).toBe(ref.current);
    expect(el.className).toBe('tick');
    expect(el.getAttribute('data-testid')).toBe('ok');
    expect(el.style.margin).toBe('8px');
    const badge = badgeOf(container);
    expect(badge.getAttribute('aria-label')).toBe('Success');
    expect(badge.style.width).toBe('80px');
    expect(badge.style.height).toBe('80px');
    // (no label: the badge alone)
    expect(labelOf(container)).toBeNull();
  });

  it('its label is in its place from the start, hidden till the badge pops in, then shown under it', () => {
    jest.useFakeTimers();
    const onComplete = jest.fn();
    const { container } = renderWithTheme(
      <RazorSenseSuccess label="Payment received" onComplete={onComplete} />,
    );
    const label = labelOf(container);
    if (!label) throw new Error('no label');
    expect(label.textContent).toBe('Payment received');
    expect(label.style.opacity).toBe('0');
    // (no WebGL2 here: the badge pops in alone, and its label comes in with it; its frames and its end on the test's clock)
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(label.style.opacity).toBe('1');
    expect(label.style.transform).toBe('none');
    jest.useRealTimers();
  });

  it('can’t animate here: says why, pops Blade’s badge in with its check, then calls onComplete once', () => {
    jest.useFakeTimers();
    const onError = jest.fn();
    const onComplete = jest.fn();
    const { container } = renderWithTheme(
      <RazorSenseSuccess onError={onError} onComplete={onComplete} accessibilityLabel="Paid" />,
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(badgeOf(container).getAttribute('aria-label')).toBe('Paid');
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(hasCheck(container)).toBe(true);
    expect(onComplete).toHaveBeenCalledTimes(1);
    // (no orb, nothing drawn by the GPU)
    expect(container.querySelector('canvas')).toBeNull();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('reduced motion: the badge as it ends, with its check and label, at once; onComplete, no error', async () => {
    reduceMotion(true);
    const onError = jest.fn();
    const onComplete = jest.fn();
    const { container } = renderWithTheme(
      <RazorSenseSuccess label="Paid" onError={onError} onComplete={onComplete} />,
    );
    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
    expect(hasCheck(container)).toBe(true);
    expect(labelOf(container)?.style.opacity).toBe('1');
    expect(onError).not.toHaveBeenCalled();
  });
});
