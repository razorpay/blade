import React from 'react';
import styled from 'styled-components';
import {
  sliderInputColors,
  sliderInputMotion,
  SLIDER_RATIO,
  SLIDER_TRACK_HEIGHT,
} from './sliderInputTokens';
import { getFillWidthExpression, getMarkerMaskImage } from './utils';
import get from '~utils/lodashButBetter/get';
import { makeSize, makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';

type SliderTrackProps = {
  /** Values that get a marker, as 0-1 ratios. Empty renders a plain rail. */
  markerRatios: number[];
  isDisabled: boolean;
  /** Hover, focus and drag all share the highlighted fill. */
  isHighlighted: boolean;
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
const TrackLayer = styled.div`
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

  /* The clip is not transitioned here: it follows the ratio the control eases, so the fill
     edge moves in the same interpolation as the thumb. */
  transition: ${({ theme }) =>
    `background-color ${makeMotionTime(
      theme.motion.duration[sliderInputMotion.color.duration],
    )} ${String(theme.motion.easing[sliderInputMotion.color.easing])}`};
`;

/**
 * The fill's trailing edge always sits under the thumb, so clipping it square is never
 * visible. The leading edge keeps the pill radius from the layer itself.
 */
const trimmed = `calc(100% - (${getFillWidthExpression(SLIDER_RATIO)}))`;

const SliderTrack = ({
  markerRatios,
  isDisabled,
  isHighlighted,
  isRTL,
}: SliderTrackProps): React.ReactElement => {
  const { theme } = useTheme();

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

  const clipPath = isRTL ? `inset(0 0 0 ${trimmed})` : `inset(0 ${trimmed} 0 0)`;

  return (
    <TrackContainer>
      <TrackLayer
        style={{ ...maskStyle, backgroundColor: get(theme.colors, sliderInputColors.rail) }}
      />
      <TrackLayer
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
