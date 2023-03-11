import type { ReactElement } from 'react';
import React, { useState } from 'react';
import styled from 'styled-components/native';

import type { StyledIconButtonProps } from './types';
import { makeAccessible } from '~utils';
import type { ColorContrastTypes } from '~tokens/theme/theme';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';

type State = 'active' | 'default';
type IconColorToken = `surface.action.icon.${State}.${ColorContrastTypes}Contrast`;

type StyledPressableProps = {
  contrast: ColorContrastTypes;
};

const StyledPressable = styled.Pressable<StyledPressableProps>({
  alignSelf: 'center', // ensure button only takes needed width
});

const _StyledIconButton: React.ForwardRefRenderFunction<BladeElementRef, StyledIconButtonProps> = (
  { icon: Icon, onClick, size, contrast, accessibilityLabel },
  ref,
): ReactElement => {
  const [isPressed, setIsPressed] = useState(false);
  const getIconColorToken = (): IconColorToken => {
    const contrastType = contrast === 'high' ? 'highContrast' : 'lowContrast';
    const state = isPressed ? 'active' : 'default';

    return `surface.action.icon.${state}.${contrastType}`;
  };
  const iconColorToken = getIconColorToken();

  return (
    <StyledPressable
      ref={ref as never}
      contrast={contrast}
      onPress={onClick}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      {...makeAccessible({ label: accessibilityLabel, role: 'button' })}
    >
      <Icon size={size} color={iconColorToken} />
    </StyledPressable>
  );
};

const StyledIconButton = React.forwardRef(_StyledIconButton);
export default StyledIconButton;
