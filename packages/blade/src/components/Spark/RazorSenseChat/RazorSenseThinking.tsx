import React, { forwardRef, useContext, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { RazorSenseThinkingProps } from './types';
import type { ChatAnchors } from './chatDriver';
import { RazorSenseChatContext } from './chatContext';
import { SLOT_FROM_LABEL, THINKING_REACH, rectIn, thinkingSlot } from './placement';
import { useChatStage } from './useChatStage';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { stillStyle, useStill } from '../RazorSenseEngine/useStill';
import { useTheme } from '~components/BladeProvider';
import { makeSize } from '~utils/makeSize';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';

/** flow 9's thinking label: its blue, and the light running through it (the colours it was made in, light and dark) */
const LABEL_COLORS = {
  light: { base: '#2d52e6', shine: '#c9d4fb' },
  dark: { base: '#4f6ff0', shine: '#dce3ff' },
} as const;

/** thinking's still, for when it can't animate (its own module per color scheme, loaded only then) */
const loadThinkingStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/thinkingDark').then((m) => m.thinkingDark)
    : import('./stills/thinkingLight').then((m) => m.thinkingLight);

const shimmer = keyframes`
  0% { background-position: 100% 0; }
  18%, 100% { background-position: 0% 0; }
`;

const ThinkingLabel = styled.span<{ base: string; shine: string }>(({ theme, base, shine }) => {
  return css`
    display: inline-block;
    white-space: nowrap;
    font-family: ${theme.typography.fonts.family.text};
    font-weight: ${theme.typography.fonts.weight.regular};
    font-size: ${makeSize(theme.typography.fonts.size[200])};
    line-height: ${makeSize(22)};
    letter-spacing: -0.208px;
    color: transparent;
    background-image: linear-gradient(90deg, ${base} 38%, ${shine} 50%, ${base} 62%);
    background-size: 250% 100%;
    background-position: 0% 0;
    background-clip: text;
    animation: ${shimmer} 1.6s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `;
});

/**
 * RazorSenseThinking
 *
 * RazorSense thinking in a chat, as flow 9 plays it: its blue thinking label, with a shimmer running through it, and the glow
 * looping round it, behind it and past its edges. Put it where the assistant's reply will go. Like RazorSense, it follows Blade's
 * color scheme (BladeProvider). Paused off-screen.
 *
 * Inside a RazorSenseChat the chat draws its glow, so that when the answer is in, it surges down into the RazorSenseBottomWave
 * under the chat input.
 *
 * @example
 * ```tsx
 * <RazorSenseThinking>Searching your settlements…</RazorSenseThinking>
 * ```
 */
const RazorSenseThinking = forwardRef<HTMLDivElement, RazorSenseThinkingProps>(
  function RazorSenseThinking(
    {
      children = 'Thinking…',
      isPaused = false,
      scale = 1,
      onLoad,
      onError,
      className,
      style,
      testID,
    },
    forwardedRef,
  ) {
    const chat = useContext(RazorSenseChatContext);
    const { colorScheme } = useTheme();
    const mode = colorScheme === 'dark' ? 'dark' : 'light';
    const colors = LABEL_COLORS[mode];
    const labelRef = useRef<HTMLSpanElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const s = holdInRange(scale, FRESH_RANGES.scale, 'RazorSenseThinking', 'scale');

    // inside a RazorSenseChat: the chat draws thinking from this label
    useEffect(() => {
      if (!chat || !labelRef.current) return undefined;
      return chat.register('thinking', labelRef.current);
    }, [chat]);

    // on its own: its canvas reaches round the label, as far as thinking does
    const getAnchors = (): ChatAnchors => {
      const stage = stageRef.current;
      const r = stage && rectIn(labelRef.current, stage);
      const slot: [number, number] = r
        ? thinkingSlot(r)
        : [THINKING_REACH.left * s, THINKING_REACH.up * s];
      return { thinking: slot, input: slot };
    };
    const { isStill } = useChatStage({
      moduleName: 'RazorSenseThinking',
      isEnabled: !chat,
      stageRef,
      isThinking: true,
      getAnchors,
      scale: s,
      isPaused,
      onLoad,
      onError,
    });
    const still = useStill(!chat && isStill, mode, loadThinkingStill);

    return (
      <div
        ref={forwardedRef}
        className={className}
        {...metaAttribute({ name: MetaConstants.RazorSenseThinking, testID })}
        style={{ position: 'relative', isolation: 'isolate', contain: 'layout', ...style }}
      >
        {chat ? null : (
          <div
            ref={stageRef}
            {...makeAccessible({ hidden: true })}
            style={{
              position: 'absolute',
              zIndex: -1,
              left: `${SLOT_FROM_LABEL.x - THINKING_REACH.left * s}px`,
              top: `${SLOT_FROM_LABEL.y - THINKING_REACH.up * s}px`,
              width: `${(THINKING_REACH.left + THINKING_REACH.right) * s}px`,
              height: `${(THINKING_REACH.up + THINKING_REACH.down) * s}px`,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            {still ? <img src={still} alt="" style={stillStyle} /> : null}
          </div>
        )}
        <ThinkingLabel ref={labelRef} base={colors.base} shine={colors.shine}>
          {children}
        </ThinkingLabel>
      </div>
    );
  },
);

export { RazorSenseThinking };
