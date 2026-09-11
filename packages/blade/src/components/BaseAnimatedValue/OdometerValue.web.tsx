import React from 'react';
import styled from 'styled-components';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { getColumnPosition } from './odometerUtils';
import type { ParsedNumber } from './odometerUtils';
import { MotionDiv } from '~components/BaseMotion';
import { screenReaderStyles } from '~components/VisuallyHidden';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

/**
 * A column carries every digit once, then repeats its first so a carry can roll off the end
 * into a `0` rather than winding all the way back down through 9 to reach it.
 */
const COLUMN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

/**
 * Clips the column down to the single digit that should be showing.
 *
 * Sized by the hidden digit inside it rather than by a height of its own, so the window is
 * exactly one line of whatever text it was dropped into. Pinning it to a fixed `em` height
 * instead made the slider's indicator 19px tall against the 17px in Figma, because it stopped
 * inheriting the line height the surrounding `Text` had set.
 */
const Window = styled.span`
  position: relative;
  display: inline-block;
  overflow: hidden;
  /* An overflow-hidden inline box takes its baseline from its bottom edge, so left to align
     itself it sits on the text baseline and pushes the line box taller than one line. */
  vertical-align: top;
`;

/** Occupies one digit so the window inherits its width and line height. Never seen. */
const Sizer = styled.span`
  visibility: hidden;
`;

/**
 * The styles rather than the `VisuallyHidden` component, which renders a `div`. This sits inside
 * `Text`, so a block element here is invalid HTML that the parser hoists out of the paragraph,
 * breaking hydration.
 */
const ReadableValue = styled.span(screenReaderStyles);

const Digit = styled.span`
  display: block;
`;

/**
 * Tabular figures matter more here than anywhere else: proportional digits change width as they
 * roll, which would shuffle every column sideways on the way past a `1`.
 */
const Row = styled.span`
  display: inline-block;
  font-variant-numeric: tabular-nums;
`;

const DigitColumn = ({
  value,
  place,
  lowestPlace,
}: {
  value: MotionValue<number>;
  place: number;
  lowestPlace: number;
}): React.ReactElement => {
  // A percentage of the column's own height, so the pitch never has to be measured in px.
  const y = useTransform(
    value,
    (current) =>
      `${(-getColumnPosition(current, place, lowestPlace) / COLUMN_DIGITS.length) * 100}%`,
  );

  return (
    <Window>
      <Sizer aria-hidden={true}>0</Sizer>
      {/* Lifted out of flow so the hidden digit above is what gives the window its size. */}
      <MotionDiv as="span" style={{ y, position: 'absolute', top: 0, left: 0 }}>
        {COLUMN_DIGITS.map((digit, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Digit key={index}>{digit}</Digit>
        ))}
      </MotionDiv>
    </Window>
  );
};

/**
 * Rolls a number by driving every digit column from a single continuously retargeted value.
 *
 * This is what makes it survive a drag. A swap animation has to finish one value before it can
 * start the next, so a slider changing fifty times a second leaves it no time to play. Here
 * the columns are a function of the value itself, and each change simply re-aims the animation
 * from wherever it currently is — so the digits keep rolling smoothly however fast the value
 * moves, and settle crisply when it stops.
 */
const OdometerValue = ({
  value,
  text,
  parsed,
  durationMs,
}: {
  value: number;
  text: string;
  parsed: ParsedNumber;
  durationMs: number;
}): React.ReactElement => {
  const target = useMotionValue(value);
  /*
   * A spring rather than a tween, because the target here is not a destination so much as
   * something to chase. Re-aiming a tween on every change restarts its easing from a standstill,
   * so during a drag it only ever covers the first slow fraction of a curve and falls further
   * and further behind — measured at thirteen units adrift. A spring carries its velocity
   * across the change, so it matches the value's pace instead of losing ground, and still
   * settles cleanly when the value stops.
   *
   * `bounce: 0` keeps it from overshooting a digit and rolling back, which on a number reads as
   * a mistake rather than as spring.
   */
  // `useSpring` takes its duration in milliseconds, unlike the seconds a `transition` wants.
  // Passing seconds here leaves a spring so stiff it snaps between whole digits.
  const displayed = useSpring(target, { duration: durationMs, bounce: 0 });

  React.useEffect(() => {
    target.set(value);
  }, [value, target]);

  return (
    <Row>
      {/*
       * Each column carries every digit, so the text of this subtree reads
       * `012345678900123456789` rather than `50`. That is what a screen reader, a find on the
       * page, or a copy would otherwise pick up, so the real value is stated once here and the
       * columns are hidden from anything that reads rather than looks.
       */}
      <ReadableValue {...metaAttribute({ name: MetaConstants.VisuallyHidden })}>
        {text}
      </ReadableValue>
      <span aria-hidden={true}>
        {parsed.slots.map((slot, index) =>
          slot.type === 'digit' ? (
            <DigitColumn
              key={`digit-${slot.place}`}
              value={displayed}
              place={slot.place}
              lowestPlace={parsed.lowestPlace}
            />
          ) : (
            // eslint-disable-next-line react/no-array-index-key
            <span key={`literal-${index}`}>{slot.char}</span>
          ),
        )}
      </span>
    </Row>
  );
};

export { OdometerValue };
