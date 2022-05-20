import type { StyledBaseButtonProps } from './StyledBaseButton';

const getBaseButtonStyles = ({
  color,
  hoverColor,
}: Omit<StyledBaseButtonProps, 'children' | 'onClick'>): string => `
  height: 48px;
  background-color: ${color} ;
  border: 2px solid ${color} ;
  color: white;
  border-radius: 2px;
  justify-content: center;
  align-self: center;
  padding: 0px 20px 0px 20px;
  &:hover {
    background-color: ${hoverColor};
    border: 2px solid ${hoverColor};
  }
`;

export default getBaseButtonStyles;
