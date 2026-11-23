import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { RazorSenseBackgroundProps } from './types';
import { BackgroundClock } from './backgroundClock';
import { placePiece } from './placePiece';
import type { PiecePlace } from './placePiece';
import { runFreshStage, toHex } from '../RazorSenseEngine';
import type {
  FreshDoc,
  FreshEngine,
  FreshKey,
  FreshLook,
  FreshStage,
  FreshStops,
} from '../RazorSenseEngine';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { stillStyle, useStill } from '../RazorSenseEngine/useStill';
import { backgroundPlaceDark, backgroundPlaceLight } from './place';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useMergeRefs } from '~utils/useMergeRefs';
import { makeAccessible } from '~utils/makeAccessible';

/** its still, the piece at its loop's start, for when it can't animate (its own module per color scheme, loaded only then) */
const loadBackgroundStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/backgroundDark').then((m) => m.backgroundDark)
    : import('./stills/backgroundLight').then((m) => m.backgroundLight);

/**
 * its canvas's sharpness (device px per CSS px): the piece is soft all over (its shapes blurred 220-840 px, its bands wide), so past 1
 * the GPU draws pixels nobody can see; and its pixels at most BACKGROUND_PIXELS, so a big screen's box draws at a lower sharpness, not
 * a bigger canvas: its GPU memory stays about a 1512 x 862 box's (down to 0.5, the engine's floor, about 0.3/255 from the device's own
 * 2x; see _decisions)
 */
const BACKGROUND_DPR = 1;
const BACKGROUND_PIXELS = 2.2e6;
const sharpnessFor = (place: PiecePlace): number =>
  Math.max(
    0.5,
    Math.min(BACKGROUND_DPR, Math.sqrt(BACKGROUND_PIXELS / (place.part.width * place.part.height))),
  );

/** the comps on the crossfade's page are its own comps again, with these ids */
const fadeId = (id: string): string => `f_${id}`;

/** the piece's place in its box: the canvas's box, the still's, both turned and scaled round the box's middle */
const putPiece = (place: PiecePlace, part: HTMLElement | null, still: HTMLElement | null): void => {
  const [mx, my] = place.middle;
  if (part) {
    const { left, top, width, height } = place.part;
    part.style.left = `${left}px`;
    part.style.top = `${top}px`;
    part.style.width = `${width}px`;
    part.style.height = `${height}px`;
    part.style.transformOrigin = `${mx - left}px ${my - top}px`;
    part.style.transform = place.transform;
    part.style.visibility = '';
  }
  if (still) {
    const { left, top, width, height } = place.whole;
    still.style.left = `${left}px`;
    still.style.top = `${top}px`;
    still.style.width = `${width}px`;
    still.style.height = `${height}px`;
    still.style.transformOrigin = `${mx - left}px ${my - top}px`;
    still.style.transform = place.transform;
  }
};

/**
 * RazorSenseBackground
 *
 * RazorSense's big piece for a page's background, as the login page has it: soft fluted bands drifting and breathing, its colours
 * on a slow loop of their own. It fills its box; the piece is placed in it as designed and the box cuts off what falls outside it,
 * and only that part is drawn. Like RazorSense, it follows Blade's color scheme (BladeProvider): light and dark are the same
 * component, each its own tuning. Drawn by the Fresh RazorSense engine on one canvas; paused off-screen. Decorative: hidden from
 * screen readers.
 *
 * @example
 * ```tsx
 * <Box position="relative" height="100vh">
 *   <RazorSenseBackground />
 *   <Box position="absolute" inset="spacing.0">...the page...</Box>
 * </Box>
 * ```
 */
