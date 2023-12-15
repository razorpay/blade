import React from 'react';
import { dimensions } from './spinnerTokens';
import SpinnerIcon from './SpinnerIcon';
import { SpinningBox } from './SpinningBox';
import getIn from '~utils/lodashButBetter/get';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { ColorContrastTypes, Feedback } from '~tokens/theme/theme';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import type { TestID } from '~utils/types';
import { makeSize } from '~utils/makeSize';
import { makeAccessible } from '~utils/makeAccessible';

type BaseSpinnerProps = {
  /**
   * Sets the color of the spinner.
   *
   * @default 'default'
   */
  color?: 'default' | 'white' | Feedback;
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
   * This is deprecated in favor of the `color` prop.
   *
   * @deprecated Use `color="white"` for high contrast and `color="default"` for low contrast
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
} & TestID &
  StyledPropsBlade;

const getColor = ({
  contrast,
  color,
  theme,
}: {
  contrast: NonNullable<BaseSpinnerProps['contrast']>;
  color: BaseSpinnerProps['color'];
  theme: Theme;
}): string => {
  if (contrast === 'high' || (color && color === 'white')) {
    return getIn(theme.colors, 'static.white');
  }
  if (color && color !== 'default') {
    return getIn(theme.colors, `feedback.${color}.action.icon.primary.disabled.lowContrast`);
  }
  return getIn(theme.colors, 'interactive.background.neutral.default');
};

const BaseSpinner = ({
  label,
  labelPosition = 'right',
  accessibilityLabel,
  contrast = 'low',
  color = 'default',
  size = 'medium',
  testID,
  ...styledProps
}: BaseSpinnerProps): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.Spinner, testID })}
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
            color={getColor({ contrast, color, theme })}
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

export type { BaseSpinnerProps };
export { BaseSpinner };
