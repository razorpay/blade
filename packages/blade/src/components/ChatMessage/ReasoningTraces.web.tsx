import React, { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import type { ReasoningTrace, ReasoningTracesProps } from './types';
import Rotate from './Rotate';
import { useTheme } from '~components/BladeProvider';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { castWebType } from '~utils';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { Collapsible } from '~components/Collapsible/Collapsible';
import { CollapsibleBody } from '~components/Collapsible/CollapsibleBody';
import { Svg, Path } from '~components/Icons/_Svg';
import useIconProps from '~components/Icons/useIconProps';

// Custom 4-pointed star matching the Figma design
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

// Spinning sparkle for the active step row (smaller)
const ActiveStepIcon = (): React.ReactElement => {
  return (
    <Rotate animate={true}>
      <SparkleIcon size="xsmall" color="feedback.icon.positive.intense" />
    </Rotate>
  );
};

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

// Connector color follows the step above it: green after completed, gray otherwise
const StepConnector = ({ fromStatus }: { fromStatus: StepStatus }): React.ReactElement => (
  <BaseBox
    style={{ flex: 1, minHeight: '6px' }}
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

  const shimmerColor = theme.colors.surface.text.staticWhite.muted;
  const shimmerDuration = msToSeconds(theme.motion.duration['2xgentle']);
  const shimmerDelay = msToSeconds(theme.motion.delay.gentle);
  const shimmerEase = cssBezierToArray(castWebType(theme.motion.easing.standard));
  return (
    <BaseBox position="relative" overflow="hidden">
      {children}
      {isActive && (
        <m.span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
            pointerEvents: 'none',
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: shimmerDuration,
            ease: shimmerEase,
            repeat: Infinity,
            repeatDelay: shimmerDelay,
          }}
        />
      )}
    </BaseBox>
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
    {/* Left column: icon + connector */}
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

    {/* Text */}
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
  // Upfront mode: all steps are known; activeStepIndex controls which is active
  const isUpfrontMode = activeStepIndex !== undefined;

  // Start collapsed in upfront mode so the open animation plays on mount
  const [isExpanded, setIsExpanded] = useState(!isUpfrontMode);
  const { theme } = useTheme();
  const isLoading = status === 'loading';
  const rowTransition = {
    duration: msToSeconds(theme.motion.duration.moderate),
    ease: cssBezierToArray(castWebType(theme.motion.easing.entrance)),
  };
  const slideTransition = {
    duration: msToSeconds(theme.motion.duration.xmoderate),
    ease: cssBezierToArray(castWebType(theme.motion.easing.emphasized)),
  };

  // Reset to expanded when status changes back to loading (for replay scenarios)
  useEffect(() => {
    if (status === 'loading') {
      setIsExpanded(true);
    }
  }, [status]);

  // Auto-collapse once all steps complete
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
    // Streaming mode: last trace is active, all before are completed
    return index < traces.length - 1 ? 'completed' : 'active';
  };

  const getTraceLabel = (trace: ReasoningTrace, stepStatus: StepStatus): string => {
    return stepStatus === 'completed' && trace.completedLabel ? trace.completedLabel : trace.label;
  };

  return (
    <BaseBox marginTop="spacing.2" marginBottom="spacing.3">
      {/* Show header only when complete */}
      {status === 'complete' && (
        <BaseBox
          as="button"
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="spacing.2"
          onClick={() => setIsExpanded((prev) => !prev)}
          cursor="pointer"
          style={{ background: 'none', border: 'none' }}
          padding="spacing.0"
          textAlign="left"
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
      )}

      {/* ── Body (animated via Blade Collapsible) ── */}
      <Collapsible
        isExpanded={isExpanded}
        onExpandChange={handleExpandChange}
        _shouldApplyWidthRestrictions={false}
      >
        <CollapsibleBody _hasMargin={false}>
          <BaseBox paddingTop="spacing.2">
            {isUpfrontMode || !isLoading ? (
              // Upfront mode OR complete: render all traces with computed step status
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
              // Streaming mode (loading, steps added one by one):
              // completed rows + active RollingText row
              <>
                {traces.slice(0, -1).map((trace, index) => {
                  // The last completed row just transitioned from the active position —
                  // it was already visible, so skip the entry animation for it.
                  const isJustCompleted = index === traces.length - 2;
                  return (
                    <m.div
                      key={trace.label}
                      initial={isJustCompleted ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={rowTransition}
                    >
                      <TraceRow
                        text={getTraceLabel(trace, 'completed')}
                        isLast={false}
                        stepStatus="completed"
                      />
                    </m.div>
                  );
                })}

                {traces.length > 0 && (
                  <m.div
                    key="active-row"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={rowTransition}
                  >
                    <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
                      <BaseBox
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                        width="16px"
                      >
                        <ActiveStepIcon />
                      </BaseBox>
                      <BaseBox position="relative" overflow="hidden">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <m.div
                            key={traces.length}
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -12, opacity: 0, position: 'absolute' }}
                            transition={slideTransition}
                          >
                            <ShimmerOverlay isActive>
                              <Text
                                color="surface.text.onSea.onSubtle"
                                size="small"
                                weight="regular"
                              >
                                {getTraceLabel(traces[traces.length - 1], 'active')}
                              </Text>
                            </ShimmerOverlay>
                          </m.div>
                        </AnimatePresence>
                      </BaseBox>
                    </BaseBox>
                  </m.div>
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
