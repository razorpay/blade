import React, { useEffect, useRef, useState } from 'react';
import { FreshStage, loadFreshEngine } from '../RazorSenseEngine';
import type { CreateFreshEngine, FreshDoc, FreshEngine } from '../RazorSenseEngine';
import type { ButtonRazorSenseProps } from './types';
import { useTheme } from '~components/BladeProvider';

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
 * ButtonRazorSenseLayer: Button's `hasRazorSense` hover (internal; web; loaded by ButtonRazorSense only when it's on). Flow 9's primary button hover (ray tools/flow/prim9.js, its
 * 'tab' version): on hover the mode's RazorSense comp plays over the button, under its label, looping while the pointer stays;
 * it fades in over .12s and out over .35s, then pauses. Any size: the button's own spot of the comp, the comp's moving shapes
 * squeezed or stretched round the button's middle to its width and height (the bands as they are); a button about as wide as
 * tall plays the square comp, a longer one keeps its growing ellipse at its bottom left (forWidth). Its canvas is made as the
 * button first comes on screen (so the first hover doesn't wait for it). Rendered as the button's first child; the button's
 * content sits above it.
 */
const ButtonRazorSenseLayer = ({ isEnabled }: ButtonRazorSenseProps): React.ReactElement | null => {
  const { colorScheme } = useTheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  const layerRef = useRef<HTMLSpanElement>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const edgeRef = useRef<HTMLElement>(null);
  const [square, setSquare] = useState<boolean | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  // the button's shape (square or wide) and whether it's on screen yet
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
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setIsOnScreen(true);
        seen.disconnect();
      }
    });
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
    let isMounted = true;
    let stage: FreshStage | null = null;
    let engine: FreshEngine | null = null;
    let doc: Comp | null = null;
    let setup: ButtonSenseSetup | null = null;
    let region: number[] = [0, 0, 1, 1];
    let laidWidth = 0; // the width the comp is laid out for (0: as made)
    let isOn = false;
    let pauseTimer = 0;
    let relayTimer = 0;

    // a longer button's comp is laid out for its width (forWidth); any other plays the comp as made
    const widthOf = (w: number): number =>
      square || !setup || w <= setup.mask.w / 2 ? 0 : Math.round(w);
    let createEngine: CreateFreshEngine | null = null;
    // a new stage for each layout: a stage's canvas can't take another comp (its engine goes with the canvas's GL context)
    const mount = (w: number): void => {
      if (!createEngine || !doc || !setup) return;
      stage?.destroy();
      stage = new FreshStage(host, createEngine);
      laidWidth = widthOf(w);
      engine = stage.reducedMotion
        ? null
        : stage.mount({
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
    };
    // a longer button laid out again as it resizes (the label's font coming in), not on the next hover
    const relay = new ResizeObserver(() => {
      window.clearTimeout(relayTimer);
      relayTimer = window.setTimeout(() => {
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
      if (widthOf(w) !== laidWidth) mount(w);
      engine?.player.shapes(
        (2 * w) / setup.mask.w,
        (2 * h) / setup.mask.h,
        setup.mask.x,
        setup.mask.y,
        1,
      );
    };
    const show = (on: boolean): void => {
      if (on === isOn || !engine || !stage) return;
      isOn = on;
      window.clearTimeout(pauseTimer);
      layer.style.transitionDuration = on ? '.12s' : '.35s';
      layer.style.opacity = on ? '1' : '0';
      if (on) {
        // the button's insets again, over the canvas (its hover ones)
        if (edgeRef.current) edgeRef.current.style.boxShadow = getComputedStyle(button).boxShadow;
        fit();
        stage.setPaused(false);
        engine?.player.restart();
        engine?.player.holdLoop(true);
      } else {
        // faded out: nothing more to draw
        pauseTimer = window.setTimeout(() => {
          engine?.player.pause();
          stage?.setPaused(true);
        }, 450);
      }
    };
    const enter = (): void => show(true);
    const leave = (): void => show(false);

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
        mount(button.offsetWidth);
        if (!engine) return; // reduced motion or no WebGL2: Blade's own hover stays
        host.style.opacity = String(setup.opacity);
        relay.observe(button);
        button.addEventListener('pointerenter', enter);
        button.addEventListener('pointerleave', leave);
        if (button.matches(':hover')) show(true);
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
      layer.style.opacity = '0';
      stage?.destroy();
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
      <span ref={hostRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />
      <i
        ref={edgeRef}
        style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none' }}
      />
    </span>
  );
};

export { ButtonRazorSenseLayer };
