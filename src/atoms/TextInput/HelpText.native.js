import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import Space from '../Space';
import Flex from '../Flex';
import View from '../View';

const styles = {
  color({ disabled }) {
    if (disabled) {
      return 'shade.930';
    } else {
      return 'shade.950';
    }
  },
};

const HelpText = ({ children, disabled }) => {
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

HelpText.defaultProps = {
  children: '',
  disabled: false,
};

export default HelpText;
