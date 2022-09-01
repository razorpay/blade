import React from 'react';
import { dimensions } from './spinnerTokens';
import SpinnerIcon from './SpinnerIcon';
import { SpinningBox } from './SpinningBox';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import { getIn, makeAccessible, makeSize } from '~utils';
import type { ColorContrastTypes, Feedback } from '~tokens/theme/theme';

type BaseSpinnerProps = {
  intent?: Feedback;
  /**
   * Sets the contrast of the spinner.
   *
   * @default 'low'
   */
  contrast?: ColorContrastTypes;
  /**
   * Sets the size of the spinner.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Sets the aria-label for web & accessibilityLabel react-native.
   *
   */
  accessibilityLabel: string;
  /**
   * Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.
   *
   *  @default 'assertive'
   */
  accessibilityLiveRegion?: 'off' | 'assertive' | 'polite';
};

const getColor = ({
  contrast,
  intent,
  theme,
}: {
  contrast: NonNullable<BaseSpinnerProps['contrast']>;
  intent: BaseSpinnerProps['intent'];
  theme: Theme;
}): string => {
  if (intent) {
    return getIn(
      theme.colors,
      `feedback.${intent}.action.icon.primary.disabled.${contrast}Contrast`,
    );
  } else if (contrast == 'low') {
    return getIn(theme.colors, 'brand.gray.700');
  } else {
    return getIn(theme.colors, 'brand.gray.400');
  }
};

const BaseSpinner = ({
  accessibilityLabel,
  contrast = 'low',
  intent,
  size = 'medium',
  accessibilityLiveRegion = 'assertive',
}: BaseSpinnerProps): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <SpinningBox
      display="flex"
      {...makeAccessible({
        label: accessibilityLabel,
        liveRegion: accessibilityLiveRegion,
        atomic: true,
      })}
    >
      <SpinnerIcon
        dimensions={makeSize(dimensions[size])}
        color={getColor({ contrast, intent, theme })}
      />
    </SpinningBox>
  );
};

export { BaseSpinner, BaseSpinnerProps };
