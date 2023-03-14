import React from 'react';
import { dimensions } from './spinnerTokens';
import SpinnerIcon from './SpinnerIcon';
import { SpinningBox } from './SpinningBox';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { metaAttribute, getIn, makeAccessible, makeSize, MetaConstants } from '~utils';
import type { ColorContrastTypes, Feedback } from '~tokens/theme/theme';
import BaseBox from '~components/Box/BaseBox';
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
} & StyledPropsBlade;

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
  ...styledProps
}: BaseSpinnerProps): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <BaseBox
      {...metaAttribute(MetaConstants.Component, MetaConstants.Spinner)}
      display="flex"
      {...getStyledProps(styledProps)}
    >
      <BaseBox
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
          <BaseBox
            marginLeft={labelPosition === 'right' ? 'spacing.3' : 'spacing.0'}
            marginTop={labelPosition === 'bottom' ? 'spacing.3' : 'spacing.0'}
          >
            <Text variant="body" weight="regular" type="subdued" size="small" contrast={contrast}>
              {label}
            </Text>
          </BaseBox>
        ) : null}
      </BaseBox>
    </BaseBox>
  );
};

export { BaseSpinner, BaseSpinnerProps };
