import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Size from '../Size';
import View from '../View';

const styles = {
  backgroundColor({ isFocused, hasError, theme, disabled, rightAlignComponent }) {
    if (disabled && !rightAlignComponent) {
      return theme.colors.shade[920];
    } else if (hasError) {
      return theme.colors.negative[900];
    } else if (isFocused) {
      return theme.colors.primary[800];
    } else {
      return theme.colors.shade[940];
    }
  },
};

const StyledLine = styled(View)`
  background-color: ${styles.backgroundColor};
  position: absolute;
  bottom: 0;
`;

const Line = ({ isFocused, hasError, disabled, rightAlignComponent }) => {
  return (
    <Size height="1px" width="100%">
      <StyledLine
        isFocused={isFocused}
        hasError={hasError}
        disabled={disabled}
        rightAlignComponent={rightAlignComponent}
      />
    </Size>
  );
};

Line.propTypes = {
  isFocused: PropTypes.bool.isRequired,
  hasError: PropTypes.bool,
  disabled: PropTypes.bool,
  rightAlignComponent: PropTypes.node,
};

Line.defaultProps = {
  hasError: false,
  disabled: false,
  rightAlignComponent: '',
};

export default Line;
