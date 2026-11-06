import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { RazorSenseChatBackgroundProps } from './types';
import { TypingSurge, getTypingSurgeSetup } from './typingSurge';
import { runFreshStage, withRoom } from '../RazorSenseEngine';
import type { FreshEngine, FreshStage } from '../RazorSenseEngine';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { placeSpill, watchSpill } from '../RazorSenseEngine/spillClip';
import { stillStyle, useStill } from '../RazorSenseEngine/useStill';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useMergeRefs } from '~utils/useMergeRefs';
import { makeAccessible } from '~utils/makeAccessible';

/** its still, for when it can't animate (its own module per color scheme, loaded only then) */
const loadChatBackgroundStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/chatBackgroundDark').then((m) => m.chatBackgroundDark)
    : import('./stills/chatBackgroundLight').then((m) => m.chatBackgroundLight);

/** flow 9's landing chat input in the comp (CSS px; the comp is 1440 x 856 CSS, made at 2x): what the comp is laid against */
const INPUT = { x: 332, y: 206, w: 840, h: 97 };
const COMP_SIZE = { w: 1440, h: 856 };
/**
 * Room round the comp (CSS px at scale 1, each side) for the strip at its widest and tallest: the engine draws nothing past a
 * comp's edges, so a strip stretched 1.5x was cut there. 1.5x needs 376 px past the left edge and 301 below.
 */
const ROOM = { x: 376, y: 301 };
/**
 * How far below the chat input's middle flow 9's strip sits (CSS px at scale 1): its lower half was under flow 9's suggestion tray.
 * With no tray under the input, it's lifted by that much, so it hugs the input evenly above and below.
 */
const LIFT = 52;
/** how far the strip reaches above and below the chat input once lifted (CSS px at scale 1): kept as the input gets taller */
const REACH_Y = 114;

/** the input's middle in comp px from the comp's middle: what the strip stretches round */
const INPUT_MIDDLE: [number, number] = [
  (INPUT.x + INPUT.w / 2 - COMP_SIZE.w / 2) * 2,
  (INPUT.y + INPUT.h / 2 - COMP_SIZE.h / 2) * 2,
];

/**
 * RazorSenseChatBackground
 *
 * RazorSense behind the chat input, as on flow 9's landing: wrap the chat input and a soft fluted strip sits behind it, drifting
 * and breathing; as someone types it pulses into its typing surge and dies back down when they stop. Like RazorSense, it follows
 * Blade's color scheme (BladeProvider).
 *
 * It's for a chat input on its own (a landing, a home screen). In an assistant chat, use RazorSenseBottomWave: the chat's
 * fainter wave, which the thinking surges into.
 *
 * The strip stretches to the input's width and height (the bands keep their size) and its glow spills outside it, on a clear
 * background, so the page shows through. Paused off-screen.
 *
 * @example
 * ```tsx
 * <RazorSenseChatBackground>
 *   <ChatInput placeholder="Ask anything..." value={text} onChange={({ value }) => setText(value ?? '')} />
 * </RazorSenseChatBackground>
 * ```
 */
