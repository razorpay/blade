import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import Flex from '../Flex';
import View from '../View';
import Space from '../Space';

const styles = {
  padding() {
    return [0.5, 0, 0, 0];
  },
};

const ErrorText = ({ children }) => {
  return (
    <Space padding={styles.padding()}>
      <Flex flex={1}>
        <View>
          <Text numberOfLines={2} color="negative.900" size="xsmall">
            {children}
          </Text>
        </View>
      </Flex>
    </Space>
  );
};

ErrorText.propTypes = {
  children: PropTypes.string,
};

ErrorText.defaultProps = {
  children: '',
};

export default ErrorText;
