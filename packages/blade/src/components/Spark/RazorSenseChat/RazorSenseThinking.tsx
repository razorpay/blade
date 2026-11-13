import React, { forwardRef, useContext, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { RazorSenseThinkingProps } from './types';
import type { ChatAnchors } from './chatDriver';
import { RazorSenseChatContext } from './chatContext';
import { SLOT_FROM_LABEL, THINKING_REACH, rectIn, thinkingSlot } from './placement';
import { useChatOwnedPropsWarning } from './useChatOwnedPropsWarning';
import { useChatStage } from './useChatStage';
import { FRESH_RANGES, holdInRange } from '../RazorSenseEngine/freshRanges';
import { placeSpill, watchSpill } from '../RazorSenseEngine/spillClip';
import { stillStyle, useStill } from '../RazorSenseEngine/useStill';
import { useTheme } from '~components/BladeProvider';
import { RollingText } from '~components/RollingText';
import { makeLetterSpacing } from '~utils/makeLetterSpacing';
import { makeTypographySize } from '~utils/makeTypographySize';
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

const ThinkingLabel = styled.span<{ base: string; shine: string; isPaused: boolean }>(
  ({ theme, base, shine, isPaused }) => {
    return css`
      display: inline-block;
      white-space: nowrap;
      font-family: ${theme.typography.fonts.family.text};
      font-weight: ${theme.typography.fonts.weight.regular};
      font-size: ${makeTypographySize(theme.typography.fonts.size[200])};
      /* flow 9's 22 px: no line-height token has it, so it's sized as the tokens are, in rem */
      line-height: ${makeTypographySize(22)};
      letter-spacing: ${makeLetterSpacing(
        theme.typography.letterSpacings[50],
        theme.typography.fonts.size[200],
      )};
      color: transparent;
      background-image: linear-gradient(90deg, ${base} 38%, ${shine} 50%, ${base} 62%);
      background-size: 250% 100%;
      background-position: 0% 0;
      background-clip: text;
      animation: ${shimmer} 1.6s linear infinite;
      animation-play-state: ${isPaused ? 'paused' : 'running'};

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `;
  },
);

/**
 * RazorSenseThinking
 *
 * RazorSense thinking in a chat, as flow 9 plays it: its blue thinking label, with a shimmer running through it, and the glow
 * looping round it, behind it and past its edges. Put it where the assistant's reply will go. Like RazorSense, it follows Blade's
 * color scheme (BladeProvider). Paused off-screen.
 *
 * Inside a RazorSenseChat the chat draws its glow, so that when the answer is in, it surges down into the RazorSenseBottomWave
 * under the chat input. There its own `scale`, `isPaused`, `onLoad` and `onError` don't apply (the chat's do; it warns in
 * development).
 *
 * @example
 * ```tsx
 * <RazorSenseThinking>Searching your settlements…</RazorSenseThinking>
 * ```
 */
const RazorSenseThinking = forwardRef<HTMLDivElement, RazorSenseThinkingProps>(
  function RazorSenseThinking(props, forwardedRef) {
    const {
      children = 'Thinking…',
      isPaused = false,
      scale = 1,
      onLoad,
      onError,
      className,
      style,
      testID,
    } = props;
    const chat = useContext(RazorSenseChatContext);
    useChatOwnedPropsWarning('RazorSenseThinking', Boolean(chat), props);
    const { colorScheme } = useTheme();
    const mode = colorScheme === 'dark' ? 'dark' : 'light';
    const colors = LABEL_COLORS[mode];
    // the label's box: where thinking is drawn from (it holds the rolling labels, so it stays put as they change)
    const labelRef = useRef<HTMLSpanElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const s = holdInRange(scale, FRESH_RANGES.scale, 'RazorSenseThinking', 'scale');

    // inside a RazorSenseChat: the chat draws thinking from this label, and thinks while it's shown (registered once: the chat's
    // register doesn't change)
    const register = chat?.register;
    useEffect(() => {
      if (!register || !labelRef.current) return undefined;
      return register('thinking', labelRef.current);
    }, [register]);

    // where its spill would grow the page (Firefox), its canvas is cut to what the page already holds
    useEffect(() => {
      const stage = stageRef.current;
      if (chat || !stage) return undefined;
      return watchSpill(stage, () => {
        placeSpill(stage, {
          left: SLOT_FROM_LABEL.x - THINKING_REACH.left * s,
          top: SLOT_FROM_LABEL.y - THINKING_REACH.up * s,
          width: (THINKING_REACH.left + THINKING_REACH.right) * s,
          height: (THINKING_REACH.up + THINKING_REACH.down) * s,
        });
      });
    }, [chat, s]);

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
    const label = (text: string): React.ReactElement => (
      <ThinkingLabel
        base={colors.base}
        shine={colors.shine}
        // (in a chat, the chat's pause: its own doesn't apply there)
        isPaused={chat ? chat.isPaused : isPaused}
      >
        {text}
      </ThinkingLabel>
    );

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
        <span ref={labelRef} style={{ display: 'inline-block' }}>
          {Array.isArray(children) && children.length > 1 ? (
            <RollingText texts={children}>{label}</RollingText>
          ) : (
            label(Array.isArray(children) ? children[0] ?? '' : children)
          )}
        </span>
      </div>
    );
  },
);

export { RazorSenseThinking };
