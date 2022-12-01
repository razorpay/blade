import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import View from '../View';
import Size from '../Size';

const styles = {
  backgroundColor({ isFocused, hasError, theme, disabled }) {
    if (disabled) {
      return theme.bladeOld.colors.shade[920];
    } else if (hasError) {
      return theme.bladeOld.colors.negative[900];
    } else if (isFocused) {
      return theme.bladeOld.colors.primary[800];
    } else {
      return theme.bladeOld.colors.shade[940];
    }
  },
};

const StyledLine = styled(View)`
  background-color: ${styles.backgroundColor};
`;

const Line = ({ isFocused, hasError, disabled }) => {
  return (
    <Size height="1px">
      <StyledLine isFocused={isFocused} hasError={hasError} disabled={disabled} />
    </Size>
  );
};

Line.propTypes = {
  isFocused: PropTypes.bool.isRequired,
  hasError: PropTypes.bool,
  disabled: PropTypes.bool,
};

Line.defaultProps = {
  hasError: false,
  disabled: false,
};

export default Line;
