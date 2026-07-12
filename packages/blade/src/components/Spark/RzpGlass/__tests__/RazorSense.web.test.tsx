jest.mock('../RazorSenseAuthored', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    RazorSenseAuthored: ({
      mode,
      paused,
      interactive,
      assetsPath,
      onError,
    }: {
      mode: string;
      paused: boolean;
      interactive: boolean;
      assetsPath?: string;
      onError?: (error: Error) => void;
    }) => {
      const hasReportedErrorRef = React.useRef(false);
      React.useEffect(() => {
        if (assetsPath !== '__test_error__' || hasReportedErrorRef.current) return;
        hasReportedErrorRef.current = true;
        onError?.(new Error('Authored renderer failed'));
      }, [assetsPath, onError]);

      return React.createElement('div', {
        'data-testid': 'authored-renderer',
        'data-mode': mode,
        'data-paused': String(paused),
        'data-interactive': String(interactive),
      });
    },
  };
});

jest.mock('../RazorSenseMood', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    RazorSenseMood: ({ mode }: { mode: string }) =>
      React.createElement('div', {
        'data-testid': 'mood-renderer',
        'data-mode': mode,
      }),
  };
});

jest.mock('../RzpGlassMount', () => ({
  RzpGlassMount: jest.fn().mockImplementation(() => ({
    loadAssets: jest.fn(() => new Promise<void>(() => undefined)),
    dispose: jest.fn(),
    setUniforms: jest.fn(),
    updateGradientMapTexture: jest.fn(),
    pause: jest.fn(),
    play: jest.fn(),
  })),
}));

jest.mock('~utils/logger', () => ({
  ...jest.requireActual<typeof import('~utils/logger')>('~utils/logger'),
  logger: jest.fn(),
}));

import { RazorSense } from '../index';
import type { RazorSenseProps } from '../index';
import { RzpGlassMount } from '../RzpGlassMount';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { logger } from '~utils/logger';

const getRazorSenseHost = (container: HTMLElement): HTMLElement => {
  const host = container.querySelector<HTMLElement>('[data-blade-component="razorsense"]');
  expect(host).not.toBeNull();
  return host as HTMLElement;
};

describe('<RazorSense />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('routes omitted mode and no props to semantic Neutral', () => {
    const { container, getByTestId } = renderWithTheme(<RazorSense />);

    expect(getRazorSenseHost(container)).toHaveAttribute('data-razor-sense-mode', 'neutral');
    expect(getByTestId('authored-renderer')).toHaveAttribute('data-mode', 'neutral');
    expect(RzpGlassMount).not.toHaveBeenCalled();
  });

  it('uses canonical pause state over its alias and defaults omitted mode to Neutral', () => {
    const canonicalTrue = renderWithTheme(<RazorSense paused={false} isPaused={true} />);

    expect(getRazorSenseHost(canonicalTrue.container)).toHaveAttribute(
      'data-razor-sense-mode',
      'neutral',
    );
    expect(canonicalTrue.getByTestId('authored-renderer')).toHaveAttribute('data-paused', 'true');
    canonicalTrue.unmount();

    const canonicalFalse = renderWithTheme(<RazorSense paused={true} isPaused={false} />);
    expect(canonicalFalse.getByTestId('authored-renderer')).toHaveAttribute('data-paused', 'false');
  });

  it('uses canonical interactivity over its alias', () => {
    const canonicalTrue = renderWithTheme(<RazorSense interactive={false} isInteractive={true} />);

    expect(canonicalTrue.getByTestId('authored-renderer')).toHaveAttribute(
      'data-interactive',
      'true',
    );
    canonicalTrue.unmount();

    const canonicalFalse = renderWithTheme(<RazorSense interactive={true} isInteractive={false} />);
    expect(canonicalFalse.getByTestId('authored-renderer')).toHaveAttribute(
      'data-interactive',
      'false',
    );
  });

  it('is decorative by default and exposes an image only when labelled', () => {
    const decorative = renderWithTheme(<RazorSense />);
    const decorativeHost = getRazorSenseHost(decorative.container);

    expect(decorativeHost).toHaveAttribute('aria-hidden', 'true');
    expect(decorativeHost).not.toHaveAttribute('role');
    decorative.unmount();

    const labelled = renderWithTheme(<RazorSense accessibilityLabel="AI assistant activity" />);
    expect(labelled.getByRole('img', { name: 'AI assistant activity' })).toBe(
      getRazorSenseHost(labelled.container),
    );
  });

  it('keeps authored presets semantic unless a raw legacy control is present', () => {
    const authoredPresets = [
      ['default', 'neutral'],
      ['zoomed', 'thinking'],
      ['bottomWave', 'typing'],
    ] as const;

    authoredPresets.forEach(([preset, mode]) => {
      const rendered = renderWithTheme(<RazorSense preset={preset} />);
      expect(getRazorSenseHost(rendered.container)).toHaveAttribute('data-razor-sense-mode', mode);
      expect(rendered.getByTestId('authored-renderer')).toHaveAttribute('data-mode', mode);
      rendered.unmount();
    });
    expect(RzpGlassMount).not.toHaveBeenCalled();

    const rawLegacy = renderWithTheme(<RazorSense preset="zoomed" numSegments={24} />);
    expect(rawLegacy.queryByTestId('authored-renderer')).not.toBeInTheDocument();
    expect(rawLegacy.container.querySelector('[data-razor-sense-mode]')).not.toBeInTheDocument();
    expect(RzpGlassMount).toHaveBeenCalledTimes(1);
  });

  it('preserves styled props, testID, and analytics attributes on the raw legacy host', () => {
    const { getByTestId } = renderWithTheme(
      <RazorSense
        numSegments={24}
        marginTop="spacing.3"
        testID="legacy-razorsense"
        data-analytics-section="legacy-material"
      />,
    );
    const host = getByTestId('legacy-razorsense');

    expect(host).toHaveAttribute('data-blade-component', 'razorsense');
    expect(host).toHaveAttribute('data-analytics-section', 'legacy-material');
    expect(window.getComputedStyle(host).marginTop).toBe('8px');
    expect(RzpGlassMount).toHaveBeenCalledTimes(1);
  });

  it('reports semantic renderer errors without reporting a successful load', () => {
    const onLoad = jest.fn();
    const onError = jest.fn();

    renderWithTheme(<RazorSense assetsPath="__test_error__" onLoad={onLoad} onError={onError} />);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Authored renderer failed' }),
    );
    expect(onLoad).not.toHaveBeenCalled();
  });

  it('lets semantic controls win runtime legacy collisions and warns once with ignored keys', () => {
    const firstCollision = ({
      isPaused: true,
      numSegments: 24,
    } as unknown) as RazorSenseProps;
    const first = renderWithTheme(<RazorSense {...firstCollision} />);

    expect(getRazorSenseHost(first.container)).toHaveAttribute('data-razor-sense-mode', 'neutral');
    expect(first.getByTestId('authored-renderer')).toHaveAttribute('data-paused', 'true');
    expect(RzpGlassMount).not.toHaveBeenCalled();
    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('numSegments') }),
    );
    first.unmount();

    const secondCollision = ({
      isInteractive: false,
      videoSrc: '/legacy-video.mp4',
    } as unknown) as RazorSenseProps;
    renderWithTheme(<RazorSense {...secondCollision} />);
    expect(logger).toHaveBeenCalledTimes(1);
  });
});
