import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { useLazyLayer } from '../useLazyLayer';

const Layer = (): React.ReactElement => <span>layer</span>;

const Host = ({
  load,
}: {
  load: () => Promise<React.ComponentType>;
}): React.ReactElement | null => {
  const Loaded = useLazyLayer(load, true);
  return Loaded ? <Loaded /> : null;
};

/** a reduced-motion setting the test can turn on and off, as the system's would */
const motionSetting = (isReduced: boolean): { set: (isReducedNow: boolean) => void } => {
  let matches = isReduced;
  const listeners = new Set<() => void>();
  window.matchMedia = (((query: string) => ({
    get matches() {
      return matches && query.includes('reduce');
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
});
