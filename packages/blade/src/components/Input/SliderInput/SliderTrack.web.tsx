import React from 'react';
import styled from 'styled-components';
import { sliderInputColors, sliderInputMotion, SLIDER_TRACK_HEIGHT } from './sliderInputTokens';
import { getFillWidthExpression, getMarkerMaskImage, getValueRatio } from './utils';
import type { ValueRange } from './utils';
import get from '~utils/lodashButBetter/get';
import { makeSize, makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';

type SliderTrackProps = {
  value: number;
  range: Pick<ValueRange, 'min' | 'max'>;
  /** Values that get a marker, as 0-1 ratios. Empty renders a plain rail. */
  markerRatios: number[];
  isDisabled: boolean;
  /** Hover, focus and drag all share the highlighted fill. */
  isHighlighted: boolean;
  /** Suppresses the movement easing so the fill keeps up with the pointer. */
  isScrubbing: boolean;
  isRTL: boolean;
};

const TrackContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${makeSize(SLIDER_TRACK_HEIGHT)};
`;

/**
 * The rail and the fill are both full track width and share one mask, so the marker cut-outs
 * line up across the two without either needing the measured width. The fill is trimmed to
 * the reached value with `clip-path` rather than by being narrower.
 *
 * Colour and mask arrive through inline styles: both change on every pointer move during a
 * drag, and threading them through styled-components would mint a new class per frame.
 */
const TrackLayer = styled.div<{ $isScrubbing: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: ${({ theme }) => makeSize(theme.border.radius.max)};
  mask-repeat: no-repeat;
  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari needs the prefixed property */
  -webkit-mask-repeat: no-repeat;
  /* The WebKit keyword has to come first so the standard property wins where both parse. */
  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari uses a different composite keyword */
  -webkit-mask-composite: source-in;
  mask-composite: intersect;

  /* Easing the clip while scrubbing would leave the fill trailing behind the thumb. A click
     is not scrubbing, so it still glides. */
  transition: ${({ theme, $isScrubbing }) => {
    const easing = String(theme.motion.easing[sliderInputMotion.position.easing]);
    const color = `background-color ${makeMotionTime(
      theme.motion.duration[sliderInputMotion.color.duration],
    )} ${easing}`;
    if ($isScrubbing) return color;
    const clip = `clip-path ${makeMotionTime(
      theme.motion.duration[sliderInputMotion.position.duration],
    )} ${easing}`;
    return `${clip}, ${color}`;
  }};
`;

const SliderTrack = ({
  value,
  range,
  markerRatios,
  isDisabled,
  isHighlighted,
  isScrubbing,
  isRTL,
}: SliderTrackProps): React.ReactElement => {
  const { theme } = useTheme();
  const ratio = getValueRatio(value, range);

  const maskStyle = React.useMemo(() => {
    if (markerRatios.length === 0) return undefined;
    const maskImage = getMarkerMaskImage(markerRatios);
    return { maskImage, WebkitMaskImage: maskImage };
  }, [markerRatios]);

  const fillColorToken = isDisabled
    ? sliderInputColors.fill.disabled
    : isHighlighted
    ? sliderInputColors.fill.highlighted
    : sliderInputColors.fill.default;

  /**
   * The fill's trailing edge always sits under the thumb, so clipping it square is never
   * visible. The leading edge keeps the pill radius from the layer itself.
   */
  const trimmed = `calc(100% - (${getFillWidthExpression(ratio)}))`;
  const clipPath = isRTL ? `inset(0 0 0 ${trimmed})` : `inset(0 ${trimmed} 0 0)`;

  return (
    <TrackContainer>
      <TrackLayer
        $isScrubbing={isScrubbing}
        style={{ ...maskStyle, backgroundColor: get(theme.colors, sliderInputColors.rail) }}
      />
      <TrackLayer
        $isScrubbing={isScrubbing}
        style={{
          ...maskStyle,
          backgroundColor: get(theme.colors, fillColorToken),
          clipPath,
        }}
      />
    </TrackContainer>
  );
};

export { SliderTrack };
export type { SliderTrackProps };
