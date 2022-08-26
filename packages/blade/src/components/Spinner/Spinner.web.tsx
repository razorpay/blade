import React from 'react';
import type { SpinnerProps } from './Spinner.d';
import { dimensions } from './spinnerTokens';
import SpinnerIcon from './SpinnerIcon';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import { getIn, makeSize } from '~utils';
import Box from '~components/Box';

const getColor = ({
  contrast,
  intent,
  theme,
}: {
  contrast: NonNullable<SpinnerProps['contrast']>;
  intent: SpinnerProps['intent'];
  theme: Theme;
}): string => {
  if (intent) {
    return getIn(
      theme.colors,
      `feedback.${intent}.action.icon.primary.disabled.${contrast}Contrast`,
    );
  } else if (contrast == 'low') {
    return getIn(theme.colors, `brand.gray.700`);
  } else {
    return getIn(theme.colors, 'brand.gray.300');
  }
};

const Spinner = ({
  // accessibilityLabel,
  contrast = 'low',
  intent,
  size = 'medium',
}: SpinnerProps): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <Box>
      <SpinnerIcon
        dimensions={makeSize(dimensions[size])}
        color={getColor({ contrast, intent, theme })}
      />
    </Box>
  );
};

export { Spinner };