const RazorSenseChatBackground = forwardRef<HTMLDivElement, RazorSenseChatBackgroundProps>(
  function RazorSenseChatBackground(
    { children, isPaused = false, scale = 1, onLoad, onError, className, style, testID },
    forwardedRef,
  ) {
    const { colorScheme } = useTheme();
    const onLoadRef = useRef(onLoad);
    onLoadRef.current = onLoad;
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;
    const mode = colorScheme === 'dark' ? 'dark' : 'light';
    const s = holdInRange(scale, FRESH_RANGES.scale, 'RazorSenseChatBackground', 'scale');
    const boxRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(forwardedRef, boxRef);
    const hostRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<FreshStage | null>(null);
    const engineRef = useRef<FreshEngine | null>(null);
    const typingRef = useRef<TypingSurge | null>(null);
    // read when the engine is up (it loads asynchronously, so a pause set before then still counts)
    const isPausedRef = useRef(isPaused);
    isPausedRef.current = isPaused;
    // gone to its still: it can't animate here (the stage is freed); it stays there, a new color scheme just changes the still
    const [isStill, setIsStill] = useState(false);
    const isStillRef = useRef(false);
    const still = useStill(isStill, mode, loadChatBackgroundStill);

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
        holdInRange(
          bw,
          FRESH_RANGES.chatInputWidth,
          'RazorSenseChatBackground',
          "the chat input's width",
          px,
        ) / INPUT.w;
      // (taller: the strip grows to keep its reach past the input, not in proportion). A chat input's height follows what's in
      // it (lines, attachments), so past its range it's held there quietly, with no warning.
      const { min: hMin, max: hMax } = FRESH_RANGES.chatInputHeight;
      const ky = (Math.min(hMax, Math.max(hMin, bh)) / 2 + REACH_Y) / (INPUT.h / 2 + REACH_Y);
      // the canvas: the comp's area as stretched (no bigger: it's what's drawn), the comp's chat input on the box (lifted); the comp
      // (with its ROOM) placed in it so its chat input lands there too
      const k = Math.max(1, kx);
      const j = Math.max(1, ky);
      const cx = INPUT.x + INPUT.w / 2;
      const cy = INPUT.y + INPUT.h / 2;
      // (cut where its spill would grow the page: Firefox; the comp moves back by the cut, so it stays where it was)
      const [cutX, cutY] = placeSpill(host, {
        left: bw / 2 - cx * k * s,
        top: bh / 2 - (cy * j + LIFT * ky) * s,
        width: COMP_SIZE.w * k * s,
        height: COMP_SIZE.h * j * s,
      });
      engineRef.current?.player.group('main', {
        dx: (cx * (k - 1) - ROOM.x) * s - cutX,
        dy: (cy * (j - 1) - ROOM.y) * s - cutY,
      });
      typingRef.current?.setStretch(kx, ky, INPUT_MIDDLE[0], INPUT_MIDDLE[1]);
    };

    useEffect(() => {
      const box = boxRef.current;
      const host = hostRef.current;
      if (!box || !host) return undefined;
      fitRef.current();
      // (no ResizeObserver, as in some test environments: laid out once)
      const observer =
        typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => fitRef.current());
      observer?.observe(box);
      const stopSpill = watchSpill(host, () => fitRef.current());
      return () => {
        observer?.disconnect();
        stopSpill();
      };
    }, [s]);

    useEffect(() => {
      // (gone to its still: it stays there, a new color scheme or scale just changes the still)
      if (isStillRef.current) return undefined;
      return runFreshStage({
        moduleName: 'RazorSenseChatBackground',
        getBox: () => hostRef.current,
        stageRef,
        loadComps: () => import('./comps'),
        start: (stage, comps) => {
          const doc = withRoom(
            mode === 'dark' ? comps.chatBackgroundDark : comps.chatBackgroundLight,
            ROOM,
          );
          const setup = getTypingSurgeSetup(doc);
          // the comp at its own size (2x comp px = CSS px) x scale, from the canvas's top-left (placed by fitRef)
          const engine = stage.mount({
            doc,
            opts: { fit: 'fixed', scale: 0.5 * s, alpha: true, paused: true },
          });
          if (!engine || !setup) return false;
          onLoadRef.current?.();
          engineRef.current = engine;
          engine.player.comp('ty', { op: 0 }); // the typing surge's layer: held at 0 until typing lifts it
          const typing = new TypingSurge(setup);
          typingRef.current = typing;
          fitRef.current();
          const duration = doc.tl.dur;
          if (stage.reducedMotion) {
            // reduced motion: held still, idle
            stage.settle(() => {
              typing.pose(engine.player, 1);
              engine.player.seek(0, 0);
            });
            return true;
          }
          stage.setDriver((eng, dt) => {
            const now = performance.now() / 1000;
            typing.step(eng.player, dt, now, duration);
          });
          stage.setPaused(isPausedRef.current);
          return true;
        },
        onFail: (error) => {
          isStillRef.current = true;
          setIsStill(true);
          onErrorRef.current?.(error);
        },
        onRelease: () => {
          engineRef.current = null;
          typingRef.current = null;
        },
      });
      // isPaused has its own effect; a new color scheme or scale starts it again
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, s]);

    useEffect(() => {
      stageRef.current?.setPaused(isPaused);
    }, [isPaused]);

    // each edit typed in the chat input inside (any input, textarea or editable element) is a keystroke
    useEffect(() => {
      const box = boxRef.current;
      if (!box) return undefined;
      const onInput = (): void => typingRef.current?.hit(performance.now() / 1000);
      box.addEventListener('input', onInput);
      return () => box.removeEventListener('input', onInput);
    }, []);

    return (
      <div
        ref={mergedRef}
        className={className}
        {...metaAttribute({ name: MetaConstants.RazorSenseChatBackground, testID })}
        style={{
          position: 'relative',
          // its own layer, so the strip draws behind the chat input and over the page
          isolation: 'isolate',
          // its canvas spreads well past the chat input (the glow round it): layout containment keeps that from growing the page
          // in Chrome and Safari (drawn, not counted for scrolling); Firefox counts it, so there the canvas is cut (placeSpill)
          contain: 'layout',
          ...style,
        }}
      >
        <div
          ref={hostRef}
          {...makeAccessible({ hidden: true })}
          style={{ position: 'absolute', zIndex: -1, pointerEvents: 'none' }}
        >
          {still ? <img src={still} alt="" style={stillStyle} /> : null}
        </div>
        {children}
      </div>
    );
  },
);

export { RazorSenseChatBackground };
