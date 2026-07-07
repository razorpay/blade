import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import type { ReasoningTrace, ReasoningTracesProps } from './types';
import Rotate from './Rotate.native';
import { useTheme } from '~components/BladeProvider';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { Collapsible } from '~components/Collapsible/Collapsible';
import { CollapsibleBody } from '~components/Collapsible/CollapsibleBody';
import { Svg, Path } from '~components/Icons/_Svg';
import useIconProps from '~components/Icons/useIconProps';
import getIn from '~utils/lodashButBetter/get';
import { castNativeType } from '~utils';
import { makeMotionTime } from '~utils/makeMotionTime';

const SparkleIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 9 9" fill="none">
      <Path
        d="M4.7169 8.67519C4.62025 8.93638 4.25084 8.93638 4.15419 8.67519L3.13296 5.91537C3.10258 5.83326 3.03784 5.76851 2.95572 5.73813L0.195898 4.7169C-0.0652872 4.62025 -0.0652871 4.25084 0.195899 4.15419L2.95572 3.13296C3.03784 3.10258 3.10258 3.03784 3.13297 2.95572L4.15419 0.1959C4.25084 -0.0652861 4.62026 -0.0652861 4.7169 0.195899L5.73813 2.95572C5.76851 3.03784 5.83326 3.10258 5.91537 3.13297L8.6752 4.15419C8.93638 4.25084 8.93638 4.62026 8.6752 4.7169L5.91537 5.73813C5.83326 5.76851 5.76851 5.83326 5.73813 5.91537L4.7169 8.67519Z"
        fill="#009E5C"
      />
    </Svg>
  );
};

const ActiveStepIcon = (): React.ReactElement => (
  <Rotate animate={true}>
    <SparkleIcon size="xsmall" color="feedback.icon.positive.intense" />
  </Rotate>
);

type StepStatus = 'completed' | 'active' | 'pending';

const StepDot = ({ status }: { status: StepStatus }): React.ReactElement => (
  <BaseBox
    style={{ opacity: status === 'pending' ? 0.3 : 1 }}
    width="6px"
    height="6px"
    borderRadius="max"
    backgroundColor={
      status === 'completed' ? 'surface.icon.onSea.onSubtle' : 'surface.icon.gray.muted'
    }
    flexShrink={0}
  />
);

const StepConnector = ({ fromStatus }: { fromStatus: StepStatus }): React.ReactElement => (
  <BaseBox
    style={{ flex: 1, minHeight: 6 }}
    width="1px"
    backgroundColor={
      fromStatus === 'completed' ? 'surface.icon.onSea.onSubtle' : 'surface.border.gray.muted'
    }
  />
);

const ShimmerOverlay = ({
  children,
  isActive,
}: {
  children: React.ReactNode;
  isActive: boolean;
}): React.ReactElement => {
  const { theme } = useTheme();
  const shimmerDuration = castNativeType(
    makeMotionTime(getIn(theme.motion, 'duration.2xgentle')),
  );
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: shimmerDuration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: shimmerDuration / 2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      );
    } else {
      opacity.value = 0;
    }
  }, [isActive, shimmerDuration, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <BaseBox position="relative" overflow="hidden">
      {children}
      {isActive && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: theme.colors.surface.text.staticWhite.muted,
            },
            animatedStyle,
          ]}
        />
      )}
    </BaseBox>
  );
};

const AnimatedRow = ({
  children,
  skipAnimation,
}: {
  children: React.ReactNode;
  skipAnimation?: boolean;
}): React.ReactElement => {
  const { theme } = useTheme();
  const duration = castNativeType(makeMotionTime(getIn(theme.motion, 'duration.moderate')));
  const opacity = useSharedValue(skipAnimation ? 1 : 0);
  const translateY = useSharedValue(skipAnimation ? 0 : 8);

  useEffect(() => {
    if (!skipAnimation) {
      opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });
      translateY.value = withTiming(0, { duration, easing: Easing.out(Easing.ease) });
    }
  }, [skipAnimation, duration, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

const ActiveTextSlider = ({ text }: { text: string }): React.ReactElement => {
  const { theme } = useTheme();
  const duration = castNativeType(makeMotionTime(getIn(theme.motion, 'duration.xmoderate')));
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    opacity.value = 0;
    translateY.value = 12;
    opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(0, { duration, easing: Easing.out(Easing.ease) });
  }, [text, duration, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ShimmerOverlay isActive>
        <Text color="surface.text.onSea.onSubtle" size="small" weight="regular">
          {text}
        </Text>
      </ShimmerOverlay>
    </Animated.View>
  );
};

