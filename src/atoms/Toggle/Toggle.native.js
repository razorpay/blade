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
};

const StyledContainer = styled(View)(
  (props) => `
  height: ${styles.size(props).containerSize.height};
  width: ${styles.size(props).containerSize.width};
  border-radius: ${`${parseInt(styles.size(props).containerSize.height, 10) / 2}px`};
  padding: ${styles.padding(props)};
  flex-direction: ${props.flexDirection};
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
  const { disabled, value, testID } = props;
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
      props.onValueChange(!toggleState);
    });
  };

  const containerFlexDirection = toggleState ? 'row-reverse' : 'row';
  return (
    <StyledContainer
      backgroundColor={containerColor}
      flexDirection={containerFlexDirection}
      {...automationAttributes(testID)}
    >
      <AnimatedKnob
        disabled={disabled}
        size={props.size}
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
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
};

Toggle.defaultProps = {
  size: 'medium',
  disabled: false,
  value: false,
  testID: 'ds-toggle',
  onValueChange: () => {},
};

export default Toggle;
