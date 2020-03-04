import React, { useContext, useRef, useEffect } from 'react';
import { Animated, Platform } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';
import { getColor } from '../../_helpers/theme';
import View from '../View';
import Size from '../Size';
import Space from '../Space';
import Text from '../Text';

const IS_ANDROID = Platform.OS === 'android';

const ANDROID_OUTLINED_INITIAL_TOP_DIVISOR = 2.4;
const IOS_OUTLINED_INITIAL_TOP_DIVISOR = 1.9;

const ANDROID_FILLED_INITIAL_TOP_DIVISOR = 1.15;
const IOS_FILLED_INITIAL_TOP_DIVISOR = 1.3;

const REGULAR_PADDING_TOP_MULTIPLIER_ANDROID = 0.36;
const REGULAR_PADDING_TOP_MULTIPLIER_IOS = 0.29;

const styles = {
  regularLabelContainer: {
    paddingTop({ inputLayoutDimensions }) {
      // For aligning left label to the center of Text Field
      if (IS_ANDROID) {
        return `${inputLayoutDimensions.height * REGULAR_PADDING_TOP_MULTIPLIER_ANDROID}px`;
      }
      return `${inputLayoutDimensions.height * REGULAR_PADDING_TOP_MULTIPLIER_IOS}px`;
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
      return theme.fonts.size.xsmall;
    },
    lineHeight({ theme }) {
      return theme.fonts.lineHeight.small;
    },
    fontFamily({ theme }) {
      return theme.fonts.family.lato.regular;
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
  }).start();
};

const onBlur = ({ animationConfig, labelAnimatedValue }) => {
  Animated.timing(labelAnimatedValue, {
    toValue: animationConfig.animationValue.initial,
    duration: animationConfig.duration,
  }).start();
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

const getInitialTopPosition = ({ layoutDimensions, variant }) => {
  if (variant === 'outlined') {
    if (IS_ANDROID) {
      return layoutDimensions.height / ANDROID_OUTLINED_INITIAL_TOP_DIVISOR;
    } else {
      return layoutDimensions.height / IOS_OUTLINED_INITIAL_TOP_DIVISOR;
    }
  } else if (IS_ANDROID) {
    return layoutDimensions.height / ANDROID_FILLED_INITIAL_TOP_DIVISOR;
  } else {
    return layoutDimensions.height / IOS_FILLED_INITIAL_TOP_DIVISOR;
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
}) => {
  const theme = useContext(ThemeContext);

  const animationConfig = {
    fontSize: {
      initial: parseInt(theme.fonts.size.medium, 10),
      final: parseInt(theme.fonts.size.xsmall, 10),
    },
    topPosition: {
      initial: getInitialTopPosition({ layoutDimensions, variant }),
      final: 0,
    },
    leftPosition: {
      initial: getInitialLeftPosition({ layoutDimensions }),
      final: 0,
    },
    labelColor: {
      initial: getColor(theme, 'shade.960'),
      final: getFinalLabelColor({ theme, hasError }),
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
      onFocus({ animationConfig, labelAnimatedValue });
    }
    if (!isFocused) {
      onBlur({ animationConfig, labelAnimatedValue });
    }
  }, [animationConfig, isFocused, labelAnimatedValue]);

  return (
    <Size height={styles.container.height({ variant })}>
      <View>
        <FloatView
          style={{
            top: getTopInterpolation({ animationConfig, labelAnimatedValue, hasText }),
            left: getLeftInterpolation({ animationConfig, labelAnimatedValue, hasText }),
          }}
          pointerEvents="none"
        >
          <StyledText
            style={{
              fontSize: getFontInterpolation({ animationConfig, labelAnimatedValue, hasText }),
              color: disabled
                ? getColor(theme, 'shade.940')
                : getColorInterpolation({ animationConfig, labelAnimatedValue }),
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
};

AnimatedLabel.defaultProps = {
  children: 'Label',
  isFocused: false,
  hasText: false,
  disabled: false,
  hasError: false,
};

const LabelContainer = styled(View)`
  padding-top: ${styles.regularLabelContainer.paddingTop};
`;

const RegularLabel = ({ children, inputLayoutDimensions }) => {
  return (
    <LabelContainer inputLayoutDimensions={inputLayoutDimensions}>
      <Space padding={[0, 3, 0, 0]}>
        <View>
          <Text size="medium" color="shade.980">
            {children}
          </Text>
        </View>
      </Space>
    </LabelContainer>
  );
};

RegularLabel.propTypes = {
  children: PropTypes.string,
  inputLayoutDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};

RegularLabel.defaultProps = {
  children: 'Label',
};

export default { Animated: AnimatedLabel, Regular: RegularLabel };
