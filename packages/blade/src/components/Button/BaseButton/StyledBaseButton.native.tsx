import styled from 'styled-components/native';
import getBaseButtonStyles from './getBaseButtonStyles';
import type { StyledBaseButtonProps } from './StyledBaseButton';

const StyledPressable = styled.Pressable(
  ({ color, hoverColor, activeColor }: Omit<StyledBaseButtonProps, 'children' | 'onClick'>) =>
    getBaseButtonStyles({ color, hoverColor, activeColor }),
);

const StyledBaseButton = ({
  onClick,
  color,
  hoverColor,
  activeColor,
  children,
}: StyledBaseButtonProps): React.ReactElement => {
  return (
    <StyledPressable
      onPress={onClick}
      color={color}
      hoverColor={hoverColor}
      activeColor={activeColor}
      style={({ pressed }): { backgroundColor: string; borderColor: string } => ({
        backgroundColor: pressed ? activeColor : color,
        borderColor: pressed ? activeColor : color,
      })}
    >
      {children}
    </StyledPressable>
  );
};

export default StyledBaseButton;
