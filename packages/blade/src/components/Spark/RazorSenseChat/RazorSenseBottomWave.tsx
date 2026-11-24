import React, { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import type { RazorSenseBottomWaveProps } from './types';
import type { ChatAnchors } from './chatDriver';
import { RazorSenseChatContext } from './chatContext';
import { BOTTOM_WAVE_REACH, OUTCOME_REACH_UP, WAVE_PIXELS, inputAnchor, rectIn } from './placement';
import { useChatOwnedPropsWarning } from './useChatOwnedPropsWarning';
import { useChatStage } from './useChatStage';
import { useStateStill } from './useStateStill';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { placeSpill, watchSpill } from '../RazorSenseEngine/spillClip';
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
 * answer is in. There its own `scale`, `isPaused`, `onLoad` and `onError` don't apply (the chat's do; it warns in development).
 *
 * Not RazorSense's `preset="bottomWave"`: that one is a static image, a decorative strip. This is the animated wave under a
 * chat input.
 *
 * @example
 * ```tsx
 * <RazorSenseBottomWave>
 *   <ChatInput placeholder="Ask anything..." value={text} onChange={({ value }) => setText(value ?? '')} />
 * </RazorSenseBottomWave>
 * ```
 */
const RazorSenseBottomWave = forwardRef<HTMLDivElement, RazorSenseBottomWaveProps>(
  function RazorSenseBottomWave(props, forwardedRef) {
    const {
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
      outcome,
    } = props;
    const chat = useContext(RazorSenseChatContext);
    useChatOwnedPropsWarning('RazorSenseBottomWave', Boolean(chat), props);
    const mode = useTheme().colorScheme === 'dark' ? 'dark' : 'light';
    const boxRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(forwardedRef, boxRef);
    const stageRef = useRef<HTMLDivElement>(null);
    const s = holdInRange(scale, FRESH_RANGES.scale, 'RazorSenseBottomWave', 'scale');
    // on its own its canvas reaches 150 px above the input and 700 to each side, as far as the wave does; while an outcome plays, as
    // far as its splash: the window's sides and top, as in flow 10.5 (and back after, so its GPU memory at rest is as it was)
    const [reach, setReach] = useState<{ up: number; side: number } | null>(null);
    const up = reach ? reach.up : BOTTOM_WAVE_REACH.up * s;
    const side = reach ? reach.side : BOTTOM_WAVE_REACH.side * s;
    const onOutcome = (isPlaying: boolean): void => {
      const box = boxRef.current;
      if (!isPlaying || !box) {
        setReach(null);
        return;
      }
      const r = box.getBoundingClientRect();
      const middle = r.left + r.width / 2;
      setReach({
        up: Math.max(OUTCOME_REACH_UP * s, r.bottom),
        side: Math.max(BOTTOM_WAVE_REACH.side * s, middle, window.innerWidth - middle),
      });
    };

    // inside a RazorSenseChat: the chat draws the wave here (registered once: the chat's register doesn't change)
    const register = chat?.register;
    useEffect(() => {
      if (!register || !boxRef.current) return undefined;
      return register('bottomWave', boxRef.current);
    }, [register]);

    // where its spill would grow the page (Firefox), its canvas is cut to what the page already holds
    useEffect(() => {
      const stage = stageRef.current;
      const box = boxRef.current;
      if (chat || !stage || !box) return undefined;
      return watchSpill(stage, () => {
        placeSpill(stage, {
          left: box.clientWidth / 2 - side,
          top: box.clientHeight - up,
          width: side * 2,
          height: up + BOTTOM_WAVE_REACH.down * s,
        });
      });
    }, [chat, s, up, side]);

    // on its own: its canvas reaches round the input, as far as the wave does
    const getAnchors = (): ChatAnchors => {
      const stage = stageRef.current;
      const r = stage && rectIn(boxRef.current, stage);
      // (offline, the strip drops below the window's bottom edge; the voice look's row is as wide as the chat input)
      const bar = r ? { top: r.top, width: r.width, height: r.height } : undefined;
      const leaveAt = stage ? window.innerHeight - stage.getBoundingClientRect().top : undefined;
      const input = r
        ? inputAnchor(r, s)
        : inputAnchor(
            {
              left: 0,
              top: 0,
              width: side * 2,
              height: up,
            },
            s,
          );
      return { thinking: input, input, bar, leaveAt };
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
      isOffline,
      isListening,
      voiceStream,
      outcome,
      onOutcome,
      layoutKey: `${up} ${side}`,
      maxPixels: WAVE_PIXELS,
    });
    const still = useStill(!chat && isStill, mode, loadBottomWaveStill);
    // (listening, or an outcome: its own still in its place)
    const stateStill = useStateStill(
      !chat && isStill,
      mode,
      isListening && !isOffline,
      outcome,
      !isOffline && !isListening,
    );

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
        style={{ position: 'relative', isolation: 'isolate', ...style }}
      >
        {chat ? null : (
          <div
            {...makeAccessible({ hidden: true })}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: -1,
              pointerEvents: 'none',
              // the wave reaches below what it wraps: layout containment on this layer keeps that from growing the page (drawn,
              // not counted for scrolling). Not on the root, which wraps the chat input: containment would anchor the input's own
              // fixed or absolute overlays (a mention list, a menu) to it
              contain: 'layout',
            }}
          >
            <div
              ref={stageRef}
              style={{
                position: 'absolute',
                left: `calc(50% - ${side}px)`,
                top: `calc(100% - ${up}px)`,
                width: `${side * 2}px`,
                height: `${up + BOTTOM_WAVE_REACH.down * s}px`,
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
            >
              {still ? (
                <img
                  src={stateStill ?? still}
                  alt=""
                  // (offline: it goes, as the strip drops)
                  style={{ ...stillStyle, opacity: isOffline ? 0 : 1, transition: 'opacity 1.2s' }}
                />
              ) : null}
            </div>
          </div>
        )}
        {children}
      </div>
    );
  },
);

export { RazorSenseBottomWave };
