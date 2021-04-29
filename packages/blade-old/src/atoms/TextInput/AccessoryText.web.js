import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import Space from '../Space';

const styles = {
  color({ disabled, isFocused }) {
    if (disabled) {
      return 'shade.930';
    }
    if (isFocused) {
      return 'shade.960';
    }
    return 'shade.950';
  },
  padding({ variant, position }) {
    let padding = [0];
    if (variant === 'filled') {
      if (position === 'left') {
        padding = [0, 0, 0, 1];
      }
      if (position === 'right') {
        padding = [0, 1, 0, 0];
      }
    }
    if (variant === 'outlined') {
      if (position === 'left') {
        padding = [0.25, 1, 0, 0];
      }
      if (position === 'right') {
        padding = [0.25, 1, 0, 1];
      }
    }
    return padding;
  },
};

const AccessoryText = ({ children, disabled, variant, position, isFocused }) => {
  return (
    <Space
      padding={styles.padding({
        variant,
        position,
      })}
    >
      <Text
        color={styles.color({
          disabled,
          isFocused,
        })}
        size="medium"
      >
        {children}
      </Text>
    </Space>
  );
};

AccessoryText.propTypes = {
  children: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.string.isRequired,
  position: PropTypes.string,
  isFocused: PropTypes.bool,
};

AccessoryText.defaultProps = {
  children: '',
  disabled: false,
};

export default AccessoryText;
