import React, { forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { RazorSenseChatBackgroundProps } from './types';
import { TypingSurge, getTypingSurgeSetup } from './typingSurge';
import { runFreshStage, withRoom } from '../RazorSenseEngine';
import type { FreshEngine, FreshExport, FreshStage } from '../RazorSenseEngine';
import type { BackgroundStates } from './backgroundStates';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { placeSpill, watchSpill } from '../RazorSenseEngine/spillClip';
import { stillStyle, useStill } from '../RazorSenseEngine/useStill';
import { RazorSenseChatContext } from '../RazorSenseChat/chatContext';
import { useTheme } from '~components/BladeProvider';
import { logger } from '~utils/logger';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useMergeRefs } from '~utils/useMergeRefs';
import { makeAccessible } from '~utils/makeAccessible';

/** its still, for when it can't animate (its own module per color scheme, loaded only then) */
const loadChatBackgroundStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/chatBackgroundDark').then((m) => m.chatBackgroundDark)
    : import('./stills/chatBackgroundLight').then((m) => m.chatBackgroundLight);
/** its still while it listens (the voice dashboard): its own module per color scheme, loaded only then */
const loadVoiceStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/voiceDashboardDark').then((m) => m.voiceDashboardDark)
    : import('./stills/voiceDashboardLight').then((m) => m.voiceDashboardLight);

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
/** how long the chat input's width has to stay out of range before that's warned about (ms) */
const WIDTH_SETTLE_MS = 1000;

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
    {
      children,
      isPaused = false,
      scale = 1,
      onLoad,
      onError,
      className,
      style,
      testID,
      isOffline = false,
      isListening = false,
      voiceStream,
    },
    forwardedRef,
  ) {
    const { colorScheme } = useTheme();
    // inside a RazorSenseChat it would draw a second animation over the chat's own: it draws nothing there (no engine, no GPU
    // memory), only its children, and says so in development (a chat's input takes RazorSenseBottomWave)
    const isInChat = Boolean(useContext(RazorSenseChatContext));
    useEffect(() => {
      if (__DEV__ && isInChat) {
        logger({
          type: 'warn',
          moduleName: 'RazorSenseChatBackground',
          message:
            "Inside RazorSenseChat it doesn't draw (the chat draws its own): for the chat's input, use RazorSenseBottomWave instead.",
        });
      }
    }, [isInChat]);
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
    const statesRef = useRef<BackgroundStates | null>(null);
    // read when the engine is up (it loads asynchronously, so a pause set before then still counts)
    const isPausedRef = useRef(isPaused);
    isPausedRef.current = isPaused;
    // the PR's states (offline, the voice look): read every frame
    const inputsRef = useRef({ isOffline, isListening, voiceStream });
    inputsRef.current = { isOffline, isListening, voiceStream };
    // offline, faded all the way: it stops drawing till it's back online
    const isAwayRef = useRef(false);
    // reduced motion: draws where it is now, settled (a state changing)
    const redrawRef = useRef<(() => void) | null>(null);
    // gone to its still: it can't animate here (the stage is freed); it stays there, a new color scheme just changes the still
    const [isStill, setIsStill] = useState(false);
    const isStillRef = useRef(false);
    // (and while it has no frame yet: its GPU getting ready)
    const [isWaiting, setIsWaiting] = useState(false);
    const still = useStill(isStill || isWaiting, mode, loadChatBackgroundStill);
    const voiceStill = useStill(
      (isStill || isWaiting) && isListening && !isOffline,
      mode,
      loadVoiceStill,
    );

    // the strip stretched to the box (held in range), and the canvas laid round the box so the comp's chat input sits on it
    const fitRef = useRef<() => void>(() => undefined);
    const stillImgRef = useRef<HTMLImageElement | null>(null);
    // (laid out as it comes in: the still loads after the box has been fitted)
    const placeStill = useCallback((img: HTMLImageElement | null): void => {
      stillImgRef.current = img;
      if (img) fitRef.current();
    }, []);
    const widthCheckRef = useRef(0);
    fitRef.current = (): void => {
      const box = boxRef.current;
      const host = hostRef.current;
      if (!box || !host || box.clientWidth < 1 || box.clientHeight < 1) return;
      const bw = box.clientWidth;
      const bh = box.clientHeight;
      const px = (v: number): string => `${Math.round(v)}px`;
      const { min: wMin, max: wMax } = FRESH_RANGES.chatInputWidth;
      const kx = Math.min(wMax, Math.max(wMin, bw)) / INPUT.w;
      // past its range the width is held there, and said so in development once the box has kept that size a moment (a box
      // measured mid-layout, narrow for a frame, isn't the app's chat input)
      window.clearTimeout(widthCheckRef.current);
      if (bw < wMin || bw > wMax) {
        widthCheckRef.current = window.setTimeout(() => {
          const width = boxRef.current?.clientWidth ?? 0;
          if (width < 1) return;
          holdInRange(
            width,
            FRESH_RANGES.chatInputWidth,
            'RazorSenseChatBackground',
            "the chat input's width",
            px,
          );
        }, WIDTH_SETTLE_MS);
      }
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
      // its still, as the animation: past the comp's own size it's stretched with the canvas; narrower or shorter, drawn in
      // round the chat input's middle, so its band stays on the input (the PR review: a 280px input had the comp's 840px band)
      const img = stillImgRef.current;
      if (img) {
        img.style.transformOrigin = `${cx * k * s - cutX}px ${(cy * j + LIFT * ky) * s - cutY}px`;
        img.style.transform =
          kx < 1 || ky < 1 ? `scale(${Math.min(1, kx)}, ${Math.min(1, ky)})` : '';
      }
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
        window.clearTimeout(widthCheckRef.current);
      };
    }, [s]);

    useEffect(() => {
      // (gone to its still: it stays there, a new color scheme or scale just changes the still; in a chat: nothing drawn)
      if (isStillRef.current || isInChat) return undefined;
      return runFreshStage({
        moduleName: 'RazorSenseChatBackground',
        getBox: () => hostRef.current,
        stageRef,
        // (its comps and its states' code, a chunk of their own with them: not in the page's always-loaded code)
        loadComps: () =>
          Promise.all([import('./comps'), import('./backgroundStates')]).then(([c, st]) => ({
            ...c,
            BackgroundStates: st.BackgroundStates,
          })),
        // (its comps ask for a clear canvas: its engine is made ahead, a step at a time)
        engineAlpha: true,
        start: (stage, comps) => {
          const doc = withRoom(
            mode === 'dark' ? comps.chatBackgroundDark : comps.chatBackgroundLight,
            ROOM,
          );
          const setup = getTypingSurgeSetup(doc);
          // the comp at its own size (2x comp px = CSS px) x scale, from the canvas's top-left (placed by fitRef)
          const opts: FreshExport['opts'] = {
            fit: 'fixed',
            scale: 0.5 * s,
            alpha: true,
            paused: true,
          };
          const engine = stage.mount({ doc, opts });
          if (!engine || !setup) return false;
          engineRef.current = engine;
          engine.player.comp('ty', { op: 0 }); // the typing surge's layer: held at 0 until typing lifts it
          const typing = new TypingSurge(setup);
          typingRef.current = typing;
          fitRef.current();
          const duration = doc.tl.dur;
          const states = new comps.BackgroundStates(engine, doc, opts, mode, ROOM, () => {
            // (another document on the engine: laid out round the chat input again)
            fitRef.current();
          });
          statesRef.current = states;
          if (stage.reducedMotion) {
            // reduced motion: held still, idle (offline: gone; listening: the voice look, silent)
            const draw = (): void => {
              states.settle(inputsRef.current, () => redrawRef.current?.());
              stage.settle(() => {
                typing.pose(engine.player, 1);
                engine.player.seek(0, 0);
              });
            };
            redrawRef.current = draw;
            draw();
            return true;
          }
          stage.setDriver((eng, dt) => {
            const nowMs = performance.now();
            states.frame(dt, nowMs, inputsRef.current);
            typing.step(eng.player, dt, nowMs / 1000, duration);
            // offline, faded all the way: nothing of it shows, so it stops drawing till it's back online
            if (states.isAway() && !isAwayRef.current) {
              isAwayRef.current = true;
              stage.setPaused(true);
            }
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
          statesRef.current?.destroy();
          statesRef.current = null;
          redrawRef.current = null;
          isAwayRef.current = false;
        },
        onDrawn: () => onLoadRef.current?.(),
        onWaiting: setIsWaiting,
      });
      // isPaused has its own effect; a new color scheme or scale starts it again
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, s, isInChat]);

    useEffect(() => {
      stageRef.current?.setPaused(isPaused || isAwayRef.current);
    }, [isPaused]);

    // a state changed: read by the next frame; with reduced motion, drawn now; back online, drawing again
    useEffect(() => {
      if (!isOffline && isAwayRef.current) {
        isAwayRef.current = false;
        stageRef.current?.setPaused(isPausedRef.current);
      }
      redrawRef.current?.();
    }, [isOffline, isListening, voiceStream]);

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
          ...style,
        }}
      >
        <div
          {...makeAccessible({ hidden: true })}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
            // its canvas spreads well past the chat input (the glow round it): layout containment on this layer keeps that from
            // growing the page in Chrome and Safari (drawn, not counted for scrolling); Firefox counts it, so there the canvas is
            // cut (placeSpill). Not on the root, which wraps the chat input: containment would anchor the input's own fixed or
            // absolute overlays (a mention list, a menu) to it
            contain: 'layout',
          }}
        >
          <div ref={hostRef} style={{ position: 'absolute', pointerEvents: 'none' }}>
            {still ? (
              <img
                ref={placeStill}
                src={voiceStill ?? still}
                alt=""
                // (offline: it fades away, as the animation does)
                style={{ ...stillStyle, opacity: isOffline ? 0 : 1, transition: 'opacity 1s' }}
              />
            ) : null}
          </div>
        </div>
        {children}
      </div>
    );
  },
);

export { RazorSenseChatBackground };
