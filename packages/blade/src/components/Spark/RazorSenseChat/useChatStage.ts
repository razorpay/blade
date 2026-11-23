import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { ChatDriver, getChatSetup } from './chatDriver';
import type { ChatAnchors } from './chatDriver';
import type { ChatStateInputs, ChatStates, OutcomeMemory } from './chatStates';
import { runFreshStage, withRoom } from '../RazorSenseEngine';
import type { FreshStage } from '../RazorSenseEngine';
import { watchLayout } from '../RazorSenseEngine/watchLayout';
import { useTheme } from '~components/BladeProvider';

/**
 * Room round the chat comp (CSS px at scale 1, each side: half the comp again down, a quarter across). It was made for flow 9's
 * 1512 x 982 window: on a taller or wider one, or scaled down, its edges came inside the panel and cut the thinking's bands and the
 * bottom wave in a line. Across, an outcome's splash reaches the window's sides (the room changes the rest by under 3 levels in 255).
 */
const ROOM = { x: 378, y: 491 };

type ChatStageOptions = {
  /** for its errors */
  moduleName: string;
  /** off for a part inside RazorSenseChat: the chat draws it */
  isEnabled: boolean;
  /** the box the canvas goes in */
  stageRef: React.RefObject<HTMLDivElement>;
  /** thinking (true), or surged down to the bottom wave and settled there (false) */
  isThinking: boolean;
  /** where thinking and the bottom wave go, in the stage's CSS px: read every frame, so they follow what they wrap */
  getAnchors: () => ChatAnchors;
  /** held in its range already */
  scale: number;
  isPaused: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  /** told when an outcome starts and stops playing on the strip (the lone bottom wave reaches up to its splash only meanwhile) */
  onOutcome?: (isPlaying: boolean) => void;
  /** changed when the component moves its stage itself (its reach): where its parts are is read again at once */
  layoutKey?: unknown;
} & Partial<ChatStateInputs>;

/**
 * The chat's RazorSense on one canvas (flow 9's chat comp and its ChatDriver), for RazorSenseChat and for RazorSenseThinking and
 * RazorSenseBottomWave on their own. Returns the keystroke signal for the bottom wave's typing surge, and whether it has gone to
 * its still (it can't animate here: the stage is freed and the component shows its still instead).
 */
/** frames between reads of where the chat's parts are when nothing has said they moved (a CSS transition moves them quietly) */
const ANCHOR_REREAD = 12;

