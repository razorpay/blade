import React, { useState, useContext } from 'react';
import { Animated, Platform } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';
import { getColor } from '../../_helpers/theme';
import View from '../View';

const IS_ANDROID = Platform.OS === 'android';

const ANDROID_OUTLINE_INITIAL_TOP_DIVISOR = 2.4;
const IOS_OUTLINE_INITIAL_TOP_DIVISOR = 2;

const ANDROID_FILLED_INITIAL_TOP_DIVISOR = 1.15;
const IOS_FILLED_INITIAL_TOP_DIVISOR = 1.3;

const styles = {
  container: {
    height({ variant }) {
      if (variant === 'outline') {
        return IS_ANDROID ? '2px' : '10px';
      } else {
        return IS_ANDROID ? '20px' : '20px';
      }
    },
  },
  text: {
    color({ theme }) {
      return getColor(theme, 'shade.800');
    },
    fontSize({ theme }) {
      return theme.fonts.size.xsmall;
    },
    lineHeight() {
      return '18px'; // TODO: Use constant from theme
    },
    fontFamily({ theme }) {
      return theme.fonts.family.lato.regular;
    },
  },
};

const Container = styled(View)`
  height: ${styles.container.height};
`;

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

const onFocus = ({ AnimationConfig, labelAnimatedValue }) => {
  Animated.timing(labelAnimatedValue, {
    toValue: AnimationConfig.FINAL_ANIMATION_VALUE,
    duration: AnimationConfig.ANIMATION_DURATION,
  }).start();
};

const onBlur = ({ AnimationConfig, labelAnimatedValue }) => {
  Animated.timing(labelAnimatedValue, {
    toValue: AnimationConfig.INITIAL_ANIMATION_VALUE,
    duration: AnimationConfig.ANIMATION_DURATION,
  }).start();
};

const getColorInterpolation = (AnimationConfig, labelAnimatedValue) => {
  return labelAnimatedValue.interpolate({
    inputRange: [AnimationConfig.INITIAL_ANIMATION_VALUE, AnimationConfig.FINAL_ANIMATION_VALUE],
    outputRange: [AnimationConfig.INITIAL_LABEL_COLOR, AnimationConfig.FINAL_LABEL_COLOR],
  });
};

const getFontInterpolation = (AnimationConfig, labelAnimatedValue, hasText) => {
  if (hasText) return AnimationConfig.FINAL_FONT_SIZE;

  return labelAnimatedValue.interpolate({
    inputRange: [AnimationConfig.INITIAL_ANIMATION_VALUE, AnimationConfig.FINAL_ANIMATION_VALUE],
    outputRange: [AnimationConfig.INITIAL_FONT_SIZE, AnimationConfig.FINAL_FONT_SIZE],
  });
};

const getTopInterpolation = (AnimationConfig, labelAnimatedValue, hasText) => {
  if (hasText) return AnimationConfig.FINAL_TOP_POSITION;

  return labelAnimatedValue.interpolate({
    inputRange: [AnimationConfig.INITIAL_ANIMATION_VALUE, AnimationConfig.FINAL_ANIMATION_VALUE],
    outputRange: [AnimationConfig.INITIAL_TOP_POSITION, AnimationConfig.FINAL_TOP_POSITION],
  });
};

const getLeftInterpolation = (AnimationConfig, labelAnimatedValue, hasText) => {
  if (hasText) return AnimationConfig.FINAL_LEFT_POSITION;

  return labelAnimatedValue.interpolate({
    inputRange: [AnimationConfig.INITIAL_ANIMATION_VALUE, AnimationConfig.FINAL_ANIMATION_VALUE],
    outputRange: [AnimationConfig.INITIAL_LEFT_POSITION, AnimationConfig.FINAL_LEFT_POSITION],
  });
};

const getInitialTopPosition = (layoutDimensions, variant) => {
  if (variant === 'outline') {
    if (IS_ANDROID) {
      return layoutDimensions.height / ANDROID_OUTLINE_INITIAL_TOP_DIVISOR;
    } else {
      return layoutDimensions.height / IOS_OUTLINE_INITIAL_TOP_DIVISOR;
    }
  } else if (IS_ANDROID) {
    return layoutDimensions.height / ANDROID_FILLED_INITIAL_TOP_DIVISOR;
  } else {
    return layoutDimensions.height / IOS_FILLED_INITIAL_TOP_DIVISOR;
  }
};

const getInitialLeftPosition = (layoutDimensions) => {
  return layoutDimensions.x;
};

const getFinalLabelColor = (theme, hasError) => {
  return hasError ? getColor(theme, 'shade.600') : getColor(theme, 'primary.900');
};

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

  const AnimationConfig = {
    ANIMATION_DURATION: 100,
    INITIAL_FONT_SIZE: parseInt(theme.fonts.size.medium, 10),
    FINAL_FONT_SIZE: parseInt(theme.fonts.size.xsmall, 10),
    INITIAL_TOP_POSITION: getInitialTopPosition(layoutDimensions, variant),
    FINAL_TOP_POSITION: 0,
    INITIAL_LEFT_POSITION: getInitialLeftPosition(layoutDimensions),
    FINAL_LEFT_POSITION: 0,
    INITIAL_LABEL_COLOR: getColor(theme, 'shade.600'),
    FINAL_LABEL_COLOR: getFinalLabelColor(theme, hasError),
    INITIAL_ANIMATION_VALUE: 0,
    FINAL_ANIMATION_VALUE: 1,
  };

  const [labelAnimatedValue] = useState(
    new Animated.Value(AnimationConfig.INITIAL_ANIMATION_VALUE),
  );

  React.useEffect(() => {
    if (isFocused) {
      onFocus({ AnimationConfig, labelAnimatedValue });
    }
    if (!isFocused) {
      onBlur({ AnimationConfig, labelAnimatedValue });
    }
  }, [AnimationConfig, isFocused, labelAnimatedValue]);

  return (
    <Container variant={variant}>
      <FloatView
        style={{
          top: getTopInterpolation(AnimationConfig, labelAnimatedValue, hasText),
          left: getLeftInterpolation(AnimationConfig, labelAnimatedValue, hasText),
        }}
        pointerEvents="none"
      >
        <StyledText
          style={{
            fontSize: getFontInterpolation(AnimationConfig, labelAnimatedValue, hasText),
            color: disabled
              ? getColor(theme, 'shade.400')
              : getColorInterpolation(AnimationConfig, labelAnimatedValue),
          }}
          numberOfLines={1}
        >
          {children}
        </StyledText>
      </FloatView>
    </Container>
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
  variant: PropTypes.oneOf(['outline', 'filled']),
  hasError: PropTypes.bool,
};

AnimatedLabel.defaultProps = {
  children: 'Label',
};

export default AnimatedLabel;
