import React from 'react';
import PropTypes from 'prop-types';
import styled, { useTheme } from 'styled-components';
import { getColor } from '../../_helpers/theme';
import Space from '../Space';
import Text from '../Text';
import View from '../View';

const styles = {
  text: {
    color({ theme, isFocused, hasError, disabled, variant, value }) {
      if (disabled) {
        return getColor(theme, 'shade.940');
      }
      if (variant === 'outlined') {
        if (isFocused) {
          if (hasError) {
            return getColor(theme, 'shade.950');
          }
          return getColor(theme, 'primary.800');
        } else if (value) {
          return getColor(theme, 'shade.950');
        }
      }
      return getColor(theme, 'shade.960');
    },
    fontSize({ theme, variant, isFocused, hasText, position, width }) {
      if (variant === 'outlined' && !(isFocused || hasText)) {
        return theme.bladeOld.fonts.size.medium;
      }
      if (position === 'left' && width !== 'small') {
        return theme.bladeOld.fonts.size.medium;
      }
      return theme.bladeOld.fonts.size.xsmall;
    },
    lineHeight({ variant, theme, isFocused, hasText, position, width }) {
      if (variant === 'outlined' && !(isFocused || hasText)) {
        return theme.bladeOld.fonts.lineHeight.medium;
      }
      if (position === 'left' && width != 'small') {
        return theme.bladeOld.fonts.lineHeight.medium;
      }
      return theme.bladeOld.fonts.lineHeight.small;
    },
    fontFamily({ theme }) {
      return theme.bladeOld.fonts.family.lato.regular;
    },
  },
  label: {
    margin({ position, variant }) {
      if (position === 'left') {
        return [1, 3, 1, 0];
      } else if (position === 'top' && variant !== 'outlined') {
        return [0, 0, 0.5, 0];
      }
      return [0];
    },
  },
};

const FloatView = styled(View)`
  position: absolute;
  will-change: transform;
  transition: transform 0.1s ease-in;
  top: 2px;
  left: ${(props) => props.layoutDimensions.initialLeftPosition}px;
  pointer-events: none;
`;

const StyledText = styled(Text)`
  display: flex;
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
  width,
  id,
}) => {
  const theme = useTheme();

  return (
    <Space
      margin={styles.label.margin({
        position,
        variant,
      })}
    >
      <StyledText
        as="label"
        htmlFor={id}
        hasError={hasError}
        disabled={disabled}
        variant={variant}
        value={value}
        hasText={hasText}
        theme={theme}
        isFocused={isFocused}
        position={position}
        width={width}
        id={id}
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
  width: PropTypes.string,
  id: PropTypes.string,
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
    ? {
        transform: `translate(-${finalLeftPosition}px,-${finalTopPosition}px)`,
      }
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
  width,
  id,
}) => {
  const theme = useTheme();
  const floatViewAnimationStyle = getFloatViewAnimationStyle({
    isFocused,
    hasText,
    layoutDimensions,
  });

  return (
    <Space
      margin={styles.label.margin({
        position,
        variant,
      })}
    >
      <FloatView layoutDimensions={layoutDimensions} style={floatViewAnimationStyle}>
        <StyledText
          as="label"
          htmlFor={id}
          isFocused={isFocused}
          hasError={hasError}
          hasText={hasText}
          disabled={disabled}
          variant={variant}
          value={value}
          theme={theme}
          position={position}
          width={width}
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
  width: PropTypes.string,
  id: PropTypes.string,
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
