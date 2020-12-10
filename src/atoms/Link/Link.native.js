import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import Text from '../Text';
import automation from '../../_helpers/automation-attributes';
import Flex from '../Flex';

const Link = ({ children, onClick, size, hitSlop, testID }) => {
  const [active, setActive] = useState(false);
  const inactiveTextColor = 'primary.800';
  const activeTextColor = 'primary.600';

  const onPressIn = useCallback(() => {
    setActive(true);
  }, [setActive]);
  const onPressOut = useCallback(() => {
    setActive(false);
  }, [setActive]);

  return (
    <Flex alignSelf="flex-start">
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClick}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        hitSlop={hitSlop}
        {...automation(testID)}
      >
        <Text
          color={active ? activeTextColor : inactiveTextColor}
          size={size}
          _isUnderlined={active}
        >
          {children}
        </Text>
      </TouchableOpacity>
    </Flex>
  );
};

Link.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(["'xsmall'", 'xsmall', 'small', 'medium', 'large']),
  testID: PropTypes.string,
  hitSlop: PropTypes.shape({
    left: PropTypes.number,
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
  }),
};

Link.defaultProps = {
  onClick: () => {},
  size: 'medium',
  testID: 'ds-link',
};

export default Link;
