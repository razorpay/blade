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

  it('is the badge’s size in the layout, an image named Success, and forwards ref, className, style and testID', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = renderWithTheme(
      <RazorSenseSuccess ref={ref} className="tick" style={{ margin: 8 }} testID="ok" />,
    );
    const el = root(container);
    expect(el).toBe(ref.current);
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('Success');
    expect(el.className).toBe('tick');
    expect(el.getAttribute('data-testid')).toBe('ok');
    expect(el.style.width).toBe('80px');
    expect(el.style.height).toBe('80px');
    expect(el.style.margin).toBe('8px');
  });

  it('can’t animate here: says why, pops Blade’s badge in with its check, then calls onComplete once', async () => {
    const onError = jest.fn();
    const onComplete = jest.fn();
    const { container } = renderWithTheme(
      <RazorSenseSuccess onError={onError} onComplete={onComplete} accessibilityLabel="Paid" />,
    );
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(root(container).getAttribute('aria-label')).toBe('Paid');
    await waitFor(() => expect(hasCheck(container)).toBe(true));
    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), { timeout: 4000 });
    // (no orb, nothing drawn by the GPU)
    expect(container.querySelector('canvas')).toBeNull();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('reduced motion: the badge as it ends, with its check, at once; onComplete, no error', async () => {
    reduceMotion(true);
    const onError = jest.fn();
    const onComplete = jest.fn();
    const { container } = renderWithTheme(
      <RazorSenseSuccess onError={onError} onComplete={onComplete} />,
    );
    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
    expect(hasCheck(container)).toBe(true);
    expect(onError).not.toHaveBeenCalled();
  });
});