const TraceRow = ({
  text,
  isLast,
  stepStatus,
}: {
  text: string;
  isLast: boolean;
  stepStatus: StepStatus;
}): React.ReactElement => (
  <BaseBox display="flex" flexDirection="row" alignItems="stretch">
    <BaseBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      flexShrink={0}
      width="16px"
      marginRight="spacing.3"
    >
      <BaseBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="17px"
        flexShrink={0}
      >
        {stepStatus === 'active' ? <ActiveStepIcon /> : <StepDot status={stepStatus} />}
      </BaseBox>
      {!isLast && <StepConnector fromStatus={stepStatus} />}
    </BaseBox>

    <BaseBox
      paddingBottom={isLast ? 'spacing.0' : 'spacing.2'}
      style={stepStatus === 'pending' ? { opacity: 0.5 } : undefined}
    >
      <ShimmerOverlay isActive={stepStatus === 'active'}>
        <Text
          color={
            stepStatus === 'active' ? 'surface.text.onSea.onSubtle' : 'surface.text.gray.muted'
          }
          size="small"
          weight="regular"
        >
          {text}
        </Text>
      </ShimmerOverlay>
    </BaseBox>
  </BaseBox>
);

const ReasoningTraces = ({
  traces,
  status = 'loading',
  title = 'Explored',
  activeStepIndex,
}: ReasoningTracesProps): React.ReactElement => {
  const isUpfrontMode = activeStepIndex !== undefined;
  const [isExpanded, setIsExpanded] = useState(!isUpfrontMode);
  const isLoading = status === 'loading';

  useEffect(() => {
    if (status === 'loading') {
      setIsExpanded(true);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'complete') {
      const timer = setTimeout(() => setIsExpanded(false), 600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [status]);

  const handleExpandChange = ({ isExpanded: next }: { isExpanded: boolean }): void => {
    setIsExpanded(next);
  };

  const getStepStatus = (index: number): StepStatus => {
    if (status === 'complete') return 'completed';
    if (isUpfrontMode) {
      if (index < activeStepIndex) return 'completed';
      if (index === activeStepIndex) return 'active';
      return 'pending';
    }
    return index < traces.length - 1 ? 'completed' : 'active';
  };

  const getTraceLabel = (trace: ReasoningTrace, stepStatus: StepStatus): string =>
    stepStatus === 'completed' && trace.completedLabel ? trace.completedLabel : trace.label;

  return (
    <BaseBox marginTop="spacing.2" marginBottom="spacing.3">
      {status === 'complete' && (
        <Pressable onPress={() => setIsExpanded((prev) => !prev)}>
          <BaseBox
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="spacing.2"
            padding="spacing.0"
            marginBottom="spacing.3"
          >
            <Text color="surface.text.gray.muted" weight="regular" variant="body" size="medium">
              {title}
            </Text>
            <BaseBox display="flex" alignItems="center">
              {isExpanded ? (
                <ChevronUpIcon size="small" color="surface.icon.gray.muted" />
              ) : (
                <ChevronDownIcon size="small" color="surface.icon.gray.muted" />
              )}
            </BaseBox>
          </BaseBox>
        </Pressable>
      )}

      <Collapsible
        isExpanded={isExpanded}
        onExpandChange={handleExpandChange}
        _shouldApplyWidthRestrictions={false}
      >
        <CollapsibleBody _hasMargin={false}>
          <BaseBox paddingTop="spacing.2">
            {isUpfrontMode || !isLoading ? (
              traces.map((trace, index) => {
                const stepStatus = getStepStatus(index);
                return (
                  <TraceRow
                    key={index}
                    text={getTraceLabel(trace, stepStatus)}
                    isLast={index === traces.length - 1}
                    stepStatus={stepStatus}
                  />
                );
              })
            ) : (
              <>
                {traces.slice(0, -1).map((trace, index) => {
                  const isJustCompleted = index === traces.length - 2;
                  return (
                    <AnimatedRow key={trace.label} skipAnimation={isJustCompleted}>
                      <TraceRow
                        text={getTraceLabel(trace, 'completed')}
                        isLast={false}
                        stepStatus="completed"
                      />
                    </AnimatedRow>
                  );
                })}

                {traces.length > 0 && (
                  <AnimatedRow key="active-row">
                    <BaseBox
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      gap="spacing.3"
                    >
                      <BaseBox
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                        width="16px"
                      >
                        <ActiveStepIcon />
                      </BaseBox>
                      <BaseBox position="relative" overflow="hidden" flex={1}>
                        <ActiveTextSlider
                          text={getTraceLabel(traces[traces.length - 1], 'active')}
                        />
                      </BaseBox>
                    </BaseBox>
                  </AnimatedRow>
                )}
              </>
            )}
          </BaseBox>
        </CollapsibleBody>
      </Collapsible>
    </BaseBox>
  );
};

export { ReasoningTraces };
