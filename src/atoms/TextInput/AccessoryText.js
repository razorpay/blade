import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledText = styled(Text)`
  color: ${(props) =>
    props.disabled ? props.theme.colors.shade[300] : props.theme.colors.shade[500]};
  padding-right: 4px;
  font-size: 14px;
  line-height: 20px;
`;

const AccessoryText = ({ children, disabled }) => {
  return (
    <StyledText numberOfLines={1} disabled={disabled}>
      {children}
    </StyledText>
  );
};

AccessoryText.propTypes = {
  children: PropTypes.string,
  disabled: PropTypes.bool,
};

AccessoryText.defaultProps = {};

export default AccessoryText;
