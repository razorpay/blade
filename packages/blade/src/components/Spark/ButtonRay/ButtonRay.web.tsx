import React, { useEffect, useRef, useState } from 'react';
import { FreshStage, loadFreshEngine } from '../RazorSenseEngine';
import type { FreshDoc, FreshEngine } from '../RazorSenseEngine';
import { Ray } from '../Ray';
import { rayBoxSize } from '../Ray/RayMount';
import { useTheme } from '~components/BladeProvider';

type ButtonRaySetup = {
  mask: { x: number; y: number; w: number; h: number };
  scale: number;
  at: number;
};

/**
 * Flow 9's "Investigate with Ray" (ray tools/flow: inv8.js with its saved tune, settings/ray-flow9-inv8.json; the text wash,
 * wash9.js with settings/ray-secondarybutton.json). Sizes are Figma's at its 34px tall button, scaled to the button's height.
 */
const INV = {
  /** it widens to the right by this much, over this long (quartic ease-out) */
  grow: 39,
  growMs: 420,
  /** Ray's body: his left edge this far past the button's resting end, his feet this far below its bottom edge */
  rayX: 7.5,
  rayY: -1.5,
  /** his width at that 34px button; like every size here he scales with the button's height, from where he's placed (his left edge, his feet) */
  rayW: 49.5,
  /** his search film starts this long into the widening */
  startAfter: 0.12,
};
const WASH = {
  light: ['#1f39ff', '#f5f8ff', '#1f39ff'],
  /** dark: the bloom wash (tint, middle, tint) and its glow */
  dark: ['#6b93ff', '#d6e3ff', '#6b93ff'],
  bloom: 0.26,
  bloomBlur: 4,
  band: 8 * 1.3,
  fade: 8,
  angle: 100,
  /** the band's gradient as wide as this % of the label, its middle from 'from' to 'to' (background-position %) */
  size: 280,
  from: 120,
  to: -40,
  dur: 2.8,
  ease: [0.02, 0.79, 0.37, 0.98] as const,
};

