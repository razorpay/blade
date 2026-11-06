import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { ChatDriver, getChatSetup } from './chatDriver';
import type { ChatAnchors } from './chatDriver';
import { runFreshStage, withRoom } from '../RazorSenseEngine';
import type { FreshStage } from '../RazorSenseEngine';
import { watchLayout } from '../RazorSenseEngine/watchLayout';
import { useTheme } from '~components/BladeProvider';

/**
 * Room round the chat comp (CSS px at scale 1, each side: half the comp again). It was made for flow 9's 1512 x 982 window: on a
 * taller or wider one, or scaled down, its edges came inside the panel and cut the thinking's bands and the bottom wave in a line.
 */
const ROOM = { x: 0, y: 491 };

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
};

/**
 * The chat's RazorSense on one canvas (flow 9's chat comp and its ChatDriver), for RazorSenseChat and for RazorSenseThinking and
 * RazorSenseBottomWave on their own. Returns the keystroke signal for the bottom wave's typing surge, and whether it has gone to
 * its still (it can't animate here: the stage is freed and the component shows its still instead).
 */
const useChatStage = ({
  moduleName,
  isEnabled,
  stageRef,
  isThinking,
  getAnchors,
  scale,
  isPaused,
  onLoad,
  onError,
}: ChatStageOptions): { keystroke: () => void; isStill: boolean } => {
  const { colorScheme } = useTheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const anchorsRef = useRef(getAnchors);
  anchorsRef.current = getAnchors;
  // read when the engine is up (it loads asynchronously, so a change before then still counts)
  const isThinkingRef = useRef(isThinking);
  isThinkingRef.current = isThinking;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const freshStageRef = useRef<FreshStage | null>(null);
  const driverRef = useRef<ChatDriver | null>(null);
  // reduced motion: moves to thinking or the bottom wave and draws its settled still frame (set once the engine is up)
  const stillRef = useRef<((nextIsThinking: boolean) => void) | null>(null);
  // reduced motion: stops its frame following the layout
  const stopFollowRef = useRef<(() => void) | null>(null);
  const [isStill, setIsStill] = useState(false);
  const isStillRef = useRef(false);

  useEffect(() => {
    // (gone to its still: it stays there, a new color scheme or scale just changes the still)
    if (!isEnabled || isStillRef.current) return undefined;
    return runFreshStage({
      moduleName,
      getBox: () => stageRef.current,
      stageRef: freshStageRef,
      loadComps: () => import('./comps'),
      start: (stage, comps) => {
        const doc = withRoom(mode === 'dark' ? comps.chatDark : comps.chatLight, ROOM);
        const setup = getChatSetup(doc);
        // flow 9's chat comp is drawn at its own size (2x comp px = CSS px) x scale, from the stage's top-left; the pages are
        // placed in it
        const engine = stage.mount({
          doc,
          opts: { fit: 'fixed', scale: 0.5 * scale, alpha: true, paused: true },
        });
        if (!engine || !setup) return false;
        onLoadRef.current?.();
        const driver = new ChatDriver(setup, mode === 'dark');
        driverRef.current = driver;
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
          const draw = (): void =>
            stage.settle(() => {
              driver.setAnchors(anchorsRef.current(), scale, ROOM);
              driver.step(engine.player, 0, clock);
            });
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
        stage.setDriver((eng, dt) => {
          driver.setAnchors(anchorsRef.current(), scale, ROOM); // (every frame, as flow 9: the chat moves, it follows)
          driver.step(eng.player, dt, performance.now());
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
        stillRef.current = null;
        stopFollowRef.current?.();
        stopFollowRef.current = null;
      },
    });
    // isThinking and isPaused have their own effects; a new color scheme or scale starts it again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, mode, scale]);

  useEffect(() => {
    freshStageRef.current?.setPaused(isPaused);
  }, [isPaused]);

  useEffect(() => {
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
  return { keystroke, isStill };
};

export { useChatStage };
