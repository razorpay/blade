import styled from 'styled-components/native';
import React from 'react';
import type { NavigationButtonProps } from './types';
import { getNavigationButtonStyles } from './getNavigationButtonStyles';
import { makeAccessible } from '~utils/makeAccessible';

const StyledPressable = styled.Pressable<
  Pick<NavigationButtonProps, 'variant'> & { isPressed: boolean }
>((props) => {
  return getNavigationButtonStyles(props);
});

const StyledNavigationButton = ({
  children,
  onClick,
  variant,
  accessibilityLabel,
}: Pick<NavigationButtonProps, 'variant' | 'onClick'> & {
  children: React.ReactNode;
  accessibilityLabel?: string;
}): React.ReactElement => {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <StyledPressable
      isPressed={isPressed}
      variant={variant}
      onPress={onClick}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      {...makeAccessible({ role: 'button', label: accessibilityLabel })}
    >
      {children}
    </StyledPressable>
  );
};

export { StyledNavigationButton };
