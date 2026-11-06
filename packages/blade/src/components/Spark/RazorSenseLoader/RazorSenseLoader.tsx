import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { RazorSenseLoaderProps } from './types';
import { getSplashClock, splashRemaining, stepSplashClock } from './splashClock';
import type { SplashClock, SplashClockState } from './splashClock';
import { FreshStage, freshFailures, loadFreshEngine } from '../RazorSenseEngine';
import type { FreshEngine } from '../RazorSenseEngine';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { stillStyle, useStill } from '../RazorSenseEngine/useStill';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useMergeRefs } from '~utils/useMergeRefs';
import { makeAccessible } from '~utils/makeAccessible';

/**
 * A CSS colour as #rrggbb, as the engine takes its ground (the browser reads it: a token can be any CSS colour); null where there's
 * no canvas to ask (tests).
 */
const toHex = (color: string): string | null => {
  const g =
    typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  if (!g) return null;
  g.fillStyle = '#000000';
  g.fillStyle = color;
  return typeof g.fillStyle === 'string' && g.fillStyle.startsWith('#') ? g.fillStyle : null;
};

/** its still, the glyph mid-loop, for when it can't animate (its own module per color scheme, loaded only then) */
const loadLoaderStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/loaderDark').then((m) => m.loaderDark)
    : import('./stills/loaderLight').then((m) => m.loaderLight);

/** how long the still takes to fade out once the page is ready (ms) */
const STILL_FADE = 400;

/**
 * RazorSenseLoader
 *
 * RazorSense's loading splash: the Razorpay glyph loops while the page loads, then grows and fades to the plain background.
 * Like RazorSense, it follows Blade's color scheme (BladeProvider): light and dark are the same component. Drawn by the Fresh
 * RazorSense engine on one canvas; paused off-screen.
 *
 * @example
 * ```tsx
 * <Box position="fixed" inset="spacing.0">
 *   <RazorSenseLoader isLoading={!isReady} onComplete={() => setShowPage(true)} />
 * </Box>
 * ```
 */
