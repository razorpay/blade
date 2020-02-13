import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import Text from '../Text';

const StyledButton = styled(TouchableOpacity)(
  (props) => `
  background-color: ${props.theme.colors.primary[900]};
  padding-top: 14px;`,
);

const Button = ({ onClick, children }) => (
  <StyledButton onPress={onClick} testID="ds-button">
    <Text color="white">{children}</Text>
  </StyledButton>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Button;
