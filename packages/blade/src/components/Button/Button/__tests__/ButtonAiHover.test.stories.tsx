import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import React, { useState } from 'react';
import ButtonComponent from '../Button';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

// Buttons with an AI hover stay plain buttons to use: hovering them (RazorSense, or Ray widening the button) doesn't get in the
// way of clicking or the keyboard, and their label stays their accessible name. This holds with or without a GPU: where the
// hover can't animate (CI's browsers often have no WebGL2) the button keeps its own hover.
export const TestAiHoverButtonsStayButtons: StoryFn<typeof ButtonComponent> = () => {
  const [askRay, setAskRay] = useState(0);
  const [investigate, setInvestigate] = useState(0);
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5" padding="spacing.10">
      <Box display="flex" gap="spacing.5" alignItems="center">
        <ButtonComponent
          variant="primary"
          color="neutral"
          aiHover="razorsense"
          onClick={() => setAskRay((n) => n + 1)}
        >
          Ask Ray
        </ButtonComponent>
        <ButtonComponent
          variant="secondary"
          aiHover="ray-investigate"
          onClick={() => setInvestigate((n) => n + 1)}
        >
          Investigate
        </ButtonComponent>
      </Box>
      <Text>{`Ask Ray: ${askRay} · Investigate: ${investigate}`}</Text>
    </Box>
  );
};

TestAiHoverButtonsStayButtons.play = async ({ canvasElement }) => {
  const { getByRole, getByText } = within(canvasElement);
  const askRay = getByRole('button', { name: 'Ask Ray' });
  const investigate = getByRole('button', { name: 'Investigate' });
  // hovered (its effect starting), then clicked
  await userEvent.hover(askRay);
  await userEvent.click(askRay);
  await userEvent.hover(investigate);
  await new Promise((resolve) => setTimeout(resolve, 600));
  await userEvent.click(investigate);
  await expect(getByText('Ask Ray: 1 · Investigate: 1')).toBeInTheDocument();
  // the keyboard: focused and pressed, as any button
  investigate.focus();
  await expect(investigate).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  askRay.focus();
  await userEvent.keyboard(' ');
  await expect(getByText('Ask Ray: 2 · Investigate: 2')).toBeInTheDocument();
  await userEvent.unhover(investigate);
};

// Keyboard focus plays an AI hover as hovering does, and blur ends it; hovered and focused at once is one effect (one canvas),
// not two. Where the hover can't play (CI's browsers often have no WebGL2) the button keeps its own hover and Blade's focus ring,
// and only that is checked.
export const TestAiHoverKeyboardFocus: StoryFn<typeof ButtonComponent> = () => {
  return (
    <Box display="flex" gap="spacing.5" alignItems="center" padding="spacing.10">
      <ButtonComponent variant="tertiary">Before</ButtonComponent>
      <ButtonComponent variant="primary" color="neutral" aiHover="razorsense">
        Ask Ray
      </ButtonComponent>
      <ButtonComponent variant="secondary" aiHover="ray-investigate">
        Investigate
      </ButtonComponent>
    </Box>
  );
};

TestAiHoverKeyboardFocus.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  const before = getByRole('button', { name: 'Before' });
  const askRay = getByRole('button', { name: 'Ask Ray' });
  const investigate = getByRole('button', { name: 'Investigate' });
  // an AI hover is playing when its layer (the button's first hidden child) is shown
  const isPlaying = (button: HTMLElement): boolean =>
    button.querySelector<HTMLElement>(':scope > span[aria-hidden="true"]')?.style.opacity === '1';
  // true once `isDone` says so (asked every `step` ms, up to `ms`)
  const settles = async (
    isDone: () => Promise<boolean>,
    ms: number,
    step = 50,
  ): Promise<boolean> => {
    if (await isDone()) return true;
    if (ms <= 0) return false;
    await new Promise((resolve) => setTimeout(resolve, step));
    return settles(isDone, ms - step, step);
  };
  const becomes = (button: HTMLElement, isOn: boolean): Promise<boolean> =>
    settles(() => Promise.resolve(isPlaying(button) === isOn), 4000);
  // the pointer onto a button's middle, or off to the page's corner (with where it is: a hover is held from the pointer's place)
  const pointTo = async (button: HTMLElement | null): Promise<void> => {
    const r = button?.getBoundingClientRect();
    await userEvent.pointer({
      target: button ?? canvasElement,
      coords: r
        ? { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }
        : { clientX: 1, clientY: 1 },
    });
  };
  // can it play here at all (a GPU drawing WebGL2)? Its canvas is made as the pointer comes onto it: that says. (A test's pointer
  // doesn't set :hover, so it doesn't start the hover itself; the keyboard does, below. The pointer's moved again till then: the
  // hover's code loads on its own time, and a move before it's in isn't seen)
  const canPlay = await settles(
    async () => {
      if (askRay.querySelector('canvas')) return true;
      await pointTo(askRay);
      return false;
    },
    6000,
    100,
  );
  await pointTo(null);
  await expect(await becomes(askRay, false)).toBe(true);
  // the keyboard: tabbing onto each plays it, tabbing off ends it
  before.focus();
  await userEvent.tab();
  await expect(askRay).toHaveFocus();
  if (canPlay) await expect(await becomes(askRay, true)).toBe(true);
  await userEvent.tab();
  await expect(investigate).toHaveFocus();
  await expect(await becomes(askRay, false)).toBe(true);
  if (canPlay) await expect(await becomes(investigate, true)).toBe(true);
  await userEvent.tab({ shift: true });
  await expect(await becomes(investigate, false)).toBe(true);
  // hovered while focused: still one effect, one canvas; the pointer leaving doesn't end it while it's focused
  await pointTo(askRay);
  if (canPlay) await expect(await becomes(askRay, true)).toBe(true);
  await expect(askRay.querySelectorAll('canvas').length).toBeLessThanOrEqual(1);
  await pointTo(null);
  if (canPlay) await expect(await becomes(askRay, true)).toBe(true);
  askRay.blur();
  await expect(await becomes(askRay, false)).toBe(true);
  // the check above is only as good as the hover playing here: say so where it can't
  if (!canPlay)
    console.info(
      'TestAiHoverKeyboardFocus: no AI hover can play here (no WebGL2), so only focus was checked',
    );
};

export default {
  title: 'Components/Interaction Tests/Button AI Hovers',
  component: ButtonComponent,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};
