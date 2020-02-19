import React, { useContext } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components/native';
import Icon from '../Icon';

const Container = styled(View)`
  padding-right: 4px;
`;

const AccessoryText = ({ name, disabled, size, hasError }) => {
  const theme = useContext(ThemeContext);
  const fill = hasError
    ? theme.colors.negative[900]
    : disabled
    ? theme.colors.shade[300]
    : theme.colors.shade[500];
  return (
    <Container disabled={disabled}>
      <Icon name={name} size={size} fill={fill} />
    </Container>
  );
};

AccessoryText.propTypes = {
  name: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
};

AccessoryText.defaultProps = {};

export default AccessoryText;
