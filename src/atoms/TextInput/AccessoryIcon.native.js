import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Space from '../Space';
import View from '../View';

const styles = {
  color({ disabled, hasError }) {
    if (hasError) {
      return 'negative.900';
    } else {
      return disabled ? 'shade.930' : 'shade.950';
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

const AccessoryIcon = ({ name, disabled, size, hasError, variant }) => {
  return (
    <Space padding={styles.padding({ variant })}>
      <View>
        <Icon name={name} size={size} fill={styles.color({ disabled, hasError })} />
      </View>
    </Space>
  );
};

AccessoryIcon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  variant: PropTypes.string.isRequired,
};

AccessoryIcon.defaultProps = {};

export default AccessoryIcon;
