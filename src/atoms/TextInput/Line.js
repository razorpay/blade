import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const styles = {
  backgroundColor({ isFocused, hasError, theme }) {
    if (hasError) {
      return theme.colors.negative[900];
    } else if (isFocused) {
      return theme.colors.primary[800];
    } else {
      return theme.colors.shade[400];
    }
  },
};

const StyledLine = styled(View)(
  (props) => `
  height: 1px;
  width: 240px;
  background-color: ${styles.backgroundColor(props)};
`,
);

const Line = ({ isFocused, hasError }) => {
  return <StyledLine isFocused={isFocused} hasError={hasError} />;
};

Line.propTypes = {
  isFocused: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
};

Line.defaultProps = {};

export default Line;
