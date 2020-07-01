import React from 'react';
import PropTypes from 'prop-types';
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
  padding({ variant, hasPrefix, hasSuffix }) {
    let padding = [0];
    if (variant === 'filled') {
      if (hasPrefix) {
        padding = [0, 0, 0, 1];
      }
      if (hasSuffix) {
        padding = [0, 1, 0, 0];
      }
    }
    if (variant === 'outlined') {
      if (hasPrefix) {
        padding = [0.5, 1, 0, 0];
      }
      if (hasSuffix) {
        padding = [0.5, 1, 0, 1];
      }
    }
    return padding;
  },
};

const AccessoryText = ({ children, disabled, variant, hasPrefix, hasSuffix }) => {
  return (
    <Space padding={styles.padding({ variant, hasPrefix, hasSuffix })}>
      <View>
        <Text color={styles.color({ disabled })} size="medium">
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
  hasPrefix: PropTypes.bool,
  hasSuffix: PropTypes.bool,
};

AccessoryText.defaultProps = {
  children: '',
  disabled: false,
};

export default AccessoryText;
