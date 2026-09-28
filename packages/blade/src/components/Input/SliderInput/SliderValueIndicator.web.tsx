import React from 'react';
import styled from 'styled-components';
import {
  sliderInputColors,
  sliderInputMotion,
  SLIDER_INDICATOR_BOTTOM,
  SLIDER_INDICATOR_RISE,
} from './sliderInputTokens';
import { Text } from '~components/Typography';
import { BaseAnimatedValue } from '~components/BaseAnimatedValue';
import { makeSize, makeSpace, makeMotionTime } from '~utils';
import get from '~utils/lodashButBetter/get';

type SliderValueIndicatorProps = {
  /** The formatted text to show. */
  children: string;
  /** The raw value behind that text, which gives the swap its direction. */
  value: number;
  /** CSS length of the thumb centre from the track's inline start. */
  offset: string;
  /** Flips with direction, since `inset-inline-start` resolves to `right` under RTL. */
  centeringTransform: string;
  isVisible: boolean;
};

/**
 * Deliberately not the public `Tooltip`.
 *
 * `Tooltip` has a 51px floor once its padding and arrow are counted, so it will not hug a
 * two-character value. This stays private and unexported for that reason.
 *
 * The indicator is anchored by a centring wrapper rather than pinned by an edge, so a wider
 * value grows evenly in both directions instead of drifting off the thumb.
 */
const IndicatorAnchor = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  /* Without this the indicator falls back to its static position, which is exactly where the
     thumb is drawn. */
  bottom: ${makeSize(SLIDER_INDICATOR_BOTTOM)};
  pointer-events: none;
  white-space: nowrap;
  border-radius: ${({ theme }) => makeSize(theme.border.radius.xsmall)};
  /* 2 / 4, per Figma: a 13px wide "50" sits in a 21 x 17 box. */
  padding: ${({ theme }) => `${makeSpace(theme.spacing[1])} ${makeSpace(theme.spacing[2])}`};
  background-color: ${({ theme }) => get(theme.colors, sliderInputColors.indicator.background)};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};

  /*
   * Fades and rises on the way in, falls away on the way out. Its position is not transitioned
   * here: it follows the ratio the control eases, so it never separates from the thumb.
   *
   * Only the rise is animated on the transform: the centring half of it is a constant
   * translateX, so it contributes nothing to the interpolation.
   */
  transition: ${({ theme, $isVisible }) => {
    const duration = makeMotionTime(theme.motion.duration[sliderInputMotion.indicator.duration]);
    const easing = String(
      theme.motion.easing[
        $isVisible
          ? sliderInputMotion.indicator.enterEasing
          : sliderInputMotion.indicator.exitEasing
      ],
    );
    return `opacity ${duration} ${easing}, transform ${duration} ${easing}`;
  }};
`;

const SliderValueIndicator = ({
  children,
  value,
  offset,
  centeringTransform,
  isVisible,
}: SliderValueIndicatorProps): React.ReactElement => {
  // Sits slightly low while hidden so it rises into place as it fades in.
  const rise = isVisible ? '' : ` translateY(${makeSize(SLIDER_INDICATOR_RISE)})`;

  return (
    <IndicatorAnchor
      $isVisible={isVisible}
      style={{ insetInlineStart: offset, transform: `${centeringTransform}${rise}` }}
      // The value is already on the thumb as `aria-valuetext`; announcing it again here would
      // double it up on every step.
      aria-hidden={true}
    >
      <Text size="xsmall" weight="regular" color={sliderInputColors.indicator.text}>
        {/*
         * Keyed on the raw value rather than the formatted string, so a custom `formatValue`
         * that adds a unit or a currency still moves in the direction the value went.
         */}
        <BaseAnimatedValue value={value} duration={sliderInputMotion.valueRoll.duration}>
          {children}
        </BaseAnimatedValue>
      </Text>
    </IndicatorAnchor>
  );
};

export { SliderValueIndicator };
export type { SliderValueIndicatorProps };
