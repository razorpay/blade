import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const styles = {
  color({ theme, disabled }) {
    if (disabled) {
      return theme.colors.shade[300];
    } else {
      return theme.colors.shade[500];
    }
  },
  padding({ variant }) {
    if (variant === 'filled') {
      return '0px 8px 0px 8px';
    } else {
      return '0px 4px 0px 0px';
    }
  },
};

const StyledText = styled(Text)`
  color: ${styles.color};
  padding: ${styles.padding};
  font-size: 14px;
  line-height: 20px;
`;

const AccessoryText = ({ children, disabled, variant }) => {
  return (
    <StyledText numberOfLines={1} disabled={disabled} variant={variant}>
      {children}
    </StyledText>
  );
};

AccessoryText.propTypes = {
  children: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.string.isRequired,
};

AccessoryText.defaultProps = {};

export default AccessoryText;
