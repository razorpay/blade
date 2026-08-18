import React from 'react';
import styled from 'styled-components';
import type { ChatFeedbackProps, ChatFeedbackStep } from './types';
import { chatFeedbackChipSize } from './chatFeedbackTokens';
import { useChatFeedback } from './useChatFeedback';
import { ChatFeedbackMoodScale } from './ChatFeedbackMoodScale.web';
import { ChatFeedbackCheck } from './ChatFeedbackCheck.web';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { BaseMotionBox } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { useTheme } from '~components/BladeProvider';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Chip, ChipGroup } from '~components/Chip';
import { CheckIcon, ChevronLeftIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { castWebType } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { useIsMobile } from '~utils/useIsMobile';
import { chipGroupGapTokens } from '~components/Chip/chipTokens';
import getIn from '~utils/lodashButBetter/get';

/**
 * `ChipGroup` always reserves space beneath its chips for the `FormHint` slot, even when no
 * `helpText` or `errorText` is set. That makes its box taller than the chips themselves, so
 * centring it in a row leaves the chips sitting above the submit button's centre line.
 *
 * Cancelling exactly that reserved space realigns the two. The amount is read from the same
 * token `ChipGroup` uses, so the two cannot drift apart.
 */
const ChipGroupAligner = styled(BaseBox)(({ theme }) => ({
  marginBottom: `-${getIn(theme, chipGroupGapTokens[chatFeedbackChipSize].bottom)}px`,
}));

const _ChatFeedback = ({
  question = 'How are we doing so far?',
  moodConfig,
  onMoodSelect,
  onTagsChange,
  controlsRef,
  isSubmitHidden = false,
  onSubmit,
  onDismiss,
  thanksLabel,
  autoDismiss = true,
  isFullWidth = true,
  isDisabled = false,
  moodIcons,
  testID,
  ...rest
}: ChatFeedbackProps): React.ReactElement => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  /**
   * Full-width steps spread edge to edge; hugging steps are only as wide as their content
   * and rely on the gap to separate the prompt from the controls. This mirrors how the
   * prototype distinguishes the attached strip from the floating bar — the bar itself does
   * nothing special, it is the step that stops stretching.
   */
  const rowLayout = isFullWidth
    ? ({ width: '100%', justifyContent: 'space-between', gap: 'spacing.4' } as const)
    : ({ width: undefined, justifyContent: 'flex-start', gap: 'spacing.3' } as const);

  const {
    step,
    selectedMood,
    selectedTags,
    question: followUpQuestion,
    thanksLabel: moodThanksLabel,
    tags,
    hasSelectedTags,
    selectMood,
    setSelectedTags,
    submitTags,
    goBackToMood,
  } = useChatFeedback({
    moodConfig,
    onMoodSelect,
    onTagsChange,
    onSubmit,
    onDismiss,
    autoDismiss,
  });

  /*
   * The handle is published in an effect, and delegates through refs.
   *
   * Two constraints pull against each other. It cannot be written during render — that is a side
   * effect in render, which double-fires under StrictMode and is unsafe once rendering can be
   * interrupted. But it also cannot be captured once, because `submitTags` closes over the current
   * selection: a handle built on mount would submit whatever happened to be picked at the time.
   *
   * Delegating satisfies both. The published functions are stable and read the latest
   * implementations out of refs when called, so the handle is written once per `controlsRef`,
   * never during render, and is never stale. It is cleared on unmount so a host cannot drive a
   * flow that is no longer on screen.
   */
  const latest = React.useRef({ submitTags, setSelectedTags });
  React.useLayoutEffect(() => {
    latest.current = { submitTags, setSelectedTags };
  });

  React.useLayoutEffect(() => {
    if (!controlsRef) return undefined;
    controlsRef.current = {
      submit: () => latest.current.submitTags(),
      setTags: (values) => latest.current.setSelectedTags(values),
    };

    return () => {
      controlsRef.current = null;
    };
  }, [controlsRef]);

  // Steps arrive on the settle curve. The exit is a plain fade — the incoming step is the
  // thing worth watching, so the outgoing one should get out of the way quickly.
  const stepInVariants: MotionVariantsType = {
    initial: { opacity: 0, y: -4 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: msToSeconds(theme.motion.duration.quick),
        ease: cssBezierToArray(castWebType(theme.motion.easing.settle)),
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: msToSeconds(theme.motion.duration['2xquick']),
        ease: cssBezierToArray(castWebType(theme.motion.easing.exit)),
      },
    },
  };

  // A record rather than a switch, so TypeScript can prove every step renders an element
  // and the motion wrapper never receives null.
  const stepRenderers: Record<ChatFeedbackStep, () => React.ReactElement> = {
    mood: () => (
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent={rowLayout.justifyContent}
        gap={rowLayout.gap}
        width={rowLayout.width}
      >
        <Text size="medium" weight="medium" color="surface.text.gray.subtle">
          {question}
        </Text>
        <ChatFeedbackMoodScale
          selectedMood={selectedMood}
          isDisabled={isDisabled}
          onSelect={selectMood}
          moodIcons={moodIcons}
        />
      </BaseBox>
    ),

    // On mobile the question claims its own line: a prompt, four chips and a submit
    // cannot share a row below ~400px without overflowing.
    tags: () => (
      <BaseBox
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'stretch' : 'center'}
        justifyContent={rowLayout.justifyContent}
        flexWrap="wrap"
        gap={rowLayout.gap}
        width={rowLayout.width}
      >
        {/* Prompt holds one line (flexShrink 0); when the chips + submit can't fit beside
                it, the whole group below wraps to the next line rather than the submit
                orphaning onto a row of its own. */}
        <BaseBox
          display="flex"
          flexDirection="row"
          alignItems="center"
          flexShrink={0}
          gap="spacing.2"
        >
          <IconButton
            icon={ChevronLeftIcon}
            size="medium"
            emphasis="intense"
            accessibilityLabel="Back to rating"
            isDisabled={isDisabled}
            onClick={goBackToMood}
          />
          <Text size="medium" weight="medium" color="surface.text.gray.subtle">
            {followUpQuestion}
          </Text>
        </BaseBox>

        <BaseBox
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent={isMobile ? 'flex-start' : 'flex-end'}
          flexShrink={0}
          flexWrap={isMobile ? 'wrap' : 'nowrap'}
          gap="spacing.3"
        >
          <ChipGroupAligner>
            <ChipGroup
              // Deliberately not the visible question — reusing it here makes screen
              // readers announce the same sentence twice.
              accessibilityLabel="Feedback tags"
              selectionType="multiple"
              size={chatFeedbackChipSize}
              isDisabled={isDisabled}
              value={selectedTags}
              onChange={({ values }) => setSelectedTags(values)}
            >
              {tags.map((tag) => (
                <Chip key={tag} value={tag}>
                  {tag}
                </Chip>
              ))}
            </ChipGroup>
          </ChipGroupAligner>

          {/*
            Hidden when the surrounding surface owns the submit, so the free-text case has one
            place to press rather than two. Otherwise always rendered rather than revealed on
            first pick — a button that appears mid-flow shifts the row and gives the user nothing
            to aim at beforehand. */}
          {isSubmitHidden ? null : (
            <Button
              icon={CheckIcon}
              variant="primary"
              color="primary"
              size="xsmall"
              accessibilityLabel="Submit feedback"
              isDisabled={isDisabled || !hasSelectedTags}
              onClick={submitTags}
            />
          )}
        </BaseBox>
      </BaseBox>
    ),

    thanks: () => (
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent={rowLayout.justifyContent}
        gap={rowLayout.gap}
        width={rowLayout.width}
      >
        <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
          <ChatFeedbackCheck />
          <Text size="medium" weight="medium" color="surface.text.gray.subtle">
            {/*
              An explicit `thanksLabel` speaks for every mood; without one the copy follows the
              sentiment, so someone who has just said this went wrong is answered with an
              acknowledgement rather than with delight at their feedback.
            */}
            {thanksLabel ?? moodThanksLabel ?? 'Thanks for the feedback!'}
          </Text>
        </BaseBox>
      </BaseBox>
    ),
  };

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      width={isFullWidth ? '100%' : 'auto'}
      {...metaAttribute({ name: MetaConstants.ChatFeedback, testID })}
      {...makeAnalyticsAttribute(rest)}
      {...getStyledProps(rest)}
    >
      {/* Keyed on step so each arrival replays the entrance. */}
      <BaseMotionBox key={step} motionVariants={stepInVariants}>
        {stepRenderers[step]()}
      </BaseMotionBox>
    </BaseBox>
  );
};

const ChatFeedback = assignWithoutSideEffects(_ChatFeedback, {
  componentId: MetaConstants.ChatFeedback,
  displayName: 'ChatFeedback',
});

export { ChatFeedback };
