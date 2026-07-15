import styled from 'styled-components';
import type { DefaultTheme } from 'styled-components';
import type { FeedbackColors } from '~tokens/theme/theme';
import { sliderTokens } from './sliderTokens';

type SliderTrackStyleProps = {
  $color: FeedbackColors;
  $hasError: boolean;
  $hasMarkLabels: boolean;
  $hasThumbValue: boolean;
  $isDisabled: boolean;
  $size: 'small' | 'medium' | 'large';
  $trackHeight: number;
};

type NativeRangeInputProps = Pick<
  SliderTrackStyleProps,
  '$color' | '$hasError' | '$hasThumbValue' | '$isDisabled' | '$size'
> & {
  $isActive: boolean;
  $pressedThumbSize: number;
  $thumbSize: number;
};

type NativeRangeInputHelperProps = NativeRangeInputProps & {
  theme: DefaultTheme;
};

const getActiveColor = ({
  theme,
  $color,
  $hasError,
  $isDisabled,
}: NativeRangeInputHelperProps): string => {
  if ($isDisabled) return theme.colors.interactive.background.gray.disabled;
  return theme.colors.interactive.background[$hasError ? 'negative' : $color].default;
};

const getHaloColor = ({ theme, $color, $hasError }: NativeRangeInputHelperProps): string =>
  theme.colors.interactive.background[$hasError ? 'negative' : $color].faded;

const HALO_BORDER_OFFSET = 0.5;
const HALO_RADIUS_OFFSET = 8;
const FOCUS_BORDER_RADIUS_OFFSET = 2;

const getDefaultThumb = (props: NativeRangeInputHelperProps): string => {
  const radius = props.$thumbSize / 2;
  return `radial-gradient(circle, ${getActiveColor(props)} 0 ${radius}px, transparent ${
    radius + HALO_BORDER_OFFSET
  }px)`;
};

const getHoverThumb = (props: NativeRangeInputHelperProps): string => {
  const radius = props.$thumbSize / 2;
  return `radial-gradient(circle, ${getActiveColor(props)} 0 ${radius}px, ${getHaloColor(
    props,
  )} ${radius}px ${radius + HALO_RADIUS_OFFSET}px, transparent ${
    radius + HALO_RADIUS_OFFSET + HALO_BORDER_OFFSET
  }px)`;
};

const getFocusedThumb = (props: NativeRangeInputHelperProps): string => {
  const radius = props.$thumbSize / 2;
  return `radial-gradient(circle, ${getActiveColor(props)} 0 ${radius}px, ${
    props.theme.colors.surface.border.primary.normal
  } ${radius}px ${radius + FOCUS_BORDER_RADIUS_OFFSET}px, transparent ${
    radius + FOCUS_BORDER_RADIUS_OFFSET + HALO_BORDER_OFFSET
  }px)`;
};

const getPressedThumb = (props: NativeRangeInputHelperProps): string => {
  const radius = props.$pressedThumbSize / 2;
  return `radial-gradient(circle, ${getActiveColor(props)} 0 ${radius}px, ${getHaloColor(
    props,
  )} ${radius}px ${radius + HALO_RADIUS_OFFSET}px, transparent ${
    radius + HALO_RADIUS_OFFSET + HALO_BORDER_OFFSET
  }px)`;
};

const TrackArea = styled.div<SliderTrackStyleProps>(
  ({ $hasMarkLabels, $hasThumbValue, $isDisabled }) => ({
    cursor: $isDisabled ? 'not-allowed' : 'pointer',
    height:
      sliderTokens.interactionTarget +
      ($hasThumbValue ? sliderTokens.thumbValueOffset : 0) +
      ($hasMarkLabels ? sliderTokens.markLabelOffset : 0),
    position: 'relative',
    touchAction: 'none',
    width: '100%',
  }),
);

const TrackLine = styled.div<SliderTrackStyleProps>(
  ({ theme, $hasThumbValue, $isDisabled, $trackHeight }) => ({
    backgroundColor: $isDisabled
      ? theme.colors.surface.background.gray.moderate
      : theme.colors.surface.background.gray.intense,
    borderRadius: theme.border.radius.max,
    height: $trackHeight,
    left: sliderTokens.interactionTarget / 2,
    overflow: 'visible',
    pointerEvents: 'none',
    position: 'absolute',
    right: sliderTokens.interactionTarget / 2,
    top:
      ($hasThumbValue ? sliderTokens.thumbValueOffset : 0) +
      (sliderTokens.interactionTarget - $trackHeight) / 2,
  }),
);

