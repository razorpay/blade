import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';

import { makePxValue } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';
import isPropDefined from '../../_helpers/isPropDefined';
import View from '../View/';
import Flex from '../Flex';

const styles = {
  container: {
    height({ size, theme }) {
      switch (size) {
        case 'medium':
          return theme.spacings.large;
        case 'large':
          return makePxValue(3);
        default:
          return theme.spacings.large;
      }
    },
    width({ size, theme }) {
      switch (size) {
        case 'medium':
          return theme.spacings.xxxlarge;
        case 'large':
          return makePxValue(6);
        default:
          return theme.spacings.xxxlarge;
      }
    },
    radius({ size, theme }) {
      switch (size) {
        case 'medium':
          return `${parseInt(theme.spacings.large, 10) / 2}px`;
        case 'large':
          return `${parseInt(makePxValue(3), 10) / 2}px`;
        default:
          return `${parseInt(theme.spacings.large, 10) / 2}px`;
      }
    },
  },
  knob: {
    height({ size, theme }) {
      switch (size) {
        case 'medium':
          return theme.spacings.medium;
        case 'large':
          return theme.spacings.large;
        default:
          return theme.spacings.medium;
      }
    },
    width({ size, theme }) {
      switch (size) {
        case 'medium':
          return theme.spacings.medium;
        case 'large':
          return theme.spacings.large;
        default:
          return theme.spacings.medium;
      }
    },
    activeWidth({ size, theme }) {
      switch (size) {
        case 'medium':
          return theme.spacings.large;
        case 'large':
          return theme.spacings.xxlarge;
        default:
          return theme.spacings.large;
      }
    },
    radius({ size, theme }) {
      switch (size) {
        case 'medium':
          return `${parseInt(theme.spacings.medium, 10) / 2}px`;
        case 'large':
          return `${parseInt(theme.spacings.large, 10) / 2}px`;
        default:
          return `${parseInt(theme.spacings.medium, 10) / 2}px`;
      }
    },
  },
  padding({ size, theme }) {
    switch (size) {
      case 'medium':
        return theme.spacings.xxsmall;
      case 'large':
        return theme.spacings.xsmall;
      default:
        return theme.spacings.xxsmall;
    }
  },
  align({ align }) {
    switch (align) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
      default:
        return 'flex-start';
    }
  },
};

const StyledContainer = styled(TouchableOpacity)`
  height: ${styles.container.height};
  width: ${styles.container.width};
  border-radius: ${styles.container.radius};
`;

const StyledKnob = styled(View)`
  position: absolute;
  height: ${styles.knob.height};
  border-radius: ${styles.knob.radius};
  min-width: ${(props) => props.minWidth};
  background-color: ${(props) => props.theme.colors.light[100]};
`;

const AnimatedContainer = Animated.createAnimatedComponent(StyledContainer);
const AnimatedKnob = Animated.createAnimatedComponent(StyledKnob);

const moveKnobLeft = (
  leftSpaceAnimatedValue,
  rightSpaceAnimatedValue,
  animationConfig,
  onAnimationEnd,
) => {
  Animated.parallel([
    Animated.timing(leftSpaceAnimatedValue, {
      toValue: animationConfig.OFF_LEFT_SPACE,
      duration: animationConfig.KNOB_TRANSLATION_DURATION,
    }),
    Animated.timing(rightSpaceAnimatedValue, {
      toValue: animationConfig.OFF_RIGHT_SPACE,
      duration: animationConfig.KNOB_TRANSLATION_DURATION,
    }),
  ]).start(onAnimationEnd);
};

const moveKnobRight = (
  leftSpaceAnimatedValue,
  rightSpaceAnimatedValue,
  animationConfig,
  onAnimationEnd,
) => {
  Animated.parallel([
    Animated.timing(leftSpaceAnimatedValue, {
      toValue: animationConfig.ON_LEFT_SPACE,
      duration: animationConfig.KNOB_TRANSLATION_DURATION,
    }),
    Animated.timing(rightSpaceAnimatedValue, {
      toValue: animationConfig.ON_RIGHT_SPACE,
      duration: animationConfig.KNOB_TRANSLATION_DURATION,
    }),
  ]).start(onAnimationEnd);
};

const scaleKnob = (animatedValue, animateToValue, animationDuration, onAnimationEnd = () => {}) => {
  Animated.timing(animatedValue, {
    toValue: animateToValue,
    duration: animationDuration,
  }).start(onAnimationEnd);
};

