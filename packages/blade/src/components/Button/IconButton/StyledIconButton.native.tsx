/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, { useState } from 'react';
import styled from 'styled-components/native';

import type { View } from 'react-native';
import type { StyledIconButtonProps } from './types';
import type { Emphasis, SubtleOrIntense } from '~tokens/theme/theme';
import { makeAccessible } from '~utils/makeAccessible';
import type { BladeCommonEvents } from '~components/types';
import { castNativeType } from '~utils';

type IconColorStates = keyof Pick<Emphasis, 'muted' | 'subtle' | 'disabled'>;
type EmphasisIconColorsType = 'staticWhite' | 'gray';
type IconColorToken = `interactive.icon.${EmphasisIconColorsType}.${IconColorStates}`;

type StyledPressableProps = {
  emphasis: SubtleOrIntense;
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
      emphasis,
      accessibilityLabel,
    },
    ref,
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const getIconColorToken = (): IconColorToken => {
      const emphasisColor = emphasis === 'intense' ? 'gray' : 'staticWhite';

      if (isDisabled) {
        return `interactive.icon.${emphasisColor}.disabled`;
      }

      const state = isPressed ? 'subtle' : 'muted';

      return `interactive.icon.${emphasisColor}.${state}`;
    };
    const iconColorToken = getIconColorToken();

    return (
      <StyledPressable
        ref={ref as any}
        emphasis={emphasis}
        onPress={castNativeType(onClick)}
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
