import React from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Space from '../Space';

const styles = {
  color({ disabled, hasError }) {
    if (hasError) {
      return 'negative.900';
    } else if (disabled) {
      return 'shade.300';
    } else {
      return 'shade.500';
    }
  },
  padding({ variant }) {
    const top = Platform.OS === 'android' ? 1 : 0;
    if (variant === 'filled') {
      return [top, 1, 0, 1];
    } else {
      return [top, 0.5, 0, 0];
    }
  },
};

const AccessoryText = ({ name, disabled, size, hasError, variant }) => {
  return (
    <Space padding={styles.padding({ variant })}>
      <View>
        <Icon name={name} size={size} fill={styles.color({ disabled, hasError })} />
      </View>
    </Space>
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
