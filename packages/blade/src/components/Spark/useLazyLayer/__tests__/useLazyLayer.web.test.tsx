import React from 'react';
import { render, waitFor } from '@testing-library/react';
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

const setReducedMotion = (isReduced: boolean): void => {
  window.matchMedia = (((query: string) => ({
    matches: isReduced && query.includes('reduce'),
    media: query,
  })) as unknown) as typeof window.matchMedia;
};

describe('useLazyLayer', () => {
  const { matchMedia } = window;
  afterEach(() => {
    window.matchMedia = matchMedia;
  });

  it('loads the layer once enabled', async () => {
    setReducedMotion(false);
    const load = jest.fn(() => Promise.resolve(Layer));
    const { findByText } = render(<Host load={load} />);
    expect(await findByText('layer')).toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('loads nothing with reduced motion', async () => {
    setReducedMotion(true);
    const load = jest.fn(() => Promise.resolve(Layer));
    const { queryByText } = render(<Host load={load} />);
    await waitFor(() => expect(load).not.toHaveBeenCalled());
    expect(queryByText('layer')).toBeNull();
  });
});
