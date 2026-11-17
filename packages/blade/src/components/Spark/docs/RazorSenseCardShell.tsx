import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { runFreshStage } from '../RazorSenseEngine';
import type { FreshDoc, FreshEngine, FreshStage } from '../RazorSenseEngine';
import { useTheme } from '~components/BladeProvider';
import { makeLetterSpacing } from '~utils/makeLetterSpacing';
import { makeTypographySize } from '~utils/makeTypographySize';

/**
 * The shell of the agentic dashboard's cards (Ray's flow 9), for the stories: what every card shares, whatever it shows.
 * Hover it (or focus its CTA with the keyboard) and:
 *   - it lifts 2 px, with a soft shadow under its stroke
 *   - RazorSense fades in behind its content and plays once: a sweep along its bottom, over a soft glow
 *   - its CTA's label slides 3 px and its arrow 6 px, and a blue wash runs through them (in dark, a light-blue bloom)
 * At rest, the same wash runs through the CTA every 3.8 s.
 *
 * Any width and height: RazorSense stays on the card's bottom at its own height, and its sweep, which starts before the card's
 * left edge and ends past its right one, stretches with the card's width (the same timing; a wider card, a longer sweep).
 * Its WebGL context is made on the first hover, so a page of cards costs none until one is hovered.
 */

type CardShape = { name?: string; x?: number; y?: number; prm?: { w?: number; h?: number } };
type CardDoc = FreshDoc & { shapes?: CardShape[] };
type CardMask = { x: number; y: number; w: number; h: number };

/** flow 9's card: its stroke, its hover shadow and its content panel, light and dark */
const CARD = {
  light: {
    // the card comps' own ground (their p.cBgCol): their RazorSense is drawn for it
    ground: '#ffffff',
    stroke: 'rgba(5, 5, 5, 0.07)',
    lift: '0 10px 24px -12px rgba(16, 24, 40, 0.16), 0 2px 6px -3px rgba(16, 24, 40, 0.08)',
    panel: 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.03) 100%)',
  },
  dark: {
    ground: '#18181a',
    stroke: 'rgba(5, 5, 5, 0.07)',
    lift: '0 12px 28px -12px rgba(0, 0, 0, 0.7), 0 2px 6px -3px rgba(0, 0, 0, 0.45)',
    panel: 'linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.04) 100%)',
  },
};

/** flow 9's wash through the CTA (its label, then its arrow) */
const WASH = {
  /** the band: blue, near-white, blue */
  light: ['#1f39ff', '#f5f8ff', '#1f39ff'],
  /** dark: a light-blue band, and a soft glow of it behind the letters */
  dark: { tint: '#6b93ff', mid: '#d6e3ff', glow: 0.26, blur: 4 },
  /** % of the gradient: the band's middle, and the soft edge each side */
  band: 8,
  fade: 8,
  /** the gradient's angle (deg) and width (% of the label's width) */
  angle: 100,
  size: 280,
  /** where the band's middle starts and ends (as a background-position %) */
  from: 120,
  to: -40,
  /** s, and its cubic-bezier */
  dur: 2.8,
  ease: [0.02, 0.79, 0.37, 0.98],
  /** s: it fades back into the text colour once the pointer leaves */
  out: 0.3,
};
/** s: the same wash at rest, every `every` s, `sweep` long, the first at `firstAt` */
const IDLE = { every: 3.8, sweep: 6, firstAt: 0.9 };
/** ms after leaving: RazorSense stops drawing (its fade is CSS) */
const PAUSE_AFTER = 450;
/** ms after leaving: the wash at rest leaves the card alone (its hover wash is fading) */
const HOVER_HOLD = 700;

