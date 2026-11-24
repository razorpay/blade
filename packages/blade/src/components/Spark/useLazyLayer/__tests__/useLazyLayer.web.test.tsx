import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { useLazyLayer } from '../useLazyLayer';
import { hoverNotes } from '../hoverLog';

const Layer = (): React.ReactElement => <span>layer</span>;

const Host = ({
  load,
}: {
  load: () => Promise<React.ComponentType>;
}): React.ReactElement | null => {
  const Loaded = useLazyLayer(load, true);
  return Loaded ? <Loaded /> : null;
};

/** a reduced-motion setting the test can turn on and off, as the system's would (on a device that can hover, unless told) */
const motionSetting = (
  isReduced: boolean,
  canHoverHere = true,
): { set: (isReducedNow: boolean) => void } => {
  let matches = isReduced;
  const listeners = new Set<() => void>();
  window.matchMedia = (((query: string) => ({
    get matches() {
      return query.includes('any-hover') ? canHoverHere : matches && query.includes('reduce');
    },
    media: query,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  })) as unknown) as typeof window.matchMedia;
  return {
    set: (isReducedNow) => {
      matches = isReducedNow;
      listeners.forEach((listener) => listener());
    },
  };
};

describe('useLazyLayer', () => {
  const { matchMedia } = window;
  afterEach(() => {
    window.matchMedia = matchMedia;
  });

  it('loads the layer once enabled', async () => {
    motionSetting(false);
    const load = jest.fn(() => Promise.resolve(Layer));
    const { findByText } = render(<Host load={load} />);
    expect(await findByText('layer')).toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('loads nothing with reduced motion, and loads once it is turned off', async () => {
    const setting = motionSetting(true);
    const load = jest.fn(() => Promise.resolve(Layer));
    const { queryByText, findByText } = render(<Host load={load} />);
    await waitFor(() => expect(load).not.toHaveBeenCalled());
    expect(queryByText('layer')).toBeNull();
    act(() => setting.set(false));
    expect(await findByText('layer')).toBeInTheDocument();
  });

  it('takes a loaded layer off when reduced motion is turned on, and puts it back after', async () => {
    const setting = motionSetting(false);
    const load = jest.fn(() => Promise.resolve(Layer));
    const { queryByText, findByText } = render(<Host load={load} />);
    expect(await findByText('layer')).toBeInTheDocument();
    act(() => setting.set(true));
    expect(queryByText('layer')).toBeNull();
    act(() => setting.set(false));
    expect(queryByText('layer')).toBeInTheDocument();
    // (kept, not loaded again)
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("loads nothing on a device that can't hover (a phone) until a keyboard focus on a button or link (not a text field's tap)", async () => {
    motionSetting(false, false);
    const load = jest.fn(() => Promise.resolve(Layer));
    const { queryByText } = render(<Host load={load} />);
    /** an element whose focus is from the keyboard (`:focus-visible`) or not */
    const make = (tag: string): HTMLElement & { isKeyboard: boolean } => {
      const el = Object.assign(document.createElement(tag), { isKeyboard: false });
      const matches = el.matches.bind(el);
      el.matches = (selector: string) =>
        selector === ':focus-visible' ? el.isKeyboard : matches(selector);
      document.body.append(el);
      return el;
    };
    const field = make('input');
    const other = make('button');
    await act(() => new Promise((resolve) => setTimeout(resolve, 30)));
    expect(load).not.toHaveBeenCalled();

    // a tap on a text field: :focus-visible too (Chrome, Safari), and still nothing
    field.isKeyboard = true;
    act(() => {
      field.focus();
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 30)));
    expect(load).not.toHaveBeenCalled();
    act(() => {
      field.blur();
    });

    // a tap's focus on a button: nothing
    act(() => {
      other.focus();
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 30)));
    expect(load).not.toHaveBeenCalled();
    act(() => {
      other.blur();
    });

    // a keyboard's (a tablet's), on a button: loaded
    other.isKeyboard = true;
    act(() => {
      other.focus();
    });
    await waitFor(() => expect(queryByText('layer')).not.toBeNull());
    expect(load).toHaveBeenCalledTimes(1);
    field.remove();
    other.remove();
  });

  it("loads on a device that says it can't hover once a mouse moves (a desktop that misreports it)", async () => {
    motionSetting(false, false);
    const load = jest.fn(() => Promise.resolve(Layer));
    const { queryByText } = render(<Host load={load} />);
    await act(() => new Promise((resolve) => setTimeout(resolve, 30)));
    // (a touch moving: nothing)
    const touch = new MouseEvent('pointermove');
    Object.defineProperty(touch, 'pointerType', { value: 'touch' });
    window.dispatchEvent(touch);
    await act(() => new Promise((resolve) => setTimeout(resolve, 30)));
    expect(load).not.toHaveBeenCalled();
    const mouse = new MouseEvent('pointermove');
    Object.defineProperty(mouse, 'pointerType', { value: 'mouse' });
    act(() => {
      window.dispatchEvent(mouse);
    });
    await waitFor(() => expect(queryByText('layer')).not.toBeNull());
  });

  it("notes why a layer didn't load (no button says so otherwise: it keeps its own hover)", async () => {
    motionSetting(false);
    const load = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch dynamically imported module')),
    );
    const Named = (): React.ReactElement | null => {
      const Loaded = useLazyLayer(load, true, 'ray');
      return Loaded ? <Loaded /> : null;
    };
    render(<Named />);
    await waitFor(() =>
      expect(hoverNotes[hoverNotes.length - 1]).toMatchObject({
        hover: 'ray',
        what: "off: its layer's code failed to load (Failed to fetch dynamically imported module)",
      }),
    );
  });

  it('notes a layer whose code never arrives (the button keeps its own hover meanwhile)', () => {
    jest.useFakeTimers();
    motionSetting(false);
    const Hanging = (): React.ReactElement | null => {
      const Loaded = useLazyLayer(
        () => new Promise<React.ComponentType>(() => undefined),
        true,
        'razorsense',
      );
      return Loaded ? <Loaded /> : null;
    };
    render(<Hanging />);
    act(() => {
      jest.advanceTimersByTime(8100);
    });
    expect(hoverNotes[hoverNotes.length - 1]).toMatchObject({
      hover: 'razorsense',
      what: "loading: its layer's code hasn't arrived after 8 s",
    });
    jest.useRealTimers();
  });

  it("puts the hovers' notes on window in development, for a browser's console", () => {
    expect(((window as unknown) as { __bladeAiHoverNotes?: unknown }).__bladeAiHoverNotes).toBe(
      hoverNotes,
    );
  });
});
