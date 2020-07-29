import styled from 'styled-components';
import View from '../View';

const styles = {
  backgroundColor({ theme, state, isChecked, disabled }) {
    if (disabled) {
      return 'transparent';
    }
    switch (state) {
      case 'hover':
        if (!isChecked) {
          return theme.colors.tone[930];
        }
        return theme.colors.primary[920];
      case 'focus':
        if (!isChecked) {
          return theme.colors.tone[940];
        }
        return theme.colors.primary[930];
      case 'active':
        if (!isChecked) {
          return theme.colors.tone[940];
        }
        return theme.colors.primary[940];
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
