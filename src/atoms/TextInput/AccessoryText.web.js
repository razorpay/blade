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
  padding({ variant }) {
    if (variant === 'filled') {
      return [0, 1, 0, 1];
    } else {
      return [1, 1, 0, 0];
    }
  },
};

const AccessoryText = ({ children, disabled, variant }) => {
  return (
    <Space padding={styles.padding({ variant })}>
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
};

AccessoryText.defaultProps = {
  children: '',
  disabled: false,
};

export default AccessoryText;
