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
    } else {
      return 'shade.950';
    }
  },
  padding({ variant, hasLeftIcon, hasRightIcon }) {
    let padding = [0];
    if (variant === 'filled') {
      if (hasLeftIcon) {
        padding = [0, 0, 0, 1];
      }
      if (hasRightIcon) {
        padding = [0, 1, 0, 0];
      }
    }
    if (variant === 'outlined') {
      if (hasLeftIcon) {
        padding = [0.5, 1, 0, 0];
      }
      if (hasRightIcon) {
        padding = [0.5, 1, 0, 1];
      }
    }
    return padding;
  },
};

const AccessoryIcon = ({ name, disabled, hasError, variant, hasLeftIcon, hasRightIcon }) => {
  return (
    <Space padding={styles.padding({ variant, hasLeftIcon, hasRightIcon })}>
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
  hasLeftIcon: PropTypes.bool,
  hasRightIcon: PropTypes.bool,
};

AccessoryIcon.defaultProps = {
  name: 'info',
  disabled: false,
  hasError: false,
};

export default AccessoryIcon;
