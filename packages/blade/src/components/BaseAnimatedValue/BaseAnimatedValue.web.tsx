import React from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
// Blade's own `MotionVariantsType` narrows out the dynamic, `custom`-resolved form of a
// variant, which is the whole mechanism the exit direction relies on below.
import type { Variants } from 'framer-motion';
import type { BaseAnimatedValueProps, AnimatedValueDirection } from './types';
import { MotionDiv } from '~components/BaseMotion';
import { castWebType, useTheme } from '~utils';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { msToSeconds } from '~utils/msToSeconds';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

/** How far content travels as it swaps, in px. Short enough to read as a nudge, not a scroll. */
const TRAVEL = 8;

/**
 * `Number` is too permissive on its own: it reads an empty or blank string as 0, which would
 * make `"" -> "5"` look like a numeric increase rather than the text swap it is.
 */
const toNumber = (value: string | number): number => {
  if (typeof value === 'number') return value;
  return value.trim() === '' ? NaN : Number(value);
};

const getDirection = (
  previous: string | number | undefined,
  current: string | number,
): AnimatedValueDirection => {
  if (previous === undefined) return 'none';
  const from = toNumber(previous);
  const to = toNumber(current);
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === to) return 'none';
  return to > from ? 'up' : 'down';
};

/**
 * Both copies share one grid cell, so the one on its way out cannot push the layout around
 * while it leaves, and the box sizes to whichever of the two is wider.
 *
 * A span rather than a div: this renders inside `Text`, which is a `<p>`, and a block element
 * there is invalid HTML that the parser hoists out, breaking hydration.
 *
 * Deliberately not clipped to its own box. `overflow: hidden` here would give the travel a
 * window to roll behind, but on an inline box it also cuts the glyphs off at rest. The fade
 * runs over the same duration as the travel, so a copy is already invisible by the time it is
 * far enough out to need hiding.
 */
const Stack = styled.span`
  display: inline-grid;

  > * {
    grid-area: 1 / 1;
  }
`;

/**
 * Animates a change of content: the outgoing value leaves and the incoming one arrives from
 * the opposite side, so a rising number reads as rising.
 *
 * Private on purpose. It is general enough to move beyond its first consumer, but it should
 * earn a public API on the back of a second one rather than ahead of it.
 *
 * Presentational only: it renders whatever it is given and takes no view on how that content
 * is announced. During a swap both copies are briefly in the DOM, so a consumer that needs
 * this read out should own the accessible name itself and keep this subtree hidden from
 * assistive technology. `SliderInput` does exactly that, announcing through `aria-valuetext`.
 */
const BaseAnimatedValue = ({
  value,
  children,
  direction,
  duration = 'xquick',
  testID,
}: BaseAnimatedValueProps): React.ReactElement => {
  const { theme } = useTheme();
  const motionDuration = msToSeconds(theme.motion.duration[duration]);

  // Tracks the value the current content is replacing, so the travel has a direction.
  const previousValue = React.useRef<string | number | undefined>(undefined);
  const resolvedDirection = direction ?? getDirection(previousValue.current, value);
  React.useEffect(() => {
    previousValue.current = value;
  }, [value]);

  /**
   * Which way, and whether at all: +1 rises, -1 falls, 0 cross-fades in place.
   *
   * Going up, the new value rises into place from below and the old one leaves through the top.
   */
  const travel =
    resolvedDirection === 'none' ? 0 : TRAVEL * (resolvedDirection === 'down' ? -1 : 1);

  /**
   * Dynamic rather than plain objects so the exit can be told which way the value went.
   *
   * `AnimatePresence` keeps the outgoing element rendered from the previous tree, so it holds
   * whatever variants it was last given — the direction of the change that brought it *in*.
   * On a reversal that is backwards: the old value would leave upwards while the new one
   * arrives from above. Framer resolves these functions against the `custom` on
   * `AnimatePresence`, which is current, so both halves agree on the direction.
   */
  const variants: Variants = {
    initial: (distance: number) => ({ opacity: 0, y: distance }),
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionDuration,
        ease: cssBezierToArray(castWebType(theme.motion.easing.entrance)),
      },
    },
    exit: (distance: number) => ({
      opacity: 0,
      y: -distance,
      transition: {
        duration: motionDuration,
        ease: cssBezierToArray(castWebType(theme.motion.easing.exit)),
      },
    }),
  };

  return (
    <Stack {...metaAttribute({ name: MetaConstants.AnimatedValue, testID })}>
      {/* `initial={false}` so the very first render lands without animating in from nowhere. */}
      <AnimatePresence initial={false} custom={travel}>
        <MotionDiv
          key={String(value)}
          // Inline for the same reason as the wrapper above.
          as="span"
          display="inline-block"
          custom={travel}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children ?? value}
        </MotionDiv>
      </AnimatePresence>
    </Stack>
  );
};

export { BaseAnimatedValue };
