import * as React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import {
  createRazorSenseSequenceController,
  disposeRazorSenseController,
  RazorSense,
  RazorSenseSequence,
  razorSenseLoginToDashboardJourney,
} from '../index';
import { getRazorSenseControlledRequestKey } from '../RazorSense.web';
import type { RazorSenseProps } from '../index';
import { RzpGlassMount } from '../RzpGlassMount';
import type { RazorSenseRuntimeSnapshot } from '../RazorSenseRuntime';
import renderWithTheme from '~utils/testing/renderWithTheme';
import { logger } from '~utils/logger';

const mockUseRazorSenseLifecycle = jest.fn();
const mockDelayedMoodLoads: Array<() => void> = [];

jest.mock('../useRazorSenseLifecycle', () => ({
  useRazorSenseLifecycle: (...args: unknown[]) => mockUseRazorSenseLifecycle(...args),
}));

jest.mock('../RazorSensePreloadBroker', () => ({
  claimRazorSensePreloadedVideo: () => undefined,
  clearRazorSensePreloads: () => undefined,
  preloadRazorSenseVideo: () => Promise.resolve(),
  releaseRazorSensePreload: () => undefined,
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
      onPresentationReady,
      onError,
    }: {
      mode: string;
      paused: boolean;
      interactive: boolean;
      assetsPath?: string;
      onLoad?: () => void;
      onPresentationReady?: (mode: string) => void;
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
          onPresentationReady?.(mode);
        }
      }, [assetsPath, onError, onLoad, onPresentationReady]);

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
      runtimeState,
      isRuntimeAdmitted,
      assetsPath,
      onLoad,
      onPresentationReady,
    }: {
      mode: string;
      paused: boolean;
      runtimeState?: string;
      isRuntimeAdmitted?: boolean;
      assetsPath?: string;
      onLoad?: () => void;
      onPresentationReady?: (mode: string) => void;
    }) => {
      const hasLoadedRef = ReactModule.useRef(false);
      ReactModule.useEffect(() => {
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;
        if (assetsPath === '__test_slow_mood__') {
          mockDelayedMoodLoads.push(() => {
            onLoad?.();
            onPresentationReady?.(mode);
          });
          return;
        }
        onLoad?.();
        onPresentationReady?.(mode);
      }, [assetsPath, onLoad, onPresentationReady]);

      return ReactModule.createElement('div', {
        'data-testid': 'mood-renderer',
        'data-mode': mode,
        'data-paused': String(paused),
        'data-runtime-state': runtimeState,
        'data-runtime-admitted': String(isRuntimeAdmitted),
      });
    },
  };
});

jest.mock('../RzpGlassMount', () => ({
  RzpGlassMount: jest.fn().mockImplementation(() => ({
    canvasElement: globalThis.document.createElement('canvas'),
    loadAssets: jest.fn(() => Promise.resolve()),
    dispose: jest.fn(),
    setUniforms: jest.fn(),
    updateGradientMapTexture: jest.fn(),
    pause: jest.fn(),
    play: jest.fn(),
  })),
}));

