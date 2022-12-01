import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import PropTypes from 'prop-types';

import { makePxValue } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';
import isDefined from '../../_helpers/isDefined';
import View from '../View';
import Flex from '../Flex';
import Size from '../Size';

const styles = {
  container: {
    height({ size, theme }) {
      switch (size) {
        case 'medium':
          return theme.bladeOld.spacings.large;
        case 'large':
          return makePxValue(3);
        default:
          return theme.bladeOld.spacings.large;
      }
    },
    width({ size, theme }) {
      switch (size) {
        case 'medium':
          return theme.bladeOld.spacings.xxxlarge;
        case 'large':
          return makePxValue(6);
        default:
          return theme.bladeOld.spacings.xxxlarge;
      }
    },
    radius({ size, theme }) {
      switch (size) {
        case 'medium':
          return `${parseInt(theme.bladeOld.spacings.large, 10) / 2}px`;
        case 'large':
          return `${parseInt(makePxValue(3), 10) / 2}px`;
        default:
          return `${parseInt(theme.bladeOld.spacings.large, 10) / 2}px`;
      }
    },
  },
  knob: {
    height({ size, theme }) {
      switch (size) {
        case 'medium':
          return theme.bladeOld.spacings.medium;
        case 'large':
          return theme.bladeOld.spacings.large;
        default:
          return theme.bladeOld.spacings.medium;
      }
    },
    width({ size, theme }) {
      switch (size) {
        case 'medium':
          return theme.bladeOld.spacings.medium;
        case 'large':
          return theme.bladeOld.spacings.large;
        default:
          return theme.bladeOld.spacings.medium;
      }
    },
    activeWidth({ size, theme }) {
      switch (size) {
        case 'medium':
          return theme.bladeOld.spacings.large;
        case 'large':
          return theme.bladeOld.spacings.xxlarge;
        default:
          return theme.bladeOld.spacings.large;
      }
    },
    radius({ size, theme }) {
      switch (size) {
        case 'medium':
          return `${parseInt(theme.bladeOld.spacings.medium, 10) / 2}px`;
        case 'large':
          return `${parseInt(theme.bladeOld.spacings.large, 10) / 2}px`;
        default:
          return `${parseInt(theme.bladeOld.spacings.medium, 10) / 2}px`;
      }
    },
  },
  padding({ size, theme }) {
    switch (size) {
      case 'medium':
        return theme.bladeOld.spacings.xxsmall;
      case 'large':
        return theme.bladeOld.spacings.xsmall;
      default:
        return theme.bladeOld.spacings.xxsmall;
    }
  },
};

const StyledContainer = styled(TouchableOpacity)`
  border-radius: ${styles.container.radius};
`;

const StyledKnob = styled(View)`
  position: absolute;
  border-radius: ${styles.knob.radius};
  background-color: ${(props) => props.theme.bladeOld.colors.light[900]};
`;

const AnimatedContainer = Animated.createAnimatedComponent(StyledContainer);
const AnimatedKnob = Animated.createAnimatedComponent(StyledKnob);

const moveKnobLeft = ({
  animatedLeftValue,
  animatedRightValue,
  animationConfig,
  onAnimationEnd,
}) => {
  Animated.parallel([
    Animated.timing(animatedLeftValue, {
      toValue: animationConfig.off.leftSpace,
      duration: animationConfig.knob.translationDuration,
      useNativeDriver: false,
    }),
    Animated.timing(animatedRightValue, {
      toValue: animationConfig.off.rightSpace,
      duration: animationConfig.knob.translationDuration,
      useNativeDriver: false,
    }),
  ]).start(onAnimationEnd);
};

const moveKnobRight = ({
  animatedLeftValue,
  animatedRightValue,
  animationConfig,
  onAnimationEnd,
}) => {
  Animated.parallel([
    Animated.timing(animatedLeftValue, {
      toValue: animationConfig.on.leftSpace,
      duration: animationConfig.knob.translationDuration,
      useNativeDriver: false,
    }),
    Animated.timing(animatedRightValue, {
      toValue: animationConfig.on.rightSpace,
      duration: animationConfig.knob.translationDuration,
      useNativeDriver: false,
    }),
  ]).start(onAnimationEnd);
};

const scaleKnob = ({
  animatedValue,
  animateToValue,
  animationDuration,
  onAnimationEnd = () => {},
}) => {
  Animated.timing(animatedValue, {
    toValue: animateToValue,
    duration: animationDuration,
    useNativeDriver: false,
  }).start(onAnimationEnd);
};

