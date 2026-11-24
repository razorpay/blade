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

  it("loads nothing on a device that can't hover (a phone) until a keyboard focus anywhere on the page", async () => {
    motionSetting(false, false);
    const load = jest.fn(() => Promise.resolve(Layer));
    const { queryByText } = render(<Host load={load} />);
    const field = document.createElement('input');
    document.body.append(field);
    const isKeyboard = { now: false };
    const matches = field.matches.bind(field);
    field.matches = (selector: string) =>
      selector === ':focus-visible' ? isKeyboard.now : matches(selector);
    await act(() => new Promise((resolve) => setTimeout(resolve, 30)));
    expect(load).not.toHaveBeenCalled();

    // a tap's focus: still nothing
    act(() => {
      field.focus();
    });
    await act(() => new Promise((resolve) => setTimeout(resolve, 30)));
    expect(load).not.toHaveBeenCalled();
    act(() => {
      field.blur();
    });

    // a keyboard's (a tablet's), on anything: loaded
    isKeyboard.now = true;
    act(() => {
      field.focus();
    });
    await waitFor(() => expect(queryByText('layer')).not.toBeNull());
    expect(load).toHaveBeenCalledTimes(1);
    field.remove();
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
});
