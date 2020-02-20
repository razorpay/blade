import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Text from '../Text';
import Space from '../Space/Space.native';

const styles = {
  color({ disabled }) {
    if (disabled) {
      return 'shade.300';
    } else {
      return 'shade.500';
    }
  },
  padding({ variant }) {
    if (variant === 'filled') {
      return [0, 1, 0, 1];
    } else {
      return [0, 0.5, 0, 0];
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
