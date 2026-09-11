import React from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
// Blade's own `MotionVariantsType` narrows out the dynamic, `custom`-resolved form of a
// variant, which is the whole mechanism the exit direction relies on below.
import type { Variants } from 'framer-motion';
import type { BaseAnimatedValueProps, AnimatedValueDirection } from './types';
import { OdometerValue } from './OdometerValue';
import { parseNumericText } from './odometerUtils';
import { MotionDiv } from '~components/BaseMotion';
import { castWebType, useTheme } from '~utils';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { msToSeconds } from '~utils/msToSeconds';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

/**
 * How far content travels as it swaps, in px.
 *
 * Far enough that the swap reads as movement rather than a flicker. The fade runs over the
 * same duration, so a copy is already invisible by the time it is this far out.
 */
const TRAVEL = 12;

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
 * Replaces the whole content, moving it in the direction the value went.
 *
 * Used for anything the odometer cannot roll — words, or a value with no digits in it. Only
 * isolated changes animate: content that changes again before the previous swap has finished
 * is written straight into place, because a swap has to complete before the next can start and
 * stacking them leaves a pile of half-faded copies that never resolves into anything readable.
 */
const SwappedValue = ({
  value,
  children,
  direction,
  durationMs,
}: {
  value: string | number;
  children: React.ReactNode;
  direction?: AnimatedValueDirection;
  durationMs: number;
}): React.ReactElement => {
  const { theme } = useTheme();

  /**
   * `key` is what drives the swap, so holding it still is how a change is written in place
   * rather than animated. `at` is when the content last changed at all, animated or not, which
   * is what keeps a continuous stream of changes from ever looking isolated.
   */
  const [swap, setSwap] = React.useState(() => ({
    key: String(value),
    shown: value,
    from: undefined as string | number | undefined,
    at: 0,
  }));

  if (swap.shown !== value) {
    const now = Date.now();
    const isIsolated = now - swap.at >= durationMs;
    setSwap({
      // Timestamped so the same value returning still counts as a change worth animating.
      key: isIsolated ? `${value}-${now}` : swap.key,
      shown: value,
      from: isIsolated ? swap.shown : undefined,
      at: now,
    });
  }

  const resolvedDirection =
    direction ?? (swap.from === undefined ? 'none' : getDirection(swap.from, value));

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
        duration: msToSeconds(durationMs),
        ease: cssBezierToArray(castWebType(theme.motion.easing.entrance)),
      },
    },
    exit: (distance: number) => ({
      opacity: 0,
      y: -distance,
      transition: {
        duration: msToSeconds(durationMs),
        ease: cssBezierToArray(castWebType(theme.motion.easing.exit)),
      },
    }),
  };

  return (
    // `initial={false}` so the very first render lands without animating in from nowhere.
    <AnimatePresence initial={false} custom={travel}>
      <MotionDiv
        key={swap.key}
        // Inline for the same reason as the wrapper above.
        as="span"
        display="inline-block"
        custom={travel}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </MotionDiv>
    </AnimatePresence>
  );
};

/**
 * Animates a change of content.
 *
 * Numbers roll their digits, driven continuously from the value itself, so they keep animating
 * however fast the value moves — a slider being dragged included. Anything without a digit in
 * it, a word or a label, swaps as a whole instead, travelling in the direction the value went.
 *
 * Private on purpose. It is general enough to move beyond its first consumer, but it should
 * earn a public API on the back of a second one rather than ahead of it.
 *
 * Presentational only: it renders whatever it is given and takes no view on how that content
 * is announced. A rolling number is a column of every digit, so a consumer that needs this read
 * out should own the accessible name itself and keep this subtree hidden from assistive
 * technology. `SliderInput` does exactly that, announcing through `aria-valuetext`.
 */
const BaseAnimatedValue = ({
  value,
  children,
  direction,
  duration = 'moderate',
  testID,
}: BaseAnimatedValueProps): React.ReactElement => {
  const { theme } = useTheme();
  const durationMs = theme.motion.duration[duration];

  /*
   * The odometer works off the text, since that is what it has to keep consistent — the number
   * driving the columns is the one the text spells out, not the value it was formatted from.
   * Children that are not plain text could be anything, so those swap instead.
   */
  const content = children ?? value;
  const parsed =
    typeof content === 'string' || typeof content === 'number'
      ? parseNumericText(String(content))
      : null;

  return (
    <Stack {...metaAttribute({ name: MetaConstants.AnimatedValue, testID })}>
      {parsed ? (
        <OdometerValue text={String(content)} parsed={parsed} durationMs={durationMs} />
      ) : (
        <SwappedValue value={value} direction={direction} durationMs={durationMs}>
          {content}
        </SwappedValue>
      )}
    </Stack>
  );
};

export { BaseAnimatedValue };
