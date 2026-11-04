/**
 * Flow 9's landing and chat UI at flow 9's sizes and places, measured off ray's flow9.html at 1024-1920 px windows, for the Fresh
 * RazorSense stories: the components are laid under them exactly as flow 9 lays its RazorSense. The chat bars' look is flow 9's own
 * (tools/flow: flow4 / flow5 / dark5.css, edge9.js and the saved tunes settings/ray-flow6-glass.json, ray-flow9-edge.json).
 * Everything is placed from the window's middle across and its middle or bottom down, as flow 9 places it.
 */
import React, { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';

/** the smallest window the mocks lay out: a canvas smaller than this shows this window scaled down to fit */
const MIN_WINDOW = { width: 1280, height: 800 };

type Flow9Window = { width: number; height: number; scale: number; left: number; top: number };

/**
 * Flow 9's window in the story's canvas: the canvas itself when it's at least a small laptop's (1280 x 800), so the layout is
 * flow 9's to the pixel; in a smaller canvas (Storybook's panels open, a docs page) a 1280 x 800 window scaled down to fit, so the
 * whole chat input and the RazorSense around it always show.
 */
const useFlow9Window = (ref: React.RefObject<HTMLDivElement>): Flow9Window => {
  const [size, setSize] = useState<Flow9Window>({
    width: 1512,
    height: 982,
    scale: 1,
    left: 0,
    top: 0,
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = (): void => {
      const cw = Math.max(1, el.clientWidth);
      const ch = Math.max(1, el.clientHeight);
      const width = Math.max(cw, MIN_WINDOW.width);
      const height = Math.max(ch, MIN_WINDOW.height);
      const scale = Math.min(cw / width, ch / height);
      setSize({
        width,
        height,
        scale,
        left: (cw - width * scale) / 2,
        top: (ch - height * scale) / 2,
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return size;
};

/** flow 9's window, laid in the story's canvas (see useFlow9Window) */
const Flow9Stage = ({
  win,
  children,
}: {
  win: Flow9Window;
  children: React.ReactNode;
}): ReactElement => (
  <div
    style={{
      position: 'absolute',
      left: win.left,
      top: win.top,
      width: win.width,
      height: win.height,
      transform: win.scale < 1 ? `scale(${win.scale})` : undefined,
      transformOrigin: '0 0',
    }}
  >
    {children}
  </div>
);

const FONT = 'Inter, -apple-system, "SF Pro Text", system-ui, sans-serif';
/** dark mode's glass on the chat bars (dark5.css): white 6% -> 2% */
const GLASS = 'linear-gradient(180deg, rgba(252,252,255,.06) 0%, rgba(255,255,255,.02) 100%)';

const PlusIcon = ({ isDark }: { isDark: boolean }): ReactElement => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M9.999 3.333c.46 0 .833.374.833.834v5h5c.46 0 .834.373.834.833s-.374.833-.834.833h-5v5c0 .46-.373.834-.833.834s-.833-.374-.833-.834v-5h-5c-.46 0-.834-.373-.834-.833s.374-.833.834-.833h5v-5c0-.46.373-.834.833-.834z"
      fill={isDark ? '#ffffff' : '#050505'}
    />
  </svg>
);

const MicIcon = ({ isDark }: { isDark: boolean }): ReactElement => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 0C7.343 0 6 1.343 6 3v6c0 1.657 1.343 3 3 3s3-1.343 3-3V3c0-1.657-1.343-3-3-3zM7.5 3c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5v6c0 .828-.672 1.5-1.5 1.5S7.5 9.828 7.5 9V3z"
      fill={isDark ? '#ffffff' : '#050505'}
    />
    <path
      d="M4.5 7.5c0-.414-.336-.75-.75-.75S3 7.086 3 7.5V9c0 3.06 2.29 5.585 5.25 5.954V16.5H6c-.414 0-.75.336-.75.75s.336.75.75.75h6c.414 0 .75-.336.75-.75s-.336-.75-.75-.75H9.75v-1.546C12.71 14.585 15 12.06 15 9V7.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75V9c0 2.485-2.015 4.5-4.5 4.5S4.5 11.485 4.5 9V7.5z"
      fill={isDark ? '#ffffff' : '#050505'}
    />
  </svg>
);

const SendIcon = (): ReactElement => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M11 17.1111V5.8667" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M6.60156 9.9L11.0016 5.5L15.4016 9.9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** flow 9's page under its boxes: in dark the boxes hide the effect behind them (the glass tune: see-through 0), so this shows */
const PAGE = { light: '#ffffff', dark: '#131315' };
const F4_SHADOW =
  '0 6px 6px -3px rgba(0,0,0,.04), 0 3px 3px -1.4px rgba(0,0,0,.04), 0 1px 1px -.5px rgba(0,0,0,.04)';

/** flow 9's chat-bar edge (tools/flow/edge9.js with its saved tune, settings/ray-flow9-edge.json): [light, dark] where they differ */
const EDGE = {
  restA: 0.12,
  spin: { color: ['#619bff', '#8fa8ff'], alpha: 0.99, radius: 142.5, period: 15 },
  hover: { from: ['#1566f1', '#7aa8ff'], to: ['#7aa8ff', '#4d7dff'], w: 200, h: 94, follow: 90 },
  active: { color: ['#7eacfb', '#5b8cff'], opacity: 0.75 },
  glow: { color: ['#1566f1', '#5b8cff'], alpha: 0.055, blur: 13, spread: 4, inner: 0.1 },
  ease: 0.32,
};

const BAR_CSS = `
.fresh-flow9-bar { position: absolute; box-sizing: border-box; border: 1px solid transparent; border-radius: 24px;
  font: 400 14px/16.94px ${FONT}; -webkit-font-smoothing: antialiased; }
.fresh-flow9-ring { position: absolute; inset: -1px; border-radius: inherit; padding: 1px; pointer-events: none; z-index: 3;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0); }
.fresh-flow9-bar input { position: absolute; box-sizing: border-box; padding: 0; border: 0; outline: 0; background: transparent;
  font: inherit; color: #050505; }
.fresh-flow9-bar input::placeholder { color: rgba(5,5,5,.5); }
.fresh-flow9-bar.fresh-flow9-dark input { color: #ffffff; caret-color: #4489ff; }
.fresh-flow9-bar.fresh-flow9-dark input::placeholder { color: rgba(255,255,255,.5); }
.fresh-flow9-btn { position: absolute; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 53px; }
.fresh-flow9-btn:hover { background: rgba(0,0,0,.04); }
.fresh-flow9-dark .fresh-flow9-btn:hover { background: rgba(255,255,255,.06); }
.fresh-flow9-mic { transition: transform .42s cubic-bezier(.22,.9,.24,1) .03s; }
.fresh-flow9-empty .fresh-flow9-mic { transform: translateX(42px); }
.fresh-flow9-send { position: absolute; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 12px;
  background: #0c0c0d; color: #ffffff; box-shadow: inset 0 -1.5px 0 rgba(0,0,0,.18), inset 0 0 0 .5px rgba(0,0,0,.18);
  transition: opacity .16s ease, transform .44s cubic-bezier(.34,1.56,.64,1); }
.fresh-flow9-dark .fresh-flow9-send { background: #f3f3f4; color: #0c0c0d; }
.fresh-flow9-empty .fresh-flow9-send { opacity: 0; transform: scale(.3); transition: opacity .14s ease, transform .22s cubic-bezier(.4,0,1,1); }
`;

const rgba = (hex: string, alpha: number): string => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
};

/** a point along a rounded rectangle's outline (w x h, corner radius r), u 0..1 of its length, clockwise from the top's middle */
const roundRectAt = (w: number, h: number, r: number, u: number): [number, number] => {
  const sx = w - 2 * r;
  const sy = h - 2 * r;
  const q = (Math.PI * r) / 2;
  let d = (((u % 1) + 1) % 1) * (2 * sx + 2 * sy + 4 * q);
  const arc = (cx: number, cy: number, a0: number, t: number): [number, number] => [
    cx + r * Math.cos(a0 + t / r),
    cy + r * Math.sin(a0 + t / r),
  ];
  const segments: [number, (t: number) => [number, number]][] = [
    [sx / 2, (t) => [w / 2 + t, 0]],
    [q, (t) => arc(w - r, r, -Math.PI / 2, t)],
    [sy, (t) => [w, r + t]],
    [q, (t) => arc(w - r, h - r, 0, t)],
    [sx, (t) => [w - r - t, h]],
    [q, (t) => arc(r, h - r, Math.PI / 2, t)],
    [sy, (t) => [0, h - r - t]],
    [q, (t) => arc(r, r, Math.PI, t)],
    [sx / 2, (t) => [r + t, 0]],
  ];
  for (const [length, at] of segments) {
    if (d <= length) return at(d);
    d -= length;
  }
  return [w / 2, 0];
};

/**
 * flow 9's edge on a chat bar: the 12% ring at rest with a light going round it, a ring following the cursor near the bar, and
 * a solid ring with a faint glow while typing in it (edge9.js's tick, one bar).
 */
const useFlow9Edge = (ref: React.RefObject<HTMLDivElement>, isDark: boolean): void => {
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return undefined;
    const ring = (name: string): HTMLElement =>
      bar.querySelector<HTMLElement>(`[data-ring="${name}"]`)!;
    const [light, hover, active] = [ring('light'), ring('hover'), ring('active')];
    const m = isDark ? 1 : 0;
    const baseShadow = isDark ? `0 4px 12px rgba(0,0,0,.1), ${F4_SHADOW}` : F4_SHADOW;
    const pointer = { x: -1e4, y: -1e4 };
    const onMove = (e: PointerEvent): void => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = (): void => {
      pointer.x = -1e4;
      pointer.y = -1e4;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    let frame = 0;
    let last = 0;
    let typing = 0;
    let near = 0;
    let angle = 0;
    let mx = 0;
    let my = 0;
    let isTracking = false;
    let shadow = '';
    const tick = (now: number): void => {
      frame = requestAnimationFrame(tick);
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      const w = bar.offsetWidth;
      const h = bar.offsetHeight;
      const r = bar.getBoundingClientRect();
      typing +=
        ((bar.matches(':focus-within') ? 1 : 0) - typing) * (1 - Math.exp(-dt / (EDGE.ease / 3)));
      const ox = Math.max(r.left - pointer.x, 0, pointer.x - r.right);
      const oy = Math.max(r.top - pointer.y, 0, pointer.y - r.bottom);
      const d = Math.hypot(ox, oy);
      const u = Math.max(0, Math.min(1, (d - 24) / 90));
      near += ((d <= 24 ? 1 : 1 - u * u * (3 - 2 * u)) - near) * (1 - Math.exp((-dt * 1000) / 73));
      const k = r.width / Math.max(1, w); // (the window scaled down to fit: the pointer in the bar's own px)
      const tx = (pointer.x - r.left) / k + 1;
      const ty = (pointer.y - r.top) / k + 1;
      if (!isTracking || near < 0.02) {
        mx = tx;
        my = ty;
        isTracking = true;
      } else {
        const k = 1 - Math.exp((-dt * 1000) / EDGE.hover.follow);
        mx += (tx - mx) * k;
        my += (ty - my) * k;
      }
      angle = (angle + (dt * 360) / EDGE.spin.period) % 360;
      const rest = 1 - typing;
      const [lx, ly] = roundRectAt(w + 2, h + 2, 25, angle / 360);
      const sc = EDGE.spin.color[m];
      light.style.background = `radial-gradient(circle ${EDGE.spin.radius}px at ${lx.toFixed(
        1,
      )}px ${ly.toFixed(1)}px, ${rgba(sc, EDGE.spin.alpha)} 0%, ${rgba(
        sc,
        EDGE.spin.alpha * 0.45,
      )} 45%, ${rgba(sc, 0)} 100%)`;
      light.style.opacity = (rest * (1 - near)).toFixed(3);
      const [c1, c2] = [EDGE.hover.from[m], EDGE.hover.to[m]];
      hover.style.background = `radial-gradient(${EDGE.hover.w}px ${EDGE.hover.h}px at ${mx.toFixed(
        1,
      )}px ${my.toFixed(1)}px, ${rgba(c1, 1)} 0%, ${rgba(c2, 1)} 42%, ${rgba(c2, 0.5)} 70%, ${rgba(
        c2,
        0,
      )} 100%)`;
      hover.style.opacity = (near * rest).toFixed(3);
      active.style.opacity = (EDGE.active.opacity * typing).toFixed(3);
      const gc = EDGE.glow.color[m];
      const glow = [
        EDGE.glow.alpha * typing > 0.003
          ? `0 0 ${EDGE.glow.blur}px ${EDGE.glow.spread}px ${rgba(gc, EDGE.glow.alpha * typing)}`
          : '',
        EDGE.glow.inner * typing > 0.003
          ? `inset 0 0 ${(EDGE.glow.blur * 0.6).toFixed(1)}px ${rgba(gc, EDGE.glow.inner * typing)}`
          : '',
      ].filter(Boolean);
      const next = [baseShadow, ...glow].join(', ');
      if (next !== shadow) {
        shadow = next;
        bar.style.boxShadow = next;
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [ref, isDark]);
};

/** where a bar's parts sit: the landing's (two rows: the text, then + and the mic) or the chat's (one row) */
const BAR_LAYOUT = {
  landing: {
    input: { left: 12, top: 10, width: 'calc(100% - 24px)', height: 37, padding: '0 10px' },
    plus: { left: 12, bottom: 10 },
    mic: { right: 52, bottom: 10 },
    send: { right: 12, bottom: 12 },
  },
  chat: {
    input: { left: 51, top: 9, width: 'calc(100% - 154px)', height: 40 },
    plus: { left: 11, top: 9 },
    mic: { right: 51, top: 9 },
    send: { right: 11, top: 11 },
  },
};

/**
 * Flow 9's chat bar (the landing's #field, the chat's #cfield): light, white inside a clear 1 px edge; dark, the 6% -> 2% white
 * glass on the page, the effect hidden behind it as flow 9's glass tune has it. The edge is flow 9's (useFlow9Edge); the send
 * button pops in once there's text, pushing the mic left.
 */
const Flow9Bar = ({
  isDark,
  layout,
  box,
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  inputRef,
  barRef,
}: {
  isDark: boolean;
  layout: keyof typeof BAR_LAYOUT;
  box: { left: number; top: number; width: number; height: number };
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
  /** the bar's element, for a component that follows the chat input */
  barRef?: React.MutableRefObject<HTMLDivElement | null>;
}): ReactElement => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  useFlow9Edge(ref, isDark);
  const place = BAR_LAYOUT[layout];
  const m = isDark ? 1 : 0;
  return (
    <div
      ref={(el) => {
        ref.current = el;
        if (barRef) barRef.current = el;
      }}
      className={`fresh-flow9-bar${isDark ? ' fresh-flow9-dark' : ''}${
        value.trim() ? '' : ' fresh-flow9-empty'
      }`}
      style={{
        ...box,
        background: isDark
          ? `${GLASS} padding-box, linear-gradient(${PAGE.dark}, ${PAGE.dark}) border-box`
          : 'linear-gradient(#ffffff, #ffffff) padding-box',
        boxShadow: isDark ? `0 4px 12px rgba(0,0,0,.1), ${F4_SHADOW}` : F4_SHADOW,
      }}
    >
      <input
        ref={inputRef}
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) onSubmit?.();
        }}
        style={place.input}
      />
      <span className="fresh-flow9-btn" style={place.plus}>
        <PlusIcon isDark={isDark} />
      </span>
      <span className="fresh-flow9-btn fresh-flow9-mic" style={place.mic}>
        <MicIcon isDark={isDark} />
      </span>
      <span className="fresh-flow9-send" style={place.send}>
        <SendIcon />
      </span>
      {isDark ? (
        <i className="fresh-flow9-ring" style={{ background: 'rgba(255,255,255,.03)' }} />
      ) : null}
      <i
        className="fresh-flow9-ring"
        style={{
          background: isDark ? `rgba(255,255,255,${EDGE.restA})` : `rgba(0,0,0,${EDGE.restA})`,
        }}
      />
      <i className="fresh-flow9-ring" data-ring="light" />
      <i className="fresh-flow9-ring" data-ring="hover" style={{ padding: 1.75, opacity: 0 }} />
      <i
        className="fresh-flow9-ring"
        data-ring="active"
        style={{ padding: 1.5, opacity: 0, background: EDGE.active.color[m] }}
      />
    </div>
  );
};

const UI_CSS = `
.fresh-flow9-ui { position: absolute; inset: 0; pointer-events: none; transition: opacity .3s ease; }
.fresh-flow9-ui > * { pointer-events: auto; }
.fresh-flow9-ui[data-hidden] { opacity: 0; }
`;

/**
 * The mock UI's Hide UI switch, in the viewport: everything flow 9 draws over RazorSense goes see-through so only RazorSense
 * shows. The chat input still takes the typing (it keeps focus; a click anywhere gives it back), so its typing surge still shows.
 */
const useMockUi = (): {
  isUiHidden: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onPointerDown: (e: React.PointerEvent) => void;
  toggle: ReactElement;
} => {
  const [isUiHidden, setIsUiHidden] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isUiHidden) inputRef.current?.focus();
  }, [isUiHidden]);
  const onPointerDown = (e: React.PointerEvent): void => {
    if (!isUiHidden || (e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    inputRef.current?.focus();
  };
  const toggle = (
    <Box
      position="absolute"
      bottom="spacing.5"
      left="spacing.5"
      display="flex"
      gap="spacing.4"
      alignItems="center"
      zIndex={10}
    >
      <Button size="small" variant="secondary" onClick={() => setIsUiHidden((v) => !v)}>
        {isUiHidden ? 'Show UI' : 'Hide UI'}
      </Button>
      {isUiHidden ? (
        <Text size="small" color="surface.text.gray.muted">
          Only RazorSense shows. Typing still goes to the chat input.
        </Text>
      ) : null}
    </Box>
  );
  return { isUiHidden, inputRef, onPointerDown, toggle };
};

/** flow 9's suggestion tray (its own icons, 14 x 14) */
const TRAY_ICONS = {
  Recommended:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNy4yODc1NiAyLjMzMzE5QzYuNjA5NTEgMi4zMzE0MiA1Ljk0MDYzIDIuNDg5ODQgNS4zMzU0MSAyLjc5NTU0TDUuMzMzMiAyLjc5NjY1TDUuMzMzMiAyLjc5NjY1QzMuODUxMTkgMy41MzczMyAyLjkxNDcyIDUuMDUxNjIgMi45MTQwOCA2LjcwODQxTDIuOTE0MDggNi43MDk3MUMyLjkxMjMxIDcuMzg3NzUgMy4wNzA3MyA4LjA1NjYzIDMuMzc2NDMgOC42NjE4NkMzLjQ0NjU1IDguODAwNjggMy40NTgzMyA4Ljk2MTc3IDMuNDA5MTQgOS4xMDkzMkwyLjY2OTc0IDExLjMyNzVMNC44ODc5NSAxMC41ODgxQzUuMDM0NzIgMTAuNTM5MiA1LjE5NDkxIDEwLjU1MDYgNS4zMzMyOSAxMC42MTk4QzYuMjY3NSAxMS4wODY5IDcuMDMxMDYgMTEuMTEwOSA3LjIxNjczIDExLjA4NzdDNy4yNDQxMSAxMS4wODQzIDcuMjcxNzEgMTEuMDgyOCA3LjI5OTMxIDExLjA4MzNDNy43NzMyOCAxMS4wOTE2IDguNTY5NDMgMTAuOTgxMyA5LjMzODY3IDEwLjYxNkMxMC4wOTgzIDEwLjI1NTQgMTAuODAzNSA5LjY2MTM5IDExLjE4IDguNzEwMTZDMTEuMTg2NSA4LjY5Mzc0IDExLjE5MzggOC42Nzc2MiAxMS4yMDE3IDguNjYxODZDMTEuNTA3NCA4LjA1NjYzIDExLjY2NTggNy4zODc3NSAxMS42NjQxIDYuNzA5NzFMMTEuNjY0MSA2LjcwODE5VjYuNDMzMUMxMS41MzQ1IDQuMjI0ODkgOS43NzIzOCAyLjQ2MjggNy41NjQxNyAyLjMzMzE5SDcuMjg5MDhMNy4yODc1NiAyLjMzMzE5Wk03LjI4OTgyIDEuMTY2NTJDNi40Mjg3IDEuMTY0NCA1LjU3OTI0IDEuMzY1NTUgNC44MTA1MiAxLjc1MzYxQzIuOTM0MTQgMi42OTE5MiAxLjc0ODQ2IDQuNjA5MzkgMS43NDc0MSA2LjcwNzM0QzEuNzQ1NDggNy40ODU5IDEuOTA5NzEgOC4yNTQ5MyAyLjIyODAxIDguOTYzMzhMMS4xOTQwMSAxMi4wNjU0QzEuMTI0MTQgMTIuMjc1IDEuMTc4NyAxMi41MDYxIDEuMzM0OTMgMTIuNjYyM0MxLjQ5MTE3IDEyLjgxODYgMS43MjIyNyAxMi44NzMxIDEuOTMxODggMTIuODAzM0w1LjAzNDIxIDExLjc2OTFDNi4wMjUzMSAxMi4yMTY0IDYuODkxNjMgMTIuMjkxMyA3LjMxNzA2IDEyLjI1MDJDNy45NTIwMiAxMi4yNTUyIDguOTA5MjQgMTIuMTExNCA5LjgzOTA3IDExLjY2OTlDMTAuNzkxMiAxMS4yMTc4IDExLjc0MjQgMTAuNDM4NCAxMi4yNTQ5IDkuMTY0MjdDMTIuNjM1NiA4LjQwMTUxIDEyLjgzMjggNy41NjAyNSAxMi44MzA3IDYuNzA3NTVWNi40MTY1MkMxMi44MzA3IDYuNDA1OCAxMi44MzA0IDYuMzk1MDkgMTIuODI5OSA2LjM4NDM5QzEyLjY3NDYgMy41Njk5NSAxMC40MjczIDEuMzIyNjggNy42MTI4OCAxLjE2NzQxQzcuNjAyMTggMS4xNjY4MiA3LjU5MTQ2IDEuMTY2NTIgNy41ODA3NCAxLjE2NjUySDcuMjg5ODJaIiBmaWxsPSIjMDUwNTA1Ii8+CjwvZz4KPC9zdmc+Cg==',
  Transactions:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNi45OTc0IDExLjUyMDdDOC40MjU4OSAxMS41MjA3IDkuNjY4ODYgMTEuMzEwNiAxMC42NjIyIDEwLjk1N0MxMC42ODQ4IDEwLjk1MDQgMTAuNzA2OSAxMC45NDI0IDEwLjcyODIgMTAuOTMzMkMxMC45NzI5IDEwLjg0MzUgMTEuMjAyIDEwLjc0NSAxMS40MTQ1IDEwLjYzODhDMTIuNDYxOCAxMC4xMTUxIDEzLjI2ODIgOS4zMDc5OCAxMy4yNjgyIDguMzEyMzRWNS42ODczNEMxMy4yNjgyIDQuNTk3NzggMTIuMzM1OSAzLjc5NjQ3IDExLjI2MzUgMy4zMDE1NEMxMC4xNDE2IDIuNzgzNzQgOC42MzI3MyAyLjQ3OSA2Ljk5NzQgMi40NzlDNS4zNjIwNyAyLjQ3OSAzLjg1MzE4IDIuNzgzNzQgMi43MzEyOCAzLjMwMTU0QzEuNjU4OTMgMy43OTY0NyAwLjcyNjU2MiA0LjU5Nzc4IDAuNzI2NTYyIDUuNjg3MzRWOC4zMTIzNEMwLjcyNjU2MiA5LjMwNzk4IDEuNTMzMDIgMTAuMTE1MSAyLjU4MDI3IDEwLjYzODhDMi43OTI4IDEwLjc0NSAzLjAyMTg5IDEwLjg0MzUgMy4yNjY1NiAxMC45MzMyQzMuMjg3OTQgMTAuOTQyNCAzLjMwOTk3IDEwLjk1MDQgMy4zMzI1OCAxMC45NTdDNC4zMjU5MyAxMS4zMTA2IDUuNTY4OSAxMS41MjA3IDYuOTk3NCAxMS41MjA3Wk0zLjIyMDE4IDQuMzYwODNDMi4yMzQwNSA0LjgxNTk2IDEuODkzMjMgNS4zMjcxNSAxLjg5MzIzIDUuNjg3MzRDMS44OTMyMyA2LjA0NzUzIDIuMjM0MDUgNi41NTg3MiAzLjIyMDE4IDcuMDEzODVDNC4xNTY3NSA3LjQ0NjExIDUuNDkxNjEgNy43MjkgNi45OTc0IDcuNzI5QzguNTAzMTkgNy43MjkgOS44MzgwNSA3LjQ0NjExIDEwLjc3NDYgNy4wMTM4NUMxMS43NjA3IDYuNTU4NzIgMTIuMTAxNiA2LjA0NzUzIDEyLjEwMTYgNS42ODczNEMxMi4xMDE2IDUuMzI3MTUgMTEuNzYwNyA0LjgxNTk2IDEwLjc3NDYgNC4zNjA4M0M5LjgzODA1IDMuOTI4NTYgOC41MDMxOSAzLjY0NTY3IDYuOTk3NCAzLjY0NTY3QzUuNDkxNjEgMy42NDU2NyA0LjE1Njc1IDMuOTI4NTYgMy4yMjAxOCA0LjM2MDgzWk0xMi4xMDE2IDcuNTk0NTVDMTEuODQzOSA3Ljc3NzA5IDExLjU1OSA3LjkzNjc1IDExLjI2MzUgOC4wNzMxNEMxMS4yMDM3IDguMTAwNzYgMTEuMTQyNyA4LjEyNzc3IDExLjA4MDcgOC4xNTQxNlY5LjQ5NTlDMTEuODUzOSA5LjA2MzI3IDEyLjEwMTYgOC42MDY1NiAxMi4xMDE2IDguMzEyMzRWNy41OTQ1NVpNNy41ODA3MyA4Ljg4MjY0QzguNDEzMzcgOC44NDUyNiA5LjIwMzM2IDguNzI4NDYgOS45MTQwNiA4LjU0NTExVjkuOTczODZDOS4yNjI2MyAxMC4xNjY2IDguNDc5NjkgMTAuMzAwMyA3LjU4MDczIDEwLjM0MVY4Ljg4MjY0Wk00LjA4MDczIDkuOTczODZDNC43MzIxNyAxMC4xNjY2IDUuNTE1MTEgMTAuMzAwMyA2LjQxNDA2IDEwLjM0MVY4Ljg4MjY0QzUuNTgxNDIgOC44NDUyNiA0Ljc5MTQzIDguNzI4NDYgNC4wODA3MyA4LjU0NTExVjkuOTczODZaTTIuOTE0MDYgOC4xNTQxNkMyLjg1MjA2IDguMTI3NzcgMi43OTExMiA4LjEwMDc2IDIuNzMxMjggOC4wNzMxNEMyLjQzNTc3IDcuOTM2NzUgMi4xNTA4OSA3Ljc3NzA5IDEuODkzMjMgNy41OTQ1NVY4LjMxMjM0QzEuODkzMjMgOC42MDY1NiAyLjE0MDkzIDkuMDYzMjcgMi45MTQwNiA5LjQ5NTlWOC4xNTQxNloiIGZpbGw9IiMwNTA1MDUiLz4KPC9nPgo8L3N2Zz4K',
  Settlements:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNi40MjUzNSAxLjQ3OTE5QzYuNzU1MjUgMS4xOTA1MyA3LjI0Nzg0IDEuMTkwNTMgNy41Nzc3MyAxLjQ3OTE5TDExLjQ2ODEgNC44ODMzQzEyLjA3NjIgNS40MTUzNCAxMS42OTk5IDYuNDE2OCAxMC44OTIgNi40MTY4SDMuMTExMTNDMi4zMDMxOSA2LjQxNjggMS45MjY5IDUuNDE1MzQgMi41MzQ5NCA0Ljg4MzNMNi40MjUzNSAxLjQ3OTE5Wk03LjAwMTU0IDIuNTI1MjVMMy44ODczOSA1LjI1MDE0SDEwLjExNTdMNy4wMDE1NCAyLjUyNTI1Wk00LjY2ODIxIDcuMDAwMTRDNC45OTAzOCA3LjAwMDE0IDUuMjUxNTQgNy4yNjEzIDUuMjUxNTQgNy41ODM0N1Y5LjkxNjhDNS4yNTE1NCAxMC4yMzkgNC45OTAzOCAxMC41MDAxIDQuNjY4MjEgMTAuNTAwMUM0LjM0NjA0IDEwLjUwMDEgNC4wODQ4OCAxMC4yMzkgNC4wODQ4OCA5LjkxNjhWNy41ODM0N0M0LjA4NDg4IDcuMjYxMyA0LjM0NjA0IDcuMDAwMTQgNC42NjgyMSA3LjAwMDE0Wk03LjAwMTU0IDcuMDAwMTRDNy4zMjM3MSA3LjAwMDE0IDcuNTg0ODggNy4yNjEzIDcuNTg0ODggNy41ODM0N1Y5LjkxNjhDNy41ODQ4OCAxMC4yMzkgNy4zMjM3MSAxMC41MDAxIDcuMDAxNTQgMTAuNTAwMUM2LjY3OTM4IDEwLjUwMDEgNi40MTgyMSAxMC4yMzkgNi40MTgyMSA5LjkxNjhWNy41ODM0N0M2LjQxODIxIDcuMjYxMyA2LjY3OTM4IDcuMDAwMTQgNy4wMDE1NCA3LjAwMDE0Wk05LjMzNDg4IDcuMDAwMTRDOS42NTcwNCA3LjAwMDE0IDkuOTE4MjEgNy4yNjEzIDkuOTE4MjEgNy41ODM0N1Y5LjkxNjhDOS45MTgyMSAxMC4yMzkgOS42NTcwNCAxMC41MDAxIDkuMzM0ODggMTAuNTAwMUM5LjAxMjcxIDEwLjUwMDEgOC43NTE1NCAxMC4yMzkgOC43NTE1NCA5LjkxNjhWNy41ODM0N0M4Ljc1MTU0IDcuMjYxMyA5LjAxMjcxIDcuMDAwMTQgOS4zMzQ4OCA3LjAwMDE0Wk0xMS42NjgyIDExLjY2NjhDMTEuNjY4MiAxMS45ODkgMTEuNDA3IDEyLjI1MDEgMTEuMDg0OSAxMi4yNTAxTDIuOTE4MjEgMTIuMjUwMUMyLjU5NjA0IDEyLjI1MDEgMi4zMzQ4OCAxMS45ODkgMi4zMzQ4OCAxMS42NjY4QzIuMzM0ODggMTEuMzQ0NiAyLjU5NjA0IDExLjA4MzUgMi45MTgyMSAxMS4wODM1TDExLjA4NDkgMTEuMDgzNUMxMS40MDcgMTEuMDgzNSAxMS42NjgyIDExLjM0NDYgMTEuNjY4MiAxMS42NjY4WiIgZmlsbD0iIzBBMEEwRSIvPgo8L2c+Cjwvc3ZnPgo=',
  'Growing my business':
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAuNTA5MiA4LjQwMzgxQzEwLjMxNTkgOC40MDM4MSAxMC4xNjA2IDguMjU4NTEgMTAuMTIyNyA4LjA2ODk0QzkuNzYzNzkgNi4xNzIwMSA4LjAyOTI4IDQuNzk0NDQgNi4wMDAwMSA0Ljc5NDQ0QzMuOTcwNzQgNC43OTQ0NCAyLjIzNjIzIDYuMTcyMDEgMS44NzczIDguMDY4OTRDMS44MTg3OCA4LjM3NzY2IDEuNzg5MjQgOC42OTExNiAxLjc4OTA3IDkuMDA1MzdDMS43ODc1OSA5LjY4OTAyIDEuOTI3NTUgMTAuMzY1NiAyLjIwMDE0IDEwLjk5MjVDMi4yNzgwNyAxMS4xNzU2IDIuNDA3OSAxMS4zMzE4IDIuNTczNiAxMS40NDE5QzIuNzM5MyAxMS41NTIgMi45MzM2MiAxMS42MTEyIDMuMTMyNTYgMTEuNjEyMUMzLjM4NzI3IDExLjYxMjEgMy41OTM3NiAxMS44MTg2IDMuNTkzNzYgMTIuMDczM1YxMi4zNTQxQzMuNTkzNzYgMTIuNjA4OCAzLjM4NzI3IDEyLjgxNTMgMy4xMzI1NiAxMi44MTUzQzIuNjk5MjYgMTIuODE0MiAyLjI3NTczIDEyLjY4NjQgMS45MTQxMSAxMi40NDc3QzEuNTUyNDkgMTIuMjA5IDEuMjY4NTYgMTEuODY5OCAxLjA5NzI3IDExLjQ3MThDMC43NTg2MDMgMTAuNjkzNyAwLjU4NDUxNSA5Ljg1Mzk3IDAuNTg1OTQ2IDkuMDA1MzdDMC41ODU5NSA4LjYxNzE4IDAuNjIyMjAxIDguMjI5ODMgMC42OTQyMjggNy44NDgzN0MwLjg2MDMxOSA3LjAwNTIgMS4yMzIyNiA2LjIxNjE1IDEuNzc2OTcgNS41NTE0NUMyLjMyMTY3IDQuODg2NzUgMy4wMjIyNCA0LjM2NzAxIDMuODE2MzQgNC4wMzg0N0MzLjU1NTcgMy43ODU5OSAzLjM0ODQ0IDMuNDgzNzEgMy4yMDY4NyAzLjE0OTU5QzMuMDY1MjkgMi44MTU0NiAyLjk5MjI5IDIuNDU2MyAyLjk5MjIgMi4wOTM0MkMyLjk5MjIgMS4yNTk1MSAzLjY2ODIxIDAuNTgzNDk2IDQuNTAyMTIgMC41ODM0OTZINy40OTc5QzguMzMxODEgMC41ODM0OTYgOS4wMDc4MiAxLjI1OTUxIDkuMDA3ODIgMi4wOTM0MkM5LjAwNzQ2IDIuNDU1OTYgOC45MzQzMyAyLjgxNDc0IDguNzkyNzYgMy4xNDg1QzguNjUxMiAzLjQ4MjI2IDguNDQ0MDggMy43ODQyMiA4LjE4MzY4IDQuMDM2NDdDOC45Nzc3OCA0LjM2NTAxIDkuNjc4MzUgNC44ODQ3NSAxMC4yMjMxIDUuNTQ5NDVDMTAuNzY3OCA2LjIxNDE1IDExLjEzOTcgNy4wMDMxOSAxMS4zMDU4IDcuODQ2MzZDMTEuMzYwNiA4LjE0MzI0IDExLjEyMjggOC40MDM4MSAxMC44MjA5IDguNDAzODFIMTAuNTA5MlpNNC45MDUxMSAzLjM2ODY4QzUuMTQxODYgMy41MTUwNSA1LjQxNDg3IDMuNTkyMTcgNS42OTMyMSAzLjU5MTMxSDYuMzA2ODFDNi43MDQwNyAzLjU5MTMxIDcuMDg1MDcgMy40MzM1IDcuMzY1OTggMy4xNTI1OUM3LjY0Njg4IDIuODcxNjggNy44MDQ3IDIuNDkwNjggNy44MDQ3IDIuMDkzNDJDNy44MDQ3IDEuOTIzOTggNy42NjczNCAxLjc4NjYyIDcuNDk3OSAxLjc4NjYySDQuNTAyMTJDNC4zMzI2OCAxLjc4NjYyIDQuMTk1MzIgMS45MjM5OCA0LjE5NTMyIDIuMDkzNDJDNC4xOTU3MiAyLjMyNTkgNC4yNDk5NCAyLjU1NTEzIDQuMzUzNzMgMi43NjMxNkM0LjQ3NzM2IDMuMDEyNTQgNC42NjgzNyAzLjIyMjMgNC45MDUxMSAzLjM2ODY4WiIgZmlsbD0iIzA1MDUwNSIvPgo8cGF0aCBkPSJNNS41OTg5NSAxMi4yMTM3SDcuODA0NjhDOC4xMzY5MSAxMi4yMTM3IDguNDA2MjQgMTIuNDgzIDguNDA2MjQgMTIuODE1M0M4LjQwNjI0IDEzLjE0NzUgOC4xMzY5MSAxMy40MTY4IDcuODA0NjggMTMuNDE2OEg1LjU5ODk1QzUuMjY2NzIgMTMuNDE2OCA0Ljk5NzM5IDEzLjE0NzUgNC45OTczOSAxMi44MTUzQzQuOTk3MzkgMTIuNDgzIDUuMjY2NzIgMTIuMjEzNyA1LjU5ODk1IDEyLjIxMzdaIiBmaWxsPSIjMDUwNTA1Ii8+CjxwYXRoIGQ9Ik03LjgwNDY4IDkuODA3NDZINS41OTg5NUM1LjI2NjcyIDkuODA3NDYgNC45OTczOSAxMC4wNzY4IDQuOTk3MzkgMTAuNDA5QzQuOTk3MzkgMTAuNzQxMyA1LjI2NjcyIDExLjAxMDYgNS41OTg5NSAxMS4wMTA2SDcuODA0NjhDOC4xMzY5MSAxMS4wMTA2IDguNDA2MjQgMTAuNzQxMyA4LjQwNjI0IDEwLjQwOUM4LjQwNjI0IDEwLjA3NjggOC4xMzY5MSA5LjgwNzQ2IDcuODA0NjggOS44MDc0NloiIGZpbGw9IiMwNTA1MDUiLz4KPHBhdGggZD0iTTUuNTk4OTUgNy40MDEyMUg3LjgwNDY4QzguMTM2OTEgNy40MDEyMSA4LjQwNjI0IDcuNjcwNTQgOC40MDYyNCA4LjAwMjc4QzguNDA2MjQgOC4zMzUwMSA4LjEzNjkxIDguNjA0MzQgNy44MDQ2OCA4LjYwNDM0SDUuNTk4OTVDNS4yNjY3MiA4LjYwNDM0IDQuOTk3MzkgOC4zMzUwMSA0Ljk5NzM5IDguMDAyNzhDNC45OTczOSA3LjY3MDU0IDUuMjY2NzIgNy40MDEyMSA1LjU5ODk1IDcuNDAxMjFaIiBmaWxsPSIjMDUwNTA1Ii8+CjxwYXRoIGQ9Ik0xMi40MTY2IDEyLjIxMzdIMTAuMjEwOUM5Ljg3ODY5IDEyLjIxMzcgOS42MDkzNiAxMi40ODMgOS42MDkzNiAxMi44MTUzQzkuNjA5MzYgMTMuMTQ3NSA5Ljg3ODY5IDEzLjQxNjggMTAuMjEwOSAxMy40MTY4SDEyLjQxNjZDMTIuNzQ4OSAxMy40MTY4IDEzLjAxODIgMTMuMTQ3NSAxMy4wMTgyIDEyLjgxNTNDMTMuMDE4MiAxMi40ODMgMTIuNzQ4OSAxMi4yMTM3IDEyLjQxNjYgMTIuMjEzN1oiIGZpbGw9IiMwNTA1MDUiLz4KPHBhdGggZD0iTTEwLjIxMDkgOS44MDc0NkgxMi40MTY2QzEyLjc0ODkgOS44MDc0NiAxMy4wMTgyIDEwLjA3NjggMTMuMDE4MiAxMC40MDlDMTMuMDE4MiAxMC43NDEzIDEyLjc0ODkgMTEuMDEwNiAxMi40MTY2IDExLjAxMDZIMTAuMjEwOUM5Ljg3ODY5IDExLjAxMDYgOS42MDkzNiAxMC43NDEzIDkuNjA5MzYgMTAuNDA5QzkuNjA5MzYgMTAuMDc2OCA5Ljg3ODY5IDkuODA3NDYgMTAuMjEwOSA5LjgwNzQ2WiIgZmlsbD0iIzA1MDUwNSIvPgo8L2c+Cjwvc3ZnPgo=',
  Account:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNyAxLjE2NjVDNS4zODkxNyAxLjE2NjUgNC4wODMzMyAyLjQ3MjM0IDQuMDgzMzMgNC4wODMxN0M0LjA4MzMzIDUuNjk0IDUuMzg5MTcgNi45OTk4NCA3IDYuOTk5ODRDOC42MTA4MyA2Ljk5OTg0IDkuOTE2NjcgNS42OTQgOS45MTY2NyA0LjA4MzE3QzkuOTE2NjcgMi40NzIzNCA4LjYxMDgzIDEuMTY2NSA3IDEuMTY2NVpNNS4yNSA0LjA4MzE3QzUuMjUgMy4xMTY2NyA2LjAzMzUgMi4zMzMxNyA3IDIuMzMzMTdDNy45NjY1IDIuMzMzMTcgOC43NSAzLjExNjY3IDguNzUgNC4wODMxN0M4Ljc1IDUuMDQ5NjcgNy45NjY1IDUuODMzMTcgNyA1LjgzMzE3QzYuMDMzNSA1LjgzMzE3IDUuMjUgNS4wNDk2NyA1LjI1IDQuMDgzMTdaIiBmaWxsPSIjMDUwNTA1Ii8+CjxwYXRoIGQ9Ik00LjY2NjY3IDguMTY2NUMzLjA1NTg0IDguMTY2NSAxLjc1IDkuNDcyMzQgMS43NSAxMS4wODMyVjEyLjI0OThDMS43NSAxMi41NzIgMi4wMTExNyAxMi44MzMyIDIuMzMzMzMgMTIuODMzMkMyLjY1NTUgMTIuODMzMiAyLjkxNjY3IDEyLjU3MiAyLjkxNjY3IDEyLjI0OThWMTEuMDgzMkMyLjkxNjY3IDEwLjExNjcgMy43MDAxNyA5LjMzMzE3IDQuNjY2NjcgOS4zMzMxN0g5LjMzMzMzQzEwLjI5OTggOS4zMzMxNyAxMS4wODMzIDEwLjExNjcgMTEuMDgzMyAxMS4wODMyVjEyLjI0OThDMTEuMDgzMyAxMi41NzIgMTEuMzQ0NSAxMi44MzMyIDExLjY2NjcgMTIuODMzMkMxMS45ODg4IDEyLjgzMzIgMTIuMjUgMTIuNTcyIDEyLjI1IDEyLjI0OThWMTEuMDgzMkMxMi4yNSA5LjQ3MjM0IDEwLjk0NDIgOC4xNjY1IDkuMzMzMzMgOC4xNjY1SDQuNjY2NjdaIiBmaWxsPSIjMDUwNTA1Ii8+CjwvZz4KPC9zdmc+Cg==',
  close:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgb3BhY2l0eT0iMC43Ij4KPHBhdGggZD0iTTEwLjkwOTkgMy45MTIzMkMxMS4xMzc3IDMuNjg0NTEgMTEuMTM3NyAzLjMxNTE2IDEwLjkwOTkgMy4wODczNkMxMC42ODIxIDIuODU5NTUgMTAuMzEyNyAyLjg1OTU1IDEwLjA4NDkgMy4wODczNkw2Ljk5NzQgNi4xNzQ4OEwzLjkwOTg3IDMuMDg3MzZDMy42ODIwNyAyLjg1OTU1IDMuMzEyNzIgMi44NTk1NSAzLjA4NDkyIDMuMDg3MzZDMi44NTcxMSAzLjMxNTE2IDIuODU3MTEgMy42ODQ1MSAzLjA4NDkyIDMuOTEyMzJMNi4xNzI0NCA2Ljk5OTg0TDMuMDg0OTIgMTAuMDg3NEMyLjg1NzExIDEwLjMxNTIgMi44NTcxMSAxMC42ODQ1IDMuMDg0OTIgMTAuOTEyM0MzLjMxMjcyIDExLjE0MDEgMy42ODIwNyAxMS4xNDAxIDMuOTA5ODcgMTAuOTEyM0w2Ljk5NzQgNy44MjQ4TDEwLjA4NDkgMTAuOTEyM0MxMC4zMTI3IDExLjE0MDEgMTAuNjgyMSAxMS4xNDAxIDEwLjkwOTkgMTAuOTEyM0MxMS4xMzc3IDEwLjY4NDUgMTEuMTM3NyAxMC4zMTUyIDEwLjkwOTkgMTAuMDg3NEw3LjgyMjM1IDYuOTk5ODRMMTAuOTA5OSAzLjkxMjMyWiIgZmlsbD0iIzA1MDUwNSIvPgo8L2c+Cjwvc3ZnPgo=',
};
const TRAY_TABS = ['Recommended', 'Transactions', 'Settlements', 'Growing my business', 'Account'];
const TRAY_PROMPTS = [
  'When will my recent settlements reach my account?',
  'Show me the deductions from the last settlement',
  'Am I eligible to get my money today?',
];

/**
 * Flow 9's suggestion tray under the landing's box (tucked 20 px under it): light, #fafafa; dark, the box's glass with a faint blue
 * on the page, the effect hidden under it as under the box. Settlements selected, as flow 9 opens.
 */
const Flow9Tray = ({
  isDark,
  left,
  top,
  width,
}: {
  isDark: boolean;
  left: number;
  top: number;
  width: number;
}): ReactElement => {
  const icon = (src: string, isOn: boolean): ReactElement => (
    <img
      src={src}
      alt=""
      width={14}
      height={14}
      style={{
        display: 'block',
        opacity: isOn ? 1 : isDark ? 0.2 : 0.4,
        filter: isDark ? 'invert(1)' : undefined,
      }}
    />
  );
  return (
    <section
      aria-label="Suggestions"
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height: 200.5,
        boxSizing: 'border-box',
        padding: '32px 8px 7.5px',
        borderRadius: '0 0 20px 20px',
        border: `1px solid ${isDark ? 'rgba(229,229,229,.04)' : 'transparent'}`,
        borderTop: 0,
        background: isDark
          ? `linear-gradient(56deg, rgba(21,102,241,.0039) 0%, rgba(21,102,241,.015) 100%), ${GLASS}, ${PAGE.dark}`
          : '#fafafa',
        font: `500 12px/16px ${FONT}`,
        WebkitFontSmoothing: 'antialiased',
        color: isDark ? '#ffffff' : '#050505',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 10,
          height: 38,
          padding: '6px 0 6px 6px',
          marginRight: 40,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {TRAY_TABS.map((tab) => (
          <span
            key={tab}
            style={{
              display: 'inline-flex',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              alignItems: 'center',
              gap: 6,
              height: 26,
              padding: '4px 8px',
              boxSizing: 'border-box',
              borderRadius: 8,
              border: `1px solid ${isDark ? 'rgba(255,255,255,.04)' : 'rgba(5,5,5,.08)'}`,
              background:
                tab === 'Settlements'
                  ? isDark
                    ? 'rgba(255,255,255,.08)'
                    : 'rgba(1,1,1,.06)'
                  : undefined,
            }}
          >
            {icon(TRAY_ICONS[tab], tab === 'Settlements')}
            {tab}
          </span>
        ))}
      </div>
      <span
        style={{
          position: 'absolute',
          right: 15,
          top: 39,
          width: 24,
          height: 24,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 6,
        }}
      >
        {icon(TRAY_ICONS.close, false)}
      </span>
      <div style={{ paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {TRAY_PROMPTS.map((prompt) => (
          <span
            key={prompt}
            style={{
              height: 34,
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 8,
              color: isDark ? 'rgba(255,255,255,.75)' : 'rgba(5,5,5,.75)',
              textShadow: isDark ? undefined : '0 1px 3px rgba(5,5,5,.04)',
            }}
          >
            {prompt}
          </span>
        ))}
      </div>
    </section>
  );
};

/** flow 9's landing box: 840 x 97, centred across the window, its top 192.75 px above the window's middle */
const FIELD = { w: 840, h: 97, top: -192.75 };
/** the tray tucked 20 px under the box, as flow 9 has it */
const TRAY_TUCK = 20;

const Flow9Landing = ({
  isDark,
  value,
  onChange,
  inputWidth = FIELD.w,
  inputHeight = FIELD.h,
  children,
}: {
  isDark: boolean;
  value: string;
  onChange: (value: string) => void;
  /** the chat input's size (flow 9's 840 x 97 by default) */
  inputWidth?: number;
  inputHeight?: number;
  /** the RazorSense behind the chat input: laid on the chat input's box */
  children: React.ReactNode;
}): ReactElement => {
  const ref = React.useRef<HTMLDivElement>(null);
  const win = useFlow9Window(ref);
  const ui = useMockUi();
  const field = {
    left: win.width / 2 - inputWidth / 2,
    top: win.height / 2 + FIELD.top,
    width: inputWidth,
    height: inputHeight,
  };
  return (
    <div
      ref={ref}
      onPointerDown={ui.onPointerDown}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: isDark ? PAGE.dark : PAGE.light,
      }}
    >
      <style>{BAR_CSS + UI_CSS}</style>
      <Flow9Stage win={win}>
        <div style={{ position: 'absolute', ...field }}>{children}</div>
        <div className="fresh-flow9-ui" data-hidden={ui.isUiHidden || undefined}>
          <Flow9Tray
            isDark={isDark}
            left={field.left}
            top={field.top + field.height - TRAY_TUCK}
            width={field.width}
          />
          <Flow9Bar
            isDark={isDark}
            layout={field.height < 90 ? 'chat' : 'landing'}
            box={field}
            label="Message Ray"
            placeholder="Ask Ray about orders, failures or reports"
            value={value}
            onChange={onChange}
            inputRef={ui.inputRef}
          />
        </div>
      </Flow9Stage>
      {ui.toggle}
    </div>
  );
};

const CHAT_CSS = `
@keyframes fresh-flow9-shimmer { 0% { background-position: 100% 0; } 18%, 100% { background-position: 0% 0; } }
.fresh-flow9-think { position: absolute; white-space: nowrap; font-size: 16px; line-height: 22px; letter-spacing: -.208px; color: transparent;
  background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; animation: fresh-flow9-shimmer 1.6s linear infinite;
  transition: opacity .3s; }
.fresh-flow9-ans { position: absolute; opacity: 0; transform: translateY(6px); transition: opacity .6s ease, transform .6s cubic-bezier(.2,.7,.2,1); }
.fresh-flow9-ans p { margin: 0 0 10px; }
.fresh-flow9-answered .fresh-flow9-ans { opacity: 1; transform: none; } .fresh-flow9-answered .fresh-flow9-think { opacity: 0; }
`;

/** flow 9's chat (px from the window's middle across; down from its top, or up from its bottom where noted) */
const CHAT = {
  /** the question bubble: its right edge, top */
  question: { right: 376, top: 96 },
  /** the thinking row: its slot (where flow 9's Ray sits; the thinking RazorSense is anchored on it), and the label after it */
  slot: { left: -376, top: 157 },
  label: { left: -316, top: 168.95 },
  /** the chat bar, 840 x 60, 111 px above the bottom; the disclaimer 39 px above it */
  bar: { w: 840, h: 60, bottom: 111 },
  disclaimer: { bottom: 39 },
};

/**
 * Flow 9's chat: the chat panel (inset 6 / 48 / 6 / 6 in the black frame, radius 10), the question bubble at the top right, the
 * thinking row under it (its answer in the same place), the chat bar near the bottom and the disclaimer under it.
 */
const Flow9Chat = ({
  isDark,
  isAnswered,
  question,
  value,
  onChange,
  onSubmit,
  chatInputRef,
  thinkingRef,
  children,
}: {
  isDark: boolean;
  isAnswered: boolean;
  question: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  /** set to the chat bar and to the thinking row's slot (where flow 9's Ray sits), for a component that follows them */
  chatInputRef?: React.MutableRefObject<HTMLDivElement | null>;
  thinkingRef?: React.MutableRefObject<HTMLDivElement | null>;
  /** the RazorSense over the chat panel: fills the panel */
  children: React.ReactNode;
}): ReactElement => {
  const ref = React.useRef<HTMLDivElement>(null);
  const win = useFlow9Window(ref);
  const ui = useMockUi();
  const mid = win.width / 2;
  const height = win.height;
  return (
    <div
      ref={ref}
      onPointerDown={ui.onPointerDown}
      className={isAnswered ? 'fresh-flow9-answered' : undefined}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#000000',
        font: `400 14px/20px ${FONT}`,
        WebkitFontSmoothing: 'antialiased',
        color: isDark ? '#ffffff' : '#050505',
      }}
    >
      <style>{CHAT_CSS + BAR_CSS + UI_CSS}</style>
      <Flow9Stage win={win}>
        <div
          style={{
            position: 'absolute',
            left: 6,
            top: 48,
            right: 6,
            bottom: 6,
            borderRadius: 10,
            background: isDark ? PAGE.dark : '#f7f7f7',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 6,
            top: 48,
            right: 6,
            bottom: 6,
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
        <div className="fresh-flow9-ui" data-hidden={ui.isUiHidden || undefined}>
          <div
            style={{
              position: 'absolute',
              right: mid - CHAT.question.right,
              top: CHAT.question.top,
              maxWidth: 560,
              boxSizing: 'border-box',
              padding: 12,
              borderRadius: 16,
              background: isDark ? '#262628' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : 'rgba(67,75,81,.12)'}`,
              boxShadow: `0 .5px 4px ${isDark ? 'rgba(0,0,0,.3)' : 'rgba(67,75,81,.06)'}`,
            }}
          >
            {question}
          </div>
          <div
            ref={thinkingRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: mid + CHAT.slot.left,
              top: CHAT.slot.top,
              width: 48,
              height: 39.89,
            }}
          />
          <div
            className="fresh-flow9-think"
            style={{
              left: mid + CHAT.label.left,
              top: CHAT.label.top,
              backgroundImage: isDark
                ? 'linear-gradient(90deg, #4f6ff0 38%, #dce3ff 50%, #4f6ff0 62%)'
                : 'linear-gradient(90deg, #2d52e6 38%, #c9d4fb 50%, #2d52e6 62%)',
            }}
          >
            Searching your settlements…
          </div>
          <div
            className="fresh-flow9-ans"
            style={{
              left: mid + CHAT.slot.left,
              top: CHAT.slot.top,
              width: CHAT.question.right - CHAT.slot.left,
              color: isDark ? 'rgba(255,255,255,.85)' : 'rgba(5,5,5,.85)',
            }}
          >
            <p>
              Your payments are up 12% on last week: ₹4.2L collected across 1,284 transactions, with
              a 98.6% success rate.
            </p>
            <p>Settlements are on schedule; the next one, ₹1.1L, lands tomorrow morning.</p>
          </div>
          <Flow9Bar
            isDark={isDark}
            layout="chat"
            box={{
              left: mid - CHAT.bar.w / 2,
              top: height - CHAT.bar.bottom,
              width: CHAT.bar.w,
              height: CHAT.bar.h,
            }}
            label="Ask Ray"
            placeholder="Ask anything…"
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            inputRef={ui.inputRef}
            barRef={chatInputRef}
          />
          <div
            style={{
              position: 'absolute',
              left: mid - CHAT.bar.w / 2,
              width: CHAT.bar.w,
              top: height - CHAT.disclaimer.bottom,
              textAlign: 'center',
              font: `400 12px/17px ${FONT}`,
              color: isDark ? 'rgba(255,255,255,.45)' : '#616d75',
            }}
          >
            Ray is AI and can make mistakes. Please check important information
          </div>
        </div>
      </Flow9Stage>
      {ui.toggle}
    </div>
  );
};

export { Flow9Landing, Flow9Chat, useFlow9Window };
