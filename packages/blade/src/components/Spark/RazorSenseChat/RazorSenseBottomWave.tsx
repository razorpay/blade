import React, { forwardRef, useContext, useEffect, useRef } from 'react';
import type { RazorSenseBottomWaveProps } from './types';
import type { ChatAnchors } from './chatDriver';
import { RazorSenseChatContext } from './chatContext';
import { BOTTOM_WAVE_REACH, inputAnchor, rectIn } from './placement';
import { useChatStage } from './useChatStage';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { stillStyle, useStill } from '../RazorSenseEngine/useStill';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { useMergeRefs } from '~utils/useMergeRefs';

/** the bottom wave's still, for when it can't animate (its own module per color scheme, loaded only then) */
const loadBottomWaveStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/bottomWaveDark').then((m) => m.bottomWaveDark)
    : import('./stills/bottomWaveLight').then((m) => m.bottomWaveLight);

/**
 * RazorSenseBottomWave
 *
 * RazorSense under a chat input, as flow 9 settles it after an answer: wrap the chat input and a faint wave sits under it,
 * drifting, and pulses up into its typing surge as the next question is typed. Like RazorSense, it follows Blade's color scheme
 * (BladeProvider). Paused off-screen.
 *
 * Inside a RazorSenseChat it marks where the wave settles and the chat draws it, so the thinking surges down into it when the
 * answer is in.
 *
 * @example
 * ```tsx
 * <RazorSenseBottomWave>
 *   <ChatInput placeholder="Ask anything..." value={text} onChange={({ value }) => setText(value ?? '')} />
 * </RazorSenseBottomWave>
 * ```
 */
const RazorSenseBottomWave = forwardRef<HTMLDivElement, RazorSenseBottomWaveProps>(
  function RazorSenseBottomWave(
    { children, isPaused = false, scale = 1, onLoad, onError, className, style, testID },
    forwardedRef,
  ) {
    const chat = useContext(RazorSenseChatContext);
    const mode = useTheme().colorScheme === 'dark' ? 'dark' : 'light';
    const boxRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(forwardedRef, boxRef);
    const stageRef = useRef<HTMLDivElement>(null);
    const s = holdInRange(scale, FRESH_RANGES.scale, 'RazorSenseBottomWave', 'scale');

    // inside a RazorSenseChat: the chat draws the wave here
    useEffect(() => {
      if (!chat || !boxRef.current) return undefined;
      return chat.register('bottomWave', boxRef.current);
    }, [chat]);

    // on its own: its canvas reaches round the input, as far as the wave does
    const getAnchors = (): ChatAnchors => {
      const stage = stageRef.current;
      const r = stage && rectIn(boxRef.current, stage);
      const input = r
        ? inputAnchor(r, s)
        : inputAnchor(
            {
              left: 0,
              top: 0,
              width: BOTTOM_WAVE_REACH.side * 2 * s,
              height: BOTTOM_WAVE_REACH.up * s,
            },
            s,
          );
      return { thinking: input, input };
    };
    const { keystroke, isStill } = useChatStage({
      moduleName: 'RazorSenseBottomWave',
      isEnabled: !chat,
      stageRef,
      isThinking: false,
      getAnchors,
      scale: s,
      isPaused,
      onLoad,
      onError,
    });
    const still = useStill(!chat && isStill, mode, loadBottomWaveStill);

    // each edit typed in the chat input inside (any input, textarea or editable element) is a keystroke
    useEffect(() => {
      const box = boxRef.current;
      if (!box) return undefined;
      const onInput = (): void => (chat ? chat.keystroke() : keystroke());
      box.addEventListener('input', onInput);
      return () => box.removeEventListener('input', onInput);
    }, [chat, keystroke]);

    return (
      <div
        ref={mergedRef}
        className={className}
        {...metaAttribute({ name: MetaConstants.RazorSenseBottomWave, testID })}
        style={{ position: 'relative', isolation: 'isolate', contain: 'layout', ...style }}
      >
        {chat ? null : (
          <div
            ref={stageRef}
            {...makeAccessible({ hidden: true })}
            style={{
              position: 'absolute',
              zIndex: -1,
              left: `calc(50% - ${BOTTOM_WAVE_REACH.side * s}px)`,
              top: `calc(100% - ${BOTTOM_WAVE_REACH.up * s}px)`,
              width: `${BOTTOM_WAVE_REACH.side * 2 * s}px`,
              height: `${(BOTTOM_WAVE_REACH.up + BOTTOM_WAVE_REACH.down) * s}px`,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            {still ? <img src={still} alt="" style={stillStyle} /> : null}
          </div>
        )}
        {children}
      </div>
    );
  },
);

export { RazorSenseBottomWave };
