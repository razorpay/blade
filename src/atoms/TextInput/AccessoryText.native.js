import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Text from '../Text';
import Space from '../Space';
import View from '../View';

const styles = {
  color({ disabled }) {
    if (disabled) {
      return 'shade.930';
    } else {
      return 'shade.950';
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

const AccessoryText = ({ children, disabled, variant }) => {
  return (
    <Space padding={styles.padding({ variant })}>
      <View>
        <Text numberOfLines={1} color={styles.color({ disabled })} size="medium">
          {children}
        </Text>
      </View>
    </Space>
  );
};

AccessoryText.propTypes = {
  children: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.string.isRequired,
};

AccessoryText.defaultProps = {};

export default AccessoryText;
