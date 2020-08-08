import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Space from '../Space';
import View from '../View';
import Flex from '../Flex';

const styles = {
  color({ disabled, hasError }) {
    if (hasError) {
      return 'negative.900';
    } else if (disabled) {
      return 'shade.930';
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
        padding = [0.5, 1, 0, 0];
      }
      if (position === 'right') {
        padding = [0.5, 1, 0, 1];
      }
    }
    return padding;
  },
};

const AccessoryIcon = ({ name, disabled, hasError, variant, position }) => {
  return (
    <Space padding={styles.padding({ variant, position })}>
      <Flex>
        <View>
          <Icon name={name} size="small" fill={styles.color({ disabled, hasError })} />
        </View>
      </Flex>
    </Space>
  );
};

AccessoryIcon.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  variant: PropTypes.oneOf(['filled', 'outlined']).isRequired,
  position: PropTypes.string,
};

AccessoryIcon.defaultProps = {
  name: 'info',
  disabled: false,
  hasError: false,
};

export default AccessoryIcon;