const useChatStage = ({
  moduleName,
  isEnabled,
  stageRef,
  isThinking,
  getAnchors,
  onOutcome,
  layoutKey,
  scale,
  isPaused,
  onLoad,
  onError,
  isOffline = false,
  isListening = false,
  voiceStream,
  outcome,
}: ChatStageOptions): { keystroke: () => void; isStill: boolean } => {
  const { colorScheme } = useTheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const anchorsRef = useRef(getAnchors);
  anchorsRef.current = getAnchors;
  const onOutcomeRef = useRef(onOutcome);
  onOutcomeRef.current = onOutcome;
  // (the stage moved by its own component: its parts are read again on the next frame)
  const isRelaidRef = useRef(false);
  useEffect(() => {
    isRelaidRef.current = true;
  }, [layoutKey]);
  // read when the engine is up (it loads asynchronously, so a change before then still counts)
  const isThinkingRef = useRef(isThinking);
  isThinkingRef.current = isThinking;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const freshStageRef = useRef<FreshStage | null>(null);
  const driverRef = useRef<ChatDriver | null>(null);
  // the PR's states on the strip (offline, the voice look, an outcome): read every frame
  const inputsRef = useRef<ChatStateInputs>({ isOffline, isListening, voiceStream, outcome });
  inputsRef.current = { isOffline, isListening, voiceStream, outcome };
  const statesRef = useRef<ChatStates | null>(null);
  // (the outcome last played, kept across its states: a new color scheme or scale doesn't play it again)
  const outcomeMemoryRef = useRef<OutcomeMemory>({});
  // offline, dropped all the way: it stops drawing till it's back online
  const isAwayRef = useRef(false);
  // reduced motion: draws where it is now, settled (a state changing)
  const redrawRef = useRef<(() => void) | null>(null);
  // reduced motion: moves to thinking or the bottom wave and draws its settled still frame (set once the engine is up)
  const stillRef = useRef<((nextIsThinking: boolean) => void) | null>(null);
  // reduced motion: stops its frame following the layout
  const stopFollowRef = useRef<(() => void) | null>(null);
  const [isStill, setIsStill] = useState(false);
  // its stills stand in while it has no frame yet (its GPU getting ready), as when it can't animate
  const [isWaiting, setIsWaiting] = useState(false);
  const isStillRef = useRef(false);

  useEffect(() => {
    // (gone to its still: it stays there, a new color scheme or scale just changes the still)
    if (!isEnabled || isStillRef.current) return undefined;
    return runFreshStage({
      moduleName,
      getBox: () => stageRef.current,
      stageRef: freshStageRef,
      // (its comps and its states' code, a chunk of their own with them: not in the page's always-loaded code)
      loadComps: () =>
        Promise.all([import('./comps'), import('./chatStates')]).then(([c, st]) => ({
          ...c,
          ChatStates: st.ChatStates,
        })),
      // (its comps ask for a clear canvas: its engine is made ahead, a step at a time)
      engineAlpha: true,
      start: (stage, comps) => {
        const doc = withRoom(mode === 'dark' ? comps.chatDark : comps.chatLight, ROOM);
        const setup = getChatSetup(doc);
        // flow 9's chat comp is drawn at its own size (2x comp px = CSS px) x scale, from the stage's top-left; the pages are
        // placed in it
        const opts = { fit: 'fixed' as const, scale: 0.5 * scale, alpha: true, paused: true };
        const engine = stage.mount({ doc, opts });
        if (!engine || !setup) return false;
        const driver = new ChatDriver(setup, mode === 'dark');
        driverRef.current = driver;
        const states = new comps.ChatStates(
          engine,
          doc,
          opts,
          mode,
          scale,
          () => redrawRef.current?.(),
          outcomeMemoryRef.current,
        );
        states.inputs = inputsRef.current;
        statesRef.current = states;
        driver.setAnchors(anchorsRef.current(), scale, ROOM);
        const now = performance.now();
        driver.think();
        if (!isThinkingRef.current) {
          // mounted on the bottom wave (or started again by a new color scheme or scale there): already settled, not a replay of
          // the thinking and its surge. Run quietly up to now on the past's clock, so the timing after it carries on as usual.
          const steps = 60;
          const from = now - steps * 250;
          driver.answer(from);
          for (let i = 0; i < steps; i++) driver.step(engine.player, 0.25, from + i * 250, false);
        }
        if (stage.reducedMotion) {
          // reduced motion: one still frame of where it is (thinking, or settled to the bottom wave), settled first (quiet steps:
          // thinking fades in, the answer surges down); when that changes, the new one, settled. The steps run on a clock of
          // their own that only goes forward. It's drawn where the parts are now, and drawn again when they move.
          let clock = now;
          const draw = (): void => {
            // (offline dropped, the voice look up, an outcome's moment: settled, then drawn)
            states.inputs = inputsRef.current;
            states.settle(driver, anchorsRef.current());
            stage.settle(() => {
              driver.setAnchors(anchorsRef.current(), scale, ROOM);
              driver.step(engine.player, 0, clock);
            });
          };
          redrawRef.current = draw;
          stillRef.current = (nextIsThinking) => {
            clock = Math.max(clock, performance.now());
            driver.setAnchors(anchorsRef.current(), scale, ROOM);
            if (nextIsThinking) driver.think();
            else driver.answer(clock);
            for (let i = 0; i < 60; i++) driver.step(engine.player, 0.25, clock + i * 250, false);
            clock += 60 * 250;
            draw();
          };
          stillRef.current(isThinkingRef.current);
          const box = stageRef.current;
          const root = box?.parentElement;
          if (box && root) {
            // (what it draws itself doesn't count)
            stopFollowRef.current = watchLayout({
              root,
              ignore: (node) => box.contains(node),
              onChange: draw,
            });
          }
          return true;
        }
        // where its parts are, read again only when the layout may have moved them (a resize, a scroll, the chat's content or
        // styles changing) and every ANCHOR_REREAD frames besides (a CSS transition moves them without telling anyone): read
        // every frame, it measured the chat's boxes 60 times a second, most of that for nothing on a phone
        let anchors = anchorsRef.current();
        let isMoved = false;
        let framesSinceRead = 0;
        const box = stageRef.current;
        const root = box?.parentElement;
        stopFollowRef.current?.();
        stopFollowRef.current =
          box && root
            ? watchLayout({
                root,
                ignore: (node) => box.contains(node),
                onChange: () => {
                  isMoved = true;
                },
              })
            : null;
        let isOutcomePlaying = false;
        stage.setDriver((eng, dt) => {
          framesSinceRead += 1;
          if (isMoved || isRelaidRef.current || framesSinceRead >= ANCHOR_REREAD) {
            anchors = anchorsRef.current();
            isMoved = false;
            isRelaidRef.current = false;
            framesSinceRead = 0;
          }
          const frameAt = performance.now();
          states.inputs = inputsRef.current;
          states.frame(dt, frameAt, driver, anchors);
          driver.setAnchors(anchors, scale, ROOM); // (the chat moves, it follows, as flow 9)
          driver.step(eng.player, dt, frameAt);
          if (driver.isPlayingOutcome !== isOutcomePlaying) {
            isOutcomePlaying = driver.isPlayingOutcome;
            onOutcomeRef.current?.(isOutcomePlaying);
          }
          // offline, dropped all the way: nothing of it shows, so it stops drawing till it's back online
          if (driver.isAway(frameAt) && !isAwayRef.current) {
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
        driverRef.current = null;
        statesRef.current?.destroy();
        statesRef.current = null;
        redrawRef.current = null;
        isAwayRef.current = false;
        stillRef.current = null;
        stopFollowRef.current?.();
        stopFollowRef.current = null;
      },
      onDrawn: () => onLoadRef.current?.(),
      onWaiting: setIsWaiting,
    });
    // isThinking and isPaused have their own effects; a new color scheme or scale starts it again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, mode, scale]);

  useEffect(() => {
    freshStageRef.current?.setPaused(isPaused || isAwayRef.current);
  }, [isPaused]);

  // a state changed: read by the next frame; with reduced motion, drawn now; back online, drawing again
  useEffect(() => {
    if (!isOffline && isAwayRef.current) {
      isAwayRef.current = false;
      freshStageRef.current?.setPaused(isPausedRef.current);
    }
    redrawRef.current?.();
  }, [isOffline, isListening, voiceStream, outcome]);

  useEffect(() => {
    // (an outcome comes with the answer: its chunk fetched while the page is idle, so it's ready; the last one played is forgotten, so
    // the same outcome set for this answer plays again)
    if (isThinking) {
      statesRef.current?.prefetchOutcome();
      outcomeMemoryRef.current.played = undefined;
    }
    if (stillRef.current) {
      stillRef.current(isThinking);
      return;
    }
    const driver = driverRef.current;
    if (!driver) return;
    if (isThinking) driver.think();
    else driver.answer(performance.now());
  }, [isThinking]);

  const keystroke = useCallback(() => driverRef.current?.hit(performance.now() / 1000), []);
  return { keystroke, isStill: isStill || isWaiting };
};

export { useChatStage };
