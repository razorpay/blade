/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  generateGradientCanvas,
  renderGradientPreview,
  DEFAULT_GRADIENT_STOPS,
} from './gradientUtils';
import type { GradientStop } from './gradientUtils';

type GradientEditorProps = {
  onChange: (canvas: HTMLCanvasElement) => void;
};

// ── Saved presets (localStorage) ─────────────────────────────────────────────

const LS_KEY = 'rzp-glass-gradient-presets';

type SavedPreset = {
  id: string;
  label: string;
  stops: GradientStop[];
};

function loadSavedPresets(): SavedPreset[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SavedPreset[]) : [];
  } catch {
    return [];
  }
}

function persistSavedPresets(presets: SavedPreset[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(presets));
}

function useSavedPresets() {
  const [saved, setSaved] = useState<SavedPreset[]>(loadSavedPresets);

  const save = useCallback((label: string, stops: GradientStop[]) => {
    const next: SavedPreset = {
      id: `${Date.now()}`,
      label,
      stops,
    };
    setSaved((prev) => {
      const updated = [...prev, next];
      persistSavedPresets(updated);
      return updated;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSaved((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      persistSavedPresets(updated);
      return updated;
    });
  }, []);

  return {
    saved,
    save,
    remove,
  };
}

// ── Built-in presets ──────────────────────────────────────────────────────────

type PresetState = 'default' | 'success' | 'error' | 'warning' | 'info';

const PRESET_DOT_COLORS: Record<PresetState, string> = {
  default: '#a855f7',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const BUILT_IN_PRESETS: { label: string; state: PresetState; stops: GradientStop[] }[] = [
  {
    label: 'Default',
    state: 'default',
    stops: [
      { color: '#8a8fa8', position: 0 },
      { color: '#1535cc', position: 0.2 },
      { color: '#2255ff', position: 0.35 },
      { color: '#55bbff', position: 0.5 },
      { color: '#88ffcc', position: 0.63 },
      { color: '#ddfff4', position: 0.7 },
      { color: '#ffffff', position: 0.75 },
    ],
  },
  {
    label: 'Success',
    state: 'success',
    stops: [
      { color: '#001a08', position: 0 },
      { color: '#003d1a', position: 0.2 },
      { color: '#007a33', position: 0.4 },
      { color: '#00c252', position: 0.6 },
      { color: '#aaffdd', position: 0.65 },
      { color: '#ffffff', position: 0.75 },
    ],
  },
  {
    label: 'Error',
    state: 'error',
    stops: [
      { color: '#1a0000', position: 0 },
      { color: '#4d0000', position: 0.2 },
      { color: '#cc0000', position: 0.42 },
      { color: '#ff3333', position: 0.6 },
      { color: '#ffbbbb', position: 0.65 },
      { color: '#ffffff', position: 0.75 },
    ],
  },
  {
    label: 'Warning',
    state: 'warning',
    stops: [
      { color: '#1a0e00', position: 0 },
      { color: '#4d2800', position: 0.2 },
      { color: '#cc7700', position: 0.42 },
      { color: '#ffaa00', position: 0.6 },
      { color: '#ffdd99', position: 0.65 },
      { color: '#ffffff', position: 0.75 },
    ],
  },
  {
    label: 'Razorpay Green',
    state: 'success',
    stops: [
      { color: '#01C171', position: 0 },
      { color: '#4FE19E', position: 0.1 },
      { color: '#4EF8E8', position: 0.3 },
      { color: '#AEF4D4', position: 0.5 },
    ],
  },
  {
    label: 'Info',
    state: 'info',
    stops: [
      { color: '#00091a', position: 0 },
      { color: '#001f4d', position: 0.2 },
      { color: '#0055cc', position: 0.42 },
      { color: '#3399ff', position: 0.6 },
      { color: '#aaccff', position: 0.65 },
      { color: '#ffffff', position: 0.75 },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000';
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

function isValidHexColor(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function HexColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}): React.ReactElement {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
      setLocalValue(val);
      if (isValidHexColor(val)) {
        onChange(val);
      }
    }
  };

  const handleBlur = () => {
    if (!isValidHexColor(localValue)) {
      setLocalValue(value);
    }
  };

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      style={{
        width: '80px',
        background: '#0d1117',
        color: '#e2e8f0',
        border: `1px solid ${isValidHexColor(localValue) ? '#333' : '#6b2222'}`,
        borderRadius: '6px',
        padding: '4px 6px',
        fontSize: '12px',
        fontFamily: 'monospace',
      }}
    />
  );
}

function makeCssGradient(stops: GradientStop[]): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const parts = sorted.map((s) => `${s.color} ${Math.round(s.position * 100)}%`).join(', ');
  return `linear-gradient(to right, ${parts})`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GradientEditor({ onChange }: GradientEditorProps): React.ReactElement {
  const [stops, setStops] = useState<GradientStop[]>(DEFAULT_GRADIENT_STOPS);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [saveLabel, setSaveLabel] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const saveLabelRef = useRef<HTMLInputElement>(null);
  const { saved, save, remove } = useSavedPresets();

  // Regenerate canvas and notify parent whenever stops change
  useEffect(() => {
    if (previewRef.current) {
      renderGradientPreview(previewRef.current, stops);
    }
    onChange(generateGradientCanvas(stops));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops]);

  // Focus save input when it appears
  useEffect(() => {
    if (showSaveInput) {
      setTimeout(() => saveLabelRef.current?.focus(), 0);
    }
  }, [showSaveInput]);

  const addStop = useCallback(() => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    let bestPos = 0.5;
    let bestGap = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = sorted[i + 1].position - sorted[i].position;
      if (gap > bestGap) {
        bestGap = gap;
        bestPos = (sorted[i].position + sorted[i + 1].position) / 2;
      }
    }
    setStops((prev) => [...prev, { color: '#888888', position: bestPos }]);
  }, [stops]);

  const removeStop = useCallback((idx: number) => {
    setStops((prev) => {
      if (prev.length <= 2) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const updateColor = useCallback((idx: number, color: string) => {
    setStops((prev) => prev.map((s, i) => (i === idx ? { ...s, color } : s)));
  }, []);

  const updatePosition = useCallback((idx: number, position: number) => {
    setStops((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, position: Math.min(1, Math.max(0, position)) } : s)),
    );
  }, []);

  const handleBarMouseDown = useCallback((e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    setDraggingIdx(idx);
  }, []);

  const handleSave = useCallback(() => {
    const label = saveLabel.trim();
    if (!label) return;
    save(label, stops);
    setSaveLabel('');
    setShowSaveInput(false);
  }, [save, saveLabel, stops]);

  const handleCancelSave = useCallback(() => {
    setShowSaveInput(false);
    setSaveLabel('');
  }, []);

  const handleExport = useCallback(() => {
    const canvas = generateGradientCanvas(stops, 512, 32);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'gradient-map.png';
    link.href = dataUrl;
    link.click();
  }, [stops]);

  useEffect(() => {
    if (draggingIdx === null) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      updatePosition(draggingIdx, pos);
    };

    const onMouseUp = () => setDraggingIdx(null);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [draggingIdx, updatePosition]);

  const sorted = [...stops]
    .map((s, i) => ({ ...s, origIdx: i }))
    .sort((a, b) => a.position - b.position);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        background: '#1a1a2e',
        borderRadius: '12px',
        border: '1px solid #333',
        minWidth: '320px',
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          GRADIENT MAP
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={handleExport}
            title="Export gradient map as PNG image"
            style={{
              background: '#1a2a3a',
              color: '#60a5fa',
              border: '1px solid #2d4a6d',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            📥 Export
          </button>
          <button
            onClick={() => setShowSaveInput((v) => !v)}
            title="Save current gradient as preset"
            style={{
              background: showSaveInput ? '#1a3a1a' : '#1a2a1a',
              color: '#4ade80',
              border: `1px solid ${showSaveInput ? '#2d6a2d' : '#2d4a2d'}`,
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            💾 Save
          </button>
          <button
            onClick={addStop}
            style={{
              background: '#3a3a5c',
              color: '#c4b5fd',
              border: '1px solid #5a5a8c',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            + Stop
          </button>
        </div>
      </div>

      {/* Save-as-preset inline input */}
      {showSaveInput && (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <input
            ref={saveLabelRef}
            type="text"
            placeholder="Preset name…"
            value={saveLabel}
            onChange={(e) => setSaveLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancelSave();
            }}
            style={{
              flex: 1,
              background: '#0d1117',
              color: '#e2e8f0',
              border: '1px solid #2d6a2d',
              borderRadius: '6px',
              padding: '5px 8px',
              fontSize: '12px',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSave}
            disabled={!saveLabel.trim()}
            style={{
              background: saveLabel.trim() ? '#15803d' : '#1a2a1a',
              color: saveLabel.trim() ? '#fff' : '#3a5a3a',
              border: 'none',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '12px',
              cursor: saveLabel.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Save
          </button>
          <button
            onClick={handleCancelSave}
            style={{
              background: 'transparent',
              color: '#64748b',
              border: '1px solid #333',
              borderRadius: '6px',
              padding: '5px 8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Gradient preview bar */}
      <div
        ref={barRef}
        style={{
          position: 'relative',
          height: '36px',
          borderRadius: '8px',
          overflow: 'visible',
          cursor: draggingIdx !== null ? 'grabbing' : 'default',
        }}
      >
        <canvas
          ref={previewRef}
          width={512}
          height={1}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            display: 'block',
          }}
        />

        {/* Draggable stop handles */}
        {sorted.map(({ color, position, origIdx }) => (
          <button
            key={`handle-${origIdx}-${color}`}
            onMouseDown={(e) => handleBarMouseDown(e, origIdx)}
            title={`Stop ${origIdx + 1}: ${color} @ ${Math.round(position * 100)}%`}
            style={{
              position: 'absolute',
              top: '50%',
              left: `${position * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: '14px',
              height: '26px',
              borderRadius: '4px',
              background: color,
              border: `2px solid ${getContrastColor(color)}`,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
              cursor: draggingIdx === origIdx ? 'grabbing' : 'grab',
              zIndex: 10,
              transition: draggingIdx === origIdx ? 'none' : 'left 0.05s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Stop list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          maxHeight: '240px',
          overflowY: 'auto',
        }}
      >
        {sorted.map(({ color, position, origIdx }) => (
          <div
            key={`${origIdx}-${color}-${position}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#16213e',
              borderRadius: '8px',
              padding: '6px 10px',
            }}
          >
            {/* Color swatch / picker */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: color,
                  border: '2px solid #444',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(origIdx, e.target.value)}
                  style={{
                    opacity: 0,
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    padding: 0,
                    border: 'none',
                  }}
                />
              </div>
            </div>

            {/* Hex input */}
            <HexColorInput value={color} onChange={(newColor) => updateColor(origIdx, newColor)} />

            {/* Position slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(position * 100)}
                onChange={(e) => updatePosition(origIdx, parseInt(e.target.value, 10) / 100)}
                style={{ flex: 1, accentColor: '#7c3aed' }}
              />
              <span
                style={{
                  color: '#8892a4',
                  fontSize: '11px',
                  minWidth: '30px',
                  textAlign: 'right',
                }}
              >
                {Math.round(position * 100)}%
              </span>
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeStop(origIdx)}
              disabled={stops.length <= 2}
              title={stops.length <= 2 ? 'Need at least 2 stops' : 'Remove stop'}
              style={{
                background: stops.length <= 2 ? 'transparent' : '#2a1a1a',
                border: `1px solid ${stops.length <= 2 ? '#2a2a2a' : '#6b2222'}`,
                color: stops.length <= 2 ? '#333' : '#f87171',
                cursor: stops.length <= 2 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                lineHeight: 1,
                padding: '5px 8px',
                borderRadius: '6px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      {/* Built-in feedback state presets */}
      <div>
        <div
          style={{
            color: '#64748b',
            fontSize: '11px',
            marginBottom: '6px',
            letterSpacing: '0.05em',
          }}
        >
          FEEDBACK STATES
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {BUILT_IN_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setStops(preset.stops)}
              style={{
                background: '#16213e',
                color: '#cbd5e1',
                border: '1px solid #2a3a55',
                borderRadius: '6px',
                padding: '5px 10px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: PRESET_DOT_COLORS[preset.state],
                  flexShrink: 0,
                }}
              />
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Saved presets */}
      {saved.length > 0 && (
        <div>
          <div
            style={{
              color: '#64748b',
              fontSize: '11px',
              marginBottom: '6px',
              letterSpacing: '0.05em',
            }}
          >
            SAVED
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {saved.map((preset) => (
              <div
                key={preset.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#16213e',
                  borderRadius: '6px',
                  padding: '4px 6px',
                }}
              >
                {/* Mini gradient preview */}
                <div
                  style={{
                    width: '48px',
                    height: '16px',
                    borderRadius: '3px',
                    background: makeCssGradient(preset.stops),
                    flexShrink: 0,
                  }}
                />
                <button
                  onClick={() => setStops(preset.stops)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    color: '#cbd5e1',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '12px',
                    cursor: 'pointer',
                    padding: '2px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {preset.label}
                </button>
                <button
                  onClick={() => remove(preset.id)}
                  title="Delete saved preset"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#475569',
                    cursor: 'pointer',
                    fontSize: '13px',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { DEFAULT_GRADIENT_STOPS };
export type { GradientStop };
