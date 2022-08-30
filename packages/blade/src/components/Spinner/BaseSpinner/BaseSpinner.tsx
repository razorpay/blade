import React from 'react';
import { dimensions } from './spinnerTokens';
import SpinnerIcon from './SpinnerIcon';
import { SpinningBox } from './SpinningBox';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import { getIn, makeSize } from '~utils';
import type { ColorContrastTypes, Feedback } from '~tokens/theme/theme';

type BaseSpinnerProps = {
  intent?: Feedback;
  contrast?: ColorContrastTypes;
  size?: 'small' | 'medium' | 'large';
  accessibilityLabel?: string;
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
}: BaseSpinnerProps): React.ReactElement => {
  console.log('unused props', accessibilityLabel);
  const { theme } = useTheme();
  return (
    <SpinningBox display="flex">
      <SpinnerIcon
        dimensions={makeSize(dimensions[size])}
        color={getColor({ contrast, intent, theme })}
      />
    </SpinningBox>
  );
};

export { BaseSpinner, BaseSpinnerProps };