jest.mock('../RazorSenseAudioWave', () => {
  const ReactModule = jest.requireActual<typeof React>('react');
  return {
    RazorSenseAudioWave: ({
      assetKey,
      paused,
      onReady,
    }: {
      assetKey?: string;
      paused: boolean;
      onReady: () => void;
    }) => {
      ReactModule.useEffect(() => onReady(), [onReady]);
      return ReactModule.createElement('div', {
        'data-testid': 'direct-video-renderer',
        'data-asset-key': assetKey,
        'data-paused': String(paused),
      });
    },
  };
});

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
  let elementRectSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDelayedMoodLoads.length = 0;
    mockUseRazorSenseLifecycle.mockReturnValue(ACTIVE_LIFECYCLE);
    elementRectSpy = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 320,
      bottom: 180,
      left: 0,
      width: 320,
      height: 180,
      toJSON: () => ({}),
    } as DOMRect);
  });

  afterEach(() => elementRectSpy.mockRestore());

  it('routes omitted mode and no props to semantic Neutral', () => {
    const { container, getByTestId } = renderWithTheme(<RazorSense />);

    expect(getRazorSenseHost(container)).toHaveAttribute('data-razor-sense-mode', 'neutral');
    expect(getByTestId('authored-renderer')).toHaveAttribute('data-mode', 'neutral');
    expect(RzpGlassMount).not.toHaveBeenCalled();
  });

  it('uses canonical pause state over its alias and defaults omitted mode to Neutral', async () => {
    const canonicalTrue = renderWithTheme(<RazorSense paused={false} isPaused={true} />);

    expect(getRazorSenseHost(canonicalTrue.container)).toHaveAttribute(
      'data-razor-sense-mode',
      'neutral',
    );
    expect(canonicalTrue.getByTestId('authored-renderer')).toHaveAttribute('data-paused', 'true');
    canonicalTrue.unmount();

    const canonicalFalse = renderWithTheme(<RazorSense paused={true} isPaused={false} />);
    await waitFor(() =>
      expect(canonicalFalse.getByTestId('authored-renderer')).toHaveAttribute(
        'data-paused',
        'false',
      ),
    );
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

  it('distinguishes duration overrides and typed replay identities in controlled requests', () => {
    const target = { state: 'thinking' } as const;
    const quick = getRazorSenseControlledRequestKey(target, {
      state: 'thinking',
      transition: { duration: 'duration.quick' },
      replayKey: 0,
    });
    const gentle = getRazorSenseControlledRequestKey(target, {
      state: 'thinking',
      transition: { duration: 'duration.gentle' },
      replayKey: 0,
    });
    const stringReplay = getRazorSenseControlledRequestKey(target, {
      state: 'thinking',
      transition: { duration: 'duration.gentle' },
      replayKey: '0',
    });

    expect(quick).not.toBe(gentle);
    expect(gentle).not.toBe(stringReplay);
  });

  it('pauses an authored sequence composition when its external controller pauses', async () => {
    const controller = createRazorSenseSequenceController(razorSenseLoginToDashboardJourney);
    const { container, unmount } = renderWithTheme(
      <RazorSenseSequence
        sequence={razorSenseLoginToDashboardJourney}
        controller={controller}
        foreground={{ source: <div />, destination: <div /> }}
      />,
    );
    const material = container.querySelector('[data-razor-sense-login-material="true"]');

    expect(material).toHaveAttribute('data-razor-sense-login-material-paused', 'false');
    act(() => controller.pause());
    await waitFor(() =>
      expect(material).toHaveAttribute('data-razor-sense-login-material-paused', 'true'),
    );
    act(() => controller.resume());
    await waitFor(() =>
      expect(material).toHaveAttribute('data-razor-sense-login-material-paused', 'false'),
    );

    unmount();
    disposeRazorSenseController(controller);
  });

  it('keeps authored presets semantic unless a raw legacy control is present', async () => {
    const authoredPresets = [
      ['default', 'neutral'],
      ['zoomed', 'thinking'],
    ] as const;

    authoredPresets.forEach(([preset, mode]) => {
      const rendered = renderWithTheme(<RazorSense preset={preset} />);
      expect(getRazorSenseHost(rendered.container)).toHaveAttribute('data-razor-sense-mode', mode);
      expect(rendered.getByTestId('authored-renderer')).toHaveAttribute('data-mode', mode);
      rendered.unmount();
    });
    expect(RzpGlassMount).not.toHaveBeenCalled();

    const bottomWave = renderWithTheme(<RazorSense preset="bottomWave" />);
    expect(bottomWave.getByTestId('direct-video-renderer')).toHaveAttribute(
      'data-asset-key',
      'bottomWave',
    );
    bottomWave.unmount();

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

    const { getByRole, getByTestId } = renderWithTheme(<Example />);
    expect(getLatestRuntimeFamily()).toBe('emotional');
    expect(getLatestRuntimeOptions().retainsWebGL).toBe(false);

    fireEvent.click(getByRole('button', { name: 'Use authored' }));
    expect(getLatestRuntimeFamily()).toBe('authored');
    expect(getLatestRuntimeOptions().retainsWebGL).toBe(true);
    expect(getByTestId('mood-renderer')).toHaveAttribute('data-paused', 'false');
    expect(getByTestId('mood-renderer')).toHaveAttribute('data-runtime-state', 'active');
    expect(getByTestId('mood-renderer')).toHaveAttribute('data-runtime-admitted', 'true');

    await act(async () => {
      jest.advanceTimersByTime(179);
      await Promise.resolve();
    });
    expect(getLatestRuntimeFamily()).toBe('authored');
    expect(getLatestRuntimeOptions().retainsWebGL).toBe(true);
    expect(getByTestId('mood-renderer')).toHaveAttribute('data-paused', 'false');
    await act(async () => {
      jest.advanceTimersByTime(1);
      await Promise.resolve();
    });
    expect(getLatestRuntimeFamily()).toBe('authored');
    expect(getLatestRuntimeOptions().retainsWebGL).toBe(false);

    requestAnimationFrame.mockRestore();
    jest.useRealTimers();
  });

  it('disposes a slow hidden emotional family when the request returns to authored', async () => {
    jest.useFakeTimers();
    const requestAnimationFrame = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });

    const Example = (): React.ReactElement => {
      const [mode, setMode] = React.useState<'neutral' | 'calm'>('neutral');
      return (
        <>
          <button type="button" onClick={() => setMode('calm')}>
            Use emotional
          </button>
          <button type="button" onClick={() => setMode('neutral')}>
            Use authored
          </button>
          <RazorSense assetsPath="__test_slow_mood__" mode={mode} modeTransitionDuration={0.1} />
        </>
      );
    };

    const { getByRole, getByTestId, queryByTestId } = renderWithTheme(<Example />);
    fireEvent.click(getByRole('button', { name: 'Use emotional' }));
    expect(getByTestId('mood-renderer')).toBeInTheDocument();
    expect(mockDelayedMoodLoads).toHaveLength(1);

    fireEvent.click(getByRole('button', { name: 'Use authored' }));
    await act(async () => {
      jest.advanceTimersByTime(180);
      await Promise.resolve();
    });

    expect(queryByTestId('mood-renderer')).not.toBeInTheDocument();

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
      canvasElement: document.createElement('canvas'),
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
    expect(RzpGlassMount).not.toHaveBeenCalled();

    lifecycle = ACTIVE_LIFECYCLE;
    fireEvent.click(getByRole('button', { name: 'Update lifecycle' }));
    expect(RzpGlassMount).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.any(Object),
      expect.objectContaining({ paused: false }),
    );
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

  it('passes the public lifecycle contract to emotional renderers and does not mount denied legacy WebGL', async () => {
    mockUseRazorSenseLifecycle.mockReturnValue({
      ...ACTIVE_LIFECYCLE,
      isAdmitted: false,
    });
    const emotional = renderWithTheme(<RazorSense mode="calm" />);
    await waitFor(() =>
      expect(emotional.getByTestId('mood-renderer')).toHaveAttribute('data-paused', 'false'),
    );
    expect(emotional.getByTestId('mood-renderer')).toHaveAttribute('data-runtime-state', 'active');
    expect(emotional.getByTestId('mood-renderer')).toHaveAttribute(
      'data-runtime-admitted',
      'false',
    );
    emotional.unmount();

    mockUseRazorSenseLifecycle.mockReturnValue({
      ...ACTIVE_LIFECYCLE,
      state: 'suspended',
      isAdmitted: false,
    });
    const deniedLegacy = renderWithTheme(<RazorSense numSegments={24} />);
    await act(async () => {
      await Promise.resolve();
    });

    const legacyHost = deniedLegacy.container.querySelector('[data-blade-component="razorsense"]');
    expect(legacyHost).toHaveAttribute('data-razor-sense-runtime-state', 'suspended');
    expect(legacyHost).toHaveAttribute('data-razor-sense-runtime-admitted', 'false');
    expect(RzpGlassMount).not.toHaveBeenCalled();
  });
});
