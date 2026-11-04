import React, { useEffect, useRef } from 'react';
import type { FreshChatBackgroundProps } from './types';
import { TypingSurge, getTypingSurgeSetup } from './typingSurge';
import { FreshStage, loadFreshEngine, withRoom } from '../RazorSenseEngine';
import type { FreshEngine } from '../RazorSenseEngine';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';

/** flow 9's landing chat input in the comp (CSS px; the comp is 1440 x 856 CSS, made at 2x): what the comp is laid against */
const INPUT = { x: 332, y: 206, w: 840, h: 97 };
const COMP_SIZE = { w: 1440, h: 856 };
/**
 * Room round the comp (CSS px at scale 1, each side) for the strip at its widest and tallest: the engine draws nothing past a
 * comp's edges, so a strip stretched 1.5x was cut there. 1.5x needs 376 px past the left edge and 301 below.
 */
const ROOM = { x: 376, y: 301 };

/** the input's middle in comp px from the comp's middle: what the strip stretches round */
const INPUT_MIDDLE: [number, number] = [
  (INPUT.x + INPUT.w / 2 - COMP_SIZE.w / 2) * 2,
  (INPUT.y + INPUT.h / 2 - COMP_SIZE.h / 2) * 2,
];

/**
 * FreshChatBackground
 *
 * RazorSense behind the chat input (flow 9's landing). Idle, it's a soft fluted strip drifting and breathing; as someone types it
 * pulses into its typing surge and dies back down to idle when they stop. Like RazorSense, it follows Blade's color scheme
 * (BladeProvider): light and dark are the same component.
 *
 * It's for a chat input on its own (a landing, a home screen). Inside an assistant chat, use FreshLLM: its idle is this same
 * strip under the chat input, so don't put both on one chat input (two strips would overlap).
 *
 * Its box is the chat input's: lay it over the chat input. The strip stretches to the input's width and height (the bands keep
 * their size) and its glow spills outside the box, on a clear background, so the page shows through. Paused off-screen.
 *
 * @example
 * ```tsx
 * <Box position="relative">
 *   <Box position="absolute" inset="spacing.0">
 *     <FreshChatBackground inputValue={text} />
 *   </Box>
 *   <ChatInput value={text} onChange={({ value }) => setText(value ?? '')} />
 * </Box>
 * ```
 */
