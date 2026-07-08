import React from 'react';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Dimensions, Pressable } from 'react-native';
import type { ElevationStyles } from '~tokens/global/elevation';
import BaseBox from '~components/Box/BaseBox';
import { getElevationValue } from '~components/Box/BaseBox/baseBoxStyles';
import { useTheme } from '~components/BladeProvider';
import { makeAccessible } from '~utils/makeAccessible';

const fillStyle = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

// Outer animated wrapper carries the slide/opacity animation + elevation shadow.
// Shadow lives here (NOT on the inner surface) because the inner surface uses
// `overflow: 'hidden'` for the Android border-radius clip fix, which would clip the shadow.
const StyledDrawerWrapper = styled(Animated.View)(() => {
  return {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    right: 0,
    width: '90%',
    flexDirection: 'column' as const,
  };
});

const StyledDrawerSurface = styled(BaseBox)(({ theme }) => {
  return {
    flex: 1,
    backgroundColor: theme.colors.popup.background.gray.subtle,
    // base breakpoint renders the drawer edge-to-edge with no radius (matches web's phone view)
    borderRadius: 0,
    overflow: 'hidden' as const,
    flexDirection: 'column' as const,
  };
});

const StyledOverlay = styled(Animated.View)(({ theme }) => {
  return {
    ...fillStyle,
    backgroundColor: theme.colors.overlay.background.subtle,
  };
});

type AnimatedDrawerContainerProps = {
  /**
   * Drives the enter/exit animation. When `true` the drawer slides in and the
   * overlay fades in; when `false` it slides out and fades away.
   */
  isVisible: boolean;
  /**
   * Whether to render the dismissible overlay behind the drawer surface.
   */
  showOverlay: boolean;
  /**
   * Called when the user presses the overlay to dismiss the drawer.
   */
  onOverlayPress: () => void;
  /**
   * Called after the exit animation completes (parity with web `onUnmount`).
   */
  onExitComplete?: () => void;
  /**
   * Accessibility label announced for the drawer dialog.
   */
  accessibilityLabel?: string;
  /**
   * Drawer content (DrawerHeader / DrawerBody / DrawerFooter).
   */
  children: React.ReactNode;
};

/**
 * Encapsulates the reanimated slide-in surface + fading overlay for the native
 * Drawer. Mirrors the web `AnimatedDrawerContainer` styled component but drives
 * `translateX`/`opacity` via reanimated shared values instead of CSS transitions.
 */
const AnimatedDrawerContainer = ({
  isVisible,
  showOverlay,
  onOverlayPress,
  onExitComplete,
  accessibilityLabel,
  children,
}: AnimatedDrawerContainerProps): React.ReactElement => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  // Always initialize the shared values at the CLOSED / off-screen state
  // (translateX = screenWidth, opacity = 0) so there is a "from" frame to animate FROM
  // when the drawer mounts open. The Portal mounts fresh on open, so this container
  // mounts with `isVisible = true`; the mount effect below then drives `withTiming` to
  // the open state, producing the slide-in.
  //
  // Initializing from the current visibility instead (open → translateX 0) meant that on
  // open the surface was already at its resting position, so the enter `withTiming(0)`
  // had nothing to animate and the panel snapped into place instantly. The exit still
  // animated (0 → screenWidth) which is why only the enter transition looked broken.
  const translateX = useSharedValue(screenWidth);
  const surfaceOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const shadow = (getElevationValue('highRaised', theme) as unknown) as ElevationStyles;

  React.useEffect(() => {
    // Mirror web's Drawer surface transition (Drawer.web.tsx): enter uses
    // `duration.xmoderate` + `easing.entrance`, exit uses `duration.moderate` +
    // `easing.exit`. Previously enter used the slower `gentle` (480ms), which made the
    // native open feel sluggish compared to web's 360ms slide-in.
    const enterConfig = {
      duration: theme.motion.duration.xmoderate,
      easing: theme.motion.easing.entrance,
    };
    const exitConfig = {
      duration: theme.motion.duration.moderate,
      easing: theme.motion.easing.exit,
    };
    const config = isVisible ? enterConfig : exitConfig;

    translateX.value = withTiming(isVisible ? 0 : screenWidth, config);
    surfaceOpacity.value = withTiming(isVisible ? 1 : 0, config);
    overlayOpacity.value = withTiming(isVisible ? 1 : 0, config, (finished) => {
      if (finished && !isVisible && onExitComplete) {
        runOnJS(onExitComplete)();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, screenWidth]);

  const surfaceAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: surfaceOpacity.value,
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  return (
    <>
      {showOverlay ? (
        <Pressable
          onPress={onOverlayPress}
          style={fillStyle}
          {...makeAccessible({ role: 'button', label: 'Dismiss' })}
        >
          <StyledOverlay style={overlayAnimatedStyle} />
        </Pressable>
      ) : null}
      <StyledDrawerWrapper style={[shadow, surfaceAnimatedStyle]}>
        <StyledDrawerSurface
          {...makeAccessible({
            role: 'dialog',
            modal: true,
            label: accessibilityLabel,
          })}
        >
          {children}
        </StyledDrawerSurface>
      </StyledDrawerWrapper>
    </>
  );
};

export { AnimatedDrawerContainer };
