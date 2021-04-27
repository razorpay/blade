import React from 'react';
import PropTypes from 'prop-types';
import AtomText from '../Text';
import Space from '../Space';
import View from '../View';
import Flex from '../Flex';

const styles = {
  color({ disabled, errorText }) {
    if (disabled) {
      return 'shade.930';
    } else if (errorText) {
      return 'negative.900';
    }
    return 'shade.950';
  },
};

const Text = ({ helpText, errorText, disabled }) => {
  const displayText = errorText || helpText;

  return (
    <Space padding={[0.5, 0, 0, 0]}>
      <Flex flex={1}>
        <View>
          <AtomText
            color={styles.color({
              disabled,
              errorText,
            })}
            size="xsmall"
          >
            {displayText}
          </AtomText>
        </View>
      </Flex>
    </Space>
  );
};

Text.propTypes = {
  helpText: PropTypes.string,
  errorText: PropTypes.string,
  disabled: PropTypes.bool,
};

Text.defaultProps = {
  errorText: '',
  helpText: '',
  disabled: false,
};

export default Text;
