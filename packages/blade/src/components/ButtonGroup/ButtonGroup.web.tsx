import type { ReactElement } from 'react';
import React from 'react';
import styled from 'styled-components';
import type { ButtonGroupProps } from './types';
import { StyledButtonGroup } from './StyledButtonGroup';
import { ButtonGroupProvider } from './ButtonGroupContext';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeBorderSize } from '~utils';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import getIn from '~utils/lodashButBetter/get';
import { getBackgroundColorToken } from '~components/Button/BaseButton/BaseButton';
import type { Theme } from '~components/BladeProvider';
import { throwBladeError } from '~utils/logger';
import { isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import type { BladeElementRef } from '~utils/types';

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

const StyledDivider = styled(BaseBox)<Pick<ButtonGroupProps, 'color' | 'isDisabled' | 'variant'>>(
  ({ theme, color, variant, isDisabled }) => {
    return {
      borderWidth: 0,
      borderLeftStyle: 'solid',
      borderLeftWidth: makeBorderSize(theme.border.width.thin),
      alignSelf: 'stretch',
      color: getIn(theme.colors, getDividerColorToken({ color, variant, isDisabled })),
    };
  },
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
    ...styledProps
  }: ButtonGroupProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const contextValue = {
    isDisabled,
    size,
    color,
    variant,
    isFullWidth,
  };

  return (
    <ButtonGroupProvider value={contextValue}>
      <StyledButtonGroup
        ref={ref as never}
        color={color}
        variant={variant}
        isDisabled={isDisabled}
        isFullWidth={isFullWidth}
        {...metaAttribute({ name: MetaConstants.ButtonGroup, testID })}
        {...getStyledProps(styledProps)}
        role="group"
      >
        {React.Children.map(children, (child, index) => {
          if (__DEV__) {
            // throw error if child is not a button or dropdown with button trigger
            /* eslint-disable no-restricted-properties */
            if (
              !isValidAllowedChildren(child, 'Button') &&
              !(
                isValidAllowedChildren(child, 'Dropdown') &&
                (child as ReactElement).props.children.some((c: ReactElement) =>
                  isValidAllowedChildren(c, 'DropdownButton'),
                )
              )
            ) {
              throwBladeError({
                moduleName: 'ButtonGroup',
                message: `Only "Button" or "Dropdown" component with Button trigger are allowed as children.`,
              });
            }
            /* eslint-enable no-restricted-properties */
          }

          return (
            <>
              {child}
              {React.Children.count(children) - 1 !== index && (
                <StyledDivider variant={variant} color={color} isDisabled={isDisabled} />
              )}
            </>
          );
        })}
      </StyledButtonGroup>
    </ButtonGroupProvider>
  );
};

/**
 * ### ButtonGroup Component
 * 
 * The ButtonGroup component is used to group related buttons together.
 * 
 * ---
 * 
 * #### Usage
 * 
 * ```jsx
  const App = () => {
    return (
      <ButtonGroup>
        <Button icon={RefreshIcon}>Sync</Button>
        <Button icon={ShareIcon}>Share</Button>
        <Button icon={DownloadIcon}>Download</Button>
      </ButtonGroup>
    );
  }
 * ```
 *
 *  ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-buttongroup FileUpload Documentation}
 * 
 */
const ButtonGroup = assignWithoutSideEffects(_ButtonGroup, {
  displayName: 'ButtonGroup',
  componentId: 'ButtonGroup',
});

export { ButtonGroup };
export type { ButtonGroupProps };
