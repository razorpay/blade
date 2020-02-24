import React, { useState, useContext } from 'react';
import { Animated, View, Platform } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { getColor } from '../../_helpers/colors';
import PropTypes from 'prop-types';

const IS_ANDROID = Platform.OS === 'android';

const Container = styled(View)`
  height: ${IS_ANDROID ? '2px' : '10px'};
`;

const FloatView = styled(Animated.View)`
  position: absolute;
`;

const StyledText = styled(Animated.Text)`
  font-family: ${'Lato-Regular'};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: ${(props) => getColor(props.theme, 'shade.800')};
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

const Label = ({ isFocused, children, hasLeftAccessory, hasText, disabled }) => {
  const theme = useContext(ThemeContext);

  const AnimationConfig = {
    ANIMATION_DURATION: 200,
    INITIAL_FONT_SIZE: 14,
    FINAL_FONT_SIZE: 12,
    INITIAL_TOP_POSITION: IS_ANDROID ? 17 : 21,
    FINAL_TOP_POSITION: 0,
    INITIAL_LEFT_POSITION: hasLeftAccessory ? 20 : 0,
    FINAL_LEFT_POSITION: 0,
    INITIAL_LABEL_COLOR: getColor(theme, 'shade.600'),
    FINAL_LABEL_COLOR: getColor(theme, 'primary.900'),
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
    <Container>
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
        >
          {children}
        </StyledText>
      </FloatView>
    </Container>
  );
};

Label.propTypes = {
  children: PropTypes.string,
  isFocused: PropTypes.bool,
  hasLeftAccessory: PropTypes.bool,
  hasText: PropTypes.bool,
  disabled: PropTypes.bool,
};

Label.defaultProps = {
  children: 'Label',
};

export default Label;
