import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import Text from '../Text';

const StyledButton = styled(TouchableOpacity)(
  (props) => `
  background-color: ${props.theme.colors.shade[800]};
  padding: 14px;`,
);

const Button = ({ onClick, children }) => {
  const theme = useContext(ThemeContext);

  return (
    <StyledButton onPress={onClick} testID="ds-button">
      <Text color={theme.colors.tone[900]} align="center">
        {children}
      </Text>
    </StyledButton>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Button;
