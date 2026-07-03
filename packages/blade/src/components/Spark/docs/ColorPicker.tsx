/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/**
 * Inline color picker — expands in-place below each gradient stop row.
 *
 * Why inline instead of floating?
 * ─────────────────────────────────────────────────────────────────────────────
 * Storybook renders the story in an iframe. Any floating/portal picker needs
 * a reliable "click outside to close" mechanism. In practice, all such
 * mechanisms (document mousedown, window pointerdown, backdrop div, etc.)
 * fail here because:
 *
 *   1. Tweakpane registers blur-triggered close callbacks on its own elements.
 *      When focus shifts to our picker, Tweakpane fires its blur handlers and
 *      can cascade events that land on our click-outside listener.
 *
 *   2. React 18 concurrent-mode schedules synthetic event handlers
 *      asynchronously in some paths, so the window pointerdown listener for
 *      click-outside can fire before our onPointerDown sets isDragging=true,
 *      causing the picker to close on the very click that starts the drag.
 *
 *   3. position:fixed inside an overflow:auto+position:fixed ancestor creates
 *      an ambiguous stacking context across different Chromium/iframe builds.
 *
 * The inline approach removes all of these issues:
 *   - No outside-click handler → no false dismissals.
 *   - No portal → no stacking-context ambiguity.
 *   - setPointerCapture within the same document → reliable drag.
 *   - e.stopPropagation() within a contained subtree → no Tweakpane bleed.
 *
 * Interaction model
 * ─────────────────────────────────────────────────────────────────────────────
 *   • Click the swatch → picker expands (AnimatePresence height:0→auto).
 *   • Click swatch again → picker collapses.
 *   • Esc key → picker collapses.
 *   • Only one picker is open at a time (GradientEditor manages openIdx).
 *   • Sat/Bri and Hue drags use setPointerCapture on the element itself —
 *     cursor can leave the element and the drag continues correctly.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

// ── Colour utilities ───────────────────────────────────────────────────────────

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}

export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d > 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return [h, max === 0 ? 0 : d / max, max];
}

export const hexToRgb = (hex: string): [number, number, number] | null => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
};

export const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('')}`;

// ── NumInput ──────────────────────────────────────────────────────────────────

function NumInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [local, setLocal] = useState(String(value));
  // Sync display when value changes externally (e.g. hue slider moves).
  useEffect(() => setLocal(String(value)), [value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
      <input
        type="text"
        inputMode="numeric"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n) && n >= 0 && n <= 255) onChange(n);
        }}
        onBlur={() => setLocal(String(value))}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            onChange(clamp(value + 1, 0, 255));
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            onChange(clamp(value - 1, 0, 255));
          }
        }}
        // Stop propagation so Tweakpane's mousedown→focus handler never runs.
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
          background: '#0a0a18',
          color: '#c8ccd8',
          border: '1px solid #1e1e32',
          borderRadius: '6px',
          padding: '5px 4px',
          fontSize: '13px',
          fontFamily: 'ui-monospace,"Cascadia Code",Menlo,monospace',
          outline: 'none',
        }}
      />
      <span
        style={{
          textAlign: 'center',
          color: '#3a3a52',
          fontSize: '10px',
          letterSpacing: '0.06em',
          userSelect: 'none',
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── InlineColorPicker ─────────────────────────────────────────────────────────

export type InlineColorPickerProps = {
  /** Current hex colour, e.g. "#31385e" */
  value: string;
  /** Called on every colour change (live, not just on release). */
  onChange: (hex: string) => void;
  /** Called when the user presses Escape. GradientEditor uses this to close. */
  onRequestClose: () => void;
};

