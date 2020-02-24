import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledText = styled(Text)`
  color: ${(props) => props.theme.colors.negative[900]};
  font-size: 12px;
  line-height: 18px;
  padding-top: 4px;
  max-width: 240px;
`;

const ErrorText = ({ children }) => {
  //TODO: have a fixed  height
  return <StyledText numberOfLines={2}>{children}</StyledText>;
};

ErrorText.propTypes = {
  children: PropTypes.string,
};

ErrorText.defaultProps = {};

export default ErrorText;
