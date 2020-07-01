import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import isEmpty from '../../_helpers/isEmpty';
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
        } else if (!isEmpty(value)) {
          return getColor(theme, 'shade.950');
        }
      }
      if (disabled) {
        return getColor(theme, 'shade.940');
      }
      return getColor(theme, 'shade.960');
    },
    fontSize({ theme, variant, isFocused, hasText }) {
      if (variant === 'outlined') {
        if (isFocused || hasText) {
          return theme.fonts.size.xsmall;
        }
        return theme.fonts.size.medium;
      }
      return theme.fonts.size.xsmall;
    },
    lineHeight({ variant, theme, isFocused, hasText }) {
      if (variant === 'outlined') {
        if (isFocused || hasText) {
          return theme.fonts.lineHeight.small;
        }
        return theme.fonts.lineHeight.medium;
      }
      return theme.fonts.lineHeight.small;
    },
    fontFamily({ theme }) {
      return theme.fonts.family.lato.regular;
    },
  },
  label: {
    margin({ position }) {
      if (position === 'left') {
        return [1, 3, 1, 0];
      }
      return [0, 0, 0.5, 0];
    },
  },
};

const FloatView = styled(View)`
  will-change: transform;
  position: absolute;
  transition: transform 0.1s ease-in;
  bottom: 0;
  left: ${(props) => props.layoutDimensions.initialLeftPosition}px;
  pointer-events: none;
`;

const StyledText = styled(Text)`
  font-family: ${styles.text.fontFamily};
  font-size: ${styles.text.fontSize};
  line-height: ${styles.text.lineHeight};
  color: ${styles.text.color};
  transition: font-size 0.1s ease-in, line-height 0.1s ease-in, color 0.1s ease-in;
`;

const RegularLabel = ({
  children,
  position,
  hasError,
  hasText,
  disabled,
  variant,
  value,
  isFocused,
}) => {
  const theme = useContext(ThemeContext);

  return (
    <Space margin={styles.label.margin({ position })}>
      <StyledText
        as="label"
        hasError={hasError}
        disabled={disabled}
        variant={variant}
        value={value}
        hasText={hasText}
        theme={theme}
        isFocused={isFocused}
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
  hasError: PropTypes.bool,
  hasText: PropTypes.bool,
  value: PropTypes.string,
};

RegularLabel.defaultProps = {
  children: 'Label',
  disabled: false,
  value: undefined,
};

const getFloatViewAnimationStyle = ({ isFocused, hasText, layoutDimensions }) => {
  const finalTopPosition = layoutDimensions.finalTopPosition;
  const finalLeftPosition = layoutDimensions.initialLeftPosition;
  return isFocused || hasText
    ? { transform: `translate(-${finalLeftPosition}px,-${finalTopPosition}px)` }
    : {};
};

const AnimatedLabel = ({
  children,
  position,
  disabled,
  isFocused,
  hasError,
  variant,
  value,
  hasText,
  layoutDimensions,
}) => {
  const theme = useContext(ThemeContext);
  const floatViewAnimationStyle = getFloatViewAnimationStyle({
    isFocused,
    hasText,
    layoutDimensions,
  });

  return (
    <Space margin={styles.label.margin({ position })}>
      <FloatView layoutDimensions={layoutDimensions} style={floatViewAnimationStyle}>
        <StyledText
          as="label"
          htmlFor={children}
          isFocused={isFocused}
          hasError={hasError}
          hasText={hasText}
          disabled={disabled}
          variant={variant}
          value={value}
          theme={theme}
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
  hasError: PropTypes.bool,
  value: PropTypes.string,
  hasText: PropTypes.bool,
  layoutDimensions: PropTypes.shape({
    initialLeftPosition: PropTypes.number,
    finalTopPosition: PropTypes.number,
  }),
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
