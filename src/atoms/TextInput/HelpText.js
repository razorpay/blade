import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledText = styled(Text)`
  color: ${(props) => props.theme.colors.shade[500]};
  font-size: 12px;
  line-height: 18px;
  padding-top: 4px;
  max-width: 240px;
`;

const HelpText = ({ children }) => {
  return <StyledText numberOfLines={2}>{children}</StyledText>;
};

HelpText.propTypes = {
  children: PropTypes.string,
};

HelpText.defaultProps = {};

export default HelpText;
