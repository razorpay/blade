import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text';
import Space from '../Space';
import Flex from '../Flex';

const styles = {
  color({ disabled }) {
    if (disabled) {
      return 'shade.300';
    } else {
      return 'shade.500';
    }
  },
};

const HelpText = ({ children, disabled }) => {
  //TODO: have a fixed  height
  return (
    <Space padding={[0.5, 0, 0, 0]}>
      <Flex flex={1}>
        <View>
          <Text
            numberOfLines={2}
            disabled={disabled}
            color={styles.color({ disabled })}
            size="xsmall"
          >
            {children}
          </Text>
        </View>
      </Flex>
    </Space>
  );
};

HelpText.propTypes = {
  children: PropTypes.string,
  disabled: PropTypes.bool,
};

HelpText.defaultProps = {};

export default HelpText;