const RazorSenseBackground = forwardRef<HTMLDivElement, RazorSenseBackgroundProps>(
  function RazorSenseBackground(
    {
      isPaused = false,
      scale = 1,
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
    // its ground, from the theme (the tokens its design matches: white in light, the page's own dark gray in dark); the engine draws
    // the comp's ground in this same colour, so the canvas has no edge in the box
    const ground =
      colorScheme === 'dark'
        ? theme.colors.surface.background.gray.moderate
        : theme.colors.surface.background.gray.intense;
    const mode = colorScheme === 'dark' ? 'dark' : 'light';
    const s = holdInRange(scale, FRESH_RANGES.scale, 'RazorSenseBackground', 'scale');
    const boxRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(forwardedRef, boxRef);
    // the part of the piece the box shows: its canvas goes in here
    const partRef = useRef<HTMLDivElement>(null);
    const stillRef = useRef<HTMLImageElement>(null);
    const stageRef = useRef<FreshStage | null>(null);
    const engineRef = useRef<FreshEngine | null>(null);
    const placeRef = useRef<PiecePlace | null>(null);
    const where = mode === 'dark' ? backgroundPlaceDark : backgroundPlaceLight;
    const isPausedRef = useRef(isPaused);
    isPausedRef.current = isPaused;
    const onLoadRef = useRef(onLoad);
    onLoadRef.current = onLoad;
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;
    const [hasFailed, setHasFailed] = useState(false);
    const hasFailedRef = useRef(false);
    // its still stands in while it has no frame yet (its GPU getting ready), and stays if it can't animate
    const [isWaiting, setIsWaiting] = useState(false);
    const still = useStill(hasFailed || isWaiting, mode, loadBackgroundStill);

    // the piece placed in the box (and only its part in the box drawn): again whenever the box changes size
    const place = (): void => {
      const box = boxRef.current;
      if (!box) return;
      const next = placePiece(box.clientWidth, box.clientHeight, where, s);
      if (!next) {
        // (none of it in the box)
        if (partRef.current) partRef.current.style.visibility = 'hidden';
        return;
      }
      const last = placeRef.current;
      placeRef.current = next;
      putPiece(next, partRef.current, stillRef.current);
      const r = next.region;
      if (engineRef.current && (!last || last.region.some((v, i) => Math.abs(v - r[i]) > 0.25))) {
        engineRef.current.player.region(r, sharpnessFor(next));
      }
    };
    const placeFnRef = useRef(place);
    placeFnRef.current = place;

    useEffect(() => {
      const box = boxRef.current;
      if (!box || typeof ResizeObserver === 'undefined') return undefined;
      const watch = new ResizeObserver(() => placeFnRef.current());
      watch.observe(box);
      return () => watch.disconnect();
    }, []);

    useEffect(() => {
      // (couldn't animate: it stays on its still, a new color scheme just changes the still)
      if (hasFailedRef.current) return undefined;
      return runFreshStage({
        moduleName: 'RazorSenseBackground',
        getBox: () => partRef.current,
        stageRef,
        loadComps: () => import('./comps'),
        // (its comps ask for an opaque canvas: its engine is made ahead, a step at a time)
        engineAlpha: false,
        start: (stage, comps) => {
          const made = mode === 'dark' ? comps.backgroundDark : comps.backgroundLight;
          const doc: FreshDoc = {
            ...made,
            p: { ...made.p, cBgCol: toHex(ground) ?? made.p.cBgCol },
          };
          const play = doc.ui?.freshBackground;
          if (!play) return false;
          placeRef.current = null;
          placeFnRef.current();
          const place = placeRef.current as PiecePlace | null;
          const engine = stage.mount({
            doc,
            opts: {
              fit: 'cover',
              alpha: false,
              paused: true,
              region: place?.region,
              dpr: place ? sharpnessFor(place) : BACKGROUND_DPR,
            },
          });
          if (!engine) return false;
          engineRef.current = engine;
          onLoadRef.current?.();
          const clock = new BackgroundClock(play);
          const { player } = engine;
          const { tools } = player;
          // the colour loop: each comp's own Colorama keys read on its clock, blended over its wrap (the fade page's comps the same)
          const stopsOf = new Map<string, FreshKey[]>();
          for (const [id, keys] of Object.entries(play.colour.stops)) {
            stopsOf.set(id, keys);
            stopsOf.set(fadeId(id), keys);
          }
          const look: FreshLook = {
            params: (p, comp) => {
              const keys = clock.isColourOn ? stopsOf.get(comp) : undefined;
              if (!keys) return p;
              const now = tools.evalTrack(keys, clock.colourT) as FreshStops;
              p.stops =
                clock.colourBlend > 0
                  ? tools.lerpStops(
                      now,
                      tools.evalTrack(keys, clock.colourBack) as FreshStops,
                      clock.colourBlend,
                    )
                  : now;
              return p;
            },
          };
          player.look(look);
          // what's set on the engine each frame, made once
          const fadeIds = [
            fadeId('root'),
            ...(doc.stack as { id: string; grp?: string }[])
              .filter((e) => e.grp !== 'fade')
              .map((e) => fadeId(e.id)),
          ];
          const drifting = play.opacity.ids;
          const fadeGroup = { op: 0, ground: true };
          const atStart = { t: play.loop.a };
          const opacity = { op: 1 };
          const draw = (): void => {
            fadeGroup.op = clock.fade;
            player.group('fade', fadeGroup);
            for (const id of fadeIds) player.comp(id, atStart);
            for (let i = 0; i < drifting.length; i += 1) {
              opacity.op = clock.opacity(i);
              player.comp(drifting[i], opacity);
              player.comp(fadeId(drifting[i]), opacity);
            }
            player.seek(clock.t, clock.alive);
          };
          if (stage.reducedMotion) {
            // reduced motion: the piece still, at its loop's start
            stage.settle(draw);
            return true;
          }
          stage.setDriver((_engine, dt) => {
            clock.step(dt);
            draw();
          });
          stage.setPaused(isPausedRef.current);
          return true;
        },
        onFail: (error) => {
          // its still instead
          hasFailedRef.current = true;
          setHasFailed(true);
          onErrorRef.current?.(error);
        },
        onRelease: () => {
          engineRef.current = null;
        },
        onWaiting: setIsWaiting,
      });
      // isPaused is read live (its own effect); a new color scheme or scale plays the new comp on the same engine
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, s, ground]);

    useEffect(() => {
      stageRef.current?.setPaused(isPaused);
    }, [isPaused]);

    // (placed again for a new color scheme or scale, and its still placed as the piece is, once it's there)
    useEffect(() => {
      placeFnRef.current();
    }, [still, where, s]);

    return (
      <div
        ref={mergedRef}
        className={className}
        {...metaAttribute({ name: MetaConstants.RazorSenseBackground, testID })}
        {...makeAccessible({ hidden: true })}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          backgroundColor: ground,
          pointerEvents: 'none',
          ...style,
        }}
      >
        <div ref={partRef} style={{ position: 'absolute', visibility: 'hidden' }} />
        {still ? (
          <img
            ref={stillRef}
            src={still}
            alt=""
            style={{ ...stillStyle, width: undefined, height: undefined }}
          />
        ) : null}
      </div>
    );
  },
);

export { RazorSenseBackground };
