/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react-vite';
import { within, waitFor, userEvent, expect } from 'storybook/test';
import React from 'react';
import { ChatFeedback } from './index';
import { Box } from '~components/Box';

/**
 * Interaction tests for the rating flow.
 *
 * These run in a real browser because the things worth guarding are geometric: whether a tap
 * lands on the point it looks like it lands on, and whether a selection is visible at all.
 * Neither is observable in jsdom, which has no layout and paints nothing.
 */
export default {
  title: 'Components/ChatFeedback/ChatFeedback Interaction Tests',
  component: ChatFeedback,
  parameters: {
    controls: { disable: true },
    a11y: { disable: false },
    chromatic: { disableSnapshot: true },
  },
};

/**
 * Emoji rather than the shipped SVGs on purpose.
 *
 * Untintable artwork is the harder case: colour does nothing to it and it has no filled twin, so
 * these stories prove the selected state survives on the worst input rather than the best.
 */
const feedbackIcons = {
  'very-dissatisfied': <span>😢</span>,
  dissatisfied: <span>😕</span>,
  satisfied: <span>🙂</span>,
  'very-satisfied': <span>😍</span>,
};

const Flow = (): React.ReactElement => (
  <Box maxWidth="600px">
    <ChatFeedback question="How's this going?" feedbackIcons={feedbackIcons} autoDismiss={false} />
  </Box>
);

/**
 * Each target must contain the point a user aims at, and stop before its neighbour's.
 *
 * The buttons are 32px around a 20px glyph and butted together, so there is no dead space between
 * them: a tap a few pixels wide of a face lands on the next one and records the *adjacent* rating.
 * On a four-point scale that is a wrong answer, not a near miss — so this checks the centre and
 * both inner edges resolve to the button they appear to belong to.
 */
export const HitTargetsResolveToTheRightMood: StoryFn = (): React.ReactElement => <Flow />;

HitTargetsResolveToTheRightMood.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  const button = getByRole('radio', { name: 'Good' });

  await waitFor(() => expect(button).toBeVisible());

  const box = button.getBoundingClientRect();
  const points = [
    { x: box.left + box.width / 2, y: box.top + box.height / 2 },
    { x: box.left + 2, y: box.top + box.height / 2 },
    { x: box.right - 2, y: box.top + box.height / 2 },
  ];

  points.forEach(({ x, y }) => {
    expect(button.contains(document.elementFromPoint(x, y))).toBe(true);
  });
};

/**
 * Selection has to be visible even when the glyph cannot carry it.
 *
 * Supplied artwork may be untintable and has no filled twin, so recolouring the icon does nothing.
 * The button's background is the cue that survives — without it, a 12% scale would be the only
 * sign a rating registered.
 */
export const SelectionIsVisibleWithUntintableArtwork: StoryFn = (): React.ReactElement => <Flow />;

SelectionIsVisibleWithUntintableArtwork.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  const button = getByRole('radio', { name: 'Terrible' });
  const isUnpainted = (): boolean =>
    ['transparent', 'rgba(0, 0, 0, 0)', ''].includes(
      window.getComputedStyle(button).backgroundColor,
    );

  await waitFor(() => expect(button).toBeVisible());
  expect(isUnpainted()).toBe(true);

  await userEvent.click(button);

  await waitFor(() => expect(isUnpainted()).toBe(false));
};

/** The flow advances to the follow-up, and can be walked back to the scale. */
export const TheFlowAdvancesAndReturns: StoryFn = (): React.ReactElement => <Flow />;

TheFlowAdvancesAndReturns.play = async ({ canvasElement }) => {
  const { getByRole, queryByRole } = within(canvasElement);

  await userEvent.click(getByRole('radio', { name: 'Love it!' }));

  await waitFor(() =>
    expect(queryByRole('radiogroup', { name: 'Rate this experience' })).toBeNull(),
  );
  const back = getByRole('button', { name: 'Back to rating' });

  await userEvent.click(back);

  await waitFor(() =>
    expect(getByRole('radio', { name: 'Love it!' })).toHaveAttribute('aria-checked', 'false'),
  );
};
