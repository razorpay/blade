import type { ReactElement } from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';

import type { StyledIconButtonProps } from './types';
import { makeAccessible } from '~utils';
import type { ColorContrastTypes } from '~tokens/theme/theme';

type State = 'active' | 'default';
type IconColorToken = `feedback.neutral.action.icon.link.${State}.${ColorContrastTypes}Contrast`;

type StyledPressableProps = {
  contrast: ColorContrastTypes;
};

const StyledPressable = styled.Pressable<StyledPressableProps>({
  alignSelf: 'center', // ensure button only takes needed width
});

const StyledIconButton = ({
  icon: Icon,
  onClick,
  size,
  contrast,
  accessibilityLabel,
}: StyledIconButtonProps): ReactElement => {
  const [isPressed, setIsPressed] = useState(false);
  const getIconColorToken = (): IconColorToken => {
    const contrastType = contrast === 'high' ? 'highContrast' : 'lowContrast';
    const state = isPressed ? 'active' : 'default';

    return `feedback.neutral.action.icon.link.${state}.${contrastType}`;
  };
  const iconColorToken = getIconColorToken();

  return (
    <StyledPressable
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

export default StyledIconButton;