const cubicBezier = ([x1, y1, x2, y2]: readonly number[]): ((u: number) => number) => {
  const b = (p1: number, p2: number, t: number): number =>
    3 * p1 * t * (1 - t) * (1 - t) + 3 * p2 * t * t * (1 - t) + t * t * t;
  return (u) => {
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let t = u;
    for (let i = 0; i < 30; i++) {
      const x = b(x1, x2, t);
      if (Math.abs(x - u) < 1e-5) break;
      if (x < u) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return b(y1, y2, t);
  };
};
const washEase = cubicBezier(WASH.ease);
const easeOutQuart = (u: number): number => 1 - (1 - Math.min(1, Math.max(0, u))) ** 4;
const smooth01 = (u: number): number => {
  const v = Math.min(1, Math.max(0, u));
  return v * v * (3 - 2 * v);
};
const rgb = (c: string): number[] => {
  if (c.startsWith('#')) return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  return (c.match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map(Number);
};

/** the card's bottom strip, as wide as the opened button (comp px; the comp is made at 2x): sidekick.js's invMake */
const stripRegion = (doc: FreshDoc, setup: ButtonRaySetup, w: number, h: number): number[] => {
  const k = Math.max(0.1, setup.scale);
  const bw = (2 * w) / k;
  const bh = (2 * h) / k;
  const left = doc.comp.w / 2 + setup.mask.x - setup.mask.w / 2;
  const bottom = doc.comp.h / 2 + setup.mask.y + setup.mask.h / 2;
  return [left + (setup.mask.w - bw) * Math.min(1, Math.max(0, setup.at)), bottom - bh, bw, bh];
};

/** the button's label: its innermost element with the text */
const labelOf = (button: HTMLElement): HTMLElement | null =>
  [...button.querySelectorAll<HTMLElement>('*')].find(
    (e) => e.childElementCount === 0 && (e.textContent ?? '').trim().length > 0,
  ) ?? null;

/**
 * ButtonRay: Button's `hasRay` hover (internal; web). Flow 9's "Investigate with Ray": on hover its RazorSense (the landing
 * card's hover, the card's bottom strip at the button's size: once, held) and a text wash along the label; at once the
 * button widens to the right and Ray is revealed in the new end, standing on its bottom edge, and whips out his magnifying
 * glass (his search film), searching for as long as the pointer stays. Off: he puts it away as it narrows again, together.
 * Light and dark (dark: the dark card's RazorSense, a soft blue bloom wash). Rendered as the button's first children; the
 * button's label sits above them.
 */
const ButtonRay = ({ isEnabled }: { isEnabled: boolean }): React.ReactElement | null => {
  const { colorScheme } = useTheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  const stripRef = useRef<HTMLSpanElement>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const edgeRef = useRef<HTMLElement>(null);
  const rayRef = useRef<HTMLSpanElement>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const rayBox = rayBoxSize('medium');

  useEffect(() => {
    const button = stripRef.current?.parentElement;
    // no observer (a test's DOM): Blade's own hover stays
    if (!button || typeof IntersectionObserver === 'undefined') return undefined;
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setIsOnScreen(true);
        seen.disconnect();
      }
    });
    seen.observe(button);
    return () => seen.disconnect();
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    const host = hostRef.current;
    const button = strip?.parentElement;
    if (!isEnabled || !isOnScreen || !strip || !host || !button) return undefined;
    let isMounted = true;
    let stage: FreshStage | null = null;
    let engine: FreshEngine | null = null;
    let frame = 0;
    let pauseTimer = 0;
    let searchTimer = 0;
    const basePadding = parseFloat(getComputedStyle(button).paddingRight) || 0;
    // the widening (e: 0..1) and the wash (its start and, once the pointer leaves, its fade)
    const S = {
      isOn: false,
      e: 0,
      from: 0,
      to: 0,
      a0: 0,
      w0: 0,
      washT0: 0,
      washOff: 0,
      label: null as HTMLElement | null,
      // the label's own colour, read before the wash paints it (painted, its colour is transparent)
      ink: [0, 0, 0],
    };
    let bloom: HTMLSpanElement | null = null;

    const scaleOf = (): number => button.offsetHeight / 34;
    const growPx = (): number => 2 * Math.round((INV.grow * scaleOf()) / 2);
    const clearWash = (): void => {
      if (S.label) {
        Object.assign(S.label.style, {
          backgroundImage: '',
          backgroundSize: '',
          backgroundPosition: '',
          backgroundRepeat: '',
          webkitBackgroundClip: '',
          backgroundClip: '',
          color: '',
        });
      }
      bloom?.remove();
      bloom = null;
    };
    const paintWash = (u: number, k: number): void => {
      const label = S.label;
      if (!label) return;
      const { ink } = S;
      const colors = mode === 'dark' ? WASH.dark : WASH.light;
      const mix = (c: string): string => {
        const to = rgb(c);
        return `rgb(${ink.map((q, n) => Math.round(q + (to[n] - q) * k)).join(',')})`;
      };
      const I = `rgb(${ink.join(',')})`;
      const s1 = 50 - WASH.band / 2;
      const s3 = 50 + WASH.band / 2;
      const band = (c0: string, c1: string, c2: string, outside: string): string =>
        `linear-gradient(${WASH.angle}deg, ${outside} 0%, ${outside} ${
          s1 - WASH.fade
        }%, ${c0} ${s1}%, ${c1} 50%, ${c2} ${s3}%, ${outside} ${s3 + WASH.fade}%, ${outside} 100%)`;
      const Wt = Math.max(1, label.offsetWidth);
      const size = (Wt * WASH.size) / 100;
      const at = (p: number): number => ((Wt - size) * p) / 100 + size / 2;
      const off = at(WASH.from) + (at(WASH.to) - at(WASH.from)) * u - size / 2;
      Object.assign(label.style, {
        backgroundImage: `${band(
          mix(colors[0]),
          mix(colors[1]),
          mix(colors[2]),
          I,
        )}, linear-gradient(${I}, ${I})`,
        backgroundSize: `${size.toFixed(1)}px 100%, 100% 100%`,
        backgroundPosition: `${off.toFixed(1)}px 0, 0 0`,
        backgroundRepeat: 'no-repeat, no-repeat',
        webkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      });
      if (mode === 'dark' && WASH.bloom > 0) {
        // the glow: the band alone, blurred, behind the letters
        if (!bloom) {
          bloom = document.createElement('span');
          bloom.setAttribute('aria-hidden', 'true');
          bloom.textContent = label.textContent;
          Object.assign(bloom.style, {
            position: 'absolute',
            inset: '0',
            pointerEvents: 'none',
            zIndex: '-1',
          });
          label.style.position = label.style.position || 'relative';
          label.append(bloom);
        }
        const clear = 'rgba(0,0,0,0)';
        Object.assign(bloom.style, {
          backgroundImage: band(colors[0], colors[1], colors[2], clear),
          backgroundSize: `${size.toFixed(1)}px 100%`,
          backgroundPosition: `${off.toFixed(1)}px 0`,
          backgroundRepeat: 'no-repeat',
          webkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          filter: `blur(${WASH.bloomBlur * scaleOf()}px)`,
          opacity: (Math.min(2, WASH.bloom) * k).toFixed(3),
        });
      }
    };
    const place = (): void => {
      // the button's width (it grows to the right) and Ray's spot past its resting end
      const ge = 2 * Math.round((INV.grow * scaleOf() * S.e) / 2);
      button.style.paddingRight = S.e > 0 ? `${basePadding + ge}px` : '';
      const ray = rayRef.current;
      if (ray) {
        const g = scaleOf();
        ray.style.left = `${(S.w0 || button.offsetWidth) + INV.rayX * g}px`;
        ray.style.top = `${button.offsetHeight + INV.rayY * g - rayBox.height}px`;
        ray.style.transform = `scale(${(INV.rayW * g) / rayBox.width})`;
      }
    };
    const tick = (now: number): void => {
      const u = (now - S.a0) / INV.growMs;
      S.e = S.from + (S.to - S.from) * easeOutQuart(u);
      place();
      if (S.washT0) {
        const t = (now - S.washT0) / 1000;
        const k = S.washOff ? 1 - smooth01((now - S.washOff) / 300) : 1;
        if (k <= 0 || t > WASH.dur + 0.05) {
          clearWash();
          S.washT0 = 0;
        } else paintWash(washEase(t / WASH.dur), k);
      }
      if (u < 1 || S.washT0) frame = requestAnimationFrame(tick);
      else {
        frame = 0;
        if (!S.isOn) {
          S.w0 = 0;
          button.style.paddingRight = '';
        }
      }
    };
    const run = (): void => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const show = (on: boolean): void => {
      if (on === S.isOn || !stage || !engine) return;
      S.isOn = on;
      window.clearTimeout(pauseTimer);
      window.clearTimeout(searchTimer);
      strip.style.transitionDuration = on ? '.15s' : '.45s';
      strip.style.opacity = on ? '1' : '0';
      S.from = S.e;
      S.to = on ? 1 : 0;
      S.a0 = performance.now();
      if (on) {
        S.w0 = S.w0 || button.offsetWidth;
        if (edgeRef.current) edgeRef.current.style.boxShadow = getComputedStyle(button).boxShadow;
        if (!S.washT0) {
          S.label = labelOf(button);
          if (S.label) S.ink = rgb(getComputedStyle(S.label).color);
        }
        S.washT0 = performance.now();
        S.washOff = 0;
        stage.setPaused(false);
        engine.player.restart();
        searchTimer = window.setTimeout(() => setIsSearching(true), INV.startAfter * 1000);
      } else {
        if (S.washT0) S.washOff = performance.now();
        setIsSearching(false);
        pauseTimer = window.setTimeout(() => {
          engine?.player.pause();
          stage?.setPaused(true);
        }, 480);
      }
      run();
    };
    const enter = (): void => show(true);
    const leave = (): void => show(false);

    void Promise.all([loadFreshEngine(), import('./comps')])
      .then(([createFreshEngine, comps]) => {
        if (!isMounted) return;
        const doc = mode === 'dark' ? comps.buttonRayDark : comps.buttonRayLight;
        const setup = doc.ui?.buttonRay as ButtonRaySetup | undefined;
        if (!setup) return;
        // the strip is as wide as the opened button all the time (a resize would clear its canvas: a flash), its left edge put
        const opened = button.offsetWidth + growPx();
        strip.style.width = `${opened}px`;
        const region = stripRegion(doc, setup, opened, button.offsetHeight);
        stage = new FreshStage(host, createFreshEngine);
        if (stage.reducedMotion) return; // reduced motion: Blade's own hover
        engine = stage.mount({
          doc,
          opts: {
            fit: 'cover',
            alpha: true,
            paused: true,
            loop: 'once',
            region: region as [number, number, number, number],
            dpr: 2,
          },
        });
        if (!engine) return; // no WebGL2: Blade's own hover
        stage.setPaused(true);
        place();
        button.addEventListener('pointerenter', enter);
        button.addEventListener('pointerleave', leave);
        if (button.matches(':hover')) show(true);
      })
      .catch(() => {
        // the engine couldn't load: Blade's own hover
      });

    return () => {
      isMounted = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(pauseTimer);
      window.clearTimeout(searchTimer);
      button.removeEventListener('pointerenter', enter);
      button.removeEventListener('pointerleave', leave);
      button.style.paddingRight = '';
      strip.style.opacity = '0';
      clearWash();
      stage?.destroy();
    };
  }, [isEnabled, isOnScreen, mode, rayBox.height, rayBox.width]);

  return (
    <>
      <span
        ref={stripRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '100%',
          zIndex: 0,
          overflow: 'hidden',
          opacity: 0,
          transition: 'opacity .45s ease',
          pointerEvents: 'none',
        }}
      >
        <span ref={hostRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />
      </span>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          borderRadius: 'inherit',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <span
          ref={rayRef}
          style={{ position: 'absolute', left: '100%', top: 0, transformOrigin: 'left bottom' }}
        >
          {isOnScreen && isEnabled ? (
            <Ray
              size="medium"
              idle="rest"
              state={isSearching ? 'searching' : 'idle'}
              isInteractive={false}
            />
          ) : null}
        </span>
      </span>
      <i
        ref={edgeRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export { ButtonRay };
