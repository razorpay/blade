import React, { useEffect, useRef } from 'react';
import type { FreshLLMProps } from './types';
import { ChatDriver, getChatSetup, flow9Anchors } from './chatDriver';
import type { ChatAnchors } from './chatDriver';
import { FreshStage, loadFreshEngine, withRoom } from '../RazorSenseEngine';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';

/**
 * Room round the chat comp (CSS px at scale 1, each side: half the comp again). It was made for flow 9's 1512 x 982 window: on a
 * taller or wider one, or scaled down, its edges came inside the panel and cut the thinking's bands and idle's strip in a line.
 */
const ROOM = { x: 0, y: 491 };

/**
 * FreshLLM
 *
 * RazorSense in the chat: thinking loops near the top while the answer is worked out, surges down to the chat input when it's
 * in, and settles there to idle, pulsing into its typing surge as the next question is typed. Like RazorSense, it follows
 * Blade's color scheme (BladeProvider): light and dark are the same component. It draws on a clear background over the chat
 * panel it fills, following the chat input and the thinking row you point it at (`chatInputRef`, `thinkingRef`; without them,
 * flow 9's chat layout). Its idle is FreshChatBackground's strip, so it takes that one's place in a chat: don't put both on one
 * chat input. Paused off-screen.
 *
 * @example
 * ```tsx
 * <Box position="relative" height="100%">
 *   <Box position="absolute" inset="spacing.0">
 *     <FreshLLM
 *       variant={isWaitingForAnswer ? 'thinking' : 'idle'}
 *       inputValue={text}
 *       chatInputRef={chatInputRef}
 *       thinkingRef={thinkingRowRef}
 *     />
 *   </Box>
 *   {messages}
 *   <Box ref={chatInputRef}>
 *     <ChatInput value={text} onChange={({ value }) => setText(value ?? '')} />
 *   </Box>
 * </Box>
 * ```
 */
const FreshLLM = ({
  variant = 'thinking',
  inputValue,
  isPaused = false,
  scale = 1,
  chatInputRef,
  thinkingRef,
  width = '100%',
  height = '100%',
  testID,
}: FreshLLMProps): React.ReactElement => {
  const { colorScheme } = useTheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  const boxRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<FreshStage | null>(null);
  const driverRef = useRef<ChatDriver | null>(null);
  const variantRef = useRef(variant);
  // read when the engine is up (it loads asynchronously, so a pause set before then still counts)
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  variantRef.current = variant;
  // reduced motion: moves to a variant and draws its settled still frame (set once the engine is up)
  const stillRef = useRef<((next: NonNullable<FreshLLMProps['variant']>) => void) | null>(null);
  const s = holdInRange(scale, FRESH_RANGES.scale, 'FreshLLM', 'scale');
  // where the chat's parts are in this box: the elements pointed at, else flow 9's chat
  const anchorsRef = useRef<() => ChatAnchors>(() => flow9Anchors(1512 - 12, 982 - 54));
  anchorsRef.current = (): ChatAnchors => {
    const box = boxRef.current;
    if (!box) return flow9Anchors(1512 - 12, 982 - 54);
    const b = box.getBoundingClientRect();
    const k = b.width / Math.max(1, box.clientWidth) || 1; // (a scaled container: screen px -> this box's own)
    const fallback = flow9Anchors(box.clientWidth, box.clientHeight);
    const input = chatInputRef?.current?.getBoundingClientRect();
    const slot = thinkingRef?.current?.getBoundingClientRect();
    return {
      input: input
        ? [(input.left + input.width / 2 - b.left) / k, (input.top - b.top) / k]
        : fallback.input,
      thinking: slot
        ? [(slot.left + slot.width / 2 - b.left) / k, (slot.top + slot.height / 2 - b.top) / k]
        : fallback.thinking,
    };
  };

  useEffect(() => {
    let isMounted = true;
    void Promise.all([loadFreshEngine(), import('./comps')])
      .then(([createFreshEngine, comps]) => {
        const box = boxRef.current;
        if (!isMounted || !box) return;
        const doc = withRoom(mode === 'dark' ? comps.chatDark : comps.chatLight, ROOM);
        const setup = getChatSetup(doc);
        const stage = new FreshStage(box, createFreshEngine);
        stageRef.current = stage;
        // flow 9's chat comp is drawn at its own size (2x comp px = CSS px) x scale, from the panel's top-left; the pages are
        // placed in it
        const engine = stage.mount({
          doc,
          opts: { fit: 'fixed', scale: 0.5 * s, alpha: true, paused: true },
        });
        if (!engine || !setup) return; // no WebGL2: nothing drawn, the chat shows as it is
        const driver = new ChatDriver(setup, mode === 'dark');
        driverRef.current = driver;
        driver.setAnchors(anchorsRef.current(), s, ROOM);
        const now = performance.now();
        driver.think();
        if (variantRef.current === 'idle') driver.answer(now);
        if (stage.reducedMotion) {
          // reduced motion: one still frame of where it is (thinking, or the answer settled to idle); when the variant changes,
          // the new one, settled. The steps run on a clock of their own that only goes forward.
          const steps = variantRef.current === 'idle' ? 60 : 0;
          for (let i = 0; i < steps; i++) driver.step(engine.player, 0.25, now + i * 250, false);
          let clock = now + steps * 250;
          driver.step(engine.player, 0, clock);
          stillRef.current = (next) => {
            clock = Math.max(clock, performance.now());
            if (next === 'idle') driver.answer(clock);
            else driver.think();
            for (let i = 0; i < 60; i++) driver.step(engine.player, 0.25, clock + i * 250, false);
            clock += 60 * 250;
            driver.step(engine.player, 0, clock);
          };
          return;
        }
        stage.setDriver((eng, dt) => {
          driver.setAnchors(anchorsRef.current(), s, ROOM); // (every frame, as flow 9: the chat moves, it follows)
          driver.step(eng.player, dt, performance.now());
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
      driverRef.current = null;
      stillRef.current = null;
    };
    // variant and isPaused have their own effects; a new color scheme or scale starts it again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, s]);

  useEffect(() => {
    stageRef.current?.setPaused(isPaused);
  }, [isPaused]);

  useEffect(() => {
    if (stillRef.current) {
      stillRef.current(variant);
      return;
    }
    const driver = driverRef.current;
    if (!driver) return;
    if (variant === 'idle') driver.answer(performance.now());
    else driver.think();
  }, [variant]);

  // every change to the chat input's text is a keystroke (not the first value)
  const lastValue = useRef(inputValue);
  useEffect(() => {
    if (inputValue === lastValue.current) return;
    lastValue.current = inputValue;
    driverRef.current?.hit(performance.now() / 1000);
  }, [inputValue]);

  return (
    <div
      ref={boxRef}
      {...metaAttribute({ name: MetaConstants.FreshLLM, testID })}
      {...makeAccessible({ hidden: true })}
      style={{
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'none',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

export { FreshLLM };
