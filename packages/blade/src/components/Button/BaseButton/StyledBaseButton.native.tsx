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
  defaultBackgroundColor,
  defaultBorderColor,
  hoverBackgroundColor,
  activeBackgroundColor,
  focusBackgroundColor,
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
        backgroundColor: pressed ? activeBackgroundColor : defaultBackgroundColor,
        borderColor: pressed ? activeBackgroundColor : defaultBackgroundColor,
      })}
      minHeight={minHeight}
      spacing={spacing}
      isFullWidth={isFullWidth}
      disabled={disabled}
      defaultBackgroundColor={defaultBackgroundColor}
      defaultBorderColor={defaultBorderColor}
      hoverBackgroundColor={hoverBackgroundColor}
      activeBackgroundColor={activeBackgroundColor}
      focusBackgroundColor={focusBackgroundColor}
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
