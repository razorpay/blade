import React, { useContext } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components/native';
import Icon from '../Icon';

const styles = {
  padding({ variant }) {
    if (variant === 'filled') {
      return '0px 8px 0px 8px';
    } else {
      return '0px 4px 0px 0px';
    }
  },
};

const Container = styled(View)`
  padding: ${styles.padding};
`;

const AccessoryText = ({ name, disabled, size, hasError, variant }) => {
  const theme = useContext(ThemeContext);
  const fill = hasError
    ? theme.colors.negative[900]
    : disabled
    ? theme.colors.shade[300]
    : theme.colors.shade[500];
  return (
    <Container disabled={disabled} variant={variant}>
      <Icon name={name} size={size} fill={fill} />
    </Container>
  );
};

AccessoryText.propTypes = {
  name: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  variant: PropTypes.string.isRequired,
};

AccessoryText.defaultProps = {};

export default AccessoryText;
