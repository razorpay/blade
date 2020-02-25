import React, { useState, useContext, useRef } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';

import automationAttributes from '../../_helpers/automation-attributes';

const styles = {
  size({ size, theme }) {
    switch (size) {
      case 'medium':
      default:
        return {
          containerSize: {
            height: theme.spacings.large,
            width: theme.spacings.xxxlarge,
          },
          knobSize: {
            height: theme.spacings.medium,
            width: theme.spacings.medium,
            activeWidth: theme.spacings.large,
          },
        };
    }
  },
  padding({ size, theme }) {
    switch (size) {
      case 'medium':
      default:
        return theme.spacings.xxsmall;
    }
  },
  containerColor({ toggleState, disabled, active, theme }) {
    if (toggleState) {
      if (disabled) {
        return theme.colors.primary[500];
      }
      if (active) {
        return theme.colors.primary[800];
      }
      return theme.colors.primary[800];
    } else {
      if (disabled) {
        return theme.colors.shade[300];
      }
      if (active) {
        return theme.colors.shade[500];
      }
      return theme.colors.shade[600];
    }
  },
  alignSelf({ align }) {
    switch (align) {
      case 'left':
      default:
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
    }
  },
};

const StyledContainer = styled(View)(
  (props) => `
  height: ${styles.size(props).containerSize.height};
  width: ${styles.size(props).containerSize.width};
  border-radius: ${`${parseInt(styles.size(props).containerSize.height, 10) / 2}px`};
  padding: ${styles.padding(props)};
  flex-direction: ${props.flexDirection};
  align-self: ${styles.alignSelf(props)}
  background-color: ${props.backgroundColor};
`,
);

const StyledKnob = styled(TouchableOpacity)(
  (props) => `
  height: ${styles.size(props).knobSize.height};
  border-radius: ${`${parseInt(styles.size(props).knobSize.height, 10) / 2}px`};
  background-color: #fff;
`,
);

const AnimatedKnob = Animated.createAnimatedComponent(StyledKnob);

const Toggle = (props) => {
  const { disabled, value, align, testID, onValueChange, size } = props;
  const theme = useContext(ThemeContext);
  const { containerSize, knobSize } = styles.size({ ...props, theme });
  const containerPadding = styles.padding({ ...props, theme });
  const knobTranslationX = useRef(new Animated.Value(0));
  const knobWidth = useRef(new Animated.Value(parseInt(knobSize.width, 10)));
  const [toggleState, setToggleState] = useState(value);
  const [active, setActive] = useState(false);
  const [containerColor, setContainerColor] = useState(
    styles.containerColor({ toggleState, active, disabled, theme }),
  );

  const onPressIn = () => {
    Animated.timing(knobWidth.current, {
      toValue: parseInt(knobSize.activeWidth, 10),
      duration: 100,
    }).start();
    setActive(true);
    setContainerColor(styles.containerColor({ toggleState, active: true, disabled, theme }));
  };

  const onPressOut = () => {
    setActive(false);
    const translationXDistance =
      parseInt(containerSize.width, 10) -
      2 * parseInt(containerPadding, 10) -
      parseInt(knobSize.width, 10);
    setContainerColor(
      styles.containerColor({
        toggleState: !toggleState,
        disabled,
        active: false,
        theme,
      }),
    );
    Animated.parallel([
      Animated.timing(knobTranslationX.current, {
        toValue: toggleState ? -translationXDistance : translationXDistance,
        duration: 600,
      }),
      Animated.timing(knobWidth.current, {
        toValue: parseInt(knobSize.width, 10),
        delay: 200,
        duration: 400,
      }),
    ]).start(() => {
      knobTranslationX.current = new Animated.Value(0);
      setToggleState(!toggleState);
      onValueChange(!toggleState);
    });
  };

  const containerFlexDirection = toggleState ? 'row-reverse' : 'row';
  const hitSlopWidth =
    parseInt(containerSize.width, 10) -
    parseInt(containerPadding, 10) -
    parseInt(knobSize.width, 10);
  const hitSlop = toggleState ? { left: hitSlopWidth } : { right: hitSlopWidth };
  return (
    <StyledContainer
      backgroundColor={containerColor}
      flexDirection={containerFlexDirection}
      {...automationAttributes(testID)}
      align={align}
    >
      <AnimatedKnob
        disabled={disabled}
        size={size}
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        hitSlop={hitSlop}
        style={[
          {
            width: knobWidth.current,
            transform: [{ translateX: knobTranslationX.current }],
          },
        ]}
      />
    </StyledContainer>
  );
};

Toggle.propTypes = {
  size: PropTypes.oneOf(['medium']),
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  onValueChange: PropTypes.func,
  testID: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
};

Toggle.defaultProps = {
  size: 'medium',
  disabled: false,
  value: false,
  testID: 'ds-toggle',
  align: 'left',
  onValueChange: () => {},
};

export default Toggle;
