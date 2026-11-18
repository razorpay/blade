import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useReducedMotion } from 'framer-motion';
import styled, { css, keyframes } from 'styled-components';
import tinycolor from 'tinycolor2';
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
import { getStringFromReactText } from '~utils/getStringChildren';
import { makeTypographySize } from '~utils/makeTypographySize';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { logger } from '~utils/logger';

/**
 * The thinking label's blue is the theme's primary text colour (surface.text.primary.normal), so it follows the theme and passes
 * contrast in both color schemes (flow 9's own dark blue was 4.3:1 on the dark page, under 4.5: the PR review). The light running
 * through it is that blue lifted toward white by this much (%), near flow 9's.
 */
const SHINE_LIFT = { light: 78, dark: 72 } as const;

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
      /* a long loading text wraps in a narrow message, as ChatMessage's own did */
      white-space: normal;
      font-family: ${theme.typography.fonts.family.text};
      font-weight: ${theme.typography.fonts.weight.regular};
      font-size: ${makeTypographySize(theme.typography.fonts.size[200])};
      line-height: ${makeTypographySize(theme.typography.lineHeights[200])};
      letter-spacing: ${makeLetterSpacing(
        theme.typography.letterSpacings[50],
        theme.typography.fonts.size[200],
      )};
      color: transparent;
      /* (as RollingText's shimmer: older Safari fills the text with this, not color) */
      -webkit-text-fill-color: transparent;
      background-image: linear-gradient(90deg, ${base} 38%, ${shine} 50%, ${base} 62%);
      background-size: 250% 100%;
      background-position: 0% 0;
      /* (styled-components adds -webkit-background-clip, which older Safari needs to clip) */
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
      texts,
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
    // texts roll in children's place: both given, say so (children isn't shown)
    const hasBoth = Boolean(texts?.length) && props.children !== undefined;
    useEffect(() => {
      if (!__DEV__ || !hasBoth) return;
      logger({
        type: 'warn',
        moduleName: 'RazorSenseThinking',
        message:
          "Both children and texts are set: texts roll in children's place, so children isn't shown. Pass one: children for one label, texts for several.",
      });
    }, [hasBoth]);
    const { theme, colorScheme } = useTheme();
    const mode = colorScheme === 'dark' ? 'dark' : 'light';
    const base = theme.colors.surface.text.primary.normal;
    const colors = {
      base,
      shine: tinycolor
        .mix(base, theme.colors.surface.text.staticWhite.normal, SHINE_LIFT[mode])
        .toHexString(),
    };
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
    // (in a chat, the chat's pause: its own doesn't apply there)
    const isLabelPaused = chat ? chat.isPaused : isPaused;
    const label = (text: string | undefined): React.ReactElement => (
      <ThinkingLabel base={colors.base} shine={colors.shine} isPaused={isLabelPaused}>
        {text}
      </ThinkingLabel>
    );

    // texts roll (RollingText), held on the one shown while paused or with reduced motion, and rolling on from it after (the roll
    // restarts from the held one, `start`). The one shown is kept with the texts it's of: new texts start from their first.
    const prefersReducedMotion = useReducedMotion();
    const isRolling = Boolean(texts && texts.length > 1);
    const isHeld = isLabelPaused || Boolean(prefersReducedMotion);
    const textsKey = texts?.join('\0') ?? '';
    const shownRef = useRef({ key: textsKey, index: 0 });
    const shownIndex = (): number =>
      shownRef.current.key === textsKey ? shownRef.current.index : 0;
    const [start, setStart] = useState({ key: textsKey, index: 0 });
    const startIndex = start.key === textsKey ? start.index : 0;
    useEffect(() => {
      if (isHeld) setStart({ key: textsKey, index: shownIndex() });
      // (on holding, and on new texts while held)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHeld, textsKey]);
    const rolled = useMemo(
      () => (texts ? [...texts.slice(startIndex), ...texts.slice(0, startIndex)] : []),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [textsKey, startIndex],
    );
    const onRolled = useCallback(
      (index: number): void => {
        shownRef.current = {
          key: textsKey,
          index: (startIndex + index) % Math.max(1, rolled.length),
        };
      },
      [textsKey, startIndex, rolled.length],
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
        {/* a status: a screen reader hears the label as it shows, and each phrase as it rolls in (every few seconds; held with
        reduced motion or paused), only what's new (a rolling phrase going out isn't read again) */}
        <span
          ref={labelRef}
          {...makeAccessible({ role: 'status', liveRegion: 'polite', atomic: false })}
          style={{ display: 'inline-block' }}
        >
          {isRolling && isHeld ? (
            label(texts?.[shownIndex()])
          ) : isRolling ? (
            <RollingText texts={rolled} onIndexChange={onRolled}>
              {label}
            </RollingText>
          ) : (
            label(texts?.[0] ?? getStringFromReactText(children))
          )}
        </span>
      </div>
    );
  },
);

export { RazorSenseThinking };
