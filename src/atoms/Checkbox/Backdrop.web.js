import styled from 'styled-components';
import View from '../View';
import { getColor } from '../../_helpers/theme';

const styles = {
  backgroundColor({ theme, state, isChecked, disabled, variantColor }) {
    if (disabled) {
      return 'transparent';
    }

    const colorKey = variantColor || 'primary';
    switch (state) {
      case 'hover':
        if (!isChecked) {
          return theme.colors.tone[930];
        }
        return getColor(theme, `${colorKey}.920`);
      case 'focus':
        if (!isChecked) {
          return theme.colors.tone[940];
        }
        return getColor(theme, `${colorKey}.930`);
      case 'active':
        if (!isChecked) {
          return theme.colors.tone[940];
        }
        return getColor(theme, `${colorKey}.940`);
      default:
        return 'transparent';
    }
  },
  borderRadius: {
    large: '14px',
    medium: '12px',
    small: '10px',
    xsmall: '8px',
  },
};

const Backdrop = styled(View)`
  background-color: ${styles.backgroundColor};
  border-radius: ${(props) => styles.borderRadius[props.size]};
  outline: none;
  &:hover {
    background-color: ${(props) => styles.backgroundColor({ ...props, state: 'hover' })};
  }
  &:focus {
    background-color: ${(props) => styles.backgroundColor({ ...props, state: 'focus' })};
  }
  &:active {
    background-color: ${(props) => styles.backgroundColor({ ...props, state: 'active' })};
  }
`;

export default Backdrop;
