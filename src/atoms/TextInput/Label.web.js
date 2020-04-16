import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getColor } from '../../_helpers/theme';
import View from '../View';
import Size from '../Size';
import Space from '../Space';
import Text from '../Text';

const REGULAR_PADDING_TOP_MULTIPLIER = 0.29;
const REGULAR_PADDING_TOP_MULTIPLIER_MULTILINE = 0.2;

const styles = {
  regularLabelContainer: {
    padding({ position, _isMultiline }) {
      let [top, right, bottom] = [0, 0, 0.5];
      const left = 0;

      if (position === 'top') {
        top = 0;
      } else {
        if (_isMultiline) {
          top = `${36 * REGULAR_PADDING_TOP_MULTIPLIER_MULTILINE}px`;
        } else {
          top = `${36 * REGULAR_PADDING_TOP_MULTIPLIER}px`;
        }

        right = 3;
        bottom = 0;
      }

      return [top, right, bottom, left];
    },
  },
  container: {
    height({ variant }) {
      if (variant === 'outlined') {
        return '10px';
      } else {
        return '20px';
      }
    },
  },
  text: {
    color({ theme }) {
      return getColor(theme, 'shade.980');
    },
    fontSize({ theme }) {
      return theme.fonts.size.xsmall;
    },
    lineHeight({ theme }) {
      return theme.fonts.lineHeight.small;
    },
    fontFamily({ theme }) {
      return theme.fonts.family.lato.regular;
    },
  },
  label: {
    padding({ iconLeft, prefix, isFocused }) {
      if (isFocused) {
        return '0';
      } else if (iconLeft || prefix) {
        return '14px 0 0 25px';
      } else {
        return '18px 0 0 0px';
      }
    },
    margintop({ isFocused }) {
      if (isFocused) {
        return '-7px';
      } else {
        return 'initial';
      }
    },
  },
};

const FloatView = styled(View)`
  position: absolute;
  padding: ${styles.label.padding};
  margin-top: ${styles.label.margintop};
`;

const StyledText = styled(Text)`
  font-family: ${styles.text.fontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: ${styles.text.fontSize};
  line-height: ${styles.text.lineHeight};
  color: ${styles.text.color};
`;

const AnimatedLabel = ({ children, variant, isFocused, iconLeft, prefix }) => {
  return (
    <Size height={styles.container.height({ variant })}>
      <View>
        <FloatView pointerEvents="none" isFocused={isFocused} iconLeft={iconLeft} prefix={prefix}>
          <StyledText numberOfLines={1}>{children}</StyledText>
        </FloatView>
      </View>
    </Size>
  );
};

AnimatedLabel.propTypes = {
  children: PropTypes.string,
  isFocused: PropTypes.bool,
  variant: PropTypes.oneOf(['outlined', 'filled']).isRequired,
  iconLeft: PropTypes.bool,
  prefix: PropTypes.string,
};

AnimatedLabel.defaultProps = {
  children: 'Label',
  isFocused: false,
};

const RegularLabel = ({ children, position, disabled, _isMultiline }) => {
  return (
    <Space
      padding={styles.regularLabelContainer.padding({
        position,
        _isMultiline,
      })}
    >
      <View>
        <Text size="medium" color={disabled ? 'shade.940' : 'shade.980'}>
          {children}
        </Text>
      </View>
    </Space>
  );
};

RegularLabel.propTypes = {
  children: PropTypes.string,
  position: PropTypes.oneOf(['top', 'left']).isRequired,
  disabled: PropTypes.bool,
  _isMultiline: PropTypes.bool,
};

RegularLabel.defaultProps = {
  children: 'Label',
  disabled: false,
  _isMultiline: false,
};

const Label = {
  Animated: AnimatedLabel,
  Regular: RegularLabel,
};

export default Label;
