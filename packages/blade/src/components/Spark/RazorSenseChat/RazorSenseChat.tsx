import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RazorSenseChatProps } from './types';
import { flow9Anchors } from './chatDriver';
import type { ChatAnchors } from './chatDriver';
import { RazorSenseChatContext } from './chatContext';
import type { ChatPart, RazorSenseChatContextValue } from './chatContext';
import {
  BOTTOM_WAVE_REACH,
  THINKING_REACH,
  bottomWaveFrame,
  inputAnchor,
  rectIn,
  thinkingFrame,
  thinkingSlot,
} from './placement';
import { RazorSenseThinking } from './RazorSenseThinking';
import { useChatStage } from './useChatStage';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { useStill } from '../RazorSenseEngine/useStill';
import { watchLayout } from '../RazorSenseEngine/watchLayout';
import { useTheme } from '~components/BladeProvider';
import { logger } from '~utils/logger';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';

/** its stills, for when it can't animate (each its own module per color scheme, loaded only then) */
const loadThinkingStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/thinkingDark').then((m) => m.thinkingDark)
    : import('./stills/thinkingLight').then((m) => m.thinkingLight);
const loadBottomWaveStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/bottomWaveDark').then((m) => m.bottomWaveDark)
    : import('./stills/bottomWaveLight').then((m) => m.bottomWaveLight);

/**
 * RazorSenseChat
 *
 * RazorSense through a chat, as flow 9 plays it: thinking loops on the thinking row while the answer is worked out, surges down
 * to the chat input when it's in, and settles there as the bottom wave, pulsing as the next question is typed. Wrap the chat
 * panel; inside it, show a RazorSenseThinking where the reply will go while the answer is worked out, and wrap the chat input in
 * RazorSenseBottomWave. It thinks while the RazorSenseThinking is shown; when that goes (the answer takes its place), the thinking
 * surges down into the bottom wave, and a RazorSenseThinking shown again for the next question brings it back up. It draws them
 * both on one canvas over its whole box, behind everything in it, so the surge runs from one to the other. Like RazorSense, it
 * follows Blade's color scheme (BladeProvider). Paused off-screen.
 *
 * @example
 * ```tsx
 * <RazorSenseChat>
 *   {messages}
 *   {isWaitingForAnswer ? <RazorSenseThinking>Searching your settlements…</RazorSenseThinking> : null}
 *   <RazorSenseBottomWave>
 *     <ChatInput value={text} onChange={({ value }) => setText(value ?? '')} />
 *   </RazorSenseBottomWave>
 * </RazorSenseChat>
 * ```
 */
