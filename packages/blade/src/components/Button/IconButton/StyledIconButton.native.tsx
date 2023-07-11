/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, { useState } from 'react';
import styled from 'styled-components/native';

import type { View } from 'react-native';
import type { StyledIconButtonProps } from './types';
import type { ColorContrastTypes } from '~tokens/theme/theme';
import { makeAccessible } from '~utils/makeAccessible';
import type { BladeCommonEvents } from '~components/types';

type State = 'active' | 'default';
type IconColorToken = `surface.action.icon.${State}.${ColorContrastTypes}Contrast`;

type StyledPressableProps = {
  contrast: ColorContrastTypes;
} & BladeCommonEvents;

const StyledPressable = styled.Pressable<StyledPressableProps>({
  alignSelf: 'center', // ensure button only takes needed width
});

const StyledIconButton = React.forwardRef<View, StyledIconButtonProps>(
  (
    {
      icon: Icon,
      isDisabled,
      onClick,
      onBlur,
      onFocus,
      onMouseLeave,
      onMouseMove,
      onPointerDown,
      onPointerEnter,
      onTouchEnd,
      onTouchStart,
      size,
      contrast,
      accessibilityLabel,
    },
    ref,
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const getIconColorToken = (): IconColorToken => {
      const contrastType = contrast === 'high' ? 'highContrast' : 'lowContrast';
      const state = isPressed ? 'active' : 'default';

      return `surface.action.icon.${state}.${contrastType}`;
    };
    const iconColorToken = getIconColorToken();

    return (
      <StyledPressable
        ref={ref as any}
        contrast={contrast}
        onPress={onClick}
        disabled={isDisabled}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchStart}
        {...makeAccessible({ label: accessibilityLabel, role: 'button' })}
      >
        <Icon size={size} color={iconColorToken} />
      </StyledPressable>
    );
  },
);

export default StyledIconButton;
