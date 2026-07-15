import React from 'react';
import { Pressable, InteractionManager } from 'react-native';
import type { View } from 'react-native';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { mergeRefs } from '@mantine/hooks';
import type { CSSObject } from 'styled-components';
import type {
  BaseMotionBoxProps,
  BaseMotionEntryExitProps,
  MotionMeta,
  MotionVariantsType,
} from './types';
import { useMotionVariants } from './baseMotionUtils';
import { useAnimatedVariant } from './baseMotionInterpreter.native';
import { useAnimateInteractions } from '~components/AnimateInteractions/AnimateInteractionsProvider';
import { useStagger } from '~components/Stagger/StaggerProvider';
import { useMemoizedStyles } from '~components/Box/BaseBox/useMemoizedStyles';
import type { BoxProps } from '~components/Box';
import type { Theme } from '~components/BladeProvider';
import { castNativeType } from '~utils';
import { logger } from '~utils/logger';

/**
 * Internal-only props threaded through the native engine. `_onAnimationComplete` lets
 * `BaseMotionEntryExit` react to the exit transition completing (for manual unmount) since native
 * has no `AnimatePresence`.
 */
type BaseMotionBoxNativeProps = BaseMotionBoxProps & {
  _motionMeta?: MotionMeta;
  _onAnimationComplete?: (targetName: keyof MotionVariantsType) => void;
};

// `style` (animated) and `pointerEvents` come from `Animated.View` itself and conflict with the
// web `BoxProps` shapes, so they're omitted from the styled generic.
type MotionDivProps = Omit<BoxProps, 'style' | 'pointerEvents' | 'as'>;

/**
 * Empty styled component so box/layout style props are still honoured on native, mirroring the web
 * `StyledDiv`. Web-only CSS is stripped since `Animated.View` can't consume it.
 */
const StyledDiv = styled(Animated.View)<MotionDivProps>((props) => {
  const boxStyles = useMemoizedStyles((props as unknown) as BoxProps & { theme: Theme }) as Record<
    string,
    unknown
  >;
  const {
    boxShadow: _boxShadow,
    transition: _transition,
    cursor: _cursor,
    transform: _transform,
    outline: _outline,
    ...nativeStyles
  } = boxStyles;

  return nativeStyles as CSSObject;
});

/**
 * `MotionDiv` — native counterpart of `motion(StyledDiv)`.
 *
 * **API divergence from web:** On web, `MotionDiv` is `motion(StyledDiv)` and accepts
 * framer-motion props (`animate`, `initial`, `exit`, `variants`, etc.). On native, there is
 * no framer-motion runtime — `MotionDiv` is simply a styled `Animated.View` that accepts a
 * resolved animated `style` prop. Framer-style declarative props are NOT supported; animation
 * is driven by `useAnimatedVariant` inside `BaseMotionBox` instead. Used directly by `Morph`
 * (layout morph is degraded — see PR description for known limitations).
 */
const MotionDiv = StyledDiv;

const _BaseMotionBox = (
  {
    children,
    motionVariants: userMotionVariants,
    type = 'inout',
    motionTriggers = ['mount'],
    animateVisibility,
    animate,
    // `as` has no arbitrary-tag semantics on native; children are wrapped instead.
    as: _as,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _motionMeta,
    _onAnimationComplete,
    ...rest
  }: BaseMotionBoxNativeProps,
  ref: React.Ref<View>,
): React.ReactElement => {
  const { isInsideAnimateInteractionsContainer } = useAnimateInteractions();
  const { isInsideStaggerContainer, staggerType } = useStagger();

  if (__DEV__ && _as) {
    logger({
      type: 'warn',
      moduleName: 'BaseMotion',
      message:
        'The "as" prop is not supported on React Native (no arbitrary-tag semantics). ' +
        'It is silently ignored — children are wrapped in an Animated.View instead.',
    });
  }

  if (__DEV__) {
    const degradedTriggers = motionTriggers.filter(
      (t) => t === 'hover' || t === 'in-view' || t === 'focus',
    );
    if (degradedTriggers.length > 0) {
      logger({
        type: 'warn',
        moduleName: 'BaseMotion',
        message:
          `Trigger(s) [${degradedTriggers.join(', ')}] are not supported on React Native and ` +
          'degrade to "mount" (animate-on-mount). Touch devices have no hover/focus/IntersectionObserver ' +
          'equivalents.',
      });
    }
  }

  const motionVariants = useMotionVariants(
    userMotionVariants,
    isInsideStaggerContainer ? staggerType : type,
  );

  const hasTap = motionTriggers.includes('tap');
  const isAnimateInteractionsDriven =
    isInsideAnimateInteractionsContainer && motionTriggers.includes('on-animate-interactions');

  const [isMounted, setIsMounted] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const nativeAnimate = castNativeType(animate);

  // Derive the current declarative target from the active triggers.
  // Priority: explicit visibility → AnimateInteractions control flag → tap → mount (+ degraded
  // hover / focus / in-view which all fall back to animate-on-mount on touch devices).
  let targetName: keyof MotionVariantsType = 'initial';
  if (animateVisibility) {
    targetName = animateVisibility;
  } else if (isAnimateInteractionsDriven) {
    targetName =
      typeof nativeAnimate === 'boolean' ? (nativeAnimate ? 'animate' : 'exit') : 'initial';
  } else if (hasTap) {
    targetName = isPressed ? 'animate' : 'initial';
  } else {
    targetName = isMounted ? 'animate' : 'initial';
  }

  const animatedStyle = useAnimatedVariant({
    variants: motionVariants,
    targetName,
    onAnimationComplete: _onAnimationComplete,
  });

  const motionContent = (
    <MotionDiv ref={ref as never} style={animatedStyle} {...(rest as MotionDivProps)}>
      {children}
    </MotionDiv>
  );

  if (hasTap) {
    return (
      <Pressable onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)}>
        {motionContent}
      </Pressable>
    );
  }

  return motionContent;
};

