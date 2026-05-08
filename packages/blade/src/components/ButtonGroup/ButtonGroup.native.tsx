import React from 'react';
import type { ButtonGroupProps } from './types';
import { ButtonGroupProvider } from './ButtonGroupContext';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTheme } from '~utils';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import getIn from '~utils/lodashButBetter/get';
import { getBackgroundColorToken } from '~components/Button/BaseButton/BaseButton';
import type { Theme } from '~components/BladeProvider';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren';
import { makeAccessible } from '~utils/makeAccessible';

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
      property: 'border',
      variant,
      color,
      state: isDisabled ? 'disabled' : 'default',
    });
  }

  return 'surface.border.gray.muted';
};

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

  const dividerColor = getIn(theme.colors, getDividerColorToken({ color, variant, isDisabled }));

  return (
    <ButtonGroupProvider value={contextValue}>
      <BaseBox
        ref={ref as never}
        {...metaAttribute({ name: MetaConstants.ButtonGroup, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
        {...makeAccessible({ role: 'group' })}
        display="flex"
        flexDirection="row"
        alignItems="stretch"
        overflow="hidden"
        borderWidth="thin"
        borderRadius="medium"
        borderColor="transparent"
        {...(isFullWidth ? { width: '100%' } : { alignSelf: 'flex-start' })}
      >
        {React.Children.map(children, (child, index) => {
          return (
            <>
              {child}
              {React.Children.count(children) - 1 !== index && (
                <BaseBox
                  style={{
                    width: theme.border.width.thin,
                    alignSelf: 'stretch',
                    backgroundColor: dividerColor,
                  }}
                />
              )}
            </>
          );
        })}
      </BaseBox>
    </ButtonGroupProvider>
  );
};

const ButtonGroup = assignWithoutSideEffects(React.forwardRef(_ButtonGroup), {
  displayName: 'ButtonGroup',
  componentId: 'ButtonGroup',
});

export { ButtonGroup };
export type { ButtonGroupProps };