/** flow 9's CTA arrow, drawn as a mask so the wash can colour it */
const ARROW_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8.8623 3.52851C9.12262 3.26855 9.54444 3.26844 9.80469 3.52851L13.8047 7.52851C14.065 7.78886 14.065 8.21152 13.8047 8.47187L9.80469 12.4719C9.54443 12.732 9.12263 12.7318 8.8623 12.4719C8.60195 12.2115 8.60195 11.7889 8.8623 11.5285L11.7236 8.66718H2.66699C2.2988 8.66718 2 8.36838 2 8.00019C2.00001 7.632 2.29881 7.3332 2.66699 7.3332H11.7236L8.8623 4.47187C8.60195 4.21152 8.60195 3.78886 8.8623 3.52851Z'/%3E%3C/svg%3E")`;

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const smooth = (a: number, b: number, x: number): number => {
  const q = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return q * q * (3 - 2 * q);
};
const inOut = (u: number): number => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);
const rgbOf = (c: string): number[] =>
  c.startsWith('#')
    ? [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
    : (c.match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map(Number);
const bezier = ([x1, y1, x2, y2]: number[]): ((u: number) => number) => {
  const curve = (a: number, b: number, t: number): number =>
    3 * a * t * (1 - t) * (1 - t) + 3 * b * t * t * (1 - t) + t * t * t;
  return (u: number): number => {
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let t = u;
    for (let i = 0; i < 30; i += 1) {
      const x = curve(x1, x2, t);
      if (Math.abs(x - u) < 1e-5) break;
      if (x < u) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return curve(y1, y2, t);
  };
};
const washEase = bezier(WASH.ease);
const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** the comp's card: its hidden "Card (mask)" (comp px, its middle from the comp's middle; the comp is made at 2x) */
const maskOf = (doc: CardDoc): CardMask | null => {
  const m = doc.shapes?.find(
    (s) => /card/i.test(s.name ?? '') && /mask/i.test(s.name ?? '') && (s.prm?.w ?? 0) > 0,
  );
  if (!m?.prm?.w || !m.prm.h) return null;
  return { x: m.x ?? 0, y: m.y ?? 0, w: m.prm.w, h: m.prm.h };
};

const Card = styled.div<{ mode: 'light' | 'dark' }>(({ theme, mode }) => {
  const c = CARD[mode];
  return css`
    position: relative;
    isolation: isolate;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: ${theme.spacing[2]}px ${theme.spacing[3]}px ${theme.spacing[3]}px;
    border-radius: ${theme.border.radius.large}px;
    overflow: hidden;
    background: ${c.ground};
    box-shadow: 0 0 0 1px ${c.stroke};
    transition: transform 0.45s ${EASE}, box-shadow 0.45s ${EASE};

    /* everything in the card sits over its RazorSense */
    & > :not([data-card-razorsense]) {
      position: relative;
      z-index: 1;
    }
    &[data-hover='true'] {
      transform: translateY(-2px);
      box-shadow: 0 0 0 1px ${c.stroke}, ${c.lift};
    }
    &[data-hover='true'] [data-card-razorsense] {
      opacity: 1;
      transition-duration: 0.12s;
    }
    &[data-hover='true'] [data-cta-label] {
      transform: translateX(3px);
      transition-duration: 0.5s;
    }
    &[data-hover='true'] [data-cta-arrow] {
      transform: translateX(6px);
      transition-duration: 0.5s;
    }
  `;
});

/** RazorSense: over the card's fill, under all in it; fades in fast, out slower */
const RazorSenseLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
`;

/** the card's content: whatever this card shows */
const Panel = styled.div<{ mode: 'light' | 'dark' }>(
  ({ theme, mode }) => css`
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: ${theme.spacing[5]}px;
    border-radius: 14px;
    overflow: hidden;
    background: ${CARD[mode].panel};
  `,
);

const Cta = styled.button(
  ({ theme }) => css`
    flex: none;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing[3]}px;
    padding: 10px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    font-family: ${theme.typography.fonts.family.text};
    font-weight: ${theme.typography.fonts.weight.medium};
    font-size: ${makeTypographySize(theme.typography.fonts.size[100])};
    line-height: ${makeTypographySize(theme.typography.lineHeights[100])};
    letter-spacing: ${makeLetterSpacing(
      theme.typography.letterSpacings[100],
      theme.typography.fonts.size[100],
    )};
    color: ${theme.colors.surface.text.gray.normal};
    text-align: left;
    cursor: pointer;
    &:focus-visible {
      outline: 2px solid ${theme.colors.surface.border.primary.normal};
      outline-offset: -2px;
    }
  `,
);

const CtaLabel = styled.span`
  display: inline-block;
  position: relative;
  isolation: isolate;
  white-space: nowrap;
  transition: transform 0.35s ${EASE};
`;

const CtaArrow = styled.span`
  flex: none;
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: currentColor;
  -webkit-mask: ${ARROW_MASK} center / contain no-repeat;
  mask: ${ARROW_MASK} center / contain no-repeat;
  transition: transform 0.35s ${EASE};
`;

type RazorSenseCardShellProps = {
  /** px */
  width: number;
  /** px */
  height: number;
  /** the CTA's text */
  ctaLabel: string;
  onCtaClick?: () => void;
  /** the card's content */
  children?: React.ReactNode;
};

const RazorSenseCardShell = ({
  width,
  height,
  ctaLabel,
  onCtaClick,
  children,
}: RazorSenseCardShellProps): React.ReactElement => {
  const { colorScheme } = useTheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  const cardRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const host = hostRef.current;
    const cta = ctaRef.current;
    const label = labelRef.current;
    const arrow = arrowRef.current;
    if (!card || !host || !cta || !label || !arrow) return undefined;

    let isPointerIn = false;
    let isFocused = false;
    let isOn = false;
    let offAt = -1e9;
    let wash: { t0: number; off: number } | null = null;
    let isIdleWashing = false;
    let pauseTimer = 0;
    let raf = 0;
    const idleFrom = performance.now() + IDLE.firstAt * 1000;

    // RazorSense: its stage made on the first hover (or focus)
    const stageRef: React.MutableRefObject<FreshStage | null> = { current: null };
    let stopStage: (() => void) | null = null;
    let engine: FreshEngine | null = null;
    let doc: CardDoc | null = null;
    let mask: CardMask | null = null;
    // the card's spot of the comp, filled in place: the engine's options hold this array and lay out again as the card resizes
    const region: [number, number, number, number] = [0, 0, 1, 1];

    /**
     * The comp laid on the card: the card's spot, at the card's size and on its bottom, with the comp's shapes stretched along
     * x round the card's middle to its width (the sweep starts as far before its left edge and ends as far past its right,
     * scaled; the same keys, so the same timing) and left at their height, on its bottom edge.
     */
    const fit = (): void => {
      if (!doc || !mask) return;
      const w = Math.max(1, card.offsetWidth);
      const h = Math.max(1, card.offsetHeight);
      const bottom = mask.y + mask.h / 2;
      region[0] = doc.comp.w / 2 + mask.x - w;
      region[1] = doc.comp.h / 2 + bottom - 2 * h;
      region[2] = 2 * w;
      region[3] = 2 * h;
      engine?.player.shapes((2 * w) / mask.w, 1, mask.x, bottom, 1);
    };

    /** its timeline once from the start, held at its end (reduced motion: just its end, drawn still) */
    const play = (): void => {
      const stage = stageRef.current;
      if (!engine || !stage) return;
      fit();
      const { player } = engine;
      if (stage.reducedMotion) {
        stage.settle(() => player.seek(Math.max(0, player.duration - 0.001)));
        return;
      }
      stage.setPaused(false);
      player.restart();
    };

    const arm = (): void => {
      if (stopStage) return;
      stopStage = runFreshStage({
        moduleName: 'RazorSenseCard',
        getBox: () => host,
        stageRef,
        loadComps: () => import('./razorSenseCardComps'),
        start: (stage, comps) => {
          doc = (mode === 'dark' ? comps.razorSenseCardDark : comps.razorSenseCardLight) as CardDoc;
          mask = maskOf(doc);
          if (!mask) return false;
          fit();
          engine = stage.mount({
            doc,
            opts: { fit: 'cover', alpha: true, paused: true, loop: 'once', region, dpr: 2 },
          });
          if (!engine) return false;
          if (isOn) play();
          else stage.setPaused(true);
          return true;
        },
        // it can't animate here: the card keeps its lift and its wash, without RazorSense
        onFail: () => undefined,
        onRelease: () => {
          engine = null;
        },
      });
    };

    // the wash: one gradient laid along the CTA (its label, then its arrow), clipped to the letters and to the arrow's mask
    const paint = (u: number, k: number): void => {
      const parts = [label, arrow].filter((e) => e.offsetWidth > 0);
      if (!parts.length) return;
      const labelWidth = label.offsetWidth;
      const rowWidth = parts.reduce((sum, e) => sum + e.offsetWidth, 0);
      const size = (labelWidth * WASH.size) / 100;
      const middleAt = (p: number): number => ((labelWidth - size) * p) / 100 + size / 2;
      const c0 = middleAt(WASH.from);
      const c1 = middleAt(WASH.to) + (rowWidth - labelWidth);
      const isDark = mode === 'dark';
      const band = isDark ? [WASH.dark.tint, WASH.dark.mid, WASH.dark.tint] : WASH.light;
      const ink = rgbOf(getComputedStyle(cta).color);
      const inkColor = `rgb(${ink.join(',')})`;
      const mix = (color: string): string => {
        const to = rgbOf(color);
        return `rgb(${ink.map((q, n) => Math.round(q + (to[n] - q) * k)).join(',')})`;
      };
      const s1 = 50 - WASH.band / 2;
      const s3 = 50 + WASH.band / 2;
      const gradient = `linear-gradient(${WASH.angle}deg, ${inkColor} 0%, ${inkColor} ${
        s1 - WASH.fade
      }%, ${mix(band[0])} ${s1}%, ${mix(band[1])} 50%, ${mix(band[2])} ${s3}%, ${inkColor} ${
        s3 + WASH.fade
      }%, ${inkColor} 100%), linear-gradient(${inkColor}, ${inkColor})`;
      const left = c0 + (c1 - c0) * u - size / 2; // the gradient's left edge, px from the CTA row's start
      let x = 0;
      for (const e of parts) {
        Object.assign(e.style, {
          backgroundImage: gradient,
          backgroundSize: `${size.toFixed(1)}px 100%, 100% 100%`,
          backgroundPosition: `${(left - x).toFixed(1)}px 0, 0 0`,
          backgroundRepeat: 'no-repeat',
        });
        // (the arrow is a mask: its background is its fill)
        if (e === label) {
          Object.assign(e.style, {
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          });
        }
        x += e.offsetWidth;
      }
      if (isDark && WASH.dark.glow > 0) {
        // the glow: the band alone, blurred, behind the letters
        let bloom = label.querySelector<HTMLSpanElement>('[data-wash-bloom]');
        if (!bloom) {
          bloom = document.createElement('span');
          bloom.setAttribute('data-wash-bloom', '');
          bloom.setAttribute('aria-hidden', 'true');
          bloom.textContent = label.textContent;
          Object.assign(bloom.style, {
            position: 'absolute',
            inset: '0',
            zIndex: '-1',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          });
          label.append(bloom);
        }
        const clear = 'rgba(0,0,0,0)';
        const solid = (color: string): string => `rgb(${rgbOf(color).join(',')})`;
        Object.assign(bloom.style, {
          backgroundImage: `linear-gradient(${WASH.angle}deg, ${clear} 0%, ${clear} ${
            s1 - WASH.fade
          }%, ${solid(band[0])} ${s1}%, ${solid(band[1])} 50%, ${solid(band[2])} ${s3}%, ${clear} ${
            s3 + WASH.fade
          }%, ${clear} 100%)`,
          backgroundSize: `${size.toFixed(1)}px 100%`,
          backgroundPosition: `${left.toFixed(1)}px 0`,
          backgroundRepeat: 'no-repeat',
          webkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          filter: `blur(${WASH.dark.blur}px)`,
          opacity: (Math.min(2, WASH.dark.glow) * k).toFixed(3),
        });
      }
    };
    const clearWash = (): void => {
      for (const e of [label, arrow]) {
        Object.assign(e.style, {
          backgroundImage: '',
          backgroundSize: '',
          backgroundPosition: '',
          backgroundRepeat: '',
          webkitBackgroundClip: '',
          backgroundClip: '',
          color: '',
        });
      }
      label.querySelector('[data-wash-bloom]')?.remove();
    };

    const frame = (now: number): void => {
      raf = requestAnimationFrame(frame);
      const isCalm = prefersReducedMotion();
      // the hover's wash: once through, fading out if the pointer leaves
      if (wash) {
        const t = (now - wash.t0) / 1000;
        const k = wash.off ? 1 - smooth(0, WASH.out, (now - wash.off) / 1000) : 1;
        if (k <= 0 || t > WASH.dur + 0.05 || isCalm) {
          clearWash();
          wash = null;
        } else paint(washEase(t / WASH.dur), k);
        return;
      }
      if (isOn || now - offAt < HOVER_HOLD) return;
      // at rest: the same wash, every IDLE.every s
      const since = now - idleFrom;
      const u = since < 0 ? -1 : (since % (IDLE.every * 1000)) / (IDLE.sweep * 1000);
      if (isCalm || u < 0 || u >= 1) {
        if (isIdleWashing) {
          clearWash();
          isIdleWashing = false;
        }
        return;
      }
      isIdleWashing = true;
      paint(inOut(u), 1);
    };

    const update = (): void => {
      const next = isPointerIn || isFocused;
      if (next === isOn) return;
      isOn = next;
      card.dataset.hover = String(isOn);
      window.clearTimeout(pauseTimer);
      if (isOn) {
        arm();
        play();
        wash = prefersReducedMotion() ? null : { t0: performance.now(), off: 0 };
        return;
      }
      offAt = performance.now();
      if (wash && !wash.off) wash.off = offAt;
      pauseTimer = window.setTimeout(() => {
        if (isOn || !engine) return;
        engine.player.pause();
        stageRef.current?.setPaused(true);
      }, PAUSE_AFTER);
    };
    const onEnter = (): void => {
      isPointerIn = true;
      update();
    };
    const onLeave = (): void => {
      isPointerIn = false;
      update();
    };
    // keyboard focus on the CTA counts as hover
    const onFocusIn = (e: FocusEvent): void => {
      isFocused = e.target instanceof HTMLElement && e.target.matches(':focus-visible');
      update();
    };
    const onFocusOut = (): void => {
      isFocused = false;
      update();
    };
    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('focusin', onFocusIn);
    card.addEventListener('focusout', onFocusOut);
    // resized (its width or height changed): the comp laid on it again
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => fit());
    resize?.observe(card);
    if (card.matches(':hover')) onEnter();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(pauseTimer);
      resize?.disconnect();
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointerleave', onLeave);
      card.removeEventListener('focusin', onFocusIn);
      card.removeEventListener('focusout', onFocusOut);
      stopStage?.();
      clearWash();
      card.dataset.hover = 'false';
    };
  }, [mode]);

  return (
    <Card ref={cardRef} mode={mode} data-hover="false" style={{ width, height }}>
      <RazorSenseLayer ref={hostRef} data-card-razorsense="" aria-hidden="true" />
      <Panel mode={mode}>{children}</Panel>
      <Cta ref={ctaRef} type="button" onClick={onCtaClick}>
        <CtaLabel ref={labelRef} data-cta-label="">
          {ctaLabel}
        </CtaLabel>
        <CtaArrow ref={arrowRef} data-cta-arrow="" aria-hidden="true" />
      </Cta>
    </Card>
  );
};

export { RazorSenseCardShell };
export type { RazorSenseCardShellProps };