const TrackFill = styled.div<Pick<SliderTrackStyleProps, '$color' | '$hasError' | '$isDisabled'>>(
  ({ theme, $color, $hasError, $isDisabled }) => ({
    backgroundColor: $isDisabled
      ? theme.colors.interactive.background.gray.disabled
      : theme.colors.interactive.background[$hasError ? 'negative' : $color].default,
    borderRadius: theme.border.radius.max,
    bottom: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
  }),
);

const NativeRangeInput = styled.input<NativeRangeInputProps>((props) => ({
  WebkitAppearance: 'none',
  appearance: 'none',
  background: 'transparent',
  cursor: props.$isDisabled ? 'not-allowed' : 'grab',
  height: sliderTokens.interactionTarget,
  left: 0,
  margin: 0,
  outline: 'none',
  pointerEvents: 'none',
  position: 'absolute',
  top: props.$hasThumbValue ? sliderTokens.thumbValueOffset : 0,
  width: '100%',
  zIndex: props.$isActive ? 3 : 2,

  '&::-webkit-slider-runnable-track': {
    background: 'transparent',
    border: 0,
    height: sliderTokens.interactionTarget,
  },
  '&::-webkit-slider-thumb': {
    WebkitAppearance: 'none',
    appearance: 'none',
    background: getDefaultThumb(props),
    border: 0,
    borderRadius: '50%',
    cursor: props.$isDisabled ? 'not-allowed' : 'grab',
    height: sliderTokens.interactionTarget,
    pointerEvents: props.$isDisabled ? 'none' : 'auto',
    width: sliderTokens.interactionTarget,
  },
  '&::-moz-range-track': {
    background: 'transparent',
    border: 0,
    height: sliderTokens.interactionTarget,
  },
  '&::-moz-range-progress': {
    background: 'transparent',
    border: 0,
  },
  '&::-moz-range-thumb': {
    background: getDefaultThumb(props),
    border: 0,
    borderRadius: '50%',
    cursor: props.$isDisabled ? 'not-allowed' : 'grab',
    height: sliderTokens.interactionTarget,
    pointerEvents: props.$isDisabled ? 'none' : 'auto',
    width: sliderTokens.interactionTarget,
  },

  ...(!props.$isDisabled && {
    '&:hover::-webkit-slider-thumb': { background: getHoverThumb(props) },
    '&:hover::-moz-range-thumb': { background: getHoverThumb(props) },
    '&:focus-visible::-webkit-slider-thumb': { background: getFocusedThumb(props) },
    '&:focus-visible::-moz-range-thumb': { background: getFocusedThumb(props) },
    '&:active::-webkit-slider-thumb': {
      background: getPressedThumb(props),
      cursor: 'grabbing',
    },
    '&:active::-moz-range-thumb': {
      background: getPressedThumb(props),
      cursor: 'grabbing',
    },
  }),
}));

const MarkDot = styled.span<Pick<SliderTrackStyleProps, '$isDisabled'>>(
  ({ theme, $isDisabled }) => ({
    backgroundColor: $isDisabled
      ? theme.colors.surface.icon.gray.disabled
      : theme.colors.surface.icon.gray.muted,
    borderRadius: theme.border.radius.round,
    height: sliderTokens.markDot,
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: sliderTokens.markDot,
  }),
);

const MarkLabel = styled.span<{ $trackHeight: number; $percent: number }>(
  ({ theme, $trackHeight, $percent }) => ({
    color: theme.colors.surface.text.gray.muted,
    fontFamily: theme.typography.fonts.family.text,
    fontSize: theme.typography.fonts.size[75],
    lineHeight: `${theme.typography.lineHeights[75]}px`,
    position: 'absolute',
    top: $trackHeight / 2 + 8,
    transform:
      $percent <= 0
        ? 'translateX(0)'
        : $percent >= 100
          ? 'translateX(-100%)'
          : 'translateX(-50%)',
    whiteSpace: 'nowrap',
  }),
);

const ThumbValueLabel = styled.span(({ theme }) => ({
  backgroundColor: theme.colors.popup.background.gray.intense,
  borderRadius: theme.border.radius.small,
  color: theme.colors.surface.text.staticWhite.normal,
  fontFamily: theme.typography.fonts.family.text,
  fontSize: theme.typography.fonts.size[75],
  lineHeight: `${theme.typography.lineHeights[75]}px`,
  padding: `${theme.spacing[1]}px ${theme.spacing[2]}px`,
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
  zIndex: 4,
}));

export { MarkDot, MarkLabel, NativeRangeInput, ThumbValueLabel, TrackArea, TrackFill, TrackLine };
export type { SliderTrackStyleProps };
