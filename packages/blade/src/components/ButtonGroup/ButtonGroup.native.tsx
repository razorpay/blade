import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import type { ButtonGroupProps } from './types';
import { StyledButtonGroup } from './StyledButtonGroup.native';
import { ButtonGroupProvider } from './ButtonGroupContext';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import type { Theme } from '~components/BladeProvider';
import { getBackgroundColorToken } from '~components/Button/BaseButton/BaseButton';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

// Mirrors the web implementation's getDividerColorToken for parity.
// Only the 'primary' branch is reachable at runtime (dividers are only
// rendered for primary variant), but all branches are kept for web/native
// consistency.
const getDividerColorToken = ({
  color,
  variant,
  isDisabled,
}: Pick<ButtonGroupProps, 'color' | 'isDisabled' | 'variant'>): DotNotationToken<
  Theme['colors']
> => {
  if (variant === 'primary') {
    return 'surface.border.gray.subtle';
  }

  if (variant === 'secondary') {
    return getBackgroundColorToken({
      variant,
      color,
      state: isDisabled ? 'disabled' : 'default',
    });
  }

  return 'surface.border.gray.muted';
};

const StyledDivider = styled(View)<{ dividerColor: string }>(
  ({ dividerColor }: { dividerColor: string }) => ({
    width: 1,
    alignSelf: 'stretch' as const,
    backgroundColor: dividerColor,
  }),
);

const _ButtonGroup = ({
  children,
  isDisabled = false,
  size = 'medium',
  color = 'primary',
  variant = 'primary',
  isFullWidth = false,
  testID,
  ...rest
}: ButtonGroupProps): React.ReactElement => {
  const { theme } = useTheme();

  const contextValue = {
    isDisabled,
    size,
    color,
    variant,
    isFullWidth,
  };

  useVerifyAllowedChildren({
    allowedComponents: ['Button', 'Dropdown', 'Tooltip', 'Popover'],
    componentName: 'ButtonGroup',
    children,
  });

  const dividerColorToken = getDividerColorToken({ color, variant, isDisabled });
  const dividerColor = getIn(theme.colors, dividerColorToken);

  const isSecondaryOrTertiary = variant === 'secondary' || variant === 'tertiary';

  return (
    <StyledButtonGroup
      size={size}
      isFullWidth={isFullWidth}
      {...metaAttribute({ name: MetaConstants.ButtonGroup, testID })}
      {...makeAnalyticsAttribute(rest)}
      {...getStyledProps(rest)}
      accessible={false}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        const isLast = React.Children.count(children) - 1 === index;
        const showDivider = variant === 'primary' && !isLast;
        const childKey = child.key ?? index;

        return (
          <React.Fragment key={childKey}>
            <ButtonGroupProvider
              value={{
                ...contextValue,
                isFirstInButtonGroup: index === 0,
                isLastInButtonGroup: isLast,
                collapseBorder: isSecondaryOrTertiary && index > 0,
              }}
            >
              {child}
            </ButtonGroupProvider>
            {showDivider && <StyledDivider dividerColor={dividerColor} />}
          </React.Fragment>
        );
      })}
    </StyledButtonGroup>
  );
};

const ButtonGroup = assignWithoutSideEffects(_ButtonGroup, {
  displayName: 'ButtonGroup',
  componentId: 'ButtonGroup',
});

export { ButtonGroup };
export type { ButtonGroupProps };
