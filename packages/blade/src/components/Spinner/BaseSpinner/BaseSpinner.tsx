import React from 'react';
import { dimensions } from './spinnerTokens';
import SpinnerIcon from './SpinnerIcon';
import { SpinningBox } from './SpinningBox';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, getIn, makeAccessible, makeSize, MetaConstants } from '~utils';
import type { ColorContrastTypes, Feedback } from '~tokens/theme/theme';
import Box from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

type BaseSpinnerProps = {
  intent?: Feedback;
  /**
   * Sets the label of the spinner.
   *
   * @default 'right'
   */
  label?: string;
  /**
   * Sets the label of the spinner.
   *
   */
  labelPosition?: 'right' | 'bottom';
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
  size?: 'medium' | 'large' | 'xlarge';
  /**
   * Sets the aria-label for web & accessibilityLabel react-native.
   *
   */
  accessibilityLabel: string;
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
    return getIn(theme.colors, 'brand.gray.700.lowContrast');
  } else {
    return getIn(theme.colors, 'brand.gray.700.highContrast');
  }
};

const BaseSpinner = ({
  label,
  labelPosition = 'right',
  accessibilityLabel,
  contrast = 'low',
  intent,
  size = 'medium',
}: BaseSpinnerProps): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <Box display="flex" {...metaAttribute(MetaConstants.Component, MetaConstants.Spinner)}>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={labelPosition === 'right' ? 'row' : 'column'}
        {...makeAccessible({
          label: accessibilityLabel,
          role: 'progressbar',
        })}
      >
        <SpinningBox>
          <SpinnerIcon
            dimensions={makeSize(dimensions[size])}
            color={getColor({ contrast, intent, theme })}
          />
        </SpinningBox>
        {label && label.trim().length > 0 ? (
          <Box
            marginLeft={labelPosition === 'right' ? 'spacing.3' : 'spacing.0'}
            marginTop={labelPosition === 'bottom' ? 'spacing.3' : 'spacing.0'}
          >
            <Text variant="body" weight="regular" type="subdued" size="small" contrast={contrast}>
              {label}
            </Text>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export { BaseSpinner, BaseSpinnerProps };
