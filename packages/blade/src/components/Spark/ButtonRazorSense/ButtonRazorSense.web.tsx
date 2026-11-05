import React, { useEffect, useRef, useState } from 'react';
import { FreshStage, loadFreshEngine } from '../RazorSenseEngine';
import type { FreshDoc, FreshEngine } from '../RazorSenseEngine';
import { useTheme } from '~components/BladeProvider';

type ButtonSenseSetup = { mask: { x: number; y: number; w: number; h: number }; opacity: number };

/** a button about as wide as tall plays the square comp (flow 9's prim9.js: within 1.25x) */
const isSquare = (button: HTMLElement): boolean => button.offsetWidth <= button.offsetHeight * 1.25;

/** the button's spot of the comp (comp px; the comp is made at 2x), round its hidden "Button (mask)" */
const regionOf = (doc: FreshDoc, setup: ButtonSenseSetup, w: number, h: number): number[] => [
  doc.comp.w / 2 + setup.mask.x - w,
  doc.comp.h / 2 + setup.mask.y - h,
  2 * w,
  2 * h,
];

/**
 * ButtonRazorSense: Button's `hasRazorSense` hover (internal; web). Flow 9's primary button hover (ray tools/flow/prim9.js, its
 * 'tab' version): on hover the mode's RazorSense comp plays over the button, under its label, looping while the pointer stays;
 * it fades in over .12s and out over .35s, then pauses. Any size: the button's own spot of the comp, the comp's moving shapes
 * squeezed or stretched round the button's middle to its width and height (the bands as they are); a button about as wide as
 * tall plays the square comp. Its canvas is made as the button first comes on screen (so the first hover doesn't wait for it).
 * Rendered as the button's first child; the button's content sits above it.
 */
const ButtonRazorSense = ({ isEnabled }: { isEnabled: boolean }): React.ReactElement | null => {
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
    if (!button) return undefined;
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
    let doc: FreshDoc | null = null;
    let setup: ButtonSenseSetup | null = null;
    let region: number[] = [0, 0, 1, 1];
    let isOn = false;
    let pauseTimer = 0;

    const fit = (): void => {
      if (!engine || !doc || !setup) return;
      const w = Math.max(1, button.offsetWidth);
      const h = Math.max(1, button.offsetHeight);
      // in place: the engine's options hold this array, and it lays out again as the button (and so its canvas) resizes
      regionOf(doc, setup, w, h).forEach((v, i) => {
        region[i] = v;
      });
      engine.player.shapes(
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
        engine.player.restart();
        engine.player.holdLoop(true);
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
        doc = docs[mode];
        setup = (doc.ui?.buttonSense as ButtonSenseSetup | undefined) ?? null;
        if (!setup) return;
        region = regionOf(doc, setup, button.offsetWidth, button.offsetHeight);
        stage = new FreshStage(host, createFreshEngine);
        if (stage.reducedMotion) return; // reduced motion: Blade's own hover stays
        engine = stage.mount({
          doc,
          opts: {
            fit: 'cover',
            alpha: true,
            paused: true,
            region: region as [number, number, number, number],
            dpr: 3,
          },
        });
        if (!engine) return; // no WebGL2: Blade's own hover
        host.style.opacity = String(setup.opacity);
        stage.setPaused(true);
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

export { ButtonRazorSense };
