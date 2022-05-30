import type { CSSObject } from 'styled-components';
import type { StyledBaseButtonProps } from './StyledBaseButton';

const getBaseButtonStyles = ({
  color,
  hoverColor,
  activeColor,
}: Omit<StyledBaseButtonProps, 'children' | 'onClick'>): CSSObject => ({
  display: 'flex',
  flexDirection: 'row',
  minHeight: '48px',
  cursor: 'pointer',
  backgroundColor: color,
  border: `2px solid ${color}`,
  color: 'white',
  borderRadius: '2px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  alignSelf: 'center',
  padding: '0px 20px 0px 20px',
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
