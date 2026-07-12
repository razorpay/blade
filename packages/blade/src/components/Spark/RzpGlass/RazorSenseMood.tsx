/* eslint-disable react/react-in-jsx-scope */

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { RazorSenseEmotionalMode } from './modes';
import {
  getRazorSenseMobileModeVideoSources,
  RAZOR_SENSE_EMOTIONAL_MODES,
  RAZOR_SENSE_MODE_LABELS,
} from './modes';
import { RazorSenseMoodMount } from './RazorSenseMoodMount';
import type { SemanticRazorSenseProps } from './types';
import { captureVideoCoverFrame, DEFAULT_CDN_PATH } from './utils';
import { useTheme } from '~components/BladeProvider';
import type { ColorSchemeNames } from '~tokens/theme';
import { useMergeRefs } from '~utils/useMergeRefs';

const FADE_IN_MS = 200;
const MOBILE_MEDIA_QUERY = '(max-width: 809.98px)';

const FALLBACK_COLORS: Record<ColorSchemeNames, Record<RazorSenseEmotionalMode, string>> = {
  light: {
    calm: '#87C0FE',
    joyful: '#D6F5DA',
    caution: '#FFF0E1',
    regret: '#FBD3C6',
  },
  dark: {
    calm: '#0E1318',
    joyful: '#0E1511',
    caution: '#1A1510',
    regret: '#1A1212',
  },
};

const MOBILE_BASE_COLORS: Record<ColorSchemeNames, Record<RazorSenseEmotionalMode, string>> = {
  light: {
    calm: '#9ABAFD',
    joyful: '#F1F7EB',
    caution: '#FDF1E1',
    regret: '#FDF1E1',
  },
  dark: {
    calm: '#0E1318',
    joyful: '#0E1511',
    caution: '#1A1510',
    regret: '#1A1212',
  },
};

type RazorSenseMoodProps = Omit<SemanticRazorSenseProps, 'mode'> & {
  mode: RazorSenseEmotionalMode;
};

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: () => void) => number;
};

