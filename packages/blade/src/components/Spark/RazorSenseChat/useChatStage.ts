import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { ChatDriver, getChatSetup } from './chatDriver';
import type { ChatAnchors } from './chatDriver';
import { FreshStage, freshFailures, loadFreshEngine, withRoom } from '../RazorSenseEngine';
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
  const [isStill, setIsStill] = useState(false);
  const isStillRef = useRef(false);

  useEffect(() => {
    // (gone to its still: it stays there, a new color scheme or scale just changes the still)
    if (!isEnabled || isStillRef.current) return undefined;
    let isMounted = true;
    let hasFailed = false;
    let stage: FreshStage | null = null;
    const fail = (reason = 'WebGL2 is unavailable, or the GPU draws only on the CPU'): void => {
      if (hasFailed || !isMounted) return;
      hasFailed = true;
      isStillRef.current = true;
      setIsStill(true);
      // the stage freed after this frame (it may be the one telling us)
      window.setTimeout(() => {
        stage?.destroy();
        if (freshStageRef.current === stage) freshStageRef.current = null;
        driverRef.current = null;
      }, 0);
      onErrorRef.current?.(new Error(`${moduleName}: ${reason}`));
    };
    void Promise.all([loadFreshEngine(), import('./comps')])
      .then(([createFreshEngine, comps]) => {
        const box = stageRef.current;
        if (!isMounted || !box) return;
        const doc = withRoom(mode === 'dark' ? comps.chatDark : comps.chatLight, ROOM);
        const setup = getChatSetup(doc);
        stage = new FreshStage(box, createFreshEngine, {
          onError: (reason) => fail(freshFailures[reason]),
        });
        freshStageRef.current = stage;
        // flow 9's chat comp is drawn at its own size (2x comp px = CSS px) x scale, from the stage's top-left; the pages are
        // placed in it
        const engine = stage.mount({
          doc,
          opts: { fit: 'fixed', scale: 0.5 * scale, alpha: true, paused: true },
        });
        if (!engine || !setup) {
          fail(); // no usable WebGL2: nothing drawn, what it wraps shows as it is
          return;
        }
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
          // their own that only goes forward.
          const still = stage;
          let clock = now;
          stillRef.current = (nextIsThinking) => {
            clock = Math.max(clock, performance.now());
            if (nextIsThinking) driver.think();
            else driver.answer(clock);
            for (let i = 0; i < 60; i++) driver.step(engine.player, 0.25, clock + i * 250, false);
            clock += 60 * 250;
            still.settle(() => driver.step(engine.player, 0, clock));
          };
          stillRef.current(isThinkingRef.current);
          return;
        }
        stage.setDriver((eng, dt) => {
          driver.setAnchors(anchorsRef.current(), scale, ROOM); // (every frame, as flow 9: the chat moves, it follows)
          driver.step(eng.player, dt, performance.now());
        });
        stage.setPaused(isPausedRef.current);
      })
      .catch(() => {
        // the engine couldn't load: nothing drawn
        if (isMounted) fail('its engine failed to load');
      });
    return () => {
      isMounted = false;
      freshStageRef.current?.destroy();
      freshStageRef.current = null;
      driverRef.current = null;
      stillRef.current = null;
    };
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
