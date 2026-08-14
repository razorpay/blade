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
import { Link } from '~components/Link';
import { TextInput } from '~components/Input/TextInput';
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
  onSubmit,
  onDismiss,
  thanksLabel = 'Thanks for the feedback!',
  addCommentLabel = 'Add more feedback',
  commentPlaceholder = 'Anything else you would like to share?',
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
    tags,
    hasSelectedTags,
    hasSubmittedComment,
    selectMood,
    setSelectedTags,
    submitTags,
    goBackToMood,
    openComment,
    submitComment,
  } = useChatFeedback({ moodConfig, onMoodSelect, onSubmit, onDismiss, autoDismiss });

  const [comment, setComment] = React.useState('');

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

  const handleCommentSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (!comment.trim()) return;
    submitComment(comment.trim());
    setComment('');
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

          {/* Always rendered rather than revealed on first pick — a button that appears
                  mid-flow shifts the row and gives the user nothing to aim at beforehand. */}
          <Button
            icon={CheckIcon}
            variant="primary"
            color="primary"
            size="xsmall"
            accessibilityLabel="Submit feedback"
            isDisabled={isDisabled || !hasSelectedTags}
            onClick={submitTags}
          />
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
            {thanksLabel}
          </Text>
        </BaseBox>
        {hasSubmittedComment ? null : (
          <Link variant="button" size="small" color="neutral" onClick={openComment}>
            {addCommentLabel}
          </Link>
        )}
      </BaseBox>
    ),

    comment: () => (
      <form onSubmit={handleCommentSubmit} style={{ width: isFullWidth ? '100%' : 'auto' }}>
        <BaseBox
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="spacing.3"
          width={rowLayout.width}
          // Hugging the content would otherwise collapse the field to the width of its
          // placeholder; a floor keeps it usable without stretching the whole bar.
          minWidth={isFullWidth ? undefined : '320px'}
        >
          <BaseBox flex="1" minWidth="spacing.0">
            <TextInput
              label=""
              accessibilityLabel={commentPlaceholder}
              placeholder={commentPlaceholder}
              /*
               * Small, matching the submit beside it and the row it replaces. This step stands in
               * for the mood scale on a strip attached to a composer, so it has to occupy about
               * the same height — a medium field made the whole composer step down as the flow
               * moved on, at the point where nothing about the layout should be changing.
               */
              size="small"
              /*
               * The user reaches this field by clicking "Add more feedback" — they asked for it,
               * and the only thing on the step is the field itself. Focus follows the action
               * rather than stealing it, which is the case the rule exists to prevent.
               */
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              isDisabled={isDisabled}
              value={comment}
              onChange={({ value }) => setComment(value ?? '')}
            />
          </BaseBox>
          <Button
            type="submit"
            variant="primary"
            color="primary"
            size="small"
            isDisabled={isDisabled || !comment.trim()}
          >
            Send
          </Button>
        </BaseBox>
      </form>
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
