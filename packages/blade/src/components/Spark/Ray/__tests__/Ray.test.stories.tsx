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

// A click on him while he watches what's typed (it takes the field's focus) flips a coin, and he settles back into his idle
export const TestRayFlipsWhileWatching: StoryFn<typeof Ray> = () => {
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
TestRayFlipsWhileWatching.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(doing()).toBe('idle'), { timeout: 4000 });
  const input = getByRole('textbox');
  await userEvent.click(input);
  await userEvent.type(input, 'How is my business doing?');
  await waitFor(() => expect(doing()).toBe('watch'), { timeout: 3000 });
  await userEvent.click(rayEl());
  await waitFor(() => expect(flip().on).toBe(true), { timeout: 1000 });
  await waitFor(() => expect(flip().on).toBe(false), { timeout: 9000 });
  await waitFor(() => expect(doing()).toBe('idle'), { timeout: 3000 });
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
        <Ray state={state} idle="rest" shouldReactToPointer={false} />
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

// Each film draws inside its crop (FILM_CROP in RayMount): every film plays (the idle ones flip a coin too) and, a few times a second,
// is drawn once more on its whole stage at the same moment, where nothing may fall outside the part its canvases cover. A film retuned
// in Ray Studio to reach further fails here rather than being cut off (the performance review, 2026-11-16)
const CROP_FILMS: { id: string; state?: RayState; idle?: 'coffee' | 'cash' | 'reading' }[] = [
  { id: 'search', state: 'searching' },
  { id: 'calling', state: 'calling' },
  { id: 'writing', state: 'writing' },
  { id: 'laptop2', state: 'working' },
  { id: 'coffee', idle: 'coffee' },
  { id: 'cash', idle: 'cash' },
  { id: 'readbox', idle: 'reading' },
];
export const TestRayFilmsStayInTheirCrop: StoryFn<typeof Ray> = () => (
  <Box display="flex" flexWrap="wrap" gap="spacing.4" padding="spacing.11" paddingTop="200px">
    {CROP_FILMS.map(({ id, state, idle }) =>
      state ? (
        <Box key={id} width="300px" height="160px" display="flex" alignItems="flex-end">
          <Ray state={state} idle="rest" shouldReactToPointer={false} />
        </Box>
      ) : (
        <Box key={id} width="300px" height="160px" display="flex" alignItems="flex-end">
          <Ray idle={idle} />
        </Box>
      ),
    )}
  </Box>
);
// the ink one film draws outside its crop at one moment: drawn again on its whole stage, then put back
const inkOutsideCrop = (r: any, id: string, now: number): number => {
  const host = r.films[id].host;
  const crop = r.filmCrop(id);
  host.setCrop(crop);
  const K = host.part();
  host.setCrop(null);
  host.tick(now);
  host.tick(now);
  let outside = 0;
  host.layer.querySelectorAll('canvas').forEach((c: HTMLCanvasElement) => {
    if (!c.getContext('2d') || !c.width || !c.height) return; // (Searching's lens is WebGL, inside its glass)
    const copy = document.createElement('canvas');
    copy.width = c.width;
    copy.height = c.height;
    const x = copy.getContext('2d', { willReadFrequently: true })!;
    x.drawImage(c, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    for (let y = 0; y < c.height; y++)
      for (let i = 0; i < c.width; i++) {
        const inside = i >= K.x && y >= K.y && i < K.x + K.w && y < K.y + K.h;
        if (!inside && d[(y * c.width + i) * 4 + 3] > 2) outside++;
      }
  });
  host.setCrop(crop);
  host.tick(now);
  return outside;
};
TestRayFilmsStayInTheirCrop.play = async () => {
  const rays = (): any[] => CROP_FILMS.map((_, i) => rayEl(i).__ray);
  await waitFor(
    () =>
      CROP_FILMS.forEach(({ id }, i) => {
        const h = rayEl(i)?.__ray?.debug.holder;
        expect(h && h.by === 'film' && h.id === id && h.started).toBe(true);
      }),
    { timeout: 15000 },
  );
  for (let i = 4; i < CROP_FILMS.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await userEvent.click(rayEl(i)); // the idle films' coin flips
  }
  const worst: Record<string, number> = {};
  for (let sample = 0; sample < 10; sample++) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(350); // (samples a few times a second, one after another)
    const C = rays()[0].constructor;
    const loop = C.onFrame;
    C.onFrame = (): void => undefined; // (his loop held: each film is drawn at one moment, both ways)
    const now = performance.now();
    CROP_FILMS.forEach(({ id }, i) => {
      worst[id] = Math.max(worst[id] ?? 0, inkOutsideCrop(rays()[i], id, now));
    });
    C.onFrame = loop;
    rays().forEach((r) => C.book(r));
  }
  await expect(worst).toEqual(Object.fromEntries(CROP_FILMS.map(({ id }) => [id, 0])));
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