const RazorSenseLoader = forwardRef<HTMLDivElement, RazorSenseLoaderProps>(
  function RazorSenseLoader(
    {
      isLoading = true,
      isPaused = false,
      onComplete,
      scale = 1,
      accessibilityLabel = 'Loading',
      width = '100%',
      height = '100%',
      onLoad,
      onError,
      className,
      style,
      testID,
    },
    forwardedRef,
  ) {
    const { colorScheme, theme } = useTheme();
    // the splash's ground, from the theme: white in light, the page's own dark gray in dark (the tokens its design matches). The
    // engine draws the comp's ground in this same colour, so there's no seam as it fades.
    const ground =
      colorScheme === 'dark'
        ? theme.colors.surface.background.gray.moderate
        : theme.colors.surface.background.gray.intense;
    const mode = colorScheme === 'dark' ? 'dark' : 'light';
    const s = holdInRange(scale, FRESH_RANGES.scale, 'RazorSenseLoader', 'scale');
    const boxRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(forwardedRef, boxRef);
    const stageRef = useRef<FreshStage | null>(null);
    const engineRef = useRef<FreshEngine | null>(null);
    const clockRef = useRef<SplashClock | null>(null);
    const isLoadingRef = useRef(isLoading);
    isLoadingRef.current = isLoading;
    // read when the engine is up (it loads asynchronously, so a pause set before then still counts)
    const isPausedRef = useRef(isPaused);
    isPausedRef.current = isPaused;
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;
    const onLoadRef = useRef(onLoad);
    onLoadRef.current = onLoad;
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;
    const isDoneRef = useRef(false);
    const [isDone, setIsDone] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);
    const hasFailedRef = useRef(false);
    // the still fading out: the page is ready and the splash couldn't animate
    const [isLeaving, setIsLeaving] = useState(false);
    const still = useStill(hasFailed && !isDone, mode, loadLoaderStill);
    // where its clock is (read by the safety net below)
    const clockStateRef = useRef<SplashClockState>({ t: 0, alive: 0 });

    const complete = (): void => {
      if (isDoneRef.current) return;
      isDoneRef.current = true;
      setIsDone(true);
      stageRef.current?.setDriver(null);
      stageRef.current?.setPaused(true);
      onCompleteRef.current?.();
    };

    useEffect(() => {
      // a splash that has played out stays done: a new color scheme or scale doesn't start it again (the box shows the plain
      // background), so onComplete is only ever called once
      if (isDoneRef.current) return undefined;
      // (couldn't animate: it stays on its still, a new color scheme just changes the still)
      if (hasFailedRef.current) return undefined;
      let isMounted = true;

      let hasReported = false;
      let stage: FreshStage | null = null;
      const fail = (reason = 'WebGL2 is unavailable, or the GPU draws only on the CPU'): void => {
        if (!isMounted) return;
        hasFailedRef.current = true;
        setHasFailed(true);
        if (hasReported) return;
        hasReported = true;
        // its still instead; the stage freed after this frame (it may be the one telling us)
        window.setTimeout(() => {
          stage?.destroy();
          if (stageRef.current === stage) stageRef.current = null;
          engineRef.current = null;
          clockRef.current = null;
        }, 0);
        onErrorRef.current?.(new Error(`RazorSenseLoader: ${reason}`));
      };

      void Promise.all([loadFreshEngine(), import('./comps')])
        .then(([createFreshEngine, comps]) => {
          // (done already, by the safety net: the page is in, nothing more to draw)
          if (!isMounted || !boxRef.current || isDoneRef.current) return;
          const made = mode === 'dark' ? comps.loaderSplashDark : comps.loaderSplashLight;
          const doc = { ...made, p: { ...made.p, cBgCol: toHex(ground) ?? made.p.cBgCol } };
          stage = new FreshStage(boxRef.current, createFreshEngine, {
            onError: (reason) => fail(freshFailures[reason]),
          });
          stageRef.current = stage;
          // scale: a smaller (bigger) part of the comp round its middle, cover-fitted to the box (1: the whole comp, as made)
          const { w, h } = doc.comp;
          const region: [number, number, number, number] | undefined =
            s === 1 ? undefined : [(w - w / s) / 2, (h - h / s) / 2, w / s, h / s];
          const engine = stage.mount({
            doc,
            opts: { fit: 'cover', alpha: false, paused: true, srcBudget: 4.0e6, region },
          });
          const clock = getSplashClock(doc);
          if (!engine || !clock) {
            // no usable WebGL2: the plain background, and the page comes in as soon as it's ready
            fail();
            if (!isLoadingRef.current) complete();
            return;
          }
          engineRef.current = engine;
          clockRef.current = clock;
          onLoadRef.current?.();
          if (stage.reducedMotion) {
            // reduced motion: the glyph, still, while loading; then straight to the plain background
            const t = isLoadingRef.current ? clock.a : clock.end;
            stage.settle(() => engine.player.seek(t, t));
            if (!isLoadingRef.current) complete();
            return;
          }
          const state: SplashClockState = { t: 0, alive: 0 };
          clockStateRef.current = state;
          stage.setDriver((eng, dt) => {
            const t = stepSplashClock(clock, state, dt, isLoadingRef.current);
            eng.player.seek(t, state.alive);
            if (t >= clock.end) {
              // faded out: nothing more to draw (complete stops the stage)
              complete();
            }
          });
          stage.setPaused(isPausedRef.current && isLoadingRef.current);
        })
        .catch(() => {
          if (!isMounted) return;
          fail('its engine failed to load');
          if (!isLoadingRef.current) complete();
        });

      return () => {
        isMounted = false;
        stageRef.current?.destroy();
        stageRef.current = null;
        engineRef.current = null;
        clockRef.current = null;
      };
      // isLoading and isPaused are read live (refs / their own effects); a new color scheme or scale starts the splash again
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, s]);

    // a pause holds it only while loading: once loading ends it always plays out and calls onComplete, so the page is never held up
    useEffect(() => {
      if (isDoneRef.current) return;
      stageRef.current?.setPaused(isPaused && isLoading);
    }, [isPaused, isLoading]);

    useEffect(() => {
      if (isLoading || isDoneRef.current) return undefined;
      // with no animation running (reduced motion, no WebGL2), the page comes in as soon as it's ready
      const stage = stageRef.current;
      const engine = engineRef.current;
      const clock = clockRef.current;
      if (stage?.reducedMotion && engine && clock) {
        stage.settle(() => engine.player.seek(clock.end, clock.end));
        complete();
        return undefined;
      }
      if (!clockRef.current && !hasFailed) {
        // ready before the splash started drawing (its engine still loading): nothing to play out, the page comes in now
        complete();
        return undefined;
      }
      if (hasFailed) {
        // its still (if it got one) fades out, then the page comes in
        setIsLeaving(true);
        const fade = window.setTimeout(complete, STILL_FADE);
        return () => window.clearTimeout(fade);
      }
      // the safety net: the page is never held up longer than the splash has left to play (plus a second). When that's up, a
      // splash still moving (its engine came in late) is given the rest; one that isn't (a hidden or display: none box, a hidden
      // tab, an engine that never loaded) is done there and then
      let timer = 0;
      let lastT = clockStateRef.current.t;
      const arm = (): void => {
        const c = clockRef.current;
        const left = c ? splashRemaining(c, clockStateRef.current) : 0;
        timer = window.setTimeout(() => {
          const cNow = clockRef.current;
          const tNow = clockStateRef.current.t;
          if (cNow && tNow > lastT && splashRemaining(cNow, clockStateRef.current) > 0) {
            lastT = tNow;
            arm();
            return;
          }
          if (cNow) engineRef.current?.player.seek(cNow.end, cNow.end);
          complete();
        }, (left + 1) * 1000);
      };
      arm();
      return () => window.clearTimeout(timer);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, hasFailed]);

    return (
      <div
        ref={mergedRef}
        className={className}
        {...metaAttribute({ name: MetaConstants.RazorSenseLoader, testID })}
        {...(isDone
          ? makeAccessible({ hidden: true })
          : makeAccessible({ role: 'progressbar', label: accessibilityLabel }))}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          backgroundColor: ground,
          ...style,
        }}
      >
        {still ? (
          <img
            src={still}
            alt=""
            style={{
              ...stillStyle,
              objectFit: 'cover',
              opacity: isLeaving ? 0 : 1,
              transition: `opacity ${STILL_FADE}ms`,
            }}
          />
        ) : null}
      </div>
    );
  },
);

export { RazorSenseLoader };
