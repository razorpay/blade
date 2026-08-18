/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react-vite';
import { within, waitFor, userEvent, expect } from 'storybook/test';
import React from 'react';
import { ChatInput } from './index';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

/**
 * Interaction tests for the attached feedback prompt.
 *
 * These run in a real browser, which is the point: the defects worth guarding here are about
 * layering and hit-testing, and neither is observable in jsdom — it has no layout, so an element
 * covered by an invisible sibling still reports as clickable.
 */
export default {
  title: 'Components/ChatInput/ChatInput Interaction Tests',
  component: ChatInput,
  parameters: {
    controls: { disable: true },
    a11y: { disable: false },
    chromatic: { disableSnapshot: true },
  },
};

/** Blade ships no artwork for the scale yet, so every render supplies its own. */
const feedbackIcons = {
  'very-dissatisfied': <span>😢</span>,
  dissatisfied: <span>😕</span>,
  satisfied: <span>🙂</span>,
  'very-satisfied': <span>😍</span>,
};

const FeedbackComposer = ({
  validationState,
}: {
  validationState?: 'error' | 'none';
}): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [picked, setPicked] = React.useState<string | null>(null);

  return (
    <Box maxWidth="600px">
      <ChatInput
        placeholder="Ask anything..."
        validationState={validationState}
        errorText={validationState === 'error' ? 'Something went wrong' : undefined}
        feedback={{
          feedbackIcons,
          isVisible,
          question: "How's this assistant doing so far?",
          onMoodSelect: ({ mood }) => setPicked(mood),
          onDismiss: () => setIsVisible(false),
        }}
      />
      <Text testID="picked-mood">{picked ?? 'none'}</Text>
    </Box>
  );
};

/**
 * The regression this exists for: `ChatInput` keeps its validation region mounted above the card
 * even with no error, and as a full-width transparent box it used to swallow clicks meant for the
 * prompt — the lower two-thirds of every mood button, with nothing on screen to explain it.
 *
 * Asserted by hit-testing rather than by clicking: `userEvent.click` dispatches at the element
 * regardless of what covers it, so it would pass against the bug. `elementFromPoint` asks the
 * question the user's cursor actually asks — what is on top here?
 */
export const MoodScaleIsNotCovered: StoryFn = (): React.ReactElement => <FeedbackComposer />;

MoodScaleIsNotCovered.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  const button = getByRole('radio', { name: 'Good' });

  await waitFor(() => expect(button).toBeVisible());

  const box = button.getBoundingClientRect();
  // The centre, and a point near the bottom edge — the part the error slot used to cover.
  const points = [
    { x: box.left + box.width / 2, y: box.top + box.height / 2 },
    { x: box.left + box.width / 2, y: box.bottom - 2 },
  ];

  points.forEach(({ x, y }) => {
    const topMost = document.elementFromPoint(x, y);
    expect(button.contains(topMost)).toBe(true);
  });
};

/** The same, with an error actually showing: the alert takes its layer back and stays reachable. */
export const ErrorRegionIsReachableWhenShowing: StoryFn = (): React.ReactElement => (
  <FeedbackComposer validationState="error" />
);

ErrorRegionIsReachableWhenShowing.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  const alert = getByRole('alert');

  await waitFor(() => expect(alert).toBeVisible());
  await waitFor(() => expect(window.getComputedStyle(alert).pointerEvents).not.toBe('none'));
};

/** Picking a mood records it and moves the flow on to the follow-up step. */
export const PickingAMoodAdvancesTheFlow: StoryFn = (): React.ReactElement => <FeedbackComposer />;

PickingAMoodAdvancesTheFlow.play = async ({ canvasElement }) => {
  const { getByRole, getByTestId, queryByRole } = within(canvasElement);

  await userEvent.click(getByRole('radio', { name: 'Love it!' }));

  await waitFor(() => expect(getByTestId('picked-mood')).toHaveTextContent('very-satisfied'));
  // The scale is replaced by the follow-up, rather than both being on the strip at once.
  await waitFor(() => expect(queryByRole('radiogroup')).toBeNull());
  await waitFor(() => expect(getByRole('button', { name: 'Back to rating' })).toBeVisible());
};

/**
 * The composer must not move when the prompt does. It sits directly on top, so a step even a
 * pixel taller pushes the whole composer down — at the moment the user is reading the strip.
 */
export const ComposerHoldsStillAcrossSteps: StoryFn = (): React.ReactElement => (
  <FeedbackComposer />
);

ComposerHoldsStillAcrossSteps.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  const textarea = canvasElement.querySelector('textarea');

  expect(textarea).not.toBeNull();
  const before = textarea.getBoundingClientRect().top;

  await userEvent.click(getByRole('radio', { name: 'Bad' }));
  await waitFor(() => expect(getByRole('button', { name: 'Back to rating' })).toBeVisible());

  const after = textarea.getBoundingClientRect().top;
  // One pixel of tolerance for sub-pixel layout, not for a shifted composer.
  expect(Math.abs(after - before)).toBeLessThanOrEqual(1);
};
