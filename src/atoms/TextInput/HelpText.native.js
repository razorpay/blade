import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledText = styled(Text)`
  color: ${(props) =>
    props.disabled ? props.theme.colors.shade[300] : props.theme.colors.shade[500]};
  font-size: 12px;
  line-height: 18px;
  padding-top: 4px;
  max-width: 240px;
`;

const HelpText = ({ children, disabled }) => {
  return (
    <StyledText numberOfLines={2} disabled={disabled}>
      {children}
    </StyledText>
  );
};

HelpText.propTypes = {
  children: PropTypes.string,
  disabled: PropTypes.bool,
};

HelpText.defaultProps = {};

export default HelpText;
