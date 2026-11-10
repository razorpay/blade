/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import React, { useRef, useState } from 'react';
import type { RayState } from '..';
import { Ray } from '..';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { ChatInput } from '~components/ChatInput';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// what Ray is doing, read from the handle his director puts on his element in development builds (el.__ray.debug)
const rayEl = (i = 0): any => document.querySelectorAll('[data-blade-component="ray"]')[i];
const doing = (i = 0): string => {
  const h = rayEl(i)?.__ray?.debug.holder;
  if (!h) return '';
  return h.by === 'player' ? h.act : `film:${h.id}`;
};
const flip = (i = 0): any => rayEl(i)?.__ray?.debug.flip;
const hover = (i = 0): any => rayEl(i)?.__ray?.player.hover;
const pointerAt = (x: number, y: number): void => {
  window.dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: y }));
};

// He watches what's typed in the input he's given, and goes back to his idle when it's cleared
export const TestRayWatchesWhatsTyped: StoryFn<typeof Ray> = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');
  return (
    <Box padding="spacing.11" maxWidth="600px">
      <Box position="relative" marginTop="spacing.11">
        <Box position="absolute" bottom="100%" right="spacing.10" zIndex={2}>
          <Ray idle="look" watchedInputRef={inputRef} />
        </Box>
        <ChatInput
          ref={inputRef}
          value={value}
          onChange={({ value: v }) => setValue(v ?? '')}
          placeholder="Ask Ray anything…"
        />
      </Box>
    </Box>
  );
};
TestRayWatchesWhatsTyped.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(doing()).toBe('idle'), { timeout: 4000 });
  const input = getByRole('textbox');
  await userEvent.click(input);
  await userEvent.type(input, 'How is my business doing?');
  await waitFor(() => expect(doing()).toBe('watch'), { timeout: 3000 });
  await userEvent.clear(input);
  await waitFor(() => expect(doing()).not.toBe('watch'), { timeout: 3000 });
};

// A click on him flips a coin; the flip plays out and he's back in his idle
export const TestRayFlipsACoin: StoryFn<typeof Ray> = () => (
  <Box padding="spacing.11" paddingTop="200px">
    <Ray idle="look" />
  </Box>
);
TestRayFlipsACoin.play = async () => {
  await waitFor(() => expect(doing()).toBe('idle'), { timeout: 4000 });
  await userEvent.click(rayEl());
  await waitFor(() => expect(flip().on).toBe(true), { timeout: 1000 });
  await waitFor(() => expect(flip().on).toBe(false), { timeout: 9000 });
  await expect(doing()).toBe('idle');
};

// Another click while the coin's up: that coin flies on by itself and he throws another
export const TestRaySpamThrowsAnother: StoryFn<typeof Ray> = () => (
  <Box padding="spacing.11" paddingTop="200px">
    <Ray idle="look" />
  </Box>
);
TestRaySpamThrowsAnother.play = async () => {
  await waitFor(() => expect(doing()).toBe('idle'), { timeout: 4000 });
  await userEvent.click(rayEl());
  await waitFor(() => expect(flip().pc).toBeTruthy(), { timeout: 1500 }); // the coin's in the air
  await sleep(250);
  await userEvent.click(rayEl());
  await waitFor(() => expect(flip().loose.length).toBeGreaterThan(0), { timeout: 500 });
  await waitFor(() => expect(flip().on).toBe(false), { timeout: 12000 });
};

// He looks at the pointer wherever it is on the page
export const TestRayLooksAtThePointer: StoryFn<typeof Ray> = () => (
  <Box padding="spacing.11" paddingTop="200px" display="flex" justifyContent="center">
    <Ray idle="look" />
  </Box>
);
TestRayLooksAtThePointer.play = async () => {
  await waitFor(() => expect(doing()).toBe('idle'), { timeout: 4000 });
  const box = rayEl().getBoundingClientRect();
  pointerAt(5, box.top);
  await waitFor(() => expect(hover().g).toBeLessThan(-0.8), { timeout: 2000 });
  pointerAt(window.innerWidth - 5, box.top);
  await waitFor(() => expect(hover().g).toBeGreaterThan(0.8), { timeout: 2000 });
  pointerAt(box.left + box.width / 2, 5);
  await waitFor(() => expect(hover().v).toBeLessThan(-0.8), { timeout: 2000 });
};

