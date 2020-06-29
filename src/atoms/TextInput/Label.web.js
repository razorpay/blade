import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import isDefined from '../../_helpers/isDefined';
import { getColor } from '../../_helpers/theme';
import Space from '../Space';
import Text from '../Text';
import View from '../View';

const styles = {
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
    color({ theme, isFocused, hasError, disabled, variant, value }) {
      if (variant === 'outlined') {
        if (isFocused && !hasError) {
          return getColor(theme, 'primary.800');
        } else if (isDefined(value)) {
          return getColor(theme, 'shade.950');
        }
      }
      if (disabled) {
        return getColor(theme, 'shade.940');
      }
      return getColor(theme, 'shade.960');
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
    padding({ iconLeft, prefix, position, variant, isFocused, value }) {
      if (variant !== 'filled' && (iconLeft || prefix) && !isFocused && !isDefined(value)) {
        return [0, 0, 0, 3];
      } else if (position === 'left') {
        return [1, 0.75, 1, 0.75];
      }
      return [0, 0, 0, 0];
    },
  },
};

const FloatView = styled(View)`
  will-change: transform;
  transition: transform 0.1s ease-in;
  position: absolute;
  transform: translateY(0px);
  pointer-events: none;
`;

const StyledText = styled(Text)`
  font-family: ${styles.text.fontFamily};
  font-size: ${styles.text.fontSize};
  line-height: ${styles.text.lineHeight};
  color: ${styles.text.color};
`;

const RegularLabel = ({
  children,
  position,
  isFocused,
  iconLeft,
  prefix,
  hasError,
  disabled,
  variant,
  value,
}) => {
  return (
    <Space
      padding={styles.label.padding({
        position,
        isFocused,
        iconLeft,
        prefix,
        variant,
        value,
      })}
    >
      <StyledText
        as="label"
        size="medium"
        hasError={hasError}
        disabled={disabled}
        variant={variant}
        value={value}
      >
        {children}
      </StyledText>
    </Space>
  );
};

RegularLabel.propTypes = {
  children: PropTypes.string,
  position: PropTypes.oneOf(['top', 'left']).isRequired,
  disabled: PropTypes.bool,
  isFocused: PropTypes.bool,
  variant: PropTypes.oneOf(['outlined', 'filled']).isRequired,
  iconLeft: PropTypes.string,
  prefix: PropTypes.string,
  hasError: PropTypes.bool,
  value: PropTypes.string,
};

RegularLabel.defaultProps = {
  children: 'Label',
  disabled: false,
  value: undefined,
};

const getLabelAnimationStyle = ({ isFocused, hasText }) => {
  return isFocused || hasText ? { transform: 'translateY(-30px)' } : {};
};

const AnimatedLabel = ({
  children,
  position,
  disabled,
  iconLeft,
  prefix,
  isFocused,
  hasError,
  variant,
  value,
  hasText,
}) => {
  const labelAnimationStyle = getLabelAnimationStyle({ isFocused, hasText });

  return (
    <Space
      padding={styles.label.padding({
        position,
        isFocused,
        iconLeft,
        prefix,
        variant,
        value,
      })}
    >
      <FloatView style={labelAnimationStyle}>
        <StyledText
          as="label"
          htmlFor={children}
          size="medium"
          isFocused={isFocused}
          hasError={hasError}
          disabled={disabled}
          variant={variant}
          value={value}
        >
          {children}
        </StyledText>
      </FloatView>
    </Space>
  );
};

AnimatedLabel.propTypes = {
  children: PropTypes.string,
  position: PropTypes.oneOf(['top', 'left']).isRequired,
  disabled: PropTypes.bool,
  isFocused: PropTypes.bool,
  variant: PropTypes.oneOf(['outlined', 'filled']).isRequired,
  iconLeft: PropTypes.string,
  prefix: PropTypes.string,
  hasError: PropTypes.bool,
  value: PropTypes.string,
  hasText: PropTypes.bool,
};

AnimatedLabel.defaultProps = {
  children: 'Label',
  disabled: false,
  value: undefined,
};

const Label = {
  Regular: RegularLabel,
  Animated: AnimatedLabel,
};

export default Label;
