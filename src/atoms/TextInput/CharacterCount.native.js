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

const CharacterCount = ({ maxLength, inputLength, disabled }) => {
  return (
    <Space padding={[0.5, 0, 0, 1]}>
      <Flex flex={0}>
        <View>
          <Text
            numberOfLines={2}
            disabled={disabled}
            color={styles.color({ disabled })}
            size="xsmall"
          >
            {`${inputLength}/${maxLength}`}
          </Text>
        </View>
      </Flex>
    </Space>
  );
};

CharacterCount.propTypes = {
  maxLength: PropTypes.number,
  inputLength: PropTypes.number,
  disabled: PropTypes.bool,
};

CharacterCount.defaultProps = {};

export default CharacterCount;
