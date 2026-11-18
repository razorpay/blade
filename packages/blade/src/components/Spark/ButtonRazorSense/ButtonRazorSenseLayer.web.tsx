import React, { useEffect, useRef, useState } from 'react';
import { FreshStage, loadFreshEngine } from '../RazorSenseEngine';
import type { CreateFreshEngine, FreshDoc, FreshEngine } from '../RazorSenseEngine';
import { canPlayHover, holdNearPointer } from '../useLazyLayer/hoverSlots';
import type { HoverSlot } from '../useLazyLayer/hoverSlots';
import type { ButtonRazorSenseProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { logger } from '~utils/logger';

type ButtonSenseSetup = { mask: { x: number; y: number; w: number; h: number }; opacity: number };
type CompShape = {
  id: string;
  x?: number;
  sx?: number;
  sy?: number;
  r?: number;
  ax?: number;
  ay?: number;
  bh?: number;
  pts?: { x: number; y: number }[];
};
type CompKey = { t: number; v: unknown };
type Comp = FreshDoc & {
  shapes?: CompShape[];
  K?: Record<string, CompKey[]>;
  stack?: { doc?: Comp }[];
};

/**
 * The widest a button may be for its hover (CSS px): 300. Past it the stretched sweep crowds its bands into the button (about 8
 * across a 470px one: busier than the comp; the PR review), and past the comp's own width (made at 2x) its spot would run off
 * the comp's edges. Such a button keeps its own hover, as a full-width one does, however it got that wide (a stretched column,
 * a grid cell).
 */
const WIDEST = 300;
const widestFor = (doc: FreshDoc): number => Math.min(WIDEST, doc.comp.w / 2);

/** a button about as wide as tall plays the square comp (flow 9's prim9.js: within 1.25x) */
const isSquare = (button: HTMLElement): boolean => button.offsetWidth <= button.offsetHeight * 1.25;

/** the button's spot of the comp (comp px; the comp is made at 2x), round its hidden "Button (mask)" */
const regionOf = (doc: FreshDoc, setup: ButtonSenseSetup, w: number, h: number): number[] => [
  doc.comp.w / 2 + setup.mask.x - w,
  doc.comp.h / 2 + setup.mask.y - h,
  2 * w,
  2 * h,
];

/** how far a shape reaches right of its position at scale 1 (comp px) */
const rightReach = (s: CompShape): number => {
  const a = ((s.r ?? 0) * Math.PI) / 180;
  return Math.max(
    0,
    ...(s.pts ?? []).map(
      (p) =>
        (p.x - (s.ax ?? 0)) * (s.sx ?? 1) * Math.cos(a) -
        (p.y - (s.ay ?? 0)) * (s.sy ?? 1) * Math.sin(a),
    ),
  );
};

/**
 * The comp laid out for a button longer than its own (the "Button (mask)", 150 px). The shapes that move along x (the sweep)
 * follow the width as on any button: P.shapes stretches them round the middle, so they start that much further before the left
 * edge and end that much further past the right, on the same keys. A shape whose scale is keyed (the ellipse that grows up from
 * under the button) instead starts where it starts on the comp's button, measured from the bottom left, at its size, and grows
 * to a scale that takes it as far past the longer button's right end as it goes past the comp's: the same keys and timing, more
 * scale. P.shapes stretches every shape the same way, so the ellipse is placed and sized here to land there once stretched.
 */
const forWidth = (doc: Comp, setup: ButtonSenseSetup, w: number): Comp => {
  const own = setup.mask.w / 2; // the comp's button: half its width in comp px = its width in CSS px
  if (w <= own) return doc;
  const kx = w / own; // what P.shapes stretches x by
  const fromMiddle = (x: number): number => setup.mask.x + (x - setup.mask.x) / kx;
  const lay = (comp: Comp): Comp => {
    const K = { ...comp.K };
    const shapes = (comp.shapes ?? []).map((s) => {
      const scale = K[`s:${s.id}:s`];
      if (!scale || scale.length < 2) return s;
      const from = Number(scale[0].v);
      const to = Number(scale[scale.length - 1].v);
      const more = (2 * (w - own)) / Math.max(1e-3, rightReach(s));
      if (to !== from) {
        K[`s:${s.id}:s`] = scale.map((k) => ({
          ...k,
          v: Number(k.v) + ((Number(k.v) - from) / (to - from)) * more,
        }));
      }
      return {
        ...s,
        x: fromMiddle((s.x ?? 0) - (w - own)),
        sx: (s.sx ?? 1) / kx,
        bh: (s.bh ?? 0) / kx,
      };
    });
    return { ...comp, K, shapes };
  };
  return {
    ...lay(doc),
    stack: doc.stack?.map((e) => (e.doc ? { ...e, doc: lay(e.doc) } : e)),
  };
};

/**
 * ButtonRazorSenseLayer: Button's `aiHover="razorsense"` (internal; web; loaded by ButtonRazorSense only when it's on). Flow 9's primary button hover (ray tools/flow/prim9.js, its
 * 'tab' version): on hover the mode's RazorSense comp plays over the button, under its label, looping while the pointer stays;
 * it fades in over .12s and out over .35s, then pauses. Any size: the button's own spot of the comp, the comp's moving shapes
 * squeezed or stretched round the button's middle to its width and height (the bands as they are); a button about as wide as
 * tall plays the square comp, a longer one keeps its growing ellipse at its bottom left (forWidth). Its comp is loaded as the
 * button comes on screen; its canvas (a WebGL context) is made only while the pointer is on or near the button and let go once
 * it has moved away and the hover has faded (holdNearPointer), so a page of these holds a few contexts at most. Rendered as the
 * button's first child; the button's content sits above it.
 */
const ButtonRazorSenseLayer = ({
  isEnabled,
  onLiveChange,
}: ButtonRazorSenseProps): React.ReactElement | null => {
  const { colorScheme } = useTheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  const layerRef = useRef<HTMLSpanElement>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const edgeRef = useRef<HTMLElement>(null);
  const [square, setSquare] = useState<boolean | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);
  const onLiveRef = useRef(onLiveChange);
  onLiveRef.current = onLiveChange;

  // the button's shape (square or wide) and whether it's on screen
  useEffect(() => {
    const button = layerRef.current?.parentElement;
    // no observers (a test's DOM): Blade's own hover stays
    if (
      !button ||
      typeof ResizeObserver === 'undefined' ||
      typeof IntersectionObserver === 'undefined'
    )
      return undefined;
    const resize = new ResizeObserver(() => setSquare(isSquare(button)));
    resize.observe(button);
    setSquare(isSquare(button));
    const seen = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry) setIsOnScreen(entry.isIntersecting);
      },
      { rootMargin: '100px' },
    );
    seen.observe(button);
    return () => {
      resize.disconnect();
      seen.disconnect();
    };
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    const host = hostRef.current;
    const button = layer?.parentElement;
    if (!isEnabled || !isOnScreen || square === null || !layer || !host || !button)
      return undefined;
    // reduced motion, no GPU drawing WebGL2, a page already too slow: Blade's own hover, nothing loaded
    if (!canPlayHover()) return undefined;
    let isMounted = true;
    let stage: FreshStage | null = null;
    let engine: FreshEngine | null = null;
    let doc: Comp | null = null;
    let setup: ButtonSenseSetup | null = null;
    let region: number[] = [0, 0, 1, 1];
    let laidWidth = 0; // the width the comp is laid out for (0: as made)
    let isOn = false;
    let isHeld = false;
    let pauseTimer = 0;
    let relayTimer = 0;
    let slot: HoverSlot | null = null;
    // the button's own hover gives way only once RazorSense has drawn over it: its canvas made (held near the pointer) and its
    // first frame in, not just its code loaded (a hover refused a slot kept no hover at all: the PR review) or its canvas made (a
    // GPU still compiling, tens of seconds the first time on Direct3D, left it bare)
    let isLive = false;
    let liveFrame = 0;
    const setLive = (live: boolean): void => {
      if (live === isLive) return;
      isLive = live;
      onLiveRef.current?.(live);
    };

    // wider than its comp: no canvas, and the button keeps its own hover (said once, in development)
    let hasWarnedWide = false;
    const isTooWide = (): boolean => {
      const isWide = Boolean(doc) && button.offsetWidth > widestFor(doc as FreshDoc);
      if (isWide && __DEV__ && !hasWarnedWide) {
        hasWarnedWide = true;
        logger({
          type: 'warn',
          moduleName: 'Button',
          message: `aiHover="razorsense" plays on buttons up to ${widestFor(
            doc as FreshDoc,
          )}px wide; this one is ${
            button.offsetWidth
          }px wide (full width, or stretched by its parent), so it keeps its own hover.`,
        });
      }
      return isWide;
    };
    // a longer button's comp is laid out for its width (forWidth); any other plays the comp as made
    const widthOf = (w: number): number =>
      square || !setup || w <= setup.mask.w / 2 ? 0 : Math.round(w);
    let createEngine: CreateFreshEngine | null = null;
    // it can't draw here after all (no usable WebGL2, frames too slow): Blade's own hover, for good
    let hasGivenUp = false;
    // (set below, once what they undo is in place)
    let giveUp = (): void => undefined;
    let letGo = (): void => undefined;
    // a new stage for each layout: a stage's canvas can't take another comp (its engine goes with the canvas's GL context)
    const mount = (w: number): void => {
      if (!createEngine || !doc || !setup || hasGivenUp || !isHeld) return;
      stage?.destroy();
      // a GPU context the browser took back (too many on the page) is let go, and tried again on the next hover; anything else
      // means it can't draw here
      stage = new FreshStage(host, createEngine, {
        onError: (reason) => (reason === 'lost' ? letGo() : giveUp()),
      });
      laidWidth = widthOf(w);
      engine = stage.mount({
        doc: laidWidth ? forWidth(doc, setup, laidWidth) : doc,
        opts: {
          fit: 'cover',
          alpha: true,
          paused: true,
          region: region as [number, number, number, number],
          dpr: 3,
        },
      });
      stage.setPaused(!isOn);
      setLive(false);
      cancelAnimationFrame(liveFrame);
      if (!engine) return;
      // a first frame drawn at once (unseen: the layer is clear till the hover), so it's live before the pointer gets there
      const mounted = stage;
      const settled = engine;
      mounted.settle(() => settled.player.seek(0), 0.3);
      const waitForFrame = (): void => {
        liveFrame = 0;
        if (!isMounted || stage !== mounted) return;
        if (mounted.hasDrawn()) setLive(true);
        else liveFrame = requestAnimationFrame(waitForFrame);
      };
      liveFrame = requestAnimationFrame(waitForFrame);
    };
    // its canvas freed (the pointer moved away, or its GPU context was lost): made again when it's held and hovered
    const release = (): void => {
      cancelAnimationFrame(liveFrame);
      stage?.destroy();
      stage = null;
      engine = null;
      setLive(false);
    };
    // wider than it plays on: hidden and its canvas let go (were it kept, the button would hold RazorSense's surface with nothing
    // over it), so it keeps its own hover
    const dropIfTooWide = (): boolean => {
      if (!isTooWide()) return false;
      if (engine || isOn) {
        isOn = false;
        window.clearTimeout(pauseTimer);
        pauseTimer = 0;
        layer.style.opacity = '0';
        release();
      }
      return true;
    };
    // a longer button laid out again as it resizes (the label's font coming in), not on the next hover
    const relay = new ResizeObserver(() => {
      window.clearTimeout(relayTimer);
      relayTimer = window.setTimeout(() => {
        // (grown past its widest, even mid-hover: its canvas goes, and it keeps its own hover)
        if (dropIfTooWide()) return;
        if (engine && !isOn && widthOf(button.offsetWidth) !== laidWidth) mount(button.offsetWidth);
      }, 200);
    });
    const fit = (): void => {
      if (!doc || !setup) return;
      const w = Math.max(1, button.offsetWidth);
      const h = Math.max(1, button.offsetHeight);
      // in place: the engine's options hold this array, and it lays out again as the button (and so its canvas) resizes
      regionOf(doc, setup, w, h).forEach((v, i) => {
        region[i] = v;
      });
      if (!engine || widthOf(w) !== laidWidth) mount(w);
      engine?.player.shapes(
        (2 * w) / setup.mask.w,
        (2 * h) / setup.mask.h,
        setup.mask.x,
        setup.mask.y,
        1,
      );
    };
    const show = (on: boolean): void => {
      if (on === isOn) return;
      if (on) {
        // its canvas is made as the pointer nears: once it's held, it shows if the pointer is still on the button
        if (!isHeld || hasGivenUp || dropIfTooWide()) return;
        fit();
        if (!engine || !stage) return;
      }
      isOn = on;
      window.clearTimeout(pauseTimer);
      pauseTimer = 0;
      layer.style.transitionDuration = on ? '.12s' : '.35s';
      layer.style.opacity = on ? '1' : '0';
      if (on && engine && stage) {
        // the button's insets again, over the canvas (its hover ones)
        if (edgeRef.current) edgeRef.current.style.boxShadow = getComputedStyle(button).boxShadow;
        stage.setPaused(false);
        engine.player.restart();
        engine.player.holdLoop(true);
      } else {
        // faded out: nothing more to draw, and its canvas may be let go
        pauseTimer = window.setTimeout(() => {
          pauseTimer = 0;
          engine?.player.pause();
          stage?.setPaused(true);
          slot?.update();
        }, 450);
      }
    };
    const enter = (event: PointerEvent): void => {
      // (where the pointer is, from the button's own event: it may have come on without moving)
      slot?.update(event.pointerType === 'touch' ? undefined : [event.clientX, event.clientY]);
      show(true);
    };
    const leave = (): void => show(false);
    const hold = (held: boolean): void => {
      isHeld = held;
      if (!held) {
        // (a running hover is let go only when more run than may be held)
        isOn = false;
        window.clearTimeout(pauseTimer);
        pauseTimer = 0;
        layer.style.opacity = '0';
        release();
        return;
      }
      // its canvas made as the pointer nears (its first frame ready for the hover), shown if the pointer's already on it
      if (dropIfTooWide()) return;
      fit();
      if (button.matches(':hover')) show(true);
    };
    letGo = (): void => {
      // (after this frame: the stage may be the one telling us)
      window.setTimeout(() => {
        if (!isMounted) return;
        isOn = false;
        window.clearTimeout(pauseTimer);
        pauseTimer = 0;
        layer.style.opacity = '0';
        release();
        slot?.update();
      }, 0);
    };
    giveUp = (): void => {
      if (hasGivenUp) return;
      hasGivenUp = true;
      window.setTimeout(() => {
        // (gone since: its cleanup let everything go, and the layer may be a newer run's)
        if (!isMounted) return;
        isOn = false;
        window.clearTimeout(pauseTimer);
        window.clearTimeout(relayTimer);
        layer.style.opacity = '0';
        relay.disconnect();
        button.removeEventListener('pointerenter', enter);
        button.removeEventListener('pointerleave', leave);
        slot?.remove();
        slot = null;
        release();
      }, 0);
    };

    // its comp and the engine's code loaded now (no canvas yet): ready for the pointer
    void Promise.all([loadFreshEngine(), import('./comps')])
      .then(([createFreshEngine, comps]) => {
        if (!isMounted) return;
        const docs = {
          light: square ? comps.buttonSenseSquareLight : comps.buttonSenseLight,
          dark: square ? comps.buttonSenseSquareDark : comps.buttonSenseDark,
        };
        doc = docs[mode] as Comp;
        setup = (doc.ui?.buttonSense as ButtonSenseSetup | undefined) ?? null;
        if (!setup) return;
        region = regionOf(doc, setup, button.offsetWidth, button.offsetHeight);
        createEngine = createFreshEngine;
        host.style.opacity = String(setup.opacity);
        relay.observe(button);
        button.addEventListener('pointerenter', enter);
        button.addEventListener('pointerleave', leave);
        slot = holdNearPointer(button, {
          isBusy: () => isOn || Boolean(pauseTimer),
          onHold: hold,
        });
      })
      .catch(() => {
        // the engine couldn't load: Blade's own hover
      });

    return () => {
      isMounted = false;
      window.clearTimeout(pauseTimer);
      window.clearTimeout(relayTimer);
      relay.disconnect();
      button.removeEventListener('pointerenter', enter);
      button.removeEventListener('pointerleave', leave);
      slot?.remove();
      layer.style.opacity = '0';
      release();
    };
  }, [isEnabled, isOnScreen, square, mode]);

  return (
    <span
      ref={layerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        borderRadius: 'inherit',
        overflow: 'hidden',
        opacity: 0,
        transition: 'opacity .35s ease',
        pointerEvents: 'none',
      }}
    >
      <span
        ref={hostRef}
        // the engine's own message (a lost GPU context) never paints text inside a button
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          fontSize: 0,
          color: 'transparent',
        }}
      />
      <i
        ref={edgeRef}
        style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none' }}
      />
    </span>
  );
};

export { ButtonRazorSenseLayer, widestFor };