const Switch = ({ disabled, on, defaultOn, onChange, size, testID }) => {
  const theme = useTheme();
  const containerWidth = parseInt(
    styles.container.width({
      size,
      theme,
    }),
    10,
  );
  const knobWidth = parseInt(
    styles.knob.width({
      size,
      theme,
    }),
    10,
  );
  const knobActiveWidth = parseInt(
    styles.knob.activeWidth({
      size,
      theme,
    }),
    10,
  );
  const containerPadding = parseInt(
    styles.padding({
      size,
      theme,
    }),
    10,
  );
  const [toggle, setToggle] = useState(false);
  const [active, setActive] = useState(false);

  const animationConfig = {
    off: {
      leftSpace: containerPadding,
      rightSpace: containerWidth - containerPadding - knobWidth,
      activeRightSpace: containerWidth - containerPadding - knobActiveWidth,
    },
    on: {
      leftSpace: containerWidth - containerPadding - knobWidth,
      rightSpace: containerPadding,
      activeLeftSpace: containerWidth - containerPadding - knobActiveWidth,
    },
    knob: {
      translationDuration: 200,
      scaleDuration: 100,
    },
  };

  const { current: animatedLeftValue } = useRef(new Animated.Value(animationConfig.off.leftSpace));
  const { current: animatedRightValue } = useRef(
    new Animated.Value(animationConfig.off.rightSpace),
  );

  useEffect(() => {
    if (defaultOn) {
      animatedLeftValue.setValue(animationConfig.on.leftSpace);
      animatedRightValue.setValue(animationConfig.on.rightSpace);
      setToggle(true);
    }
  }, [
    animatedLeftValue,
    animatedRightValue,
    animationConfig.on.leftSpace,
    animationConfig.on.rightSpace,
    defaultOn,
  ]);

  useEffect(() => {
    if (isDefined(on)) {
      if (isDefined(defaultOn)) {
        throw Error('Expected only one of defaultOn or on props.');
      }
      if (on && !toggle) {
        moveKnobRight({
          animatedLeftValue,
          animatedRightValue,
          animationConfig,
          onAnimationEnd: () => {
            setToggle(!toggle);
          },
        });
      } else if (!on && toggle) {
        moveKnobLeft({
          animatedLeftValue,
          animatedRightValue,
          animationConfig,
          onAnimationEnd: () => {
            setToggle(!toggle);
          },
        });
      }
    }
  }, [on, defaultOn, toggle, animatedLeftValue, animatedRightValue, animationConfig]);

  const onPressIn = useCallback(() => {
    setActive(true);
    if (toggle) {
      scaleKnob({
        animatedValue: animatedLeftValue,
        animateToValue: animationConfig.on.activeLeftSpace,
        animationDuration: animationConfig.knob.scaleDuration,
      });
    } else {
      scaleKnob({
        animatedValue: animatedRightValue,
        animateToValue: animationConfig.off.activeRightSpace,
        animationDuration: animationConfig.knob.scaleDuration,
      });
    }
  }, [
    animatedLeftValue,
    animatedRightValue,
    animationConfig.knob.scaleDuration,
    animationConfig.off.activeRightSpace,
    animationConfig.on.activeLeftSpace,
    toggle,
  ]);

  const onPressOut = useCallback(() => {
    setActive(false);
    if (isDefined(on)) {
      if (toggle) {
        scaleKnob({
          animatedValue: animatedLeftValue,
          animateToValue: animationConfig.on.leftSpace,
          animationDuration: animationConfig.knob.scaleDuration,
          onAnimationEnd: () => onChange(!on),
        });
      } else {
        scaleKnob({
          animatedValue: animatedRightValue,
          animateToValue: animationConfig.off.rightSpace,
          animationDuration: animationConfig.knob.scaleDuration,
          onAnimationEnd: () => onChange(!on),
        });
      }
      return;
    }
    if (toggle) {
      moveKnobLeft({
        animatedLeftValue,
        animatedRightValue,
        animationConfig,
        onAnimationEnd: () => {
          setToggle(!toggle);
          onChange(!toggle);
        },
      });
    } else {
      moveKnobRight({
        animatedLeftValue,
        animatedRightValue,
        animationConfig,
        onAnimationEnd: () => {
          setToggle(!toggle);
          onChange(!toggle);
        },
      });
    }
  }, [animatedLeftValue, animatedRightValue, animationConfig, on, onChange, toggle]);

  const interpolateContainerColor = animatedLeftValue.interpolate({
    inputRange: [animationConfig.off.leftSpace, animationConfig.on.leftSpace],
    outputRange: [theme.bladeOld.colors.shade[960], theme.bladeOld.colors.primary[800]],
  });

  const activeContainerColor = active
    ? toggle
      ? theme.bladeOld.colors.primary[700]
      : theme.bladeOld.colors.shade[950]
    : null;

  const disabledContainerColor = disabled
    ? toggle
      ? theme.bladeOld.colors.primary[500]
      : theme.bladeOld.colors.shade[930]
    : null;

  return (
    <Flex flexDirection="row">
      <Size
        height={styles.container.height({
          size,
          theme,
        })}
        width={styles.container.width({
          size,
          theme,
        })}
      >
        <AnimatedContainer
          disabled={disabled}
          activeOpacity={1}
          size={size}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          delayPressIn={0}
          style={[
            {
              backgroundColor:
                activeContainerColor || disabledContainerColor || interpolateContainerColor,
            },
          ]}
          {...automation(testID)}
        >
          <Size
            height={styles.knob.height({
              size,
              theme,
            })}
            minWidth={`${knobWidth}px`}
          >
            <Flex alignSelf="center">
              <AnimatedKnob
                size={size}
                style={{
                  left: animatedLeftValue,
                  right: animatedRightValue,
                }}
              />
            </Flex>
          </Size>
        </AnimatedContainer>
      </Size>
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
};

Switch.defaultProps = {
  size: 'medium',
  disabled: false,
  testID: 'ds-switch',
  onChange: () => {},
};

export default Switch;
