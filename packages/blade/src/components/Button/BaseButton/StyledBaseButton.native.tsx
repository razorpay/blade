import styled from 'styled-components/native';
import getBaseButtonStyles from './getBaseButtonStyles';
import type { StyledBaseButtonProps } from './StyledBaseButton';

const StyledPressable = styled.Pressable(
  (props: Omit<StyledBaseButtonProps, 'children' | 'onClick'>) => getBaseButtonStyles(props),
);

const StyledBaseButton = ({
  onClick,
  children,
  minHeight,
  spacing,
  isFullWidth,
  disabled,
  defaultColor,
  defaultBorderColor,
  hoverColor,
  activeColor,
  focusColor,
  focusRingColor,
  hoverBorderColor,
  activeBorderColor,
  focusBorderColor,
  borderWidth,
  borderRadius,
}: StyledBaseButtonProps): React.ReactElement => {
  return (
    <StyledPressable
      onPress={onClick}
      style={({ pressed }): { backgroundColor: string; borderColor: string } => ({
        backgroundColor: pressed ? activeColor : defaultColor,
        borderColor: pressed ? activeColor : defaultColor,
      })}
      minHeight={minHeight}
      spacing={spacing}
      isFullWidth={isFullWidth}
      disabled={disabled}
      defaultColor={defaultColor}
      defaultBorderColor={defaultBorderColor}
      hoverColor={hoverColor}
      activeColor={activeColor}
      focusColor={focusColor}
      focusRingColor={focusRingColor}
      hoverBorderColor={hoverBorderColor}
      activeBorderColor={activeBorderColor}
      focusBorderColor={focusBorderColor}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
    >
      {children}
    </StyledPressable>
  );
};

export default StyledBaseButton;
