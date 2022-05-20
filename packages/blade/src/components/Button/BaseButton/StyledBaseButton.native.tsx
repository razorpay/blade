import styled from 'styled-components/native';
import getBaseButtonStyles from './getBaseButtonStyles';
import type { StyledBaseButtonProps } from './StyledBaseButton';

const StyledPressable = styled.Pressable(
  ({ color, hoverColor }: Omit<StyledBaseButtonProps, 'onClick'>) =>
    getBaseButtonStyles({ color, hoverColor }),
);

const StyledBaseButton = ({
  onClick,
  color,
  hoverColor,
  children,
}: StyledBaseButtonProps): React.ReactElement => {
  return (
    <StyledPressable onPress={onClick} color={color} hoverColor={hoverColor}>
      {children}
    </StyledPressable>
  );
};

export default StyledBaseButton;
