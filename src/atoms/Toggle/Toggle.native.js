import React, { useState, useContext, useRef, useEffect } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import PropTypes from 'prop-types';

import { makePxValue } from '../../_helpers/theme';
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
      case 'large':
        return {
          containerSize: {
            height: makePxValue(3),
            width: makePxValue(6),
          },
          knobSize: {
            height: theme.spacings.large,
            width: theme.spacings.large,
            activeWidth: theme.spacings.xxlarge,
          },
        };
    }
  },
  padding({ size, theme }) {
    switch (size) {
      case 'medium':
      default:
        return theme.spacings.xxsmall;
      case 'large':
        return theme.spacings.xsmall;
    }
  },
  containerColor({ toggleState, disabled, active, theme }) {
    if (toggleState) {
      if (disabled) {
        return theme.colors.primary[500];
      }
      if (active) {
        return theme.colors.primary[700];
      }
      return theme.colors.primary[800];
    } else {
      if (disabled) {
        return theme.colors.shade[930];
      }
      if (active) {
        return theme.colors.shade[950];
      }
      return theme.colors.shade[960];
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

const StyledContainer = styled(Animated.View)(
  (props) => `
  height: ${styles.size(props).containerSize.height};
  width: ${styles.size(props).containerSize.width};
  border-radius: ${`${parseInt(styles.size(props).containerSize.height, 10) / 2}px`};
  padding: ${styles.padding(props)};
  flex-direction: ${props.flexDirection};
  align-self: ${styles.alignSelf(props)};
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
  const { disabled, on, defaultOn, onChange, size, align, testID } = props;
  const theme = useContext(ThemeContext);
  const { containerSize, knobSize } = styles.size({ ...props, theme });
  const containerPadding = styles.padding({ ...props, theme });
  const knobTranslationX = useRef(new Animated.Value(0));
  const knobWidth = useRef(new Animated.Value(parseInt(knobSize.width, 10)));
  const [toggleState, setToggleState] = useState(false);
  const [active, setActive] = useState(false);

  const [containerColor, setContainerColor] = useState(
    styles.containerColor({ toggleState, active, disabled, theme }),
  );
  const translationXDistance =
    parseInt(containerSize.width, 10) -
    2 * parseInt(containerPadding, 10) -
    parseInt(knobSize.width, 10);

  useEffect(() => {
    if (typeof on !== 'undefined') {
      if (on && !toggleState) {
        setContainerColor(
          styles.containerColor({ toggleState: true, active: false, disabled, theme }),
        );
        Animated.timing(knobTranslationX.current, {
          toValue: translationXDistance,
          duration: 600,
        }).start(() => {
          knobTranslationX.current.setValue(0);
          setToggleState(true);
          setActive(true);
          onChange(!on);
        });
      } else if (!on && toggleState) {
        setContainerColor(
          styles.containerColor({ toggleState: false, active: false, disabled, theme }),
        );
        Animated.timing(knobTranslationX.current, {
          toValue: -translationXDistance,
          duration: 600,
        }).start(() => {
          knobTranslationX.current.setValue(0);
          setToggleState(false);
          setActive(true);
          onChange(!on);
        });
      }
      return;
    }
    if (defaultOn) {
      knobTranslationX.current.setValue(translationXDistance);
      knobTranslationX.current.setValue(0);
      setToggleState(true);
      setActive(true);
      setContainerColor(
        styles.containerColor({ toggleState: true, active: true, disabled, theme }),
      );
    }
  }, [on, defaultOn]);

  const onPressIn = () => {
    Animated.timing(knobWidth.current, {
      toValue: parseInt(knobSize.activeWidth, 10),
      duration: 100,
    }).start();
    setActive(true);
    setContainerColor(styles.containerColor({ toggleState, active: true, disabled, theme }));
  };

  const onPressOut = () => {
    if (typeof on !== 'undefined') {
      Animated.timing(knobWidth.current, {
        toValue: parseInt(knobSize.width, 10),
        delay: 200,
        duration: 200,
      }).start();
      onChange(!on);
      return;
    }
    setActive(false);
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
        duration: 400,
      }),
      Animated.timing(knobWidth.current, {
        toValue: parseInt(knobSize.width, 10),
        delay: 200,
        duration: 200,
      }),
    ]).start(() => {
      knobTranslationX.current.setValue(0);
      setToggleState(!toggleState);
      onChange(!toggleState);
    });
  };
  const hitSlopWidth =
    parseInt(containerSize.width, 10) -
    parseInt(containerPadding, 10) -
    parseInt(knobSize.width, 10);
  const hitSlop = toggleState ? { left: hitSlopWidth } : { right: hitSlopWidth };
  return (
    <StyledContainer
      backgroundColor={containerColor}
      flexDirection={toggleState ? 'row-reverse' : 'row'}
      align={align}
      size={size}
      {...automationAttributes(testID)}
    >
      <AnimatedKnob
        disabled={disabled}
        size={size}
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        hitSlop={hitSlop}
        style={{
          width: knobWidth.current,
          transform: [{ translateX: knobTranslationX.current }],
        }}
      />
    </StyledContainer>
  );
};

Toggle.propTypes = {
  size: PropTypes.oneOf(['medium', 'large']),
  disabled: PropTypes.bool,
  on: PropTypes.bool,
  defaultOn: PropTypes.bool,
  onChange: PropTypes.func,
  testID: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
};

Toggle.defaultProps = {
  size: 'medium',
  disabled: false,
  defaultOn: false,
  testID: 'ds-toggle',
  align: 'left',
  onChange: () => {},
};

export default Toggle;
