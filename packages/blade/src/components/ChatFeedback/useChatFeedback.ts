import React from 'react';
import type { ChatFeedbackMood, ChatFeedbackProps, ChatFeedbackStep } from './types';
import { chatFeedbackDefaultMoodConfig, chatFeedbackThanksDurationMs } from './chatFeedbackTokens';
import { useTheme } from '~components/BladeProvider';

type UseChatFeedbackProps = Pick<
  ChatFeedbackProps,
  'moodConfig' | 'onMoodSelect' | 'onSubmit' | 'onDismiss' | 'autoDismiss'
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
  onSubmit,
  onDismiss,
  autoDismiss = true,
}: UseChatFeedbackProps): {
  step: ChatFeedbackStep;
  selectedMood: ChatFeedbackMood | null;
  selectedTags: string[];
  question: string;
  tags: string[];
  hasSelectedTags: boolean;
  hasSubmittedComment: boolean;
  selectMood: (mood: ChatFeedbackMood) => void;
  setSelectedTags: (values: string[]) => void;
  submitTags: () => void;
  goBackToMood: () => void;
  openComment: () => void;
  submitComment: (comment: string) => void;
} => {
  const { theme } = useTheme();

  const [step, setStep] = React.useState<ChatFeedbackStep>('mood');
  const [selectedMood, setSelectedMood] = React.useState<ChatFeedbackMood | null>(null);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [hasSubmittedComment, setHasSubmittedComment] = React.useState(false);

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
    [clearTimers, onMoodSelect, schedule, theme.motion.duration.quick],
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
  }, [clearTimers]);

  const openComment = React.useCallback(() => {
    clearTimers();
    setStep('comment');
  }, [clearTimers]);

  const submitComment = React.useCallback(
    (comment: string) => {
      if (!selectedMood) return;
      onSubmit?.({ mood: selectedMood, tags: selectedTags, comment });
      setHasSubmittedComment(true);
      clearTimers();
      setStep('thanks');
      if (!autoDismiss) return;
      schedule(() => onDismiss?.(), chatFeedbackThanksDurationMs);
    },
    [autoDismiss, clearTimers, onDismiss, onSubmit, schedule, selectedMood, selectedTags],
  );

  return {
    step,
    selectedMood,
    selectedTags,
    question: resolvedConfig?.question ?? '',
    tags: resolvedConfig?.tags ?? [],
    hasSelectedTags: selectedTags.length > 0,
    hasSubmittedComment,
    selectMood,
    setSelectedTags,
    submitTags,
    goBackToMood,
    openComment,
    submitComment,
  };
};

export { useChatFeedback };