export function InlineColorPicker({
  value,
  onChange,
  onRequestClose,
}: InlineColorPickerProps): React.ReactElement {
  // ── Internal HSV ────────────────────────────────────────────────────────────
  const parseColor = (hex: string): [number, number, number] => {
    const rgb = hexToRgb(hex);
    return rgb ? rgbToHsv(...rgb) : [0, 1, 1];
  };

  const [hsv, setHsv] = useState<[number, number, number]>(() => parseColor(value));
  const [hexLocal, setHexLocal] = useState(value);

  // Preserved hue so that dragging to pure black/white doesn't reset the hue
  // ring back to 0 when the user pulls back to colour.
  const hueStore = useRef(hsv[0]);

  // Sync from parent (e.g. HexColorInput in the row was edited directly).
  const prevValue = useRef(value);
  useEffect(() => {
    if (prevValue.current === value) return;
    prevValue.current = value;
    const parsed = parseColor(value);
    if (parsed[1] > 0.01) hueStore.current = parsed[0];
    setHsv(parsed);
    setHexLocal(value);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const [h, s, v] = hsv;
  const [r, g, b] = hsvToRgb(h, s, v);

  const commit = useCallback(
    (newHsv: [number, number, number]) => {
      const hex = rgbToHex(...hsvToRgb(...newHsv));
      setHexLocal(hex);
      onChange(hex);
    },
    [onChange],
  );

  const updateHsv = useCallback(
    (newHsv: [number, number, number]) => {
      if (newHsv[1] > 0.01) hueStore.current = newHsv[0];
      setHsv(newHsv);
      commit(newHsv);
    },
    [commit],
  );

  // ── Sat/Bri canvas ──────────────────────────────────────────────────────────

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Redraw the gradient whenever hue changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas;

    // Fill with the pure hue colour.
    const [cr, cg, cb] = hsvToRgb(h, 1, 1);
    ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
    ctx.fillRect(0, 0, width, height);

    // Saturation: white → transparent (left → right).
    const gSat = ctx.createLinearGradient(0, 0, width, 0);
    gSat.addColorStop(0, 'rgba(255,255,255,1)');
    gSat.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gSat;
    ctx.fillRect(0, 0, width, height);

    // Brightness: transparent → black (top → bottom).
    const gBri = ctx.createLinearGradient(0, 0, 0, height);
    gBri.addColorStop(0, 'rgba(0,0,0,0)');
    gBri.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gBri;
    ctx.fillRect(0, 0, width, height);
  }, [h]);

  // Pick sat/bri from a pointer position relative to the canvas element.
  // Accepts the canvas element directly to avoid stale ref issues during drag.
  const pickSatBri = useCallback(
    (clientX: number, clientY: number, el: HTMLCanvasElement) => {
      const rect = el.getBoundingClientRect();
      updateHsv([
        hueStore.current,
        clamp((clientX - rect.left) / rect.width, 0, 1),
        clamp(1 - (clientY - rect.top) / rect.height, 0, 1),
      ]);
    },
    [updateHsv],
  );

  // ── Hue slider ──────────────────────────────────────────────────────────────

  const hueTrackRef = useRef<HTMLDivElement>(null);

  const pickHue = useCallback(
    (clientX: number, el: HTMLDivElement) => {
      const rect = el.getBoundingClientRect();
      const nh = clamp((clientX - rect.left) / rect.width, 0, 1) * 360;
      hueStore.current = nh;
      updateHsv([nh, s, v]);
    },
    [s, v, updateHsv],
  );

  // ── Keyboard handler ────────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onRequestClose();
      }
    },
    [onRequestClose],
  );

  // ── Derived display values ──────────────────────────────────────────────────

  const cursorBorder = v > 0.6 && s < 0.35 ? '#555' : '#fff';
  const previewHex = rgbToHex(r, g, b);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      // Intercept ALL pointer and keyboard events so nothing escapes to
      // Tweakpane or the parent scroll container.
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
      // Make the container focusable so keyboard events land here.
      tabIndex={-1}
      style={{
        padding: '10px 10px 12px',
        background: '#0e0e1c',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '9px',
        outline: 'none',
        // Rounded only at the bottom — top edge is shared with the stop row.
        borderRadius: '0 0 8px 8px',
      }}
    >
      {/* ── Saturation / Brightness 2-D canvas ── */}
      <div
        style={{
          position: 'relative',
          borderRadius: '6px',
          // overflow:hidden clips the canvas to the rounded corners cleanly.
          overflow: 'hidden',
          cursor: 'crosshair',
          // Subtle outline so the canvas area is visually delimited.
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        <canvas
          ref={canvasRef}
          // 2× intrinsic resolution for sharp rendering on Retina displays.
          width={640}
          height={300}
          style={{ display: 'block', width: '100%', height: '150px' }}
          onPointerDown={(e) => {
            // setPointerCapture keeps pointermove firing on this element even
            // when the cursor leaves its bounds.
            e.currentTarget.setPointerCapture(e.pointerId);
            pickSatBri(e.clientX, e.clientY, e.currentTarget);
          }}
          onPointerMove={(e) => {
            // e.buttons is the reliable cross-browser guard for "button held".
            // hasPointerCapture can return false inside Storybook's iframe even
            // when capture is active, causing drag to silently no-op.
            if (e.buttons === 0) return;
            pickSatBri(e.clientX, e.clientY, e.currentTarget);
          }}
        />

        {/* Crosshair cursor overlay */}
        <div
          style={{
            position: 'absolute',
            left: `${s * 100}%`,
            top: `${(1 - v) * 100}%`,
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            border: `2px solid ${cursorBorder}`,
            // Inner shadow creates contrast against both bright and dark areas.
            boxShadow: '0 0 0 1px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.2)',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
            willChange: 'left, top',
          }}
        />
      </div>

      {/* ── Preview dot + Hue strip ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Live colour preview */}
        <div
          style={{
            width: '26px',
            height: '26px',
            flexShrink: 0,
            borderRadius: '50%',
            background: previewHex,
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        />

        {/* Hue rainbow strip */}
        <div
          ref={hueTrackRef}
          style={{
            flex: 1,
            height: '12px',
            borderRadius: '6px',
            cursor: 'pointer',
            position: 'relative',
            userSelect: 'none',
            // HSL stops cover the full hue wheel.
            background:
              'linear-gradient(to right,' +
              'hsl(0,100%,50%),' +
              'hsl(60,100%,50%),' +
              'hsl(120,100%,50%),' +
              'hsl(180,100%,50%),' +
              'hsl(240,100%,50%),' +
              'hsl(300,100%,50%),' +
              'hsl(360,100%,50%))',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            pickHue(e.clientX, e.currentTarget);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 0) return;
            pickHue(e.clientX, e.currentTarget);
          }}
        >
          {/* Thumb */}
          <div
            style={{
              position: 'absolute',
              left: `${(h / 360) * 100}%`,
              top: '50%',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: `hsl(${h},100%,50%)`,
              border: '2.5px solid #fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
              willChange: 'left',
            }}
          />
        </div>
      </div>

      {/* ── Hex text input ── */}
      <input
        type="text"
        value={hexLocal}
        spellCheck={false}
        onChange={(e) => {
          const val = e.target.value;
          setHexLocal(val);
          const hex = val.startsWith('#') ? val : `#${val}`;
          if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
            const rgb = hexToRgb(hex);
            if (rgb) {
              const parsed = rgbToHsv(...rgb);
              if (parsed[1] > 0.01) hueStore.current = parsed[0];
              setHsv(parsed);
              onChange(hex);
            }
          }
        }}
        onBlur={() => setHexLocal(rgbToHex(r, g, b))}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: '#0a0a18',
          color: '#c8ccd8',
          border: '1px solid #1e1e32',
          borderRadius: '6px',
          padding: '6px 8px',
          fontSize: '12px',
          fontFamily: 'ui-monospace,"Cascadia Code",Menlo,monospace',
          letterSpacing: '0.05em',
          outline: 'none',
        }}
      />

      {/* ── R G B numeric inputs ── */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <NumInput
          label="R"
          value={r}
          onChange={(rv) => {
            const parsed = rgbToHsv(rv, g, b);
            updateHsv([parsed[1] > 0.01 ? parsed[0] : hueStore.current, parsed[1], parsed[2]]);
          }}
        />
        <NumInput
          label="G"
          value={g}
          onChange={(gv) => {
            const parsed = rgbToHsv(r, gv, b);
            updateHsv([parsed[1] > 0.01 ? parsed[0] : hueStore.current, parsed[1], parsed[2]]);
          }}
        />
        <NumInput
          label="B"
          value={b}
          onChange={(bv) => {
            const parsed = rgbToHsv(r, g, bv);
            updateHsv([parsed[1] > 0.01 ? parsed[0] : hueStore.current, parsed[1], parsed[2]]);
          }}
        />
      </div>
    </div>
  );
}
