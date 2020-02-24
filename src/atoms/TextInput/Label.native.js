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

const onFocus = ({ AnimationConfig, fontSize, bottom, color, left }) => {
  Animated.parallel([
    Animated.timing(fontSize, {
      toValue: AnimationConfig.FINAL_FONT_SIZE,
      duration: AnimationConfig.ANIMATION_DURATION,
    }),
    Animated.timing(bottom, {
      toValue: AnimationConfig.FINAL_BOTTOM_POSITION,
      duration: AnimationConfig.ANIMATION_DURATION,
    }),
    Animated.timing(left, {
      toValue: AnimationConfig.FINAL_LEFT_POSITION,
      duration: AnimationConfig.ANIMATION_DURATION,
    }),
    Animated.timing(color, {
      toValue: AnimationConfig.FINAL_LABEL_COLOR,
      duration: AnimationConfig.ANIMATION_DURATION,
    }),
  ]).start();
};

const onBlur = ({ AnimationConfig, fontSize, bottom, color, left }) => {
  Animated.parallel([
    Animated.timing(fontSize, {
      toValue: AnimationConfig.INITIAL_FONT_SIZE,
      duration: AnimationConfig.ANIMATION_DURATION,
    }),
    Animated.timing(bottom, {
      toValue: AnimationConfig.INITIAL_BOTTOM_POSITION,
      duration: AnimationConfig.ANIMATION_DURATION,
    }),
    Animated.timing(left, {
      toValue: AnimationConfig.INITIAL_LEFT_POSITION,
      duration: AnimationConfig.ANIMATION_DURATION,
    }),
    Animated.timing(color, {
      toValue: AnimationConfig.INITIAL_LABEL_COLOR,
      duration: AnimationConfig.ANIMATION_DURATION,
    }),
  ]).start();
};

const getColorInterpolation = (color, theme) => {
  return color.interpolate({
    inputRange: [0, 1],
    outputRange: [getColor(theme, 'shade.900'), getColor(theme, 'primary.800')],
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
    INITIAL_LABEL_COLOR: 0,
    FINAL_LABEL_COLOR: 1,
  };
  const [bottom] = useState(new Animated.Value(AnimationConfig.INITIAL_BOTTOM_POSITION));
  const [left] = useState(new Animated.Value(AnimationConfig.INITIAL_LEFT_POSITION));
  const [fontSize] = useState(new Animated.Value(AnimationConfig.INITIAL_FONT_SIZE));
  const [color] = useState(new Animated.Value(AnimationConfig.INITIAL_LABEL_COLOR));

  React.useEffect(() => {
    if (isFocused) {
      onFocus({ AnimationConfig, fontSize, bottom, left, color });
    }
    if (!isFocused) {
      onBlur({ AnimationConfig, fontSize, bottom, left, color });
    }
  }, [AnimationConfig, bottom, color, fontSize, isFocused, left]);

  return (
    <FloatView style={{ bottom, left }} pointerEvents="none">
      <StyledText
        style={{
          fontSize,
          color: getColorInterpolation(color, theme),
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
