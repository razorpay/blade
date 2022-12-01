import React, { useRef, useEffect } from 'react';
import { Animated, Platform } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import PropTypes from 'prop-types';
import { getColor } from '../../_helpers/theme';
import View from '../View';
import Size from '../Size';
import Space from '../Space';
import Text from '../Text';

const IS_ANDROID = Platform.OS === 'android';

const REGULAR_PADDING_TOP_MULTIPLIER_ANDROID = 0.36;
const REGULAR_PADDING_TOP_MULTIPLIER_IOS = 0.29;
const REGULAR_PADDING_TOP_MULTIPLIER_MULTILINE = 0.2;

const styles = {
  regularLabelContainer: {
    padding({ position, inputLayoutDimensions, _isMultiline }) {
      let [top, right, bottom] = [0, 0, 0.5];
      const left = 0;

      if (position === 'top') {
        top = 0;
      } else {
        if (_isMultiline) {
          top = `${inputLayoutDimensions.height * REGULAR_PADDING_TOP_MULTIPLIER_MULTILINE}px`;
        } else if (IS_ANDROID) {
          top = `${inputLayoutDimensions.height * REGULAR_PADDING_TOP_MULTIPLIER_ANDROID}px`;
        } else {
          top = `${inputLayoutDimensions.height * REGULAR_PADDING_TOP_MULTIPLIER_IOS}px`;
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
        return IS_ANDROID ? '2px' : '10px';
      } else {
        return IS_ANDROID ? '20px' : '20px';
      }
    },
  },
  text: {
    color({ theme }) {
      return getColor(theme, 'shade.980');
    },
    fontSize({ theme }) {
      return theme.bladeOld.fonts.size.xsmall;
    },
    lineHeight({ theme }) {
      return theme.bladeOld.fonts.lineHeight.small;
    },
    fontFamily({ theme }) {
      return theme.bladeOld.fonts.family.lato.regular;
    },
  },
};

const FloatView = styled(Animated.View)`
  position: absolute;
`;

const StyledText = styled(Animated.Text)`
  font-family: ${styles.text.fontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: ${styles.text.fontSize};
  line-height: ${styles.text.lineHeight};
  color: ${styles.text.color};
`;

const onFocus = ({ animationConfig, labelAnimatedValue }) => {
  Animated.timing(labelAnimatedValue, {
    toValue: animationConfig.animationValue.final,
    duration: animationConfig.duration,
    useNativeDriver: false,
  }).start();
};

const onBlur = ({ animationConfig, labelAnimatedValue }) => {
  Animated.timing(labelAnimatedValue, {
    toValue: animationConfig.animationValue.initial,
    duration: animationConfig.duration,
    useNativeDriver: false,
  }).start();
};

const getInitialTopDivisor = ({ variant, _isMultiline }) => {
  if (variant === 'outlined') {
    if (_isMultiline) {
      return IS_ANDROID ? 1.75 : 1.16;
    } else {
      return IS_ANDROID ? 2.4 : 2;
    }
  } else if (_isMultiline) {
    return IS_ANDROID ? 1.1 : 1.16;
  } else {
    return IS_ANDROID ? 1.15 : 1.3;
  }
};

const getColorInterpolation = ({ animationConfig, labelAnimatedValue }) => {
  return labelAnimatedValue.interpolate({
    inputRange: [animationConfig.animationValue.initial, animationConfig.animationValue.final],
    outputRange: [animationConfig.labelColor.initial, animationConfig.labelColor.final],
  });
};

const getFontInterpolation = ({ animationConfig, labelAnimatedValue, hasText }) => {
  if (hasText) return animationConfig.fontSize.final;

  return labelAnimatedValue.interpolate({
    inputRange: [animationConfig.animationValue.initial, animationConfig.animationValue.final],
    outputRange: [animationConfig.fontSize.initial, animationConfig.fontSize.final],
  });
};

const getTopInterpolation = ({ animationConfig, labelAnimatedValue, hasText }) => {
  if (hasText) return animationConfig.topPosition.final;

  return labelAnimatedValue.interpolate({
    inputRange: [animationConfig.animationValue.initial, animationConfig.animationValue.final],
    outputRange: [animationConfig.topPosition.initial, animationConfig.topPosition.final],
  });
};

const getLeftInterpolation = ({ animationConfig, labelAnimatedValue, hasText }) => {
  if (hasText) return animationConfig.leftPosition.final;

  return labelAnimatedValue.interpolate({
    inputRange: [animationConfig.animationValue.initial, animationConfig.animationValue.final],
    outputRange: [animationConfig.leftPosition.initial, animationConfig.leftPosition.final],
  });
};

const getInitialTopPosition = ({ layoutDimensions, variant, _isMultiline }) => {
  const initialTopDivisor = getInitialTopDivisor({
    variant,
    _isMultiline,
  });

  if (variant === 'outlined') {
    if (IS_ANDROID) {
      return layoutDimensions.height / initialTopDivisor;
    } else {
      return layoutDimensions.height / initialTopDivisor;
    }
  } else if (IS_ANDROID) {
    return layoutDimensions.height / initialTopDivisor;
  } else {
    return layoutDimensions.height / initialTopDivisor;
  }
};

const getInitialLeftPosition = ({ layoutDimensions }) => layoutDimensions.x;

const getFinalLabelColor = ({ theme, hasError }) =>
  hasError ? getColor(theme, 'shade.960') : getColor(theme, 'primary.900');

const AnimatedLabel = ({
  isFocused,
  children,
  hasText,
  disabled,
  layoutDimensions,
  variant,
  hasError,
  _isMultiline,
}) => {
  const theme = useTheme();

  const animationConfig = {
    fontSize: {
      initial: parseInt(theme.bladeOld.fonts.size.medium, 10),
      final: parseInt(theme.bladeOld.fonts.size.xsmall, 10),
    },
    topPosition: {
      initial: getInitialTopPosition({
        layoutDimensions,
        variant,
        _isMultiline,
      }),
      final: 0,
    },
    leftPosition: {
      initial: getInitialLeftPosition({
        layoutDimensions,
      }),
      final: 0,
    },
    labelColor: {
      initial: getColor(theme, 'shade.960'),
      final: getFinalLabelColor({
        theme,
        hasError,
      }),
    },
    animationValue: {
      initial: 0,
      final: 1,
    },
    duration: 100,
  };

  const { current: labelAnimatedValue } = useRef(
    new Animated.Value(animationConfig.animationValue.initial),
  );

  useEffect(() => {
    if (isFocused) {
      onFocus({
        animationConfig,
        labelAnimatedValue,
      });
    }
    if (!isFocused) {
      onBlur({
        animationConfig,
        labelAnimatedValue,
      });
    }
  }, [animationConfig, isFocused, labelAnimatedValue]);

  return (
    <Size
      height={styles.container.height({
        variant,
      })}
    >
      <View>
        <FloatView
          style={{
            top: getTopInterpolation({
              animationConfig,
              labelAnimatedValue,
              hasText,
            }),
            left: getLeftInterpolation({
              animationConfig,
              labelAnimatedValue,
              hasText,
            }),
          }}
          pointerEvents="none"
        >
          <StyledText
            style={{
              fontSize: getFontInterpolation({
                animationConfig,
                labelAnimatedValue,
                hasText,
              }),
              color: disabled
                ? getColor(theme, 'shade.940')
                : getColorInterpolation({
                    animationConfig,
                    labelAnimatedValue,
                  }),
            }}
            numberOfLines={1}
          >
            {children}
          </StyledText>
        </FloatView>
      </View>
    </Size>
  );
};

AnimatedLabel.propTypes = {
  children: PropTypes.string,
  isFocused: PropTypes.bool,
  hasText: PropTypes.bool,
  disabled: PropTypes.bool,
  layoutDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  variant: PropTypes.oneOf(['outlined', 'filled']).isRequired,
  hasError: PropTypes.bool,
  _isMultiline: PropTypes.bool,
};

AnimatedLabel.defaultProps = {
  children: 'Label',
  isFocused: false,
  hasText: false,
  disabled: false,
  hasError: false,
};

const RegularLabel = ({ children, inputLayoutDimensions, position, disabled, _isMultiline }) => {
  return (
    <Space
      padding={styles.regularLabelContainer.padding({
        position,
        inputLayoutDimensions,
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
  inputLayoutDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
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