const FreshChatBackground = ({
  variant = 'idle',
  inputValue,
  isPaused = false,
  scale = 1,
  width = '100%',
  height = '100%',
  testID,
}: FreshChatBackgroundProps): React.ReactElement => {
  const { colorScheme } = useTheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  const s = holdInRange(scale, FRESH_RANGES.scale, 'FreshChatBackground', 'scale');
  const boxRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<FreshStage | null>(null);
  const engineRef = useRef<FreshEngine | null>(null);
  const typingRef = useRef<TypingSurge | null>(null);
  const variantRef = useRef(variant);
  // read when the engine is up (it loads asynchronously, so a pause set before then still counts)
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  variantRef.current = variant;
  // reduced motion: draws the still frame for the current variant (set once the engine is up)
  const stillRef = useRef<(() => void) | null>(null);

  // the strip stretched to the box (held in range), and the canvas laid round the box so the comp's chat input sits on it
  const fitRef = useRef<() => void>(() => undefined);
  fitRef.current = (): void => {
    const box = boxRef.current;
    const host = hostRef.current;
    if (!box || !host || box.clientWidth < 1 || box.clientHeight < 1) return;
    const bw = box.clientWidth;
    const bh = box.clientHeight;
    const px = (v: number): string => `${Math.round(v)}px`;
    const kx =
      holdInRange(bw, FRESH_RANGES.chatInputWidth, 'FreshChatBackground', 'width', px) / INPUT.w;
    const ky =
      holdInRange(bh, FRESH_RANGES.chatInputHeight, 'FreshChatBackground', 'height', px) / INPUT.h;
    // the canvas: the comp's area as stretched (no bigger: it's what's drawn), the comp's chat input on the box; the comp (with
    // its ROOM) placed in it so its chat input lands there too
    const k = Math.max(1, kx);
    const j = Math.max(1, ky);
    const cx = INPUT.x + INPUT.w / 2;
    const cy = INPUT.y + INPUT.h / 2;
    Object.assign(host.style, {
      left: `${bw / 2 - cx * k * s}px`,
      top: `${bh / 2 - cy * j * s}px`,
      width: `${COMP_SIZE.w * k * s}px`,
      height: `${COMP_SIZE.h * j * s}px`,
    });
    engineRef.current?.player.group('main', {
      dx: (cx * (k - 1) - ROOM.x) * s,
      dy: (cy * (j - 1) - ROOM.y) * s,
    });
    typingRef.current?.setStretch(kx, ky, INPUT_MIDDLE[0], INPUT_MIDDLE[1]);
  };

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    fitRef.current();
    const observer = new ResizeObserver(() => fitRef.current());
    observer.observe(box);
    return () => observer.disconnect();
  }, [s]);

  useEffect(() => {
    let isMounted = true;
    void Promise.all([loadFreshEngine(), import('./comps')])
      .then(([createFreshEngine, comps]) => {
        if (!isMounted || !hostRef.current) return;
        const doc = withRoom(
          mode === 'dark' ? comps.chatBackgroundDark : comps.chatBackgroundLight,
          ROOM,
        );
        const setup = getTypingSurgeSetup(doc);
        const stage = new FreshStage(hostRef.current, createFreshEngine);
        stageRef.current = stage;
        // the comp at its own size (2x comp px = CSS px) x scale, from the canvas's top-left (placed by fitRef)
        const engine = stage.mount({
          doc,
          opts: { fit: 'fixed', scale: 0.5 * s, alpha: true, paused: true },
        });
        if (!engine || !setup) return; // no WebGL2: nothing drawn, the page shows as it is
        engineRef.current = engine;
        engine.player.comp('ty', { op: 0 }); // the typing surge's layer: held at 0 until typing lifts it
        const typing = new TypingSurge(setup);
        typingRef.current = typing;
        fitRef.current();
        const duration = doc.tl.dur;
        if (stage.reducedMotion) {
          // reduced motion: held still (in its typing surge, if that's the variant), and again whenever the variant changes
          stillRef.current = () => {
            engine.player.comp('ty', {
              op: variantRef.current === 'typing-surge' ? setup.tune.level : 0,
            });
            typing.pose(engine.player, 1);
            engine.player.seek(0, 0);
          };
          stillRef.current();
          return;
        }
        stage.setDriver((eng, dt) => {
          const now = performance.now() / 1000;
          typing.setHeld(variantRef.current === 'typing-surge', now);
          typing.step(eng.player, dt, now, duration);
        });
        stage.setPaused(isPausedRef.current);
      })
      .catch(() => {
        // the engine couldn't load: nothing drawn
      });
    return () => {
      isMounted = false;
      stageRef.current?.destroy();
      stageRef.current = null;
      engineRef.current = null;
      typingRef.current = null;
      stillRef.current = null;
    };
    // variant and isPaused are read live; a new color scheme or scale starts it again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, s]);

  useEffect(() => {
    stageRef.current?.setPaused(isPaused);
  }, [isPaused]);

  useEffect(() => {
    stillRef.current?.();
  }, [variant]);

  // every change to the chat input's text is a keystroke (not the first value)
  const lastValue = useRef(inputValue);
  useEffect(() => {
    if (inputValue === lastValue.current) return;
    lastValue.current = inputValue;
    typingRef.current?.hit(performance.now() / 1000);
  }, [inputValue]);

  return (
    <div
      ref={boxRef}
      {...metaAttribute({ name: MetaConstants.FreshChatBackground, testID })}
      {...makeAccessible({ hidden: true })}
      style={{
        position: 'relative',
        pointerEvents: 'none',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      <div ref={hostRef} style={{ position: 'absolute' }} />
    </div>
  );
};

export { FreshChatBackground };
