import React from 'react';
import PropTypes from 'prop-types';
import Space from '../Space';
import Flex from '../Flex';

const styles = {
  color({ disabled, hasError, isFocused }) {
    if (disabled) {
      return 'shade.930';
    }
    if (hasError) {
      return 'negative.900';
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

const AccessoryIcon = ({ icon: Icon, disabled, hasError, variant, isFocused, position }) => {
  return (
    <Space
      padding={styles.padding({
        variant,
        position,
      })}
    >
      <Flex>
        <Icon
          size="small"
          fill={styles.color({
            disabled,
            hasError,
            isFocused,
          })}
          testID="input-icon"
        />
      </Flex>
    </Space>
  );
};

AccessoryIcon.propTypes = {
  icon: PropTypes.elementType,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  variant: PropTypes.oneOf(['filled', 'outlined']).isRequired,
  position: PropTypes.string,
  isFocused: PropTypes.bool,
};

AccessoryIcon.defaultProps = {
  disabled: false,
  hasError: false,
};

export default AccessoryIcon;