const DesktopRazorSenseMood = forwardRef<HTMLDivElement, RazorSenseMoodProps>(
  function DesktopRazorSenseMood(props, forwardedRef) {
    const {
      mode,
      width = '100%',
      height = '100%',
      className,
      style,
      assetsPath = DEFAULT_CDN_PATH,
      modeTransitionDuration = 1,
      paused = false,
      playbackRate = 1,
      startTime = 0,
      interactive = true,
      onLoad,
      onError,
    } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const mountRef = useRef<RazorSenseMoodMount | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { colorScheme } = useTheme();

    useEffect(() => {
      if (!containerRef.current) return undefined;

      let active = true;
      let mount: RazorSenseMoodMount;
      try {
        mount = new RazorSenseMoodMount(containerRef.current, {
          mode,
          assetsPath,
          transitionDuration: modeTransitionDuration,
          paused,
          playbackRate,
          startTime,
          interactive,
          colorScheme,
          onError: (error) => {
            if (!active) return;
            mountRef.current?.dispose();
            mountRef.current = null;
            setHasError(true);
            onError?.(error);
          },
        });
      } catch (cause: unknown) {
        const error = cause instanceof Error ? cause : new Error(String(cause));
        setHasError(true);
        onError?.(error);
        return undefined;
      }
      mountRef.current = mount;

      void mount
        .loadAssets()
        .then(() => {
          if (!active) return;
          setHasError(false);
          setIsInitialized(true);
          onLoad?.();
        })
        .catch((cause: unknown) => {
          if (!active) return;
          const error = cause instanceof Error ? cause : new Error(String(cause));
          mount.dispose();
          mountRef.current = null;
          setHasError(true);
          onError?.(error);
        });

      return () => {
        active = false;
        mount.dispose();
        mountRef.current = null;
        setIsInitialized(false);
      };
      // Mode changes are intentionally handled in-place by the effect below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsPath]);

    useEffect(() => {
      mountRef.current?.setMode(mode);
    }, [mode]);

    useEffect(() => {
      mountRef.current?.setOptions({
        transitionDuration: modeTransitionDuration,
        paused,
        playbackRate,
        startTime,
        interactive,
        colorScheme,
      });
    }, [colorScheme, interactive, modeTransitionDuration, paused, playbackRate, startTime]);

    const mergedRef = useMergeRefs(forwardedRef, containerRef);
    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const heightStyle = typeof height === 'number' ? `${height}px` : height;

    return (
      <div
        ref={mergedRef}
        role="img"
        aria-label={`RazorSense ${RAZOR_SENSE_MODE_LABELS[mode]} animation`}
        data-razor-sense-color-scheme={colorScheme}
        className={className}
        style={{
          width: widthStyle,
          height: heightStyle,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: hasError ? FALLBACK_COLORS[colorScheme][mode] : 'transparent',
          transition: `${FADE_IN_MS}ms opacity, ${FADE_IN_MS}ms background-color`,
          opacity: isInitialized || hasError ? 1 : 0,
          ...style,
        }}
      />
    );
  },
);

const MobileRazorSenseMood = forwardRef<HTMLDivElement, RazorSenseMoodProps>(
  function MobileRazorSenseMood(props, forwardedRef) {
    const {
      mode,
      width = '100%',
      height = '100%',
      className,
      style,
      assetsPath = DEFAULT_CDN_PATH,
      modeTransitionDuration = 0.6,
      paused = false,
      playbackRate = 1,
      startTime = 0,
      onLoad,
      onError,
    } = props;
    const { colorScheme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const schemeSnapshotCanvasRef = useRef<HTMLCanvasElement>(null);
    const videoRefs = useRef<Partial<Record<RazorSenseEmotionalMode, HTMLVideoElement>>>({});
    const playbackTimesRef = useRef<Partial<Record<RazorSenseEmotionalMode, number>>>({});
    const pendingPlaybackTimesRef = useRef<Partial<Record<RazorSenseEmotionalMode, number>>>({});
    const displayedColorSchemeRef = useRef(colorScheme);
    const requestedColorSchemeRef = useRef(colorScheme);
    const schemeTransitionPendingRef = useRef(false);
    const schemeTransitionGenerationRef = useRef(0);
    const pausedRef = useRef(paused);
    const playbackRateRef = useRef(playbackRate);
    const startTimeRef = useRef(startTime);
    const transitionDurationRef = useRef(modeTransitionDuration);
    const modeRef = useRef(mode);
    const onLoadRef = useRef(onLoad);
    const onErrorRef = useRef(onError);
    const hasLoadedRef = useRef(false);
    const loadedModesRef = useRef(new Set<RazorSenseEmotionalMode>());
    const failedModeErrorsRef = useRef(new Map<RazorSenseEmotionalMode, Error>());
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [, setSchemeTransitionEpoch] = useState(0);
    const sources = getRazorSenseMobileModeVideoSources(assetsPath, colorScheme);

    if (requestedColorSchemeRef.current !== colorScheme) {
      const pendingTimes = { ...playbackTimesRef.current };
      const activeVideo = videoRefs.current[mode];
      if (activeVideo?.readyState && Number.isFinite(activeVideo.currentTime)) {
        pendingTimes[mode] = activeVideo.currentTime;
      }
      pendingPlaybackTimesRef.current = pendingTimes;
      requestedColorSchemeRef.current = colorScheme;
      schemeTransitionPendingRef.current = true;
      schemeTransitionGenerationRef.current += 1;
    }

    const completeSchemeTransition = useCallback(
      (candidate: RazorSenseEmotionalMode): void => {
        if (
          candidate !== modeRef.current ||
          !schemeTransitionPendingRef.current ||
          requestedColorSchemeRef.current !== colorScheme
        ) {
          return;
        }
        const completionGeneration = schemeTransitionGenerationRef.current;
        window.requestAnimationFrame(() => {
          if (
            !schemeTransitionPendingRef.current ||
            requestedColorSchemeRef.current !== colorScheme ||
            schemeTransitionGenerationRef.current !== completionGeneration
          ) {
            return;
          }
          displayedColorSchemeRef.current = colorScheme;
          schemeTransitionPendingRef.current = false;
          pendingPlaybackTimesRef.current = {};
          setSchemeTransitionEpoch((epoch) => epoch + 1);
        });
      },
      [colorScheme],
    );

    const completeSchemeTransitionAfterDecodedFrame = useCallback(
      (candidate: RazorSenseEmotionalMode, video: HTMLVideoElement): void => {
        const waitForPresentedFrame = (): void => {
          const frameVideo = video as VideoWithFrameCallback;
          if (!pausedRef.current && !document.hidden && frameVideo.requestVideoFrameCallback) {
            frameVideo.requestVideoFrameCallback(() => completeSchemeTransition(candidate));
          } else {
            window.requestAnimationFrame(() => completeSchemeTransition(candidate));
          }
        };

        if (video.seeking) {
          video.addEventListener('seeked', waitForPresentedFrame, { once: true });
        } else {
          waitForPresentedFrame();
        }
      },
      [completeSchemeTransition],
    );

    pausedRef.current = paused;
    playbackRateRef.current = playbackRate;
    startTimeRef.current = startTime;
    transitionDurationRef.current = modeTransitionDuration;
    modeRef.current = mode;
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;

    useEffect(() => {
      loadedModesRef.current.clear();
      failedModeErrorsRef.current.clear();
      setHasError(false);
    }, [colorScheme]);

    useEffect(() => {
      const knownError = failedModeErrorsRef.current.get(mode);
      if (knownError) {
        setHasError(true);
        onErrorRef.current?.(knownError);
      } else if (loadedModesRef.current.has(mode)) {
        setHasError(false);
        setIsInitialized(true);
        if (!hasLoadedRef.current) {
          hasLoadedRef.current = true;
          onLoadRef.current?.();
        }
      }

      const targetVideo = videoRefs.current[mode];
      if (targetVideo) {
        targetVideo.currentTime = Math.max(0, startTimeRef.current);
        targetVideo.playbackRate = playbackRateRef.current;
        if (!pausedRef.current && !document.hidden) {
          targetVideo.play().catch(() => undefined);
        }
      }

      const pausePreviousVideos = window.setTimeout(() => {
        Object.entries(videoRefs.current).forEach(([candidate, video]) => {
          if (candidate !== mode) video?.pause();
        });
      }, transitionDurationRef.current * 1000 + 60);

      return () => window.clearTimeout(pausePreviousVideos);
    }, [mode]);

    useEffect(() => {
      Object.entries(videoRefs.current).forEach(([candidate, video]) => {
        if (!video) return;
        video.playbackRate = playbackRate;
        if (paused) {
          video.pause();
        } else if (candidate === mode && !document.hidden) {
          video.play().catch(() => undefined);
        }
      });
    }, [mode, paused, playbackRate]);

    useEffect(
      () => () => {
        Object.values(videoRefs.current).forEach((video) => {
          video?.pause();
          if (video) {
            video.src = '';
            video.load();
          }
        });
      },
      [],
    );

    useEffect(() => {
      const handleVisibilityChange = (): void => {
        if (document.hidden) {
          Object.values(videoRefs.current).forEach((video) => video?.pause());
          return;
        }

        if (!pausedRef.current) {
          videoRefs.current[modeRef.current]?.play().catch(() => undefined);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const mergedRef = useMergeRefs(forwardedRef, containerRef);
    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const heightStyle = typeof height === 'number' ? `${height}px` : height;
    const displayedColorScheme = schemeTransitionPendingRef.current
      ? displayedColorSchemeRef.current
      : colorScheme;

    return (
      <div
        ref={mergedRef}
        role="img"
        aria-label={`RazorSense ${RAZOR_SENSE_MODE_LABELS[mode]} animation`}
        data-razor-sense-color-scheme={colorScheme}
        className={className}
        style={{
          width: widthStyle,
          height: heightStyle,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: MOBILE_BASE_COLORS[displayedColorScheme][mode],
          transition: `${FADE_IN_MS}ms opacity, ${
            modeTransitionDuration * 1000
          }ms background-color`,
          opacity: isInitialized || hasError ? 1 : 0,
          ...style,
        }}
      >
        {RAZOR_SENSE_EMOTIONAL_MODES.map((candidate) => (
          <video
            key={candidate}
            ref={(video) => {
              if (video) videoRefs.current[candidate] = video;
            }}
            aria-hidden="true"
            src={sources[candidate]}
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => {
              loadedModesRef.current.add(candidate);
              failedModeErrorsRef.current.delete(candidate);
              if (candidate !== mode) return;
              const video = videoRefs.current[candidate];
              if (video) {
                const restoredTime = schemeTransitionPendingRef.current
                  ? pendingPlaybackTimesRef.current[candidate]
                  : undefined;
                video.currentTime = Math.max(0, restoredTime ?? startTimeRef.current);
                video.playbackRate = playbackRateRef.current;
                if (!pausedRef.current && !document.hidden) {
                  video.play().catch(() => undefined);
                }
              }
              setHasError(false);
              setIsInitialized(true);
              if (!hasLoadedRef.current) {
                hasLoadedRef.current = true;
                onLoadRef.current?.();
              }
              if (video) completeSchemeTransitionAfterDecodedFrame(candidate, video);
            }}
            onTimeUpdate={(event) => {
              playbackTimesRef.current[candidate] = event.currentTarget.currentTime;
              if (candidate === modeRef.current && !schemeTransitionPendingRef.current) {
                captureVideoCoverFrame(
                  event.currentTarget,
                  schemeSnapshotCanvasRef.current,
                  containerRef.current,
                );
              }
            }}
            onError={() => {
              const error = new Error(`RazorSense: Failed to load the ${candidate} mobile mode`);
              loadedModesRef.current.delete(candidate);
              failedModeErrorsRef.current.set(candidate, error);
              if (candidate !== mode) return;
              setHasError(true);
              onErrorRef.current?.(error);
            }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: mode === candidate ? 1 : 0,
              transform: colorScheme === 'dark' ? 'scaleX(1.2)' : 'scaleX(1)',
              transition: `${modeTransitionDuration * 1000}ms ease opacity`,
              transitionProperty: 'opacity, transform',
              pointerEvents: 'none',
            }}
          />
        ))}
        <canvas
          ref={schemeSnapshotCanvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            opacity: schemeTransitionPendingRef.current ? 1 : 0,
            transform: displayedColorScheme === 'dark' ? 'scaleX(1.2)' : 'scaleX(1)',
            transition: schemeTransitionPendingRef.current
              ? 'none'
              : `${modeTransitionDuration * 1000}ms ease opacity`,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  },
);

const RazorSenseMood = forwardRef<HTMLDivElement, RazorSenseMoodProps>(function RazorSenseMood(
  props,
  forwardedRef,
) {
  const [useMobileRenderer, setUseMobileRenderer] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateRenderer = (event: MediaQueryListEvent): void =>
      setUseMobileRenderer(event.matches);
    setUseMobileRenderer(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateRenderer);
    return () => mediaQuery.removeEventListener('change', updateRenderer);
  }, []);

  if (useMobileRenderer === null) {
    const width = props.width ?? '100%';
    const height = props.height ?? '100%';
    return (
      <div
        ref={forwardedRef}
        role="img"
        aria-label={`RazorSense ${RAZOR_SENSE_MODE_LABELS[props.mode]} animation`}
        className={props.className}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          position: 'relative',
          overflow: 'hidden',
          ...props.style,
          opacity: 0,
        }}
      />
    );
  }

  if (useMobileRenderer) {
    return <MobileRazorSenseMood {...props} ref={forwardedRef} />;
  }

  return <DesktopRazorSenseMood {...props} ref={forwardedRef} />;
});

export { RazorSenseMood, MobileRazorSenseMood };
