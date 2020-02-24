import React, { useState, useContext } from 'react';
import { Animated } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { getColor } from '../../_helpers/colors';
import PropTypes from 'prop-types';

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
    toValue: 1,
    duration: AnimationConfig.ANIMATION_DURATION,
  }).start();
};

const onBlur = ({ AnimationConfig, labelAnimatedValue }) => {
  Animated.timing(labelAnimatedValue, {
    toValue: 0,
    duration: AnimationConfig.ANIMATION_DURATION,
  }).start();
};

const getColorInterpolation = (AnimationConfig, labelAnimatedValue) => {
  return labelAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [AnimationConfig.INITIAL_LABEL_COLOR, AnimationConfig.FINAL_LABEL_COLOR],
  });
};

const getFontInterpolation = (AnimationConfig, labelAnimatedValue) => {
  return labelAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 12],
  });
};

const getBottomInterpolation = (AnimationConfig, labelAnimatedValue) => {
  return labelAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [AnimationConfig.INITIAL_BOTTOM_POSITION, AnimationConfig.FINAL_BOTTOM_POSITION],
  });
};

const getLeftInterpolation = (AnimationConfig, labelAnimatedValue) => {
  return labelAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [AnimationConfig.INITIAL_LEFT_POSITION, AnimationConfig.FINAL_LEFT_POSITION],
  });
};

const Label = ({ isFocused, children, hasLeftIcon, hasPrefix }) => {
  const theme = useContext(ThemeContext);

  const AnimationConfig = {
    ANIMATION_DURATION: 200,
    INITIAL_FONT_SIZE: 14,
    FINAL_FONT_SIZE: 12,
    INITIAL_BOTTOM_POSITION: 10,
    FINAL_BOTTOM_POSITION: 30,
    INITIAL_LEFT_POSITION: hasLeftIcon || hasPrefix ? 20 : 0,
    FINAL_LEFT_POSITION: 0,
    INITIAL_LABEL_COLOR: getColor(theme, 'shade.800'),
    FINAL_LABEL_COLOR: getColor(theme, 'primary.900'),
  };

  const [labelAnimatedValue] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (isFocused) {
      onFocus({ AnimationConfig, labelAnimatedValue });
    }
    if (!isFocused) {
      onBlur({ AnimationConfig, labelAnimatedValue });
    }
  }, [AnimationConfig, isFocused, labelAnimatedValue]);

  return (
    <FloatView
      style={{
        bottom: getBottomInterpolation(AnimationConfig, labelAnimatedValue),
        left: getLeftInterpolation(AnimationConfig, labelAnimatedValue),
      }}
      pointerEvents="none"
    >
      <StyledText
        style={{
          fontSize: getFontInterpolation(AnimationConfig, labelAnimatedValue),
          color: getColorInterpolation(AnimationConfig, labelAnimatedValue),
        }}
      >
        {children}
      </StyledText>
    </FloatView>
  );
};

Label.propTypes = {
  children: PropTypes.string,
  isFocused: PropTypes.bool,
  hasLeftIcon: PropTypes.bool,
  hasPrefix: PropTypes.bool,
};

Label.defaultProps = {
  children: 'Label',
};

export default Label;
