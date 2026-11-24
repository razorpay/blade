import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { loadFreshEngine, measureScreen } from '../RazorSenseEngine';
import type { CreateFreshEngine, FreshDoc, FreshEngine, FreshStage } from '../RazorSenseEngine';
import { Ray } from '../Ray';
import { RAY_BOX } from '../Ray/rayBox';
import { loadRay } from '../Ray/loadRay';
import type { RayState } from '../Ray/types';
import {
  canHover,
  followKeyboardFocus,
  holdNearPointer,
  whenHoverOrKeyboardFocus,
  whyCantPlayHover,
} from '../useLazyLayer/hoverSlots';
import { errorText, noteHover, SLOW_LOAD_MS } from '../useLazyLayer/hoverLog';
import type { HoverSlot, KeyboardFocus } from '../useLazyLayer/hoverSlots';
import { letGoOfStage, takeStage, VIEW_ONLY } from '../useLazyLayer/stagePool';
import type { PooledStage } from '../useLazyLayer/stagePool';
import { logger } from '~utils/logger';
import type { ButtonRayProps, ButtonRayVariant } from './types';
import { rgb } from './rgb';
import { useTheme } from '~components/BladeProvider';

type ButtonRaySetup = {
  mask: { x: number; y: number; w: number; h: number };
  scale: number;
  at: number;
};

/**
 * Each variant's Ray: how the button opens for him, where he stands, and what he does. Sizes are Figma's at a 34px tall
 * button, scaled to the button's height.
 */
const RAY_VARIANTS: Record<
  ButtonRayVariant,
  {
    grow: number;
    growMs: number;
    rayX: number;
    rayY: number;
    rayW: number;
    eyeY: number;
    padding: number;
    gapTrim: Record<ButtonRayProps['size'], number>;
    startAfter: number;
    state: RayState;
  }
> = {
  /**
   * Flow 9's "Investigate with Ray" (ray tools/flow: inv8.js with its saved tune, settings/ray-flow9-inv8.json; the text
   * wash, wash9.js with settings/ray-secondarybutton.json): he whips out his magnifying glass and searches.
   */
  investigate: {
    /** it widens to the right by this much, over this long (quartic ease-out) */
    grow: 39,
    growMs: 420,
    /** Ray's body: his left edge this far past the button's resting end, his feet this far below its bottom edge */
    rayX: 7.5,
    rayY: 0.5,
    /** his width at that 34px button; like every size here he scales with the button's height, from where he's placed (his left edge, his feet) */
    rayW: 49.5,
    /** his eyes, and the glass that rides his open eye, this much higher (− = up) */
    eyeY: -5,
    /** the button's right padding as it opens: Ray's spot and its width are measured from its label's end past this */
    padding: 8,
    /** per size, Ray and the opened end this many px closer to the label (as tuned on Blade's sizes) */
    gapTrim: { xsmall: 1, small: 2, medium: 4, large: 4 },
    /** his film starts this long into the hover (flow 9's beat: he notices, then the glass comes out; it's loaded ahead) */
    startAfter: 0.12,
    /** what he does while it's hovered */
    state: 'searching',
  },
};
/**
 * The text wash (wash9.js): a band of the primary colour with a light middle sweeping along the label. Its colour is the theme's
 * primary text (so it follows the theme and its brand colour), its middle that lifted this far towards white; dark adds a soft
 * bloom of the band behind the letters.
 */
