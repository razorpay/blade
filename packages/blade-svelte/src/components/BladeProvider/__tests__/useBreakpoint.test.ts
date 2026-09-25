import { render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BreakpointHarness from './BreakpointHarness.svelte';
import BreakpointConsumer from './BreakpointConsumer.svelte';

type Listener = (event: { media: string; matches: boolean }) => void;

/**
 * Replace jsdom's matchMedia with one whose match state is driven by a mutable
 * viewport width, and expose `resize()` to fire the change listeners.
 */
const installViewport = (initialWidth: number): { resize: (width: number) => void } => {
  let width = initialWidth;
  const listeners = new Map<string, Set<Listener>>();

  const matches = (query: string): boolean => {
    const min = Number(/min-width: (\d+)px/.exec(query)?.[1] ?? 0);
    const max = Number(/max-width: (\d+)px/.exec(query)?.[1] ?? Infinity);
    return width >= min && width <= max;
  };

  window.matchMedia = (((query: string) => ({
    media: query,
    get matches() {
      return matches(query);
    },
    addEventListener: (_: string, cb: Listener) => {
      if (!listeners.has(query)) listeners.set(query, new Set());
      listeners.get(query)!.add(cb);
    },
    removeEventListener: (_: string, cb: Listener) => listeners.get(query)?.delete(cb),
  })) as unknown) as typeof window.matchMedia;

  return {
    resize: (next) => {
      const before = new Map([...listeners.keys()].map((q) => [q, matches(q)]));
      width = next;
      listeners.forEach((cbs, query) => {
        const now = matches(query);
        if (now !== before.get(query)) {
          cbs.forEach((cb) => cb({ media: query, matches: now }));
        }
      });
    },
  };
};

describe('useBreakpoint', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('resolves the current breakpoint and device type after mount', async () => {
    installViewport(1100);
    render(BreakpointHarness);

    await waitFor(() => expect(screen.getByTestId('breakpoint')).toHaveTextContent('l'));
    expect(screen.getByTestId('device')).toHaveTextContent('desktop');
  });

  it('treats tablet widths as mobile', async () => {
    installViewport(600);
    render(BreakpointHarness);

    await waitFor(() => expect(screen.getByTestId('breakpoint')).toHaveTextContent('s'));
    expect(screen.getByTestId('device')).toHaveTextContent('mobile');
  });

  it('updates reactively when the viewport crosses a breakpoint', async () => {
    const viewport = installViewport(1300);
    render(BreakpointHarness);
    await waitFor(() => expect(screen.getByTestId('breakpoint')).toHaveTextContent('xl'));

    viewport.resize(400);

    await waitFor(() => expect(screen.getByTestId('breakpoint')).toHaveTextContent('xs'));
    expect(screen.getByTestId('device')).toHaveTextContent('mobile');
  });

  it('throws outside BladeProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(BreakpointConsumer)).toThrow(
      '[Blade: useBreakpoint]: BladeProvider is missing',
    );
    consoleError.mockRestore();
  });
});
