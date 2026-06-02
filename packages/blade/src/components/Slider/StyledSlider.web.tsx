import styled from 'styled-components';
import { sliderSizes } from './sliderTokens';
import type { SliderSize } from './types';
import getIn from '~utils/lodashButBetter/get';
import { castWebType } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

type StyledSliderInputProps = {
  $size: SliderSize;
  $isDisabled: boolean;
  $hasError: boolean;
};

const StyledSliderInput = styled.input<StyledSliderInputProps>(
  ({ theme, $size, $isDisabled }) => {
    const tokens = sliderSizes[$size];
    const trackColor = $isDisabled
      ? getIn(theme.colors, 'interactive.background.gray.disabled')
      : getIn(theme.colors, 'surface.border.gray.muted');
    const fillColor = $isDisabled
      ? getIn(theme.colors, 'interactive.background.gray.disabled')
      : getIn(theme.colors, 'interactive.background.primary.default');
    const thumbBg = getIn(theme.colors, 'surface.background.gray.intense');
    const thumbBorder = $isDisabled
      ? getIn(theme.colors, 'interactive.background.gray.disabled')
      : getIn(theme.colors, 'interactive.background.primary.default');

    return {
      WebkitAppearance: 'none',
      appearance: 'none',
      width: '100%',
      height: `${tokens.trackHeight}px`,
      borderRadius: `${theme.border.radius.max}px`,
      outline: 'none',
      cursor: $isDisabled ? 'not-allowed' : 'pointer',
      padding: 0,
      margin: 0,
      background: 'transparent',

      // WebKit track (Chrome/Safari) — uses --slider-fill-pct CSS variable for filled portion
      '&::-webkit-slider-runnable-track': {
        height: `${tokens.trackHeight}px`,
        borderRadius: `${theme.border.radius.max}px`,
        background: castWebType(
          `linear-gradient(to right, ${fillColor} var(--slider-fill-pct, 0%), ${trackColor} var(--slider-fill-pct, 0%))`,
        ),
        cursor: $isDisabled ? 'not-allowed' : 'pointer',
      },

      // WebKit thumb (Chrome/Safari)
      '&::-webkit-slider-thumb': {
        WebkitAppearance: 'none',
        appearance: 'none',
        width: `${tokens.thumbSize}px`,
        height: `${tokens.thumbSize}px`,
        borderRadius: '50%',
        background: castWebType(thumbBg),
        border: `${tokens.thumbBorderWidth}px solid ${castWebType(thumbBorder)}`,
        cursor: $isDisabled ? 'not-allowed' : 'pointer',
        marginTop: `-${(tokens.thumbSize - tokens.trackHeight) / 2}px`,
        transition: 'box-shadow 100ms ease',
      },

      // Firefox track
      '&::-moz-range-track': {
        height: `${tokens.trackHeight}px`,
        borderRadius: `${theme.border.radius.max}px`,
        background: castWebType(trackColor),
        cursor: $isDisabled ? 'not-allowed' : 'pointer',
      },

      // Firefox filled portion — auto-sizes to current value, no JS needed
      '&::-moz-range-progress': {
        height: `${tokens.trackHeight}px`,
        borderRadius: `${theme.border.radius.max}px`,
        background: castWebType(fillColor),
      },

      // Firefox thumb
      '&::-moz-range-thumb': {
        width: `${tokens.thumbSize}px`,
        height: `${tokens.thumbSize}px`,
        borderRadius: '50%',
        background: castWebType(thumbBg),
        border: `${tokens.thumbBorderWidth}px solid ${castWebType(thumbBorder)}`,
        cursor: $isDisabled ? 'not-allowed' : 'pointer',
        boxSizing: 'border-box',
      },

      // Focus ring on thumb (WebKit)
      '&:focus-visible::-webkit-slider-thumb': {
        ...getFocusRingStyles({ theme }),
      },

      // Focus ring on thumb (Firefox)
      '&:focus-visible::-moz-range-thumb': {
        ...getFocusRingStyles({ theme }),
      },
    };
  },
);

export { StyledSliderInput };
