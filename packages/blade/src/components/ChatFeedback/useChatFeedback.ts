import React from 'react';
import type { ChatFeedbackMood, ChatFeedbackProps, ChatFeedbackStep } from './types';
import { chatFeedbackDefaultMoodConfig, chatFeedbackThanksDurationMs } from './chatFeedbackTokens';
import { useTheme } from '~components/BladeProvider';

type UseChatFeedbackProps = Pick<
  ChatFeedbackProps,
  'moodConfig' | 'onMoodSelect' | 'onTagsChange' | 'onSubmit' | 'onDismiss' | 'autoDismiss'
>;

/**
 * The whole flow, with no rendering attached.
 *
 * Every timer goes through `schedule` so that a step change or unmount cancels anything
 * still pending — an auto-dismiss that fires after the user has navigated away is the
 * bug this indirection exists to prevent.
 */
const useChatFeedback = ({
  moodConfig,
  onMoodSelect,
  onTagsChange,
  onSubmit,
  onDismiss,
  autoDismiss = true,
}: UseChatFeedbackProps): {
  step: ChatFeedbackStep;
  selectedMood: ChatFeedbackMood | null;
  selectedTags: string[];
  question: string;
  thanksLabel?: string;
  tags: string[];
  hasSelectedTags: boolean;
  selectMood: (mood: ChatFeedbackMood) => void;
  setSelectedTags: (values: string[]) => void;
  submitTags: () => void;
  goBackToMood: () => void;
} => {
  const { theme } = useTheme();

  const [step, setStep] = React.useState<ChatFeedbackStep>('mood');
  const [selectedMood, setSelectedMood] = React.useState<ChatFeedbackMood | null>(null);
  const [selectedTags, setSelectedTagsState] = React.useState<string[]>([]);

  /*
   * Every route that changes the selection reports it.
   *
   * The chip group used to be the only one that did, so the two internal clears — going back to
   * the moods, and picking a new mood — changed the selection silently. A host mirroring it to
   * drive its own UI then held tags that no longer existed, and acted on them: a composer handed
   * the free-text tag stayed in feedback mode after the strip had walked back to the mood step,
   * with no tag selected and no way out. Reporting from one place makes drift impossible rather
   * than merely unlikely.
   */
  const setSelectedTags = React.useCallback(
    (values: string[]) => {
      setSelectedTagsState(values);
      onTagsChange?.({ tags: values });
    },
    [onTagsChange],
  );

  const timers = React.useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const schedule = React.useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  }, []);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  React.useEffect(() => clearTimers, [clearTimers]);

  const resolvedConfig = selectedMood
    ? { ...chatFeedbackDefaultMoodConfig[selectedMood], ...moodConfig?.[selectedMood] }
    : null;

  const goToThanks = React.useCallback(() => {
    clearTimers();
    setStep('thanks');
    if (!autoDismiss) return;
    schedule(() => onDismiss?.(), chatFeedbackThanksDurationMs);
  }, [autoDismiss, clearTimers, onDismiss, schedule]);

  const selectMood = React.useCallback(
    (mood: ChatFeedbackMood) => {
      clearTimers();
      setSelectedMood(mood);
      setSelectedTags([]);
      onMoodSelect?.({ mood });
      // A beat before the follow-up, so the selection is seen before the step changes.
      schedule(() => setStep('tags'), theme.motion.duration.quick);
    },
    [clearTimers, onMoodSelect, schedule, setSelectedTags, theme.motion.duration.quick],
  );

  const submitTags = React.useCallback(() => {
    if (!selectedMood) return;
    onSubmit?.({ mood: selectedMood, tags: selectedTags });
    goToThanks();
  }, [goToThanks, onSubmit, selectedMood, selectedTags]);

  const goBackToMood = React.useCallback(() => {
    clearTimers();
    setSelectedMood(null);
    setSelectedTags([]);
    setStep('mood');
  }, [clearTimers, setSelectedTags]);

  return {
    step,
    selectedMood,
    selectedTags,
    question: resolvedConfig?.question ?? '',
    tags: resolvedConfig?.tags ?? [],
    thanksLabel: resolvedConfig?.thanksLabel,
    hasSelectedTags: selectedTags.length > 0,
    selectMood,
    setSelectedTags,
    submitTags,
    goBackToMood,
  };
};

export { useChatFeedback };
