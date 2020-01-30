import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled.TouchableOpacity`
  background-color: ${'#202c41'};
  padding-vertical: 14px;
  border-radius: 6px;
  border-width: 1px;
  margin-vertical: 7px;
`;

const StyledText = styled.Text`
  color: ${'#fff'};
  align-self: center;
  font-size: 18px;
`;

const Button = ({ onClick, children, ...rest }) => (
  <StyledButton onPress={onClick} {...rest}>
    <StyledText>{children}</StyledText>
  </StyledButton>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Button;