const WASH = {
  lift: { light: 0.96, dark: 0.7 },
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
const css = ([r, g, b]: number[]): string => `rgb(${r},${g},${b})`;

/** whether the button grows when it's given more padding: not where its parent sets its width (stretched, a grid cell) */
const canWiden = (button: HTMLElement): boolean => {
  const before = button.offsetWidth;
  const own = button.style.paddingRight;
  button.style.paddingRight = `${(parseFloat(getComputedStyle(button).paddingRight) || 0) + 8}px`;
  const grows = button.offsetWidth > before;
  button.style.paddingRight = own;
  return grows;
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
 * Ray's canvases are drawn at the screen's density (at most 2) times how much bigger than his box he's shown, so a big button's
 * Ray made canvases at 2.9x on a Retina screen: about 10 MB each, three of them for a hover (the PR review). On a button they're
 * held to 2 device px per CSS px in all, so a hover's canvases take about half that; a Ray shown bigger than his box is a touch
 * softer for it.
 */
const MAX_RAY_SHARPNESS = 2;
const screenDensity = (): number =>
  Math.min(2, (typeof window === 'undefined' ? 1 : window.devicePixelRatio) || 1);

/**
 * ButtonRayLayer: Button's Ray hover (`aiHover="ray-…"`; internal; web; loaded by ButtonRay only when it's on). Flow 9's "Investigate with Ray": on hover its RazorSense (the landing
 * card's hover, the card's bottom strip at the button's size: once, held) and a text wash along the label; at once the
 * button widens to the right and Ray is revealed in the new end, standing on its bottom edge, and whips out his magnifying
 * glass (his search film), searching for as long as the pointer stays. Off: he puts it away as it narrows again, together.
 * Light and dark (dark: the dark card's RazorSense, a soft blue bloom wash). Its comp is loaded as the button comes on screen;
 * the strip's canvas and Ray (his canvases and films) are made only while the pointer is on or near the button and let go once
 * it has moved away and the hover is over (holdNearPointer), so a page of these holds a few at most. A button its parent sets
 * the width of (stretched in a column, a grid cell) can't widen: it keeps its own hover. Rendered as the button's first
 * children; the button's label sits above them.
 */
const ButtonRayLayer = ({
  isEnabled,
  variant,
  size,
}: ButtonRayProps): React.ReactElement | null => {
  const INV = RAY_VARIANTS[variant];
  const gapTrim = INV.gapTrim[size];
  const { colorScheme, theme } = useTheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  const tint = theme.colors.surface.text.primary.normal;
  const stripRef = useRef<HTMLSpanElement>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const edgeRef = useRef<HTMLElement>(null);
  const rayRef = useRef<HTMLSpanElement>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);
  // a device that can't hover (a phone): nothing probed or loaded (the engine, the strip's comp, Ray and his film) till the button
  // is focused from a keyboard
  const [canStart, setCanStart] = useState(canHover);
  // Ray's there only while the hover holds its canvases (the pointer on or near the button)
  const [isRayUp, setIsRayUp] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  // his width on this button (its height / 34 of flow 9's): drawn at the size of his nearest to it, and as much finer as he's
  // shown bigger than that (scaled up, he'd blur)
  const [rayWidth, setRayWidth] = useState(INV.rayW);
  const raySize = rayWidth < RAY_BOX.medium.width ? 'small' : 'medium';
  const rayBox = RAY_BOX[raySize];
  const rayBoxRef = useRef(rayBox);
  rayBoxRef.current = rayBox;

  useEffect(() => {
    const button = stripRef.current?.parentElement;
    // no observers (a test's DOM): Blade's own hover stays
    if (
      !button ||
      typeof IntersectionObserver === 'undefined' ||
      typeof ResizeObserver === 'undefined'
    )
      return undefined;
    const seen = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry) setIsOnScreen(entry.isIntersecting);
      },
      { rootMargin: '100px' },
    );
    seen.observe(button);
    return () => seen.disconnect();
  }, []);

  useEffect(() => {
    const button = stripRef.current?.parentElement;
    if (canStart || !isEnabled || !button) return undefined;
    noteHover('ray', "waiting: its button's keyboard focus (nothing here can hover)");
    return whenHoverOrKeyboardFocus(button, () => setCanStart(true));
  }, [canStart, isEnabled]);

  useEffect(() => {
    const strip = stripRef.current;
    const edge = edgeRef.current;
    const host = hostRef.current;
    const button = strip?.parentElement;
    if (!isEnabled || !canStart || !isOnScreen || !strip || !host || !button) return undefined;
    // reduced motion, no GPU drawing WebGL2, a page already too slow: Blade's own hover, nothing loaded
    const cantPlay = whyCantPlayHover();
    if (cantPlay) {
      noteHover('ray', `off: ${cantPlay}`);
      return undefined;
    }
    // the screen's rate, from now: before its canvas is made, as the pointer nears (once a page)
    measureScreen();
    let isMounted = true;
    // Ray (his canvases, and his film's GPU context) let go in this task, not on React's next turn: the slot that let him go may
    // hold another button in the same check, and the page must never hold more than its 3 (on a commit of its own he stayed up to
    // 98 ms longer on a Windows laptop, the device test). Not while React is unmounting the layer: it takes him down itself
    const rayDown = (): void => {
      if (isMounted) flushSync(() => setIsRayUp(false));
      else setIsRayUp(false);
    };
    let stage: FreshStage | null = null;
    // (its stage from the page's pool: one a button near it just let go, its GPU context and programs kept, or a new one)
    let pooled: PooledStage | null = null;
    let engine: FreshEngine | null = null;
    let isHeld = false;
    let slot: HoverSlot | null = null;
    let frame = 0;
    let pauseTimer = 0;
    let searchTimer = 0;
    let hasWarned = false;
    // Blade's own right padding: measured at rest with the rest (measure), so a resize or a new size since keeps it right
    let basePadding = parseFloat(getComputedStyle(button).paddingRight) || 0;
    // the widening (e: 0..1) and the wash (its start and, once the pointer leaves, its fade). What it lays out by is measured as
    // the hover starts, never while it runs: each frame writes, and reads nothing back (a read after a write is a layout)
    const S = {
      isOn: false,
      e: 0,
      from: 0,
      to: 0,
      a0: 0,
      // the button's width and height at rest, and its height over flow 9's 34 px
      w0: 0,
      h0: 0,
      g: 1,
      // the right padding last written (not written again while it's the same)
      padding: '',
      washT0: 0,
      washOff: 0,
      label: null as HTMLElement | null,
      labelWidth: 1,
      // the label's own text when its width was read: a label changed during the wash is measured again
      labelText: '',
      // the label's own colour, read before the wash paints it (painted, its colour is transparent)
      ink: [0, 0, 0],
      // how far the button's content runs on past its text (measured at rest)
      slack: 0,
      // the label's own inline position (the dark bloom needs it relative)
      labelPosition: '',
    };
    let bloom: HTMLSpanElement | null = null;
    // the label's own text, not the dark glow's copy of it
    const ownText = (label: HTMLElement): string =>
      Array.from(label.childNodes)
        .filter((node) => node !== bloom)
        .map((node) => node.textContent ?? '')
        .join('');
    // the wash's band: the theme's primary colour, its middle lifted towards white
    const washTint = rgb(tint);
    const washMiddle = washTint.map((q) => Math.round(q + (255 - q) * WASH.lift[mode]));

    // Blade's label runs on a little past its text: Ray and the opened end are measured from the text's own end, as in flow 9
    const slackOf = (): number => {
      const label = labelOf(button);
      if (!label) return 0;
      const range = document.createRange();
      range.selectNodeContents(label);
      // the content's own end: the text's, or a right-hand icon's past it (the button's content holds both)
      let end = range.getBoundingClientRect().right;
      const content = [...button.children].find((c) => c.contains(label));
      content?.querySelectorAll('svg').forEach((icon) => {
        end = Math.max(end, icon.getBoundingClientRect().right);
      });
      const contentEnd = button.getBoundingClientRect().right - basePadding;
      return Math.max(0, contentEnd - end);
    };
    const measure = (): void => {
      // (at rest the padding is Blade's own: only while it's open is it the widening's)
      if (!S.padding) basePadding = parseFloat(getComputedStyle(button).paddingRight) || 0;
      S.w0 = button.offsetWidth;
      S.h0 = button.offsetHeight;
      S.g = S.h0 / 34;
      S.slack = slackOf();
    };
    // the right padding opened e of the way: from Blade's own to flow 9's past the text (INV.padding) plus the widening,
    // whole even px
    const paddingAt = (e: number): number => {
      const ge = 2 * Math.round((INV.grow * S.g * e) / 2);
      const open = INV.padding * S.g - S.slack - gapTrim;
      return 2 * Math.round((basePadding + (open - basePadding) * e + ge) / 2);
    };
    const setPadding = (value: string): void => {
      if (value === S.padding) return;
      S.padding = value;
      button.style.paddingRight = value;
    };
    const clearWash = (): void => {
      if (S.label) {
        // its own colour back at once: Blade's colour transition would fade it in from transparent (a flash)
        Object.assign(S.label.style, {
          backgroundImage: '',
          backgroundSize: '',
          backgroundPosition: '',
          backgroundRepeat: '',
          webkitBackgroundClip: '',
          backgroundClip: '',
          color: '',
          transition: 'none',
        });
        void S.label.offsetWidth;
        S.label.style.transition = '';
      }
      if (bloom && S.label) S.label.style.position = S.labelPosition;
      bloom?.remove();
      bloom = null;
    };
    const paintWash = (u: number, k: number): void => {
      const label = S.label;
      if (!label) return;
      // the label changed during the wash (its text updated in place): its width read again, and the glow's copy with it
      const text = ownText(label);
      if (text !== S.labelText) {
        S.labelText = text;
        S.labelWidth = Math.max(1, label.offsetWidth);
        if (bloom) bloom.textContent = text;
      }
      const { ink } = S;
      const mix = (to: number[]): string => css(ink.map((q, n) => Math.round(q + (to[n] - q) * k)));
      const I = css(ink);
      const s1 = 50 - WASH.band / 2;
      const s3 = 50 + WASH.band / 2;
      const band = (c0: string, c1: string, c2: string, outside: string): string =>
        `linear-gradient(${WASH.angle}deg, ${outside} 0%, ${outside} ${
          s1 - WASH.fade
        }%, ${c0} ${s1}%, ${c1} 50%, ${c2} ${s3}%, ${outside} ${s3 + WASH.fade}%, ${outside} 100%)`;
      const Wt = S.labelWidth;
      const width = (Wt * WASH.size) / 100;
      const at = (p: number): number => ((Wt - width) * p) / 100 + width / 2;
      const off = at(WASH.from) + (at(WASH.to) - at(WASH.from)) * u - width / 2;
      Object.assign(label.style, {
        backgroundImage: `${band(
          mix(washTint),
          mix(washMiddle),
          mix(washTint),
          I,
        )}, linear-gradient(${I}, ${I})`,
        backgroundSize: `${width.toFixed(1)}px 100%, 100% 100%`,
        backgroundPosition: `${off.toFixed(1)}px 0, 0 0`,
        backgroundRepeat: 'no-repeat, no-repeat',
        webkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        // painted at once (Blade's colour transition would show the letters under the paint as they fade)
        transition: 'none',
      });
      if (mode === 'dark' && WASH.bloom > 0) {
        // the glow: the band alone, blurred, behind the letters
        if (!bloom) {
          bloom = document.createElement('span');
          bloom.setAttribute('aria-hidden', 'true');
          bloom.textContent = text;
          Object.assign(bloom.style, {
            position: 'absolute',
            inset: '0',
            pointerEvents: 'none',
            zIndex: '-1',
            filter: `blur(${WASH.bloomBlur * S.g}px)`,
          });
          // (its own position kept, given back in clearWash)
          S.labelPosition = label.style.position;
          label.style.position = label.style.position || 'relative';
          label.append(bloom);
        }
        const clear = 'rgba(0,0,0,0)';
        Object.assign(bloom.style, {
          backgroundImage: band(css(washTint), css(washMiddle), css(washTint), clear),
          backgroundSize: `${width.toFixed(1)}px 100%`,
          backgroundPosition: `${off.toFixed(1)}px 0`,
          backgroundRepeat: 'no-repeat',
          webkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          opacity: (Math.min(2, WASH.bloom) * k).toFixed(3),
        });
      }
    };
    const place = (): void => {
      // the button's width (it grows to the right, in place: what's after it moves along, as in flow 9) and Ray's spot past its
      // label's end
      setPadding(S.e > 0 ? `${paddingAt(S.e)}px` : '');
      const ray = rayRef.current;
      if (ray) {
        const box = rayBoxRef.current;
        const left = S.w0 - basePadding - S.slack + (INV.padding + INV.rayX) * S.g - gapTrim;
        // as in flow 9, his right side runs past the opened end (rayX + rayW > grow) and is cut by its corner: what shows is his
        // face and the glass, by design. Closed, his spot (near the label) can reach into the resting button's padding: he waits
        // just past its end and comes in with the widening (and goes back out as it closes). Moved by transform: no layout
        const away = Math.max(0, S.w0 + 1 - left);
        const x = left + away * (1 - S.e);
        const y = S.h0 + INV.rayY * S.g - box.height;
        ray.style.transform = `translate(${x}px, ${y}px) scale(${(INV.rayW * S.g) / box.width})`;
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
        if (!S.isOn) setPadding('');
        slot?.update();
      }
    };
    const run = (): void => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    // the strip's comp, loaded as the button comes on screen; the strip's spot of it, and how wide the strip is
    let doc: FreshDoc | null = null;
    let setup: ButtonRaySetup | null = null;
    let createEngine: CreateFreshEngine | null = null;
    const region = [0, 0, 1, 1];
    const fitStrip = (): void => {
      if (!doc || !setup) return;
      // the strip is as wide as the opened button all the time (a resize would clear its canvas: a flash), its left edge put
      const w = S.w0 - basePadding + paddingAt(1);
      strip.style.width = `${w}px`;
      // in place: the engine's options hold it, and it lays out again as the strip resizes
      stripRegion(doc, setup, w, S.h0).forEach((v, i) => {
        region[i] = v;
      });
      // his width on this button now
      setRayWidth((INV.rayW * S.h0) / 34);
    };
    // (set below, once what they undo is in place)
    let letGo = (): void => undefined;
    let giveUp = (): void => undefined;
    let hasGivenUp = false;
    // its canvas let go (the pointer moved away): parked for the next button for a moment (stagePool), or freed at once when its
    // GPU context was lost or it can't draw here (`isReusable` false); made again when it's held and hovered
    const release = (isReusable = true): void => {
      if (pooled) letGoOfStage(pooled, isReusable && !hasGivenUp);
      pooled = null;
      stage = null;
      engine = null;
    };
    // the strip's stage made (the pointer's near), and Ray put in
    const make = (): void => {
      if (!createEngine || !doc || !isHeld || engine) return;
      measure();
      fitStrip();
      setIsRayUp(true);
      // a GPU context the browser took back (too many on the page) is let go, and tried again on the next hover; anything else
      // means it can't draw here: Blade's own hover, for good
      pooled = takeStage(host, `spark:${mode}`, createEngine, (reason) => {
        noteHover('ray', `stage: ${reason}`);
        return reason === 'lost' ? letGo() : giveUp();
      });
      stage = pooled.stage;
      // (a stage another button let go still shows its last frame: drawn afresh from the start, unseen, before it's shown here)
      const isWarm = stage.hasDrawn();
      engine = stage.mount(
        {
          doc,
          opts: {
            fit: 'cover',
            alpha: true,
            paused: true,
            loop: 'once',
            region: region as [number, number, number, number],
            dpr: 2,
          },
        },
        // (its layers made only over the strip's spot of the card: the same picture, in a fraction of the memory)
        VIEW_ONLY,
      );
      stage.setPaused(true);
      if (!engine) noteHover('ray', 'stage: made no engine');
      if (isWarm && engine) {
        const warm = engine;
        stage.settle(() => warm.player.seek(0), 0);
      }
      place();
    };
    const show = (on: boolean): void => {
      if (on === S.isOn) return;
      if (on) {
        if (!isHeld) return; // (once it's held, it shows if the pointer's still on the button)
        // its parent sets its width (stretched, a grid cell): it can't widen for him, so it keeps its own hover
        if (!S.isOn && S.e === 0 && !canWiden(button)) {
          if (!hasWarned) {
            hasWarned = true;
            noteHover('ray', "off: it can't widen (its parent sets its width)");
            if (__DEV__) {
              logger({
                type: 'warn',
                moduleName: 'Button',
                message:
                  "aiHover: this button can't widen (its parent sets its width: a stretched column, a grid cell), so it keeps its own hover. Give it room to grow to the right.",
              });
            }
          }
          return;
        }
        if (!engine) make();
        if (!engine || !stage) return;
      }
      S.isOn = on;
      window.clearTimeout(pauseTimer);
      pauseTimer = 0;
      window.clearTimeout(searchTimer);
      strip.style.transitionDuration = on ? '.15s' : '.45s';
      strip.style.opacity = on ? '1' : '0';
      S.from = S.e;
      S.to = on ? 1 : 0;
      S.a0 = performance.now();
      if (on && engine && stage) {
        if (S.e === 0) {
          // measured at rest, as it starts: nothing's read while it runs
          measure();
          fitStrip();
        }
        if (edgeRef.current) edgeRef.current.style.boxShadow = getComputedStyle(button).boxShadow;
        if (!S.washT0) {
          S.label = labelOf(button);
          if (S.label) {
            S.ink = rgb(getComputedStyle(S.label).color);
            S.labelWidth = Math.max(1, S.label.offsetWidth);
            S.labelText = ownText(S.label);
          }
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
          pauseTimer = 0;
          engine?.player.pause();
          stage?.setPaused(true);
          // faded out: the button's own edge again (the hover's insets were laid over the strip)
          if (edgeRef.current) edgeRef.current.style.boxShadow = '';
          slot?.update();
        }, 480);
      }
      run();
    };
    const enter = (event: PointerEvent): void => {
      // (where the pointer is, from the button's own event: it may have come on without moving)
      slot?.update(event.pointerType === 'touch' ? undefined : [event.clientX, event.clientY]);
      show(true);
    };
    // keyboard focus plays it as hovering does (followKeyboardFocus); hovered and focused at once is the one hover
    let keyboardFocus: KeyboardFocus | null = null;
    const isWanted = (): boolean => button.matches(':hover') || Boolean(keyboardFocus?.isFocused());
    const leave = (): void => show(Boolean(keyboardFocus?.isFocused()));
    // back at rest, at once (let go, given up, unmounted)
    const rest = (): void => {
      cancelAnimationFrame(frame);
      frame = 0;
      window.clearTimeout(pauseTimer);
      pauseTimer = 0;
      window.clearTimeout(searchTimer);
      S.isOn = false;
      S.e = 0;
      S.washT0 = 0;
      setIsSearching(false);
      setPadding('');
      strip.style.opacity = '0';
      if (edge) edge.style.boxShadow = '';
      clearWash();
    };
    const hold = (held: boolean): void => {
      isHeld = held;
      if (held) {
        // made as the pointer nears (the strip's first frame and his films ready for the hover), shown if it's already on it
        if (canWiden(button)) make();
        if (isWanted()) show(true);
        return;
      }
      rest();
      release();
      rayDown();
    };
    letGo = (): void => {
      // (after this frame: the stage may be the one telling us)
      window.setTimeout(() => {
        if (!isMounted) return;
        rest();
        release(false);
        // Ray let go too (his canvases and films), as when the pointer moves away: both made again on the next hover (the PR
        // review)
        rayDown();
        slot?.update();
      }, 0);
    };
    // the button resized at rest (its label, its container, a font coming in): the strip and its spot of the card follow
    let refitTimer = 0;
    const resize = new ResizeObserver(() => {
      window.clearTimeout(refitTimer);
      refitTimer = window.setTimeout(() => {
        if (S.isOn || S.e > 0 || !engine) return;
        measure();
        fitStrip();
        place();
      }, 200);
    });

    giveUp = (): void => {
      if (hasGivenUp) return;
      hasGivenUp = true;
      window.setTimeout(() => {
        if (!isMounted) return;
        rest();
        resize.disconnect();
        button.removeEventListener('pointerenter', enter);
        button.removeEventListener('pointerleave', leave);
        keyboardFocus?.stop();
        slot?.remove();
        slot = null;
        release();
        setIsRayUp(false);
      }, 0);
    };

    // Ray's code and his film's too, while the page is idle (nothing made): he starts at once as the pointer nears, not as it hovers
    loadRay(INV.state).catch((error: unknown) =>
      noteHover('ray', `Ray's code failed to load (${errorText(error)})`),
    );
    // the strip's comp and the engine's code loaded now (no canvas yet): ready for the pointer
    const slowLoad = window.setTimeout(
      () =>
        noteHover(
          'ray',
          `loading: the engine or its comp hasn't arrived after ${SLOW_LOAD_MS / 1000} s`,
        ),
      SLOW_LOAD_MS,
    );
    void Promise.all([loadFreshEngine(), import('./comps')])
      .then(([createFreshEngine, comps]) => {
        window.clearTimeout(slowLoad);
        if (!isMounted) return;
        doc = mode === 'dark' ? comps.buttonRayDark : comps.buttonRayLight;
        setup = (doc.ui?.buttonRay as ButtonRaySetup | undefined) ?? null;
        if (!setup) {
          noteHover('ray', 'off: its comp has no button setup');
          return;
        }
        createEngine = createFreshEngine;
        resize.observe(button);
        button.addEventListener('pointerenter', enter);
        button.addEventListener('pointerleave', leave);
        slot = holdNearPointer(button, {
          isBusy: () => S.isOn || Boolean(frame) || Boolean(pauseTimer),
          onHold: hold,
        });
        keyboardFocus = followKeyboardFocus(button, slot, (isFocused) =>
          show(isFocused || button.matches(':hover')),
        );
        noteHover('ray', 'ready');
      })
      .catch((error: unknown) => {
        window.clearTimeout(slowLoad);
        // the engine couldn't load: Blade's own hover
        noteHover('ray', `off: the engine or its comp failed to load (${errorText(error)})`);
      });

    return () => {
      isMounted = false;
      window.clearTimeout(slowLoad);
      rest();
      window.clearTimeout(refitTimer);
      resize.disconnect();
      button.removeEventListener('pointerenter', enter);
      button.removeEventListener('pointerleave', leave);
      keyboardFocus?.stop();
      slot?.remove();
      release();
      setIsRayUp(false);
    };
  }, [isEnabled, canStart, isOnScreen, mode, tint, INV, gapTrim]);

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
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transformOrigin: 'left bottom',
            // (placed as the hover starts: till then, past the button's end)
            transform: 'translateX(10000px)',
          }}
        >
          {isRayUp && isEnabled ? (
            <Ray
              size={raySize}
              idle="rest"
              state={isSearching ? INV.state : 'idle'}
              shouldReactToPointer={false}
              _lookY={(INV.eyeY * rayBox.width) / INV.rayW}
              _scale={Math.min(rayWidth / rayBox.width, MAX_RAY_SHARPNESS / screenDensity())}
              _preloadState={INV.state}
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

export { ButtonRayLayer };
