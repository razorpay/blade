import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { RayLoaderMount } from './RayLoaderMount';
import type { RayLoaderProps } from './types';
import { canDraw } from '../Ray/canDraw';
import { RAY_BOX } from '../Ray/rayBox';
import { DASH_STILL } from '../Ray/engine/dashStill';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { useMergeRefs } from '~utils/useMergeRefs';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';

// his box's height by default, in his widths: room for his charge (he pulls back tall), the dash, his jump at the finish and the
// floor he drops through (Ray Studio's Dash film, measured over its whole run)
const HEIGHT_IN_WIDTHS = 4;

/**
 * His film's first frame as a still (Ray Studio's dash_still.py: what the film draws as he starts, 2x WebP, 1.1–1.7 KB each), shown from
 * the first render (a server's too) until his film has drawn him, so the box isn't empty while his director, the engine and his film
 * download (Saurav's round-6 review: about 70 KB, the first seconds of a slow connection). It sits where the film starts him: his path is
 * in % of the box's width and his floor at 0.76 of its height, so `box` is a share of each plus a few px. (A box under about two of his
 * widths tall draws him smaller in the film; the still stays his size.)
 */
const RayStill = ({
  size,
  colorScheme,
}: {
  size: keyof typeof RAY_BOX;
  colorScheme: 'light' | 'dark';
}): React.ReactElement => {
  const still = DASH_STILL[size];
  const [leftShare, leftPx, topShare, topPx, width, height] = still.box;
  return (
    <img
      src={still[colorScheme]}
      alt=""
      aria-hidden
      style={{
        position: 'absolute',
        left: `calc(${leftShare * 100}% + ${leftPx}px)`,
        top: `calc(${topShare * 100}% + ${topPx}px)`,
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: 'none',
        userSelect: 'none', // (no pointer: the stage has none)
      }}
    />
  );
};

/**
 * The Ray loader (secondary): Ray charges up and dashes across his box while the page loads, and when it's ready (`isLoading`
 * false) he slides on, turns round, jumps and drops through the floor, then `onComplete` is called. Drawn by Ray Studio's Dash
 * film, on Ray's engine.
 */
const _RayLoader = (
  {
    isLoading = true,
    onComplete,
    size = 'medium',
    width = '100%',
    height,
    accessibilityLabel = 'Loading',
    testID,
    ...rest
  }: RayLoaderProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { colorScheme } = useTheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const boxRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<RayLoaderMount | null>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(ref, outerRef);
  const optionsRef = useRef({ size, colorScheme: scheme } as const);
  optionsRef.current = { size, colorScheme: scheme };
  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  // once he's gone (or there was nothing to show), it's done for this mount: onComplete once, and the box is left to the page
  const [isDone, setIsDone] = useState(false);
  // his film has drawn him: his still goes (it stays if his film never comes, as a still loader, till the page is ready)
  const [isFilmShown, setIsFilmShown] = useState(false);
  const isDoneRef = useRef(false);
  const complete = (): void => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;
    setIsDone(true);
    onCompleteRef.current?.();
  };
  // he's gone, or there's nothing to show (his film gave up or didn't load): onComplete once the page is ready too, never while it's
  // still loading (the fresh-eyes review: a slow or failed chunk called it early)
  const isGoneRef = useRef(false);
  const gone = (): void => {
    isGoneRef.current = true;
    if (!isLoadingRef.current) complete();
  };
  const goneRef = useRef(gone);
  goneRef.current = gone;

  // his director, engine and film load with his first render, chunks of their own, so an app that doesn't show the loader never
  // downloads them
  useEffect(() => {
    if (!boxRef.current || !canDraw()) return undefined;
    let mount: RayLoaderMount | null = null;
    let isUnmounted = false;
    import('./RayLoaderMount')
      .then((module) => {
        if (isUnmounted || !boxRef.current || isDoneRef.current) return;
        mount = new module.RayLoaderMount(
          boxRef.current,
          optionsRef.current,
          () => goneRef.current(),
          () => setIsFilmShown(true),
        );
        mountRef.current = mount;
        if (!isLoadingRef.current) mount.finish(); // (ready while he was loading: done at once)
      })
      .catch((error: unknown) => {
        if (isUnmounted) return;
        if (__DEV__) console.error('[RayLoader] its director failed to load', error);
        goneRef.current();
      });
    return () => {
      isUnmounted = true;
      mount?.dispose();
      mountRef.current = null;
    };
  }, []);

  useEffect(() => {
    mountRef.current?.update(optionsRef.current);
  }, [size, scheme]);

  useEffect(() => {
    if (isLoading) return;
    // (gone already, or nothing to draw him on: there's no finish to wait for; his director still loading finishes as it starts)
    if (isGoneRef.current || !canDraw()) complete();
    else mountRef.current?.finish();
  }, [isLoading]);

  const boxHeight = height ?? RAY_BOX[size].width * HEIGHT_IN_WIDTHS; // (his width: Ray's own sizes)
  return (
    <BaseBox
      ref={mergedRef as never}
      {...(isDone
        ? makeAccessible({ hidden: true })
        : makeAccessible({ role: 'progressbar', label: accessibilityLabel }))}
      {...metaAttribute({ name: MetaConstants.RayLoader, testID })}
      {...makeAnalyticsAttribute(rest)}
      {...getStyledProps(rest)}
    >
      {/* his stage: the box's own size (any CSS length), his film drawn across it; what falls below it (through the floor) is cut */}
      <div
        ref={boxRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          pointerEvents: 'none',
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof boxHeight === 'number' ? `${boxHeight}px` : boxHeight,
        }}
      >
        {isDone || isFilmShown ? null : <RayStill size={size} colorScheme={scheme} />}
      </div>
    </BaseBox>
  );
};

const RayLoader = assignWithoutSideEffects(forwardRef(_RayLoader), {
  displayName: 'RayLoader',
  componentId: 'RayLoader',
});

export { RayLoader };
