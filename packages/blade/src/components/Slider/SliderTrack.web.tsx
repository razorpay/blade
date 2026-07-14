import styled, { css } from 'styled-components';
import type { DefaultTheme } from 'styled-components';
import type { FeedbackColors } from '~tokens/theme/theme';

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
  theme: DefaultTheme;
};

const getActiveColor = ({
  theme,
  $color,
  $hasError,
  $isDisabled,
}: NativeRangeInputProps): string => {
  if ($isDisabled) return theme.colors.interactive.background.gray.disabled;
  return theme.colors.interactive.background[$hasError ? 'negative' : $color].default;
};

const getHaloColor = ({ theme, $color, $hasError }: NativeRangeInputProps): string =>
  theme.colors.interactive.background[$hasError ? 'negative' : $color].faded;

const getDefaultThumb = (props: NativeRangeInputProps): string => {
  const radius = props.$thumbSize / 2;
  return `radial-gradient(circle, ${getActiveColor(props)} 0 ${radius}px, transparent ${
    radius + 0.5
  }px)`;
};

const getHoverThumb = (props: NativeRangeInputProps): string => {
  const radius = props.$thumbSize / 2;
  return `radial-gradient(circle, ${getActiveColor(props)} 0 ${radius}px, ${getHaloColor(
    props,
  )} ${radius}px ${radius + 8}px, transparent ${radius + 8.5}px)`;
};

const getFocusedThumb = (props: NativeRangeInputProps): string => {
  const radius = props.$thumbSize / 2;
  return `radial-gradient(circle, ${getActiveColor(props)} 0 ${radius}px, ${
    props.theme.colors.surface.border.primary.normal
  } ${radius}px ${radius + 2}px, transparent ${radius + 2.5}px)`;
};

const getPressedThumb = (props: NativeRangeInputProps): string => {
  const radius = props.$pressedThumbSize / 2;
  return `radial-gradient(circle, ${getActiveColor(props)} 0 ${radius}px, ${getHaloColor(
    props,
  )} ${radius}px ${radius + 8}px, transparent ${radius + 8.5}px)`;
};

const TrackArea = styled.div<SliderTrackStyleProps>(({ $hasMarkLabels, $hasThumbValue }) => ({
  cursor: 'pointer',
  height: 44 + ($hasThumbValue ? 24 : 0) + ($hasMarkLabels ? 18 : 0),
  position: 'relative',
  touchAction: 'none',
  width: '100%',
}));

const TrackLine = styled.div<SliderTrackStyleProps>(
  ({ theme, $hasThumbValue, $isDisabled, $trackHeight }) => ({
    backgroundColor: $isDisabled
      ? theme.colors.surface.background.gray.moderate
      : theme.colors.surface.background.gray.intense,
    borderRadius: theme.border.radius.max,
    height: $trackHeight,
    left: 22,
    overflow: 'visible',
    pointerEvents: 'none',
    position: 'absolute',
    right: 22,
    top: ($hasThumbValue ? 24 : 0) + (44 - $trackHeight) / 2,
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
  height: 44,
  left: 0,
  margin: 0,
  outline: 'none',
  pointerEvents: 'none',
  position: 'absolute',
  top: props.$hasThumbValue ? 24 : 0,
  width: '100%',
  zIndex: props.$isActive ? 3 : 2,

  '&::-webkit-slider-runnable-track': {
    background: 'transparent',
    border: 0,
    height: 44,
  },
  '&::-webkit-slider-thumb': {
    WebkitAppearance: 'none',
    appearance: 'none',
    background: getDefaultThumb(props),
    border: 0,
    borderRadius: '50%',
    cursor: props.$isDisabled ? 'not-allowed' : 'grab',
    height: 44,
    pointerEvents: props.$isDisabled ? 'none' : 'auto',
    width: 44,
  },
  '&::-moz-range-track': {
    background: 'transparent',
    border: 0,
    height: 44,
  },
  '&::-moz-range-thumb': {
    background: getDefaultThumb(props),
    border: 0,
    borderRadius: '50%',
    cursor: props.$isDisabled ? 'not-allowed' : 'grab',
    height: 44,
    pointerEvents: props.$isDisabled ? 'none' : 'auto',
    width: 44,
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
    height: 4,
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 4,
  }),
);

const MarkLabel = styled.span(({ theme }) => ({
  color: theme.colors.surface.text.gray.muted,
  fontFamily: theme.typography.fonts.family.text,
  fontSize: theme.typography.fonts.size[75],
  lineHeight: `${theme.typography.lineHeights[75]}px`,
  position: 'absolute',
  top: 10,
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
}));

const ThumbValueLabel = styled.span<{ $hasThumbValue: boolean }>(({ theme }) => ({
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

const disabledTrackStyles = css<SliderTrackStyleProps>`
  ${({ $isDisabled }) =>
    $isDisabled &&
    css`
      cursor: not-allowed;
    `}
`;

const StyledTrackArea = styled(TrackArea)`
  ${disabledTrackStyles}
`;

export {
  MarkDot,
  MarkLabel,
  NativeRangeInput,
  StyledTrackArea,
  ThumbValueLabel,
  TrackFill,
  TrackLine,
};
export type { SliderTrackStyleProps };
