import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, fireEvent } from 'storybook/test';
import React, { useState } from 'react';
import ButtonComponent from '../Button';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Checkbox } from '~components/Checkbox';

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

// an AI hover is playing when its layer (the button's first hidden child) is shown
const isPlaying = (button: HTMLElement): boolean =>
  button.querySelector<HTMLElement>(':scope > span[aria-hidden="true"]')?.style.opacity === '1';
// true once `isDone` says so (asked every `step` ms, up to `ms`)
const settles = async (isDone: () => Promise<boolean>, ms: number, step = 50): Promise<boolean> => {
  if (await isDone()) return true;
  if (ms <= 0) return false;
  await new Promise((resolve) => setTimeout(resolve, step));
  return settles(isDone, ms - step, step);
};
const becomes = (button: HTMLElement, isOn: boolean): Promise<boolean> =>
  settles(() => Promise.resolve(isPlaying(button) === isOn), 4000);
// the pointer onto a button's middle, or off to the story's corner (with where it is: a hover is held from the pointer's place)
const pointTo = async (story: HTMLElement, button: HTMLElement | null): Promise<void> => {
  const r = button?.getBoundingClientRect();
  await userEvent.pointer({
    target: button ?? story,
    coords: r
      ? { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }
      : { clientX: 1, clientY: 1 },
  });
};
// whether the button's canvas is made as the pointer comes onto it: it is wherever its hover can play (a GPU drawing WebGL2). A
// test's pointer doesn't set :hover, so it doesn't start the hover itself (the keyboard does). The pointer's moved again till
// then: the hover's code loads on its own time, and a move before it's in isn't seen
const isCanvasMade = (story: HTMLElement, button: HTMLElement, ms = 6000): Promise<boolean> =>
  settles(
    async () => {
      if (button.querySelector('canvas')) return true;
      await pointTo(story, button);
      return false;
    },
    ms,
    100,
  );

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
  // can it play here at all?
  const canPlay = await isCanvasMade(canvasElement, askRay);
  await pointTo(canvasElement, null);
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
  await pointTo(canvasElement, askRay);
  if (canPlay) await expect(await becomes(askRay, true)).toBe(true);
  await expect(askRay.querySelectorAll('canvas').length).toBeLessThanOrEqual(1);
  await pointTo(canvasElement, null);
  if (canPlay) await expect(await becomes(askRay, true)).toBe(true);
  askRay.blur();
  await expect(await becomes(askRay, false)).toBe(true);
  // the check above is only as good as the hover playing here: say so where it can't
  if (!canPlay)
    console.info(
      'TestAiHoverKeyboardFocus: no AI hover can play here (no WebGL2), so only focus was checked',
    );
};

// When Ray is unavailable or the merchant is offline, the app disables the button (isDisabled); while Ray works on it, the app shows
// it loading (isLoading). Neither plays its AI hover, on the pointer or the keyboard (no canvas is made, and it shows Blade's own
// disabled or loading look), and a button disabled or set loading mid-hover ends it at once. The checkboxes stand in for the app.
export const TestAiHoverDisabledOrLoading: StoryFn<typeof ButtonComponent> = () => {
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5" padding="spacing.10">
      <Checkbox isChecked={isUnavailable} onChange={({ isChecked }) => setIsUnavailable(isChecked)}>
        Ray unavailable (the app disables his buttons)
      </Checkbox>
      <Checkbox isChecked={isWorking} onChange={({ isChecked }) => setIsWorking(isChecked)}>
        Ray working on it (the app shows his buttons loading)
      </Checkbox>
      <Box display="flex" gap="spacing.5" alignItems="center">
        <ButtonComponent variant="tertiary">Before</ButtonComponent>
        <ButtonComponent
          variant="primary"
          color="neutral"
          aiHover="razorsense"
          isDisabled={isUnavailable}
          isLoading={isWorking}
        >
          Ask Ray
        </ButtonComponent>
        <ButtonComponent
          variant="secondary"
          aiHover="ray-investigate"
          isDisabled={isUnavailable}
          isLoading={isWorking}
        >
          Investigate
        </ButtonComponent>
        <ButtonComponent variant="primary" color="neutral" isDisabled>
          Disabled
        </ButtonComponent>
        <ButtonComponent variant="primary" color="neutral" isLoading>
          Loading
        </ButtonComponent>
      </Box>
    </Box>
  );
};

TestAiHoverDisabledOrLoading.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  const unavailable = getByRole('checkbox', { name: /unavailable/ });
  const working = getByRole('checkbox', { name: /working/ });
  const before = getByRole('button', { name: 'Before' });
  const askRay = getByRole('button', { name: 'Ask Ray' });
  const investigate = getByRole('button', { name: 'Investigate' });
  const disabledNeutral = getByRole('button', { name: 'Disabled' });
  const loadingNeutral = getByRole('button', { name: /Loading/ });
  const canPlay = await isCanvasMade(canvasElement, askRay);
  await pointTo(canvasElement, null);
  const restingWidth = investigate.getBoundingClientRect().width;
  // each button playing (from the keyboard: a test's pointer doesn't set :hover), then the app turns `toggle` on mid-hover: it
  // ends at once (no canvas, the layer hidden, Ray's widening let go), and stays off (no canvas as the pointer comes, and the
  // keyboard passes it by), then `toggle` goes off again. (A click on the checkbox without focusing it, so the button keeps focus
  // till then)
  const endsAndStaysOff = async (toggle: HTMLElement, button: HTMLElement): Promise<void> => {
    if (canPlay) await expect(await isCanvasMade(canvasElement, button)).toBe(true);
    await pointTo(canvasElement, null);
    button.focus();
    if (canPlay) await expect(await becomes(button, true)).toBe(true);
    fireEvent.click(toggle);
    await expect(button).toBeDisabled();
    await new Promise((resolve) => setTimeout(resolve, 100));
    await expect(button.querySelectorAll('canvas')).toHaveLength(0);
    await expect(isPlaying(button)).toBe(false);
    await expect(Math.abs(investigate.getBoundingClientRect().width - restingWidth)).toBeLessThan(
      1,
    );
    await expect(await isCanvasMade(canvasElement, button, 1500)).toBe(false);
    before.focus();
    await userEvent.tab();
    await expect(askRay).not.toHaveFocus();
    await expect(investigate).not.toHaveFocus();
    fireEvent.click(toggle);
  };
  // disabled: Ray unavailable, or the merchant offline
  await endsAndStaysOff(unavailable, askRay);
  await endsAndStaysOff(unavailable, investigate);
  // loading: Ray working on it
  await endsAndStaysOff(working, askRay);
  await endsAndStaysOff(working, investigate);
  // Blade's own disabled and loading looks, as neutral buttons with no AI hover (once their colour has eased there)
  fireEvent.click(unavailable);
  await new Promise((resolve) => setTimeout(resolve, 600));
  await expect(getComputedStyle(askRay).backgroundColor).toBe(
    getComputedStyle(disabledNeutral).backgroundColor,
  );
  fireEvent.click(unavailable);
  fireEvent.click(working);
  await new Promise((resolve) => setTimeout(resolve, 600));
  await expect(getComputedStyle(askRay).backgroundColor).toBe(
    getComputedStyle(loadingNeutral).backgroundColor,
  );
  fireEvent.click(working);
  if (!canPlay)
    console.info(
      'TestAiHoverDisabledOrLoading: no AI hover can play here (no WebGL2), so only the disabled and loading buttons were checked',
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
