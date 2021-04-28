import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
import Space from '../Space';
import View from '../View';

const styles = {
  color({ disabled }) {
    if (disabled) {
      return 'shade.930';
    }
    return 'shade.950';
  },
};

const CharacterCount = ({ maxLength, currentLength, disabled }) => {
  return (
    <Space padding={[0.5, 0, 0, 1]}>
      <View>
        <Text
          color={styles.color({
            disabled,
          })}
          size="xsmall"
        >
          {`${currentLength}/${maxLength}`}
        </Text>
      </View>
    </Space>
  );
};

CharacterCount.propTypes = {
  maxLength: PropTypes.number,
  currentLength: PropTypes.number,
  disabled: PropTypes.bool,
};

CharacterCount.defaultProps = {
  currentLength: 0,
  disabled: false,
};

export default CharacterCount;
