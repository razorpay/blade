import type { StyledBaseButtonProps } from './StyledBaseButton';

const getBaseButtonStyles = ({
  color,
  hoverColor,
  activeColor,
}: Omit<StyledBaseButtonProps, 'children' | 'onClick'>): string => `
  display:flex;
  flex-direction: row;
  height: 48px;
  cursor: pointer;
  background-color: ${color};
  border: 2px solid ${color};
  color: white;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: center;
  padding: 0px 20px 0px 20px;
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
