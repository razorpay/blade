import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledLine = styled(View)(
  (props) => `
  height: 1px;
  width: 240px;
  background-color: ${
    props.isFocused ? props.theme.colors.primary[800] : props.theme.colors.shade[400]
  };
`,
);

const Line = ({ isFocused }) => {
  return <StyledLine isFocused={isFocused} />;
};

Line.propTypes = {
  isFocused: PropTypes.bool.isRequired,
};

Line.defaultProps = {};

export default Line;
