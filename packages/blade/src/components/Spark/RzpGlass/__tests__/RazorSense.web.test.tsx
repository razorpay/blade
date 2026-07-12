import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { RazorSense } from '../index';
import type { RazorSenseProps } from '../index';
import { RzpGlassMount } from '../RzpGlassMount';
import type { RazorSenseRuntimeSnapshot } from '../RazorSenseRuntime';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { logger } from '~utils/logger';

const mockUseRazorSenseLifecycle = jest.fn();

jest.mock('../useRazorSenseLifecycle', () => ({
  useRazorSenseLifecycle: (...args: unknown[]) => mockUseRazorSenseLifecycle(...args),
}));

jest.mock('../RazorSenseAuthored', () => {
  const ReactModule = jest.requireActual<typeof React>('react');
  return {
    RazorSenseAuthored: ({
      mode,
      paused,
      interactive,
      assetsPath,
      onLoad,
      onError,
    }: {
      mode: string;
      paused: boolean;
      interactive: boolean;
      assetsPath?: string;
      onLoad?: () => void;
      onError?: (error: Error) => void;
    }) => {
      const hasSettledRef = ReactModule.useRef(false);
      ReactModule.useEffect(() => {
        if (hasSettledRef.current) return;
        hasSettledRef.current = true;
        if (assetsPath === '__test_error__') {
          onError?.(new Error('Authored renderer failed'));
        } else {
          onLoad?.();
        }
      }, [assetsPath, onError, onLoad]);

      return ReactModule.createElement('div', {
        'data-testid': 'authored-renderer',
        'data-mode': mode,
        'data-paused': String(paused),
        'data-interactive': String(interactive),
      });
    },
  };
});

jest.mock('../RazorSenseMood', () => {
  const ReactModule = jest.requireActual<typeof React>('react');
  return {
    RazorSenseMood: ({
      mode,
      paused,
      onLoad,
    }: {
      mode: string;
      paused: boolean;
      onLoad?: () => void;
    }) => {
      const hasLoadedRef = ReactModule.useRef(false);
      ReactModule.useEffect(() => {
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;
        onLoad?.();
      }, [onLoad]);

      return ReactModule.createElement('div', {
        'data-testid': 'mood-renderer',
        'data-mode': mode,
        'data-paused': String(paused),
      });
    },
  };
});

jest.mock('../RzpGlassMount', () => ({
  RzpGlassMount: jest.fn().mockImplementation(() => ({
    loadAssets: jest.fn(() => Promise.resolve()),
    dispose: jest.fn(),
    setUniforms: jest.fn(),
    updateGradientMapTexture: jest.fn(),
    pause: jest.fn(),
    play: jest.fn(),
  })),
}));

jest.mock('~utils/logger', () => ({ logger: jest.fn() }));

const getRazorSenseHost = (container: HTMLElement): HTMLElement => {
  const host = container.querySelector<HTMLElement>('[data-blade-component="razorsense"]');
  expect(host).not.toBeNull();
  return host!;
};

const ACTIVE_LIFECYCLE: RazorSenseRuntimeSnapshot = {
  state: 'active',
  isAdmitted: true,
  isPageVisible: true,
  intersectionRatio: 1,
};

const getLatestRuntimeOptions = (): { family: string; retainsWebGL?: boolean } => {
  const latestCall = mockUseRazorSenseLifecycle.mock.calls[
    mockUseRazorSenseLifecycle.mock.calls.length - 1
  ] as [React.RefObject<HTMLElement>, { family: string; retainsWebGL?: boolean }];
  return latestCall[1];
};

const getLatestRuntimeFamily = (): string => getLatestRuntimeOptions().family;

