import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import Space from '../Space';

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
  return (
    <Space padding={[0.5, 0, 0, 0]}>
      <Text numberOfLines={2} disabled={disabled} color={styles.color({ disabled })} size="xsmall">
        {children}
      </Text>
    </Space>
  );
};

HelpText.propTypes = {
  children: PropTypes.string,
  disabled: PropTypes.bool,
};

HelpText.defaultProps = {};

export default HelpText;
