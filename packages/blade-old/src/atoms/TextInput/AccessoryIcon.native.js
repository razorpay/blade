import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import Space from '../Space';
import View from '../View';

const IS_ANDROID = Platform.OS === 'android';

const styles = {
  color({ disabled, hasError }) {
    if (hasError) {
      return 'negative.900';
    } else if (disabled) {
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

const AccessoryIcon = ({ icon: Icon, disabled, hasError, variant, _isMultiline }) => {
  return (
    <Space
      padding={styles.padding({
        variant,
        _isMultiline,
      })}
    >
      <View>
        <Icon
          size="small"
          fill={styles.color({
            disabled,
            hasError,
          })}
          testID="input-icon"
        />
      </View>
    </Space>
  );
};

AccessoryIcon.propTypes = {
  icon: PropTypes.elementType,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  variant: PropTypes.oneOf(['filled', 'outlined']).isRequired,
  _isMultiline: PropTypes.bool,
};

AccessoryIcon.defaultProps = {
  disabled: false,
  hasError: false,
  _isMultiline: false,
};

export default AccessoryIcon;
