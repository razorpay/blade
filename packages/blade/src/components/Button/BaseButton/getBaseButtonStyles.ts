import type { CSSObject } from 'styled-components';
import type { StyledBaseButtonProps } from './StyledBaseButton';

const getBaseButtonStyles = ({
  color,
  hoverColor,
  activeColor,
  minHeight,
  spacing,
}: Omit<StyledBaseButtonProps, 'children' | 'onClick'>): CSSObject => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'center',
  minHeight,
  cursor: 'pointer',
  backgroundColor: color,
  border: `2px solid ${color}`,
  color: 'white',
  borderRadius: '2px',
  padding: spacing,
  '&:hover': {
    backgroundColor: hoverColor,
    border: `2px solid ${hoverColor}`,
  },
  '&:active': {
    backgroundColor: activeColor,
    border: `2px solid ${activeColor}`,
  },
});

export default getBaseButtonStyles;
