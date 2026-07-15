import React from 'react';
import { Pressable } from 'react-native';
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
  const boxStyles = useMemoizedStyles(
    (props as unknown) as BoxProps & { theme: Theme },
  ) as Record<
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
 * `MotionDiv` — native counterpart of `motion(StyledDiv)`. It's a styled `Animated.View` that
 * accepts a resolved animated `style`. Used directly by `Morph` (layout morph is degraded).
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
  const { isInsideAnimateInteractionsContainer, isInteracting } = useAnimateInteractions();
  const {
    isInsideStaggerContainer,
    staggerType,
    staggerDelay,
    staggerVisibility,
    isLastStaggerChild,
    onStaggerComplete,
  } = useStagger();

  const resolvedMotionVariants = useMotionVariants(
    userMotionVariants,
    isInsideStaggerContainer ? staggerType : type,
  );

  // Inside a Stagger, the parent injects a per-child offset into the resolved variants (the
  // interpreter reads `transition.delay`). This is the single choke point where the delay is
  // applied, so child presets stay oblivious. Guarded behind `isInsideStaggerContainer` so
  // standalone usage is byte-for-byte unchanged.
  const motionVariants = React.useMemo<MotionVariantsType | undefined>(() => {
    if (!isInsideStaggerContainer || !staggerDelay || !resolvedMotionVariants) {
      return resolvedMotionVariants;
    }
    return {
      initial: resolvedMotionVariants.initial,
      animate: {
        ...resolvedMotionVariants.animate,
        transition: { ...resolvedMotionVariants.animate?.transition, delay: staggerDelay.enter },
      },
      exit: {
        ...resolvedMotionVariants.exit,
        transition: { ...resolvedMotionVariants.exit?.transition, delay: staggerDelay.exit },
      },
    };
  }, [isInsideStaggerContainer, staggerDelay, resolvedMotionVariants]);

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
  // Priority: stagger visibility → AnimateInteractions control flag → explicit visibility → tap →
  // mount (+ degraded hover / focus / in-view which all fall back to animate-on-mount on touch
  // devices).
  //
  // `isAnimateInteractionsDriven` deliberately outranks `animateVisibility`: presets wrapped in
  // `AnimateInteractions` render through `BaseMotionEntryExit`, which always threads
  // `animateVisibility='animate'` (default `isVisible`). Letting that win would pin the child open
  // and swallow the interaction. This mirrors the web engine, where `shouldSkipAnimationVariables`
  // discards `animateVisibility` for `on-animate-interactions` children so framer's control
  // propagation drives them instead.
  let targetName: keyof MotionVariantsType = 'initial';
  if (isInsideStaggerContainer && staggerVisibility) {
    // Inside a Stagger the container owns visibility: every child animates towards the shared
    // target (offset by its own `staggerDelay`) rather than its local mount / trigger state.
    targetName = staggerVisibility;
  } else if (isAnimateInteractionsDriven) {
    // Prefer the context signal published by `AnimateInteractions.native` (press-and-hold);
    // fall back to the legacy `animate` boolean prop for any direct caller. `false` maps to
    // `'exit'` (the resting/hidden target) so descendants start idle before first interaction.
    const driven =
      typeof isInteracting === 'boolean'
        ? isInteracting
        : typeof nativeAnimate === 'boolean'
        ? nativeAnimate
        : false;
    targetName = driven ? 'animate' : 'exit';
  } else if (animateVisibility) {
    targetName = animateVisibility;
  } else if (hasTap) {
    targetName = isPressed ? 'animate' : 'initial';
  } else {
    targetName = isMounted ? 'animate' : 'initial';
  }

  // The last stagger child (largest total exit time) also notifies the container so it can defer
  // its unmount until the final child's exit completes. Additive: the child's own
  // `_onAnimationComplete` (if any) still fires.
  const handleAnimationComplete = React.useCallback(
    (completedTarget: keyof MotionVariantsType) => {
      _onAnimationComplete?.(completedTarget);
      if (isInsideStaggerContainer && isLastStaggerChild) {
        onStaggerComplete?.(completedTarget);
      }
    },
    [_onAnimationComplete, isInsideStaggerContainer, isLastStaggerChild, onStaggerComplete],
  );

  const animatedStyle = useAnimatedVariant({
    variants: motionVariants,
    targetName,
    onAnimationComplete: handleAnimationComplete,
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
      // Defer to the next frame so the unmount is decoupled from the reanimated timing callback
      // (which fires on the UI thread), and re-check visibility in case it flipped back.
      requestAnimationFrame(() => {
        if (!isVisibleRef.current) {
          setIsMounted(false);
        }
      });
    },
    [shouldUnmountWhenHidden],
  );

  const motionMeta: MotionMeta = React.useMemo(() => {
    return {
      isEnhanced: true,
      innerRef: ((children as { ref?: React.Ref<View> }).ref ?? null) as MotionMeta['innerRef'],
    };
  }, [children]);

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