/**
 * Base motion component that resolves the target variant from triggers and drives the reanimated
 * interpreter.
 */
const BaseMotionBox = React.forwardRef(_BaseMotionBox);

const _BaseMotionEnhancerBox: React.ForwardRefRenderFunction<View, BaseMotionBoxNativeProps> = (
  { children, ...motionBoxArgs },
  ref,
) => {
  const childRef = (children.props as { ref?: React.Ref<View> }).ref ?? null;

  return (
    <BaseMotionBox
      // Preserve the child's own ref alongside the forwarded ref (used by AnimateInteractions).
      ref={mergeRefs(childRef, ref ?? null)}
      {...motionBoxArgs}
    >
      {children}
    </BaseMotionBox>
  );
};

/**
 * Used in AnimateInteractions, Scale, etc.
 *
 * On native there is no arbitrary-tag `as`, so instead of cloning the child element we wrap it in
 * the animated `Animated.View` rendered by `BaseMotionBox`.
 *
 * **Known layout divergence from web:** On web, `BaseMotionEnhancerBox` clones the child element
 * and applies animation styles directly to it (no extra DOM node). On native, we must wrap the
 * child in an extra `Animated.View` because React Native does not support arbitrary-tag `as`.
 * This introduces an additional view node in the hierarchy, which may cause minor layout
 * differences (e.g., extra nesting in flexbox). Consumers should be aware of this when porting
 * layouts that depend on the enhancer not adding a wrapper.
 */
const BaseMotionEnhancerBox = React.forwardRef(_BaseMotionEnhancerBox);

/**
 * Base component for entry / exit animations.
 *
 * Native has no `AnimatePresence`, so mount/unmount is controlled manually (mirroring
 * `CollapsibleBodyContent.native.tsx`): on exit we keep the node mounted, run the exit variant, and
 * unmount only once the reanimated transition reports completion via `_onAnimationComplete`.
 */
const BaseMotionEntryExit = ({
  children,
  motionVariants,
  isVisible = true,
  type = 'inout',
  motionTriggers = ['mount'],
  shouldUnmountWhenHidden = false,
}: BaseMotionEntryExitProps): React.ReactElement | null => {
  const [isMounted, setIsMounted] = React.useState(shouldUnmountWhenHidden ? isVisible : true);

  // Synchronous read of the latest visibility for the deferred unmount callback, guarding against
  // rapid toggles (visible → hidden → visible before the exit animation completes).
  const isVisibleRef = React.useRef(isVisible);
  isVisibleRef.current = isVisible;

  // Declared before handleAnimationComplete so the callback can store the handle for cleanup.
  const interactionHandleRef = React.useRef<{ cancel?: () => void } | null>(null);

  React.useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
    }
    // When hiding with `shouldUnmountWhenHidden`, we stay mounted until the exit animation
    // completes (see `handleAnimationComplete`), so nothing to do here on the falsy branch.
  }, [isVisible]);

  const handleAnimationComplete = React.useCallback(
    (targetName: keyof MotionVariantsType) => {
      if (targetName !== 'exit' || !shouldUnmountWhenHidden) return;
      // Use InteractionManager.runAfterInteractions instead of requestAnimationFrame so the
      // callback fires even when the app is backgrounded (rAF may be paused by the OS).
      // The handle is stored for cleanup on unmount to prevent memory leaks.
      interactionHandleRef.current = InteractionManager.runAfterInteractions(() => {
        if (!isVisibleRef.current) {
          setIsMounted(false);
        }
      });
    },
    [shouldUnmountWhenHidden],
  );

  // Cleanup pending InteractionManager callback on unmount.
  React.useEffect(() => {
    return () => {
      interactionHandleRef.current?.cancel?.();
    };
  }, []);

  const motionMeta: MotionMeta = React.useMemo(() => {
    return {
      isEnhanced: true,
      innerRef: ((children as { ref?: React.Ref<View> }).ref ?? null) as MotionMeta['innerRef'],
    };
    // Depend on the child's ref identity rather than the entire children object, which changes
    // every render and would make the memo ineffective.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(children as { ref?: React.Ref<View> }).ref]);

  if (!isMounted) {
    return null;
  }

  return (
    <BaseMotionBox
      motionVariants={motionVariants}
      motionTriggers={motionTriggers}
      type={type}
      // Always drive visibility on native so the exit animation (and its completion callback) runs.
      animateVisibility={isVisible ? 'animate' : 'exit'}
      _motionMeta={motionMeta}
      _onAnimationComplete={handleAnimationComplete}
    >
      {children}
    </BaseMotionBox>
  );
};

export { MotionDiv, BaseMotionBox, BaseMotionEnhancerBox, BaseMotionEntryExit };