const RazorSenseChat = forwardRef<HTMLDivElement, RazorSenseChatProps>(function RazorSenseChat(
  {
    children,
    isPaused = false,
    scale = 1,
    width = '100%',
    height = '100%',
    onLoad,
    onError,
    className,
    style,
    testID,
  },
  forwardedRef,
) {
  const mode = useTheme().colorScheme === 'dark' ? 'dark' : 'light';
  const stageRef = useRef<HTMLDivElement>(null);
  const thinkingStillRef = useRef<HTMLImageElement>(null);
  const bottomWaveStillRef = useRef<HTMLImageElement>(null);
  const partsRef = useRef<Record<ChatPart, HTMLElement | null>>({
    thinking: null,
    bottomWave: null,
  });
  // thinking while a RazorSenseThinking is shown in it; when that goes (the answer takes its place), the surge
  const [isThinking, setIsThinking] = useState(false);
  // where they were last seen: the surge still runs from the thinking row once it's gone (the answer took its place)
  const lastRef = useRef<ChatAnchors | null>(null);
  const s = holdInRange(scale, FRESH_RANGES.scale, 'RazorSenseChat', 'scale');

  const getAnchors = (): ChatAnchors => {
    const stage = stageRef.current;
    if (!stage) return lastRef.current ?? flow9Anchors(1512 - 12, 982 - 54);
    const fallback = lastRef.current ?? flow9Anchors(stage.clientWidth, stage.clientHeight);
    const thinking = rectIn(partsRef.current.thinking, stage);
    const bottomWave = rectIn(partsRef.current.bottomWave, stage);
    const anchors: ChatAnchors = {
      thinking: thinking ? thinkingSlot(thinking) : fallback.thinking,
      input: bottomWave ? inputAnchor(bottomWave, s) : fallback.input,
    };
    lastRef.current = anchors;
    return anchors;
  };
  const { keystroke, isStill } = useChatStage({
    moduleName: 'RazorSenseChat',
    isEnabled: true,
    stageRef,
    isThinking,
    getAnchors,
    scale: s,
    isPaused,
    onLoad,
    onError,
  });
  const thinkingStill = useStill(isStill, mode, loadThinkingStill);
  const bottomWaveStill = useStill(isStill, mode, loadBottomWaveStill);

  // its stills follow the thinking label and the chat input, as the animation does (and cross-fade, for the surge). They're
  // placed again only when something may have moved them (paused, they're placed once and stay there)
  const getAnchorsRef = useRef(getAnchors);
  getAnchorsRef.current = getAnchors;
  useEffect(() => {
    const stage = stageRef.current;
    const root = stage?.parentElement;
    if (!isStill || !stage || !root) return undefined;
    const place = (): void => {
      const anchors = getAnchorsRef.current();
      const [tx, ty] = thinkingFrame(anchors.thinking, s);
      const [bx, by] = bottomWaveFrame(anchors.input, s);
      if (thinkingStillRef.current) {
        thinkingStillRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
      }
      if (bottomWaveStillRef.current) {
        bottomWaveStillRef.current.style.transform = `translate(${bx}px, ${by}px)`;
      }
    };
    place();
    if (isPaused) return undefined;
    return watchLayout({
      root,
      getParts: () => [stage, partsRef.current.thinking, partsRef.current.bottomWave],
      // (its own stills moving don't count)
      ignore: (node) => node === thinkingStillRef.current || node === bottomWaveStillRef.current,
      onChange: place,
    });
  }, [isStill, s, isPaused]);

  // (stable: a part registers once, not again on every change of the chat's props)
  const register = useCallback<RazorSenseChatContextValue['register']>((part, element) => {
    partsRef.current[part] = element;
    if (part === 'thinking') setIsThinking(true);
    return () => {
      if (partsRef.current[part] !== element) return;
      partsRef.current[part] = null;
      if (part === 'thinking') setIsThinking(false);
    };
  }, []);
  const context = useMemo<RazorSenseChatContextValue>(
    () => ({ register, keystroke, isPaused, Thinking: RazorSenseThinking }),
    [register, keystroke, isPaused],
  );

  // without its parts it lines up with flow 9's own chat: say so, it's rarely what's meant (the parts register first: their
  // effects run before this one)
  useEffect(() => {
    if (__DEV__ && !partsRef.current.bottomWave) {
      logger({
        type: 'warn',
        moduleName: 'RazorSenseChat',
        message:
          "There's no RazorSenseBottomWave inside: the wave settles where flow 9's chat input was, not under yours. Wrap your chat input in RazorSenseBottomWave.",
      });
    }
  }, []);

  return (
    <RazorSenseChatContext.Provider value={context}>
      <div
        ref={forwardedRef}
        className={className}
        {...metaAttribute({ name: MetaConstants.RazorSenseChat, testID })}
        style={{
          position: 'relative',
          isolation: 'isolate',
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
      >
        <div
          ref={stageRef}
          {...makeAccessible({ hidden: true })}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {thinkingStill ? (
            <img
              ref={thinkingStillRef}
              src={thinkingStill}
              alt=""
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: `${(THINKING_REACH.left + THINKING_REACH.right) * s}px`,
                height: `${(THINKING_REACH.up + THINKING_REACH.down) * s}px`,
                opacity: isThinking ? 1 : 0,
                transition: 'opacity 0.6s',
              }}
            />
          ) : null}
          {bottomWaveStill ? (
            <img
              ref={bottomWaveStillRef}
              src={bottomWaveStill}
              alt=""
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: `${BOTTOM_WAVE_REACH.side * 2 * s}px`,
                height: `${(BOTTOM_WAVE_REACH.up + BOTTOM_WAVE_REACH.down) * s}px`,
                opacity: isThinking ? 0 : 1,
                transition: 'opacity 0.6s',
              }}
            />
          ) : null}
        </div>
        {children}
      </div>
    </RazorSenseChatContext.Provider>
  );
});

export { RazorSenseChat };
