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
import type { BladeElementRef } from '~utils/types';

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

const _ButtonGroup = (
  {
    children,
    isDisabled = false,
    size = 'medium',
    color = 'primary',
    variant = 'primary',
    isFullWidth = false,
    testID,
    ...rest
  }: ButtonGroupProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { theme } = useTheme();
  // While a secondary/tertiary button is pressed, lift it above siblings and
  // release the next sibling's -1px overlap so the highlighted right border shows.
  const [pressedButtonIndex, setPressedButtonIndex] = React.useState<number | null>(null);

  const contextValue = {
    isDisabled,
    size,
    color,
    variant,
    isFullWidth,
    setPressedButtonIndex,
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
      ref={ref as never}
      size={size}
      isFullWidth={isFullWidth}
      {...metaAttribute({ name: MetaConstants.ButtonGroup, testID })}
      {...makeAnalyticsAttribute(rest)}
      {...getStyledProps(rest)}
      accessibilityRole="group"
      accessible={false}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        const isLast = React.Children.count(children) - 1 === index;
        const showDivider = variant === 'primary' && !isLast;
        // child.key is preferred; index fallback is acceptable here because
        // ButtonGroup children are a static set of Buttons that are not
        // dynamically added/removed at runtime.
        const childKey = child.key ?? index;
        const isPressed = pressedButtonIndex === index;
        // Collapse doubled borders, except when the previous button is pressed —
        // then keep this sibling un-overlapped so the pressed button's right
        // highlighted border isn't covered.
        const isGroupBorderCollapsed =
          isSecondaryOrTertiary && index > 0 && pressedButtonIndex !== index - 1;

        return (
          <React.Fragment key={childKey}>
            {/*
              Wrap each child so Dropdown's `height: 100%` resolves against a
              content-sized parent (not the Storybook screen), and so the open
              overlay can paint above siblings.
            */}
            <View
              style={{
                // Full-width groups need the wrapper to grow so BaseButton's
                // `flex: 1` can share the row (wrappers previously forced
                // `alignSelf: 'center'` and blocked expansion).
                ...(isFullWidth
                  ? { flex: 1, alignSelf: 'stretch' as const }
                  : { alignSelf: 'center' as const }),
                // Pressed button above siblings so its full focus border paints
                // on top of the next button's overlapping edge.
                zIndex: isPressed ? 10 : isLast ? 2 : 1,
              }}
            >
              <ButtonGroupProvider
                value={{
                  ...contextValue,
                  buttonIndex: index,
                  isFirstInButtonGroup: index === 0,
                  isLastInButtonGroup: isLast,
                  isGroupBorderCollapsed,
                  isInsideButtonGroup: true,
                }}
              >
                {child}
              </ButtonGroupProvider>
            </View>
            {showDivider && <StyledDivider dividerColor={dividerColor} />}
          </React.Fragment>
        );
      })}
    </StyledButtonGroup>
  );
};

const ButtonGroup = assignWithoutSideEffects(React.forwardRef(_ButtonGroup), {
  displayName: 'ButtonGroup',
  componentId: 'ButtonGroup',
});

export { ButtonGroup };
export type { ButtonGroupProps };
