import React from 'react';
import type { ButtonGroupProps } from './types';
import { StyledButtonGroup } from './StyledButtonGroup';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import styled from 'styled-components';
import { makeBorderSize } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import { getBackgroundColorToken } from '~components/Button/BaseButton/BaseButton';
import { ButtonGroupProvider } from './ButtonGroupContext';

const getDividerColorToken = ({
  color,
  variant,
  isDisabled,
}: Pick<ButtonGroupProps, 'color' | 'isDisabled' | 'variant'>) => {
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

const _ButtonGroup = ({
  children,
  isDisabled = false,
  size = 'medium',
  color = 'primary',
  variant = 'primary',
  isFullWidth = false,
  testID,
  ...styledProps
}: ButtonGroupProps): React.ReactElement => {
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
        color={color}
        variant={variant}
        isDisabled={isDisabled}
        isFullWidth={isFullWidth}
        {...metaAttribute({ name: MetaConstants.ButtonGroup, testID })}
        {...getStyledProps(styledProps)}
        role="group"
      >
        {React.Children.map(children, (child, index) => {
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

const ButtonGroup = assignWithoutSideEffects(_ButtonGroup, {
  displayName: 'ButtonGroup',
  componentId: 'ButtonGroup',
});

export { ButtonGroup };
export type { ButtonGroupProps };
