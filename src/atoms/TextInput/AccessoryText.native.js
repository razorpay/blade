import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Text from '../Text';
import Space from '../Space';
import View from '../View';

const IS_ANDROID = Platform.OS === 'android';

const styles = {
  color({ disabled }) {
    if (disabled) {
      return 'shade.930';
    } else {
      return 'shade.950';
    }
  },
  padding({ variant, _isMultiline }) {
    let top = 1;
    if (_isMultiline || !IS_ANDROID) {
      top = 0;
    }

    if (variant === 'filled') {
      return [0, 1, 0, 1];
    } else {
      return [top, 0.5, 0, 0];
    }
  },
};

const AccessoryText = ({ children, disabled, variant, _isMultiline }) => {
  return (
    <Space padding={styles.padding({ variant, _isMultiline })}>
      <View>
        <Text maxLines={1} color={styles.color({ disabled })} size="medium">
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
  _isMultiline: PropTypes.bool,
};

AccessoryText.defaultProps = {
  children: '',
  disabled: false,
  _isMultiline: false,
};

export default AccessoryText;
