import React from 'react';
import { Linking, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import styled from 'styled-components';
import type { CardRootProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { castNativeType, makeMotionTime, useTheme } from '~utils';
import { logger } from '~utils/logger';
import { makeAccessible } from '~utils/makeAccessible/makeAccessible.native';

const StyledCardRoot = styled(BaseBox)<CardRootProps>(({ isSelected, ...props }) => {
  const selectedColor = isSelected ? props.theme.colors.brand.primary[500] : 'transparent';
  return {
    // TODO: use thicker
    border: `${props.theme.border.width.thick}px solid ${selectedColor}`,
  };
});

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const openURL = async (href: string): Promise<void> => {
  try {
    const canOpen = await Linking.canOpenURL(href);
    if (canOpen) {
      await Linking.openURL(href);
    }
  } catch {
    if (__DEV__) {
      logger({
        type: 'warn',
        message: `Could not open the link "href=${href}"`,
        moduleName: 'BaseButton',
      });
    }
  }
};

const CardRoot = ({
  children,
  onClick,
  isSelected,
  scaleOnHover,
  href,
  as,
  accessibilityLabel,
  ...props
}: CardRootProps): React.ReactElement => {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = React.useState(false);
  const duration = castNativeType(makeMotionTime(theme.motion.duration.xquick));
  const easing = castNativeType(theme.motion.easing.standard.effective);

  const styles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          // TODO: check with design once what to do on mobile
          scale: withTiming(isPressed ? 0.95 : 1, { duration, easing }),
        },
      ],
    };
  }, [isPressed]);

  if (onClick || scaleOnHover || href) {
    return (
      <AnimatedPressable
        {...makeAccessible({ label: accessibilityLabel, selected: isSelected })}
        style={styles}
        onPressIn={() => {
          if (onClick) {
            onClick();
          }
          setIsPressed(true);
        }}
        onPressOut={() => {
          if (href) {
            void openURL(href);
          }
          setIsPressed(false);
        }}
      >
        <StyledCardRoot as={undefined} isSelected={isSelected} {...props}>
          {children}
        </StyledCardRoot>
      </AnimatedPressable>
    );
  }

  return (
    <StyledCardRoot as={undefined} isSelected={isSelected} {...props}>
      {children}
    </StyledCardRoot>
  );
};

export { CardRoot };
