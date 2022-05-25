import type { StyledBaseButtonProps } from './StyledBaseButton';

const getBaseButtonStyles = ({
  color,
  hoverColor,
  activeColor,
  buttonHeight,
  buttonSpacing,
}: Omit<StyledBaseButtonProps, 'children' | 'onClick'>): string => `
  display: flex;  
  flex-direction: row;
  align-items: center;
  align-self: center;
  height: ${buttonHeight};
  cursor: pointer;
  background-color: ${color};
  border: 2px solid ${color};
  color: white;
  border-radius: 2px;
  padding: ${buttonSpacing};
  &:hover {
    background-color: ${hoverColor};
    border: 2px solid ${hoverColor};
  }
  &:active {
    background-color: ${activeColor};
    border: 2px solid ${activeColor};
  }
`;

export default getBaseButtonStyles;
