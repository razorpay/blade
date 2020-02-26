import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import View from '../View';

const styles = {
  backgroundColor({ isFocused, hasError, theme, disabled }) {
    if (disabled) {
      return theme.colors.shade[200];
    } else if (hasError) {
      return theme.colors.negative[900];
    } else if (isFocused) {
      return theme.colors.primary[800];
    } else {
      return theme.colors.shade[400];
    }
  },
};

const StyledLine = styled(View)`
  height: 1px;
  background-color: ${styles.backgroundColor};
`;

const Line = ({ isFocused, hasError, disabled }) => {
  return <StyledLine isFocused={isFocused} hasError={hasError} disabled={disabled} />;
};

Line.propTypes = {
  isFocused: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

Line.defaultProps = {};

export default Line;