describe('<RazorSense />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRazorSenseLifecycle.mockReturnValue(ACTIVE_LIFECYCLE);
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

  it('keeps authored presets semantic unless a raw legacy control is present', async () => {
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
    await act(async () => {
      await Promise.resolve();
    });
    expect(rawLegacy.queryByTestId('authored-renderer')).not.toBeInTheDocument();
    expect(rawLegacy.container.querySelector('[data-razor-sense-mode]')).not.toBeInTheDocument();
    expect(RzpGlassMount).toHaveBeenCalledTimes(1);
  });

  it('preserves styled props, testID, and analytics attributes on the raw legacy host', async () => {
    const { getByTestId } = renderWithTheme(
      <RazorSense
        numSegments={24}
        marginTop="spacing.3"
        testID="legacy-razorsense"
        data-analytics-section="legacy-material"
      />,
    );
    await act(async () => {
      await Promise.resolve();
    });
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

  it('hands runtime admission to the requested authored family before the emotional fade ends', async () => {
    jest.useFakeTimers();
    const requestAnimationFrame = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });

    const Example = (): React.ReactElement => {
      const [mode, setMode] = React.useState<'calm' | 'neutral'>('calm');
      return (
        <>
          <button type="button" onClick={() => setMode('neutral')}>
            Use authored
          </button>
          <RazorSense mode={mode} modeTransitionDuration={0.1} />
        </>
      );
    };

    const { getByRole } = renderWithTheme(<Example />);
    expect(getLatestRuntimeFamily()).toBe('emotional');
    expect(getLatestRuntimeOptions().retainsWebGL).toBe(false);

    fireEvent.click(getByRole('button', { name: 'Use authored' }));
    expect(getLatestRuntimeFamily()).toBe('authored');
    expect(getLatestRuntimeOptions().retainsWebGL).toBe(true);

    await act(async () => {
      jest.advanceTimersByTime(179);
      await Promise.resolve();
    });
    expect(getLatestRuntimeFamily()).toBe('authored');
    expect(getLatestRuntimeOptions().retainsWebGL).toBe(true);
    await act(async () => {
      jest.advanceTimersByTime(1);
      await Promise.resolve();
    });
    expect(getLatestRuntimeFamily()).toBe('authored');
    expect(getLatestRuntimeOptions().retainsWebGL).toBe(false);

    requestAnimationFrame.mockRestore();
    jest.useRealTimers();
  });

  it('keeps runtime-induced legacy pause through fade and resumes after 200ms', async () => {
    jest.useFakeTimers();
    let lifecycle: RazorSenseRuntimeSnapshot = {
      ...ACTIVE_LIFECYCLE,
      state: 'dormant',
      isAdmitted: false,
    };
    let resolveLoadAssets: (() => void) | undefined;
    const mount = {
      loadAssets: jest.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveLoadAssets = resolve;
          }),
      ),
      dispose: jest.fn(),
      setUniforms: jest.fn(),
      updateGradientMapTexture: jest.fn(),
      pause: jest.fn(),
      play: jest.fn(),
    };
    (RzpGlassMount as jest.Mock).mockImplementationOnce(() => mount);
    mockUseRazorSenseLifecycle.mockImplementation(() => lifecycle);

    const Example = (): React.ReactElement => {
      const [, renderAgain] = React.useReducer((value) => value + 1, 0);
      return (
        <>
          <button type="button" onClick={renderAgain}>
            Update lifecycle
          </button>
          <RazorSense numSegments={24} />
        </>
      );
    };

    const { getByRole } = renderWithTheme(<Example />);
    expect(RzpGlassMount).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.any(Object),
      expect.objectContaining({ paused: true }),
    );

    lifecycle = ACTIVE_LIFECYCLE;
    fireEvent.click(getByRole('button', { name: 'Update lifecycle' }));
    await act(async () => {
      resolveLoadAssets?.();
      await Promise.resolve();
    });

    expect(mount.setUniforms).not.toHaveBeenCalledWith(expect.objectContaining({ paused: false }));
    expect(mount.play).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(199);
      await Promise.resolve();
    });
    expect(mount.play).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(1);
      await Promise.resolve();
    });
    expect(mount.play).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it('clears the legacy fade timer on cleanup', async () => {
    jest.useFakeTimers();
    const rendered = renderWithTheme(<RazorSense numSegments={24} />);
    await act(async () => {
      await Promise.resolve();
    });
    const mount = (RzpGlassMount as jest.Mock).mock.results.at(-1)!.value as {
      play: jest.Mock;
    };

    expect(jest.getTimerCount()).toBe(1);
    rendered.unmount();
    expect(jest.getTimerCount()).toBe(0);
    await act(async () => {
      jest.advanceTimersByTime(200);
      await Promise.resolve();
    });
    expect(mount.play).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('feeds lifecycle denial and suspension into emotional and legacy pause', async () => {
    mockUseRazorSenseLifecycle.mockReturnValue({
      ...ACTIVE_LIFECYCLE,
      isAdmitted: false,
    });
    const emotional = renderWithTheme(<RazorSense mode="calm" />);
    expect(emotional.getByTestId('mood-renderer')).toHaveAttribute('data-paused', 'true');
    emotional.unmount();

    mockUseRazorSenseLifecycle.mockReturnValue({
      ...ACTIVE_LIFECYCLE,
      state: 'suspended',
      isAdmitted: false,
    });
    renderWithTheme(<RazorSense numSegments={24} />);
    await act(async () => {
      await Promise.resolve();
    });

    expect(RzpGlassMount).toHaveBeenLastCalledWith(
      expect.any(HTMLElement),
      expect.any(Object),
      expect.objectContaining({ paused: true }),
    );
    const legacyMount = (RzpGlassMount as jest.Mock).mock.results.at(-1)!.value as {
      setUniforms: jest.Mock;
    };
    expect(legacyMount.setUniforms).toHaveBeenCalledWith(expect.objectContaining({ paused: true }));
  });
});
