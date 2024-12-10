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
import type { FeedbackColors } from '~tokens/theme/theme';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import type { BladeElementRef, TestID } from '~utils/types';
import { makeSize } from '~utils/makeSize';
import { makeAccessible } from '~utils/makeAccessible';

type BaseSpinnerProps = {
  /**
   * Sets the color of the spinner.
   *
   * @default 'default'
   */
  color?: 'primary' | 'white' | FeedbackColors;
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

const getColor = ({ color, theme }: { color: BaseSpinnerProps['color']; theme: Theme }): string => {
  if (color && color === 'white') {
    return getIn(theme.colors, 'interactive.icon.staticWhite.subtle');
  }
  if (color && color !== 'neutral') {
    return getIn(theme.colors, `interactive.icon.${color}.subtle`);
  }
  return getIn(theme.colors, 'interactive.icon.gray.subtle');
};

const _BaseSpinner = (
  {
    label,
    labelPosition = 'right',
    accessibilityLabel,
    color = 'neutral',
    size = 'medium',
    testID,
    ...styledProps
  }: BaseSpinnerProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <BaseBox
      ref={ref as never}
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
          <SpinnerIcon dimensions={makeSize(dimensions[size])} color={getColor({ color, theme })} />
        </SpinningBox>
        {label && label.trim().length > 0 ? (
          <BaseBox
            marginLeft={labelPosition === 'right' ? 'spacing.3' : 'spacing.0'}
            marginTop={labelPosition === 'bottom' ? 'spacing.3' : 'spacing.0'}
          >
            <Text variant="body" weight="regular" size="small" color="surface.text.gray.muted">
              {label}
            </Text>
          </BaseBox>
        ) : null}
      </BaseBox>
    </BaseBox>
  );
};

const BaseSpinner = React.forwardRef(_BaseSpinner);

export type { BaseSpinnerProps };
export { BaseSpinner };