const Switch = ({ disabled, on, defaultOn, onChange, size, align, testID }) => {
  const theme = useContext(ThemeContext);
  const containerWidth = parseInt(styles.container.width({ size, theme }), 10);
  const knobWidth = parseInt(styles.knob.width({ size, theme }), 10);
  const knobActiveWidth = parseInt(styles.knob.activeWidth({ size, theme }), 10);
  const containerPadding = parseInt(styles.padding({ size, theme }), 10);
  const [toggleState, setToggleState] = useState(false);
  const [active, setActive] = useState(false);

  const AnimationConfig = {
    OFF_LEFT_SPACE: containerPadding,
    OFF_RIGHT_SPACE: containerWidth - containerPadding - knobWidth,
    OFF_ACTIVE_RIGHT_SPACE: containerWidth - containerPadding - knobActiveWidth,
    ON_RIGHT_SPACE: containerPadding,
    ON_LEFT_SPACE: containerWidth - containerPadding - knobWidth,
    ON_ACTIVE_LEFT_SPACE: containerWidth - containerPadding - knobActiveWidth,
    KNOB_TRANSLATION_DURATION: 200,
    KNOB_SCALE_DURATION: 100,
  };

  const { current: leftSpaceAnimatedValue } = useRef(
    new Animated.Value(AnimationConfig.OFF_LEFT_SPACE),
  );
  const { current: rightSpaceAnimatedValue } = useRef(
    new Animated.Value(AnimationConfig.OFF_RIGHT_SPACE),
  );

  useEffect(() => {
    if (isPropDefined(on)) {
      if (isPropDefined(defaultOn)) {
        throw Error('Expected only one of defaultOn or on props.');
      }
      if (on && !toggleState) {
        moveKnobRight(leftSpaceAnimatedValue, rightSpaceAnimatedValue, AnimationConfig, () => {
          setToggleState(!toggleState);
        });
      } else if (!on && toggleState) {
        moveKnobLeft(leftSpaceAnimatedValue, rightSpaceAnimatedValue, AnimationConfig, () => {
          setToggleState(!toggleState);
        });
      }
    }
    if (defaultOn) {
      leftSpaceAnimatedValue.setValue(AnimationConfig.ON_LEFT_SPACE);
      rightSpaceAnimatedValue.setValue(AnimationConfig.ON_RIGHT_SPACE);
      setToggleState(true);
    }
  }, [on, defaultOn]);

  const onPressIn = useCallback(() => {
    setActive(true);
    if (toggleState) {
      scaleKnob(
        leftSpaceAnimatedValue,
        AnimationConfig.ON_ACTIVE_LEFT_SPACE,
        AnimationConfig.KNOB_SCALE_DURATION,
      );
    } else {
      scaleKnob(
        rightSpaceAnimatedValue,
        AnimationConfig.OFF_ACTIVE_RIGHT_SPACE,
        AnimationConfig.KNOB_SCALE_DURATION,
      );
    }
  }, [toggleState]);

  const onPressOut = useCallback(() => {
    setActive(false);
    if (isPropDefined(on)) {
      if (toggleState) {
        scaleKnob(
          leftSpaceAnimatedValue,
          AnimationConfig.ON_LEFT_SPACE,
          AnimationConfig.KNOB_SCALE_DURATION,
          () => onChange(!on),
        );
      } else {
        scaleKnob(
          rightSpaceAnimatedValue,
          AnimationConfig.OFF_RIGHT_SPACE,
          AnimationConfig.KNOB_SCALE_DURATION,
          () => onChange(!on),
        );
      }
      return;
    }
    if (toggleState) {
      moveKnobLeft(leftSpaceAnimatedValue, rightSpaceAnimatedValue, AnimationConfig, () => {
        setToggleState(!toggleState);
        onChange(!toggleState);
      });
    } else {
      moveKnobRight(leftSpaceAnimatedValue, rightSpaceAnimatedValue, AnimationConfig, () => {
        setToggleState(!toggleState);
        onChange(!toggleState);
      });
    }
  }, [toggleState]);

  const interpolateContainerColor = leftSpaceAnimatedValue.interpolate({
    inputRange: [AnimationConfig.OFF_LEFT_SPACE, AnimationConfig.ON_LEFT_SPACE],
    outputRange: [theme.colors.shade[960], theme.colors.primary[800]],
  });

  const activeContainerColor = active
    ? toggleState
      ? theme.colors.primary[700]
      : theme.colors.shade[950]
    : null;

  const disabledContainerColor = disabled
    ? toggleState
      ? theme.colors.primary[500]
      : theme.colors.shade[930]
    : null;

  return (
    <Flex flexDirection="row" alignSelf={styles.align({ align })}>
      <AnimatedContainer
        disabled={disabled}
        activeOpacity={1}
        size={size}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          {
            backgroundColor:
              activeContainerColor || disabledContainerColor || interpolateContainerColor,
          },
        ]}
        {...automation(testID)}
      >
        <Flex alignSelf="center">
          <AnimatedKnob
            size={size}
            minWidth={`${knobWidth}px`}
            style={{
              left: leftSpaceAnimatedValue,
              right: rightSpaceAnimatedValue,
            }}
          />
        </Flex>
      </AnimatedContainer>
    </Flex>
  );
};

Switch.propTypes = {
  size: PropTypes.oneOf(['medium', 'large']),
  disabled: PropTypes.bool,
  on: PropTypes.bool,
  defaultOn: PropTypes.bool,
  onChange: PropTypes.func,
  testID: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
};

Switch.defaultProps = {
  size: 'medium',
  disabled: false,
  testID: 'ds-switch',
  align: 'left',
  onChange: () => {},
};

export default Switch;
