import styled from 'styled-components/native';
import getBaseButtonStyles from './getBaseButtonStyles';
import type { StyledBaseButtonProps } from './StyledBaseButton';

const StyledPressable = styled.Pressable(
  ({
    activeBorderColor,
    activeColor,
    borderColor,
    minHeight,
    spacing,
    color,
    disabled,
    focusBorderColor,
    focusColor,
    focusRingColor,
    hoverBorderColor,
    hoverColor,
    isFullWidth,
  }: Omit<StyledBaseButtonProps, 'children' | 'onClick'>) =>
    getBaseButtonStyles({
      activeBorderColor,
      activeColor,
      borderColor,
      minHeight,
      spacing,
      color,
      disabled,
      focusBorderColor,
      focusColor,
      focusRingColor,
      hoverBorderColor,
      hoverColor,
      isFullWidth,
    }),
);

const StyledBaseButton = ({
  onClick,
  children,
  minHeight,
  spacing,
  isFullWidth,
  disabled,
  color,
  borderColor,
  hoverColor,
  activeColor,
  focusColor,
  focusRingColor,
  hoverBorderColor,
  activeBorderColor,
  focusBorderColor,
}: StyledBaseButtonProps): React.ReactElement => {
  return (
    <StyledPressable
      onPress={onClick}
      style={({ pressed }): { backgroundColor: string; borderColor: string } => ({
        backgroundColor: pressed ? activeColor : color,
        borderColor: pressed ? activeColor : color,
      })}
      minHeight={minHeight}
      spacing={spacing}
      isFullWidth={isFullWidth}
      disabled={disabled}
      color={color}
      borderColor={borderColor}
      hoverColor={hoverColor}
      activeColor={activeColor}
      focusColor={focusColor}
      focusRingColor={focusRingColor}
      hoverBorderColor={hoverBorderColor}
      activeBorderColor={activeBorderColor}
      focusBorderColor={focusBorderColor}
    >
      {children}
    </StyledPressable>
  );
};

export default StyledBaseButton;