// isVisible: he hops off the surface and comes back up onto it
export const TestRayHopsOffAndBack: StoryFn<typeof Ray> = () => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      alignItems="flex-end"
      gap="spacing.8"
    >
      <Ray idle="rest" isVisible={isVisible} />
      <Button onClick={() => setIsVisible((v) => !v)}>{isVisible ? 'Hide' : 'Show'}</Button>
    </Box>
  );
};
TestRayHopsOffAndBack.play = async () => {
  const { getByRole } = within(document.body);
  await userEvent.click(getByRole('button', { name: 'Hide' }));
  await waitFor(() => expect(doing()).toBe('gone'), { timeout: 3000 });
  await userEvent.click(getByRole('button', { name: 'Show' }));
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 3000 });
};

// The answer's states, each handing over to the next, then done: the last one's exit, and he's back at rest
export const TestRayAnswerStates: StoryFn<typeof Ray> = () => {
  const [state, setState] = useState<RayState>('idle');
  const states: RayState[] = ['searching', 'calling', 'writing', 'working', 'idle'];
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      flexDirection="column"
      gap="spacing.8"
    >
      <Box display="flex" gap="spacing.3">
        {states.map((s) => (
          <Button key={s} size="small" variant="secondary" onClick={() => setState(s)}>
            {s === 'idle' ? 'done' : s}
          </Button>
        ))}
      </Box>
      <Box paddingLeft="spacing.11">
        <Ray state={state} idle="rest" isInteractive={false} />
      </Box>
    </Box>
  );
};
TestRayAnswerStates.play = async () => {
  const { getByRole } = within(document.body);
  const step = async (button: string, film: string): Promise<void> => {
    await userEvent.click(getByRole('button', { name: button }));
    await waitFor(() => expect(doing()).toBe(film), { timeout: 5000 });
    await sleep(1200);
  };
  await step('searching', 'film:search');
  await step('calling', 'film:calling');
  await step('writing', 'film:writing');
  await step('working', 'film:laptop2');
  await userEvent.click(getByRole('button', { name: 'done' }));
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 8000 });
};

// entrance="dash": he dashes in as he first appears, then his idle takes him on
export const TestRayDashesIn: StoryFn<typeof Ray> = () => (
  <Box padding="spacing.11" paddingTop="200px" paddingLeft="500px">
    <Ray entrance="dash" idle="look" />
  </Box>
);
TestRayDashesIn.play = async () => {
  await waitFor(() => expect(doing()).toBe('entrance'), { timeout: 2000 });
  await waitFor(() => expect(doing()).toBe('idle'), { timeout: 6000 });
};

// Text in the box and nobody typing for 10 s: the nudge; typing again cancels it
export const TestRayNudges: StoryFn<typeof Ray> = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');
  return (
    <Box padding="spacing.11" maxWidth="600px">
      <Box position="relative" marginTop="spacing.11">
        <Box position="absolute" bottom="100%" right="spacing.10" zIndex={2}>
          <Ray idle="look" watchedInputRef={inputRef} />
        </Box>
        <ChatInput
          ref={inputRef}
          value={value}
          onChange={({ value: v }) => setValue(v ?? '')}
          placeholder="Ask Ray anything…"
        />
      </Box>
    </Box>
  );
};
TestRayNudges.play = async () => {
  const { getByRole } = within(document.body);
  const input = getByRole('textbox');
  await userEvent.click(input);
  await userEvent.type(input, 'How is my business');
  await waitFor(() => expect(doing()).toBe('watch'), { timeout: 3000 });
  await waitFor(() => expect(rayEl().__ray.player.isNudging).toBe(true), { timeout: 12000 });
  await userEvent.type(input, ' doing?');
  await waitFor(() => expect(rayEl().__ray.player.isNudging).toBe(false), { timeout: 1500 });
};

// Sleep: found asleep, he wakes by himself the first time (after 10 s), then he's awake (cap on), looking around
export const TestRaySleepCycle: StoryFn<typeof Ray> = () => (
  <Box padding="spacing.11" paddingTop="200px">
    <Ray idle="sleep" />
  </Box>
);
TestRaySleepCycle.play = async () => {
  await waitFor(() => expect(rayEl().__ray.player.napPhase).toBe('asleep'), { timeout: 3000 });
  await waitFor(() => expect(rayEl().__ray.player.napPhase).toBe('awake'), { timeout: 14000 });
};

export default {
  title: 'Components/Interaction Tests/Ray',
  component: Ray,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};
