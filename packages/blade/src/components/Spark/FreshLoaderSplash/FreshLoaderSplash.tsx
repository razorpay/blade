import React, { useEffect, useRef, useState } from 'react';
import type { FreshLoaderSplashProps } from './types';
import { getSplashClock, stepSplashClock } from './splashClock';
import type { SplashClock, SplashClockState } from './splashClock';
import { FreshStage, loadFreshEngine } from '../RazorSenseEngine';
import type { FreshEngine } from '../RazorSenseEngine';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

/** The page colour under the splash: before its first frame, after it has faded, and when WebGL2 isn't there. */
const GROUND = { light: '#ffffff', dark: '#131315' } as const;

/**
 * FreshLoaderSplash
 *
 * RazorSense's loading splash: the Razorpay glyph loops while the page loads, then grows and fades to the plain background.
 * Like RazorSense, it follows Blade's color scheme (BladeProvider): light and dark are the same component. Drawn by the Fresh
 * RazorSense engine on one canvas; paused off-screen.
 *
 * @example
 * ```tsx
 * <Box position="fixed" inset="spacing.0">
 *   <FreshLoaderSplash isLoading={!isReady} onComplete={() => setShowPage(true)} />
 * </Box>
 * ```
 */
const FreshLoaderSplash = ({
  isLoading = true,
  isPaused = false,
  onComplete,
  scale = 1,
  width = '100%',
  height = '100%',
  testID,
}: FreshLoaderSplashProps): React.ReactElement => {
  const { colorScheme } = useTheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  const s = holdInRange(scale, FRESH_RANGES.scale, 'FreshLoaderSplash', 'scale');
  const boxRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<FreshStage | null>(null);
  const engineRef = useRef<FreshEngine | null>(null);
  const clockRef = useRef<SplashClock | null>(null);
  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const isDoneRef = useRef(false);
  const [hasFailed, setHasFailed] = useState(false);

  const complete = (): void => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;
    onCompleteRef.current?.();
  };

  useEffect(() => {
    let isMounted = true;
    isDoneRef.current = false;
    setHasFailed(false);

    void Promise.all([loadFreshEngine(), import('./comps')])
      .then(([createFreshEngine, comps]) => {
        if (!isMounted || !boxRef.current) return;
        const doc = mode === 'dark' ? comps.loaderSplashDark : comps.loaderSplashLight;
        const stage = new FreshStage(boxRef.current, createFreshEngine, {
          onError: () => setHasFailed(true),
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
          // no WebGL2: the plain background, and the page comes in as soon as it's ready
          setHasFailed(true);
          if (!isLoadingRef.current) complete();
          return;
        }
        engineRef.current = engine;
        clockRef.current = clock;
        if (stage.reducedMotion) {
          // reduced motion: the glyph, still, while loading; then straight to the plain background
          const t = isLoadingRef.current ? clock.a : clock.end;
          engine.player.seek(t, t);
          if (!isLoadingRef.current) complete();
          return;
        }
        const state: SplashClockState = { t: 0, alive: 0 };
        stage.setDriver((eng, dt) => {
          const t = stepSplashClock(clock, state, dt, isLoadingRef.current);
          eng.player.seek(t, state.alive);
          if (t >= clock.end) {
            // faded out: nothing more to draw
            stage.setDriver(null);
            stage.setPaused(true);
            complete();
          }
        });
        stage.setPaused(isPaused);
      })
      .catch(() => {
        if (!isMounted) return;
        setHasFailed(true);
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

  useEffect(() => {
    stageRef.current?.setPaused(isPaused);
  }, [isPaused]);

  useEffect(() => {
    if (isLoading) return;
    // with no animation running (reduced motion, no WebGL2), the page comes in as soon as it's ready
    const stage = stageRef.current;
    const engine = engineRef.current;
    const clock = clockRef.current;
    if (stage?.reducedMotion && engine && clock) {
      engine.player.seek(clock.end, clock.end);
      complete();
    } else if (hasFailed) {
      complete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, hasFailed]);

  return (
    <div
      ref={boxRef}
      {...metaAttribute({ name: MetaConstants.FreshLoaderSplash, testID })}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        backgroundColor: GROUND[mode],
      }}
    />
  );
};

export { FreshLoaderSplash };
