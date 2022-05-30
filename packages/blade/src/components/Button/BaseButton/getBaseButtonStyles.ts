import type { StyledBaseButtonProps } from './StyledBaseButton';

const getBaseButtonStyles = ({
  activeBorderColor,
  activeColor,
  borderColor,
  buttonHeight,
  buttonSpacing,
  color,
  disabled,
  focusBorderColor,
  focusColor,
  focusRingColor,
  hoverBorderColor,
  hoverColor,
  isFullWidth,
}: Omit<StyledBaseButtonProps, 'children' | 'onClick'>): string => `
  display: flex;  
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: center;
  height: ${buttonHeight};
  width: ${isFullWidth ? '100%' : 'auto'};
  cursor: ${disabled ? 'not-allowed' : 'pointer'} ;
  background-color: ${color};
  border: 2px solid ${borderColor};
  color: white;
  border-radius: 2px;
  padding: ${buttonSpacing};
  &:hover {
    background-color: ${hoverColor};
    border: 2px solid ${hoverBorderColor};
  }
  &:active {
    background-color: ${activeColor};
    border: 2px solid ${activeBorderColor};
  }
  &:focus {
    background-color: ${focusColor};
    border: 2px solid ${focusBorderColor};
    box-shadow: 0px 0px 0px 4px ${focusRingColor};
    outline: none;
  }
 
`;

export default getBaseButtonStyles;
