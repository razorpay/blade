import { act } from '@testing-library/react';
import { RazorSense, RazorSenseSequence, defineRazorSenseSequence } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR';

jest.mock('../RazorSensePreloadBroker', () => ({
  claimRazorSensePreloadedVideo: () => undefined,
  clearRazorSensePreloads: () => undefined,
  preloadRazorSenseVideo: () => Promise.resolve(),
  releaseRazorSensePreload: () => undefined,
}));

jest.mock('../RazorSenseAuthored', () => {
  const ReactModule = jest.requireActual('react');
  return {
    RazorSenseAuthored: ({ mode }: { mode: string }) =>
      ReactModule.createElement('div', { 'data-ssr-authored-mode': mode }),
  };
});

jest.mock('../RazorSenseMood', () => {
  const ReactModule = jest.requireActual('react');
  return {
    RazorSenseMood: ({ mode }: { mode: string }) =>
      ReactModule.createElement('div', { 'data-ssr-mood-mode': mode }),
  };
});

const SSR_SEQUENCE = defineRazorSenseSequence({
  id: 'test.razorsense.ssr.v1',
  steps: [
    { id: 'thinking', state: 'thinking', playback: 'once' },
    { id: 'result', state: 'success', playback: 'once' },
  ],
  endBehavior: 'hold',
});

const MANUAL_SEQUENCE = defineRazorSenseSequence({
  id: 'test.razorsense.manual-without-controller.v1',
  steps: [{ id: 'thinking', state: 'thinking', playback: 'loop', advance: 'manual' }],
});

describe('<RazorSense /> SSR', () => {
  it('hydrates a controlled semantic state without changing its accessible host', async () => {
    const rendered = renderWithSSR(
      <RazorSense
        state="thinking"
        playback="loop"
        accessibilityLabel="Ray is thinking"
        assetsPath="/assets/spark"
      />,
    );
    await act(async () => Promise.resolve());

    expect(rendered.getByRole('img', { name: 'Ray is thinking' })).toHaveAttribute(
      'data-blade-component',
      'razorsense',
    );
    rendered.unmount();
  });

  it('hydrates an authored sequence from its deterministic first step', async () => {
    const rendered = renderWithSSR(
      <RazorSenseSequence
        sequence={SSR_SEQUENCE}
        runId="ssr-run-1"
        accessibilityLabel="Preparing insight"
        assetsPath="/assets/spark"
      />,
    );
    await act(async () => Promise.resolve());

    expect(rendered.getByRole('img', { name: 'Preparing insight' })).toBeInTheDocument();
    rendered.unmount();
  });

  it('rejects a manual-advance sequence when no public controller can advance it', () => {
    expect(() =>
      renderWithSSR(
        <RazorSenseSequence sequence={MANUAL_SEQUENCE} accessibilityLabel="Ray is thinking" />,
      ),
    ).toThrow(
      expect.objectContaining({
        code: 'invalid-sequence-definition',
        message: expect.stringContaining('manual-advance step needs a bound sequence controller'),
      }),
    );
  });
});
