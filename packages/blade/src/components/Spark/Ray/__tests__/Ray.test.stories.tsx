/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import React, { useRef, useState } from 'react';
import type { RayOutcome, RayState } from '..';
import { Ray } from '..';
import { RayLoader } from '../../RayLoader';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { ChatInput } from '~components/ChatInput';
import { Text } from '~components/Typography';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// what Ray is doing, read from the handle his director puts on his element in development builds (el.__ray.debug)
const rayEl = (i = 0): any => document.querySelectorAll('[data-blade-component="ray"]')[i];
const doing = (i = 0): string => {
  const h = rayEl(i)?.__ray?.debug.holder;
  if (!h) return '';
  return h.by === 'player' ? h.act : `film:${h.id}`;
};
const flip = (i = 0): any => rayEl(i)?.__ray?.debug.flip;
const holder = (i = 0): any => rayEl(i)?.__ray?.debug.holder;
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

// A film loaded ahead (here the answer's next, Calling) draws one frame unseen, then sleeps: its first frame's one-off work (its
// canvases' first draws, a WebGL shader built on Windows' Direct3D) is done while it waits, not in the frame it takes him in
export const TestRayRehearsesAFilmLoadedAhead: StoryFn<typeof Ray> = () => (
  <Box padding="spacing.11" paddingTop="200px">
    <Ray state="searching" idle="rest" />
  </Box>
);
TestRayRehearsesAFilmLoadedAhead.play = async () => {
  await waitFor(() => expect(doing()).toBe('film:search'), { timeout: 5000 });
  const next = (): any => rayEl().__ray.films.calling;
  await waitFor(() => expect(next()?.ready).toBe(true), { timeout: 5000 });
  await waitFor(() => expect(next().host.rehearsed).toBe(true), { timeout: 3000 }); // its one frame
  expect(next().host.parked).toBe(true); // asleep after it (its canvases emptied)
  for (let i = 0; i < 10; i++) {
    expect(next().host.layer.style.visibility).toBe('hidden'); // never seen
    expect(doing()).toBe('film:search');
    // eslint-disable-next-line no-await-in-loop
    await sleep(50);
  }
};

// A film still loading doesn't hold him up: hidden while his idle's film loads (on a slow connection), he hops off at once, not
// once it's loaded or given up on (the PR review)
export const TestRayDoesntWaitForAFilm: StoryFn<typeof Ray> = () => {
  const [idle, setIdle] = useState<'rest' | 'coffee'>('rest');
  const [isVisible, setIsVisible] = useState(true);
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      alignItems="flex-end"
      gap="spacing.8"
    >
      <Ray idle={idle} isVisible={isVisible} />
      <Button onClick={() => setIdle('coffee')}>Coffee</Button>
      <Button onClick={() => setIsVisible(false)}>Hide</Button>
    </Box>
  );
};
TestRayDoesntWaitForAFilm.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 3000 });
  rayEl().__ray.loading.coffee = new Promise(() => undefined); // (Coffee's chunk never comes)
  await userEvent.click(getByRole('button', { name: 'Coffee' }));
  await waitFor(() => expect(doing()).toBe('film:coffee'), { timeout: 3000 });
  expect(rayEl().__ray.debug.holder.started).toBe(false);
  await userEvent.click(getByRole('button', { name: 'Hide' }));
  await waitFor(() => expect(['hiding', 'gone']).toContain(doing()), { timeout: 1000 });
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

// `thinking` plays the magnifying glass (Searching's film); `reading`, the box with the papers coming out (Reading box's film, as an
// answer state), taking him over mid-move from where the last one left him; done, he's back at rest
export const TestRayThinksAndReads: StoryFn<typeof Ray> = () => {
  const [state, setState] = useState<RayState>('idle');
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      alignItems="flex-end"
      gap="spacing.8"
    >
      <Ray state={state} idle="rest" shouldReactToPointer={false} />
      <Button onClick={() => setState('thinking')}>Thinking</Button>
      <Button onClick={() => setState('reading')}>Reading</Button>
      <Button onClick={() => setState('idle')}>Done</Button>
    </Box>
  );
};
TestRayThinksAndReads.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 3000 });
  await userEvent.click(getByRole('button', { name: 'Thinking' }));
  await waitFor(
    () => expect(holder()).toMatchObject({ id: 'search', kind: 'answer', started: true }),
    {
      timeout: 5000,
    },
  );
  await sleep(1500);
  await userEvent.click(getByRole('button', { name: 'Reading' }));
  await waitFor(
    () => expect(holder()).toMatchObject({ id: 'readbox', kind: 'answer', started: true }),
    {
      timeout: 5000,
    },
  );
  expect(rayEl().__ray.pendingFrom).not.toBe(null); // (handed over mid-move: from where Thinking left him)
  await sleep(2000);
  await userEvent.click(getByRole('button', { name: 'Done' }));
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 10000 });
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

// The nightcap is the sleep idle's: on while he sleeps or dozes, and in an answer's film meanwhile; off as another idle starts
// (Coffee at 6am with time-of-day, or an app's new `idle`), on him and in that idle's film (the user, 2026-11-18)
export const TestRayNightcapIsTheSleepIdles: StoryFn<typeof Ray> = () => {
  const [idle, setIdle] = useState<'sleep' | 'coffee'>('sleep');
  const [state, setState] = useState<RayState>('idle');
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      alignItems="flex-end"
      gap="spacing.8"
    >
      <Ray idle={idle} state={state} shouldReactToPointer={false} />
      <Button onClick={() => setState('searching')}>Answer</Button>
      <Button onClick={() => setState('idle')}>Done</Button>
      <Button onClick={() => setIdle('coffee')}>Coffee</Button>
    </Box>
  );
};
TestRayNightcapIsTheSleepIdles.play = async () => {
  const { getByRole } = within(document.body);
  const cap = (): boolean => rayEl().__ray.player.cap.CAP.on;
  const filmCap = (id: string): boolean =>
    Boolean(rayEl().__ray.films[id]?.host.peek('rayCap')?.CAP.on);
  await waitFor(() => expect(rayEl().__ray.player.napPhase).toBe('asleep'), { timeout: 3000 });
  expect(cap()).toBe(true);
  await userEvent.click(getByRole('button', { name: 'Answer' }));
  await waitFor(() => expect(doing()).toBe('film:search'), { timeout: 5000 });
  await waitFor(() => expect(filmCap('search')).toBe(true), { timeout: 3000 }); // (his idle is still Sleep)
  await userEvent.click(getByRole('button', { name: 'Done' }));
  await waitFor(() => expect(rayEl().__ray.player.napPhase).not.toBe(null), { timeout: 8000 });
  expect(cap()).toBe(true);
  await userEvent.click(getByRole('button', { name: 'Coffee' }));
  await waitFor(() => expect(doing()).toBe('film:coffee'), { timeout: 6000 });
  expect(cap()).toBe(false);
  await waitFor(() => expect(filmCap('coffee')).toBe(false), { timeout: 1000 });
};

// a made-up voice, as a page's own mic would hand it over (a quiet buzz, never played out loud): for the mic's level
const fakeVoice = (): { stream: MediaStream; stop: () => void } => {
  const ctx = new AudioContext();
  const out = ctx.createMediaStreamDestination();
  const buzz = ctx.createOscillator();
  const gain = ctx.createGain();
  gain.gain.value = 0.15;
  buzz.type = 'sawtooth';
  buzz.connect(gain).connect(out);
  buzz.start();
  return { stream: out.stream, stop: () => ctx.close() };
};

// isOffline: the droop film's malfunction takes him (it wins over everything else), and back online he jumps back to rest. Asked back
// mid-way (offline again as he jumps back), the film turns back from where he is
export const TestRayGoesOffline: StoryFn<typeof Ray> = () => {
  const [isOffline, setIsOffline] = useState(false);
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      alignItems="flex-end"
      gap="spacing.8"
    >
      <Ray idle="rest" isOffline={isOffline} />
      <Button onClick={() => setIsOffline((v) => !v)}>{isOffline ? 'Online' : 'Offline'}</Button>
    </Box>
  );
};
TestRayGoesOffline.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 3000 });
  await userEvent.click(getByRole('button', { name: 'Offline' }));
  await waitFor(
    () => expect(holder()).toMatchObject({ id: 'droop', state: 'offline', started: true }),
    { timeout: 5000 },
  );
  await sleep(1500);
  await userEvent.click(getByRole('button', { name: 'Online' })); // back online: the jump
  await waitFor(() => expect(holder().leaving).toBe('exit'), { timeout: 1000 });
  await userEvent.click(getByRole('button', { name: 'Offline' })); // offline again mid-jump: back from where he is
  await waitFor(() => expect(holder()).toMatchObject({ id: 'droop', leaving: false }), {
    timeout: 1000,
  });
  await userEvent.click(getByRole('button', { name: 'Online' }));
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 6000 });
};

// From an idle film, offline (as the mic and an outcome) takes him with a send's quick hand-over, as flow 10.5 does: the film's exit at
// the hop's pace (1.6x), then the malfunction from his rest
export const TestRayIdleFilmHandsOverQuickly: StoryFn<typeof Ray> = () => {
  const [isOffline, setIsOffline] = useState(false);
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      alignItems="flex-end"
      gap="spacing.8"
    >
      <Ray idle="coffee" isOffline={isOffline} shouldReactToPointer={false} />
      <Button onClick={() => setIsOffline(true)}>Offline</Button>
    </Box>
  );
};
TestRayIdleFilmHandsOverQuickly.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(holder()).toMatchObject({ id: 'coffee', started: true }), {
    timeout: 6000,
  });
  const host = rayEl().__ray.films.coffee.host;
  const sent: any[] = [];
  const send = host.send.bind(host);
  host.send = (m: any) => {
    sent.push(m);
    send(m);
  };
  await userEvent.click(getByRole('button', { name: 'Offline' }));
  await waitFor(() => expect(sent).toContainEqual({ ray: 'pace', v: 1.6 }), { timeout: 2000 });
  await waitFor(
    () => expect(holder()).toMatchObject({ id: 'droop', state: 'offline', started: true }),
    {
      timeout: 8000,
    },
  );
};

// outcome="error": the droop film's sad one-shot on his seat, once, then his rest; set again, it plays again
export const TestRayPlaysAnError: StoryFn<typeof Ray> = () => {
  const [outcome, setOutcome] = useState<RayOutcome | undefined>(undefined);
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      alignItems="flex-end"
      gap="spacing.8"
    >
      <Ray idle="rest" outcome={outcome} />
      <Button onClick={() => setOutcome('error')}>Error</Button>
      <Button onClick={() => setOutcome(undefined)}>Clear</Button>
    </Box>
  );
};
TestRayPlaysAnError.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 3000 });
  for (let round = 0; round < 2; round++) {
    // eslint-disable-next-line no-await-in-loop
    await userEvent.click(getByRole('button', { name: 'Error' }));
    // eslint-disable-next-line no-await-in-loop
    await waitFor(
      () => expect(holder()).toMatchObject({ id: 'droop', state: 'error', started: true }),
      { timeout: 5000 },
    );
    // eslint-disable-next-line no-await-in-loop
    await waitFor(() => expect(doing()).toBe('rest'), { timeout: 10000 }); // (once: it's over, and stays over)
    // eslint-disable-next-line no-await-in-loop
    await sleep(600);
    expect(doing()).toBe('rest');
    // eslint-disable-next-line no-await-in-loop
    await userEvent.click(getByRole('button', { name: 'Clear' }));
  }
};

// outcome="success": canon Success, once, then his rest. It waits for an answer's states to end
export const TestRayPlaysSuccessAfterTheAnswer: StoryFn<typeof Ray> = () => {
  const [state, setState] = useState<RayState>('searching');
  const [outcome, setOutcome] = useState<RayOutcome | undefined>(undefined);
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      alignItems="flex-end"
      gap="spacing.8"
    >
      <Ray idle="rest" state={state} outcome={outcome} shouldReactToPointer={false} />
      <Button onClick={() => setOutcome('success')}>Success</Button>
      <Button onClick={() => setState('idle')}>Done</Button>
    </Box>
  );
};
TestRayPlaysSuccessAfterTheAnswer.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(doing()).toBe('film:search'), { timeout: 5000 });
  await userEvent.click(getByRole('button', { name: 'Success' }));
  await sleep(800);
  expect(doing()).toBe('film:search'); // (the answer's still going: it waits)
  await userEvent.click(getByRole('button', { name: 'Done' }));
  await waitFor(() => expect(doing()).toBe('outcome'), { timeout: 8000 });
  const started = performance.now();
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 6000 });
  expect(performance.now() - started).toBeGreaterThan(3000); // (all of it: about 3.8 s)
};

// An outcome cleared before it ever played stays cleared: an error asked for while its film is still loading, a new answer, then
// `outcome` cleared with the next question: once that answer's done he rests, with no stale error (the simplify review)
export const TestRayClearedOutcomeStaysCleared: StoryFn<typeof Ray> = () => {
  const [state, setState] = useState<RayState>('idle');
  const [outcome, setOutcome] = useState<RayOutcome | undefined>(undefined);
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      alignItems="flex-end"
      gap="spacing.8"
    >
      <Ray idle="rest" state={state} outcome={outcome} shouldReactToPointer={false} />
      <Button onClick={() => setOutcome('error')}>Error</Button>
      <Button onClick={() => setState('searching')}>Answer</Button>
      <Button onClick={() => setOutcome(undefined)}>Clear</Button>
      <Button onClick={() => setState('idle')}>Done</Button>
    </Box>
  );
};
TestRayClearedOutcomeStaysCleared.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 3000 });
  rayEl().__ray.loading.droop = new Promise(() => undefined); // (the error's film never comes)
  await userEvent.click(getByRole('button', { name: 'Error' }));
  await waitFor(() => expect(holder()).toMatchObject({ id: 'droop', started: false }), {
    timeout: 3000,
  });
  await userEvent.click(getByRole('button', { name: 'Answer' }));
  await waitFor(() => expect(doing()).toBe('film:search'), { timeout: 5000 });
  await userEvent.click(getByRole('button', { name: 'Clear' }));
  expect(rayEl().__ray.outcome).toBe(null);
  await userEvent.click(getByRole('button', { name: 'Done' }));
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 8000 });
  await sleep(1000);
  expect(doing()).toBe('rest');
};

// isListening with a voiceStream: the mic film, fed the voice's level (he never opens a mic himself), and back in at rest. Offline wins
// over the mic: it goes at once
export const TestRayListens: StoryFn<typeof Ray> = () => {
  const [isListening, setIsListening] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [voice, setVoice] = useState<{ stream: MediaStream; stop: () => void } | null>(null);
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      alignItems="flex-end"
      gap="spacing.8"
    >
      <Ray
        idle="rest"
        isListening={isListening}
        isOffline={isOffline}
        voiceStream={voice?.stream}
      />
      <Button
        onClick={() => {
          if (!voice) setVoice(fakeVoice());
          setIsListening((v) => !v);
        }}
      >
        {isListening ? 'Stop' : 'Listen'}
      </Button>
      <Button onClick={() => setIsOffline((v) => !v)}>{isOffline ? 'Online' : 'Offline'}</Button>
    </Box>
  );
};
TestRayListens.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 3000 });
  await userEvent.click(getByRole('button', { name: 'Listen' }));
  await waitFor(() => expect(holder()).toMatchObject({ id: 'mic', state: 'mic', started: true }), {
    timeout: 5000,
  });
  await waitFor(() => expect(rayEl().__ray.voice?.sent).toBeGreaterThan(0.05), { timeout: 3000 }); // (its level, sent to the film)
  await userEvent.click(getByRole('button', { name: 'Stop' }));
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 5000 });
  expect(rayEl().__ray.voice).toBe(null); // (stopped listening: his analyser's let go)
  await userEvent.click(getByRole('button', { name: 'Listen' }));
  await waitFor(() => expect(holder()).toMatchObject({ id: 'mic', started: true }), {
    timeout: 5000,
  });
  await sleep(800);
  await userEvent.click(getByRole('button', { name: 'Offline' }));
  await waitFor(() => expect(holder()).toMatchObject({ id: 'droop', state: 'offline' }), {
    timeout: 1500,
  }); // (at once)
};

// The answer row's Ray comes up out of his row (canon hide's second half) and his first film takes him from there; as the answer's done
// and he's hidden, his film's exit is cut once its prop is put away and he goes down from there (flow 10.5). Both his jumps at 1.7x
export const TestRayRowHops: StoryFn<typeof Ray> = () => {
  const [state, setState] = useState<RayState>('working');
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Box
      padding="spacing.11"
      paddingTop="200px"
      display="flex"
      alignItems="flex-end"
      gap="spacing.8"
    >
      <Ray idle="rest" state={state} isVisible={isVisible} shouldReactToPointer={false} />
      <Button onClick={() => setIsVisible(true)}>Rise</Button>
      <Button
        onClick={() => {
          setState('idle');
          setIsVisible(false);
        }}
      >
        Done
      </Button>
    </Box>
  );
};
TestRayRowHops.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(doing()).toBe('gone'), { timeout: 3000 });
  await waitFor(() => expect(rayEl().__ray.films.laptop2?.ready).toBe(true), { timeout: 5000 }); // (loaded ahead)
  await userEvent.click(getByRole('button', { name: 'Rise' }));
  const rise = performance.now();
  await waitFor(() => expect(doing()).toBe('showing'), { timeout: 1000 });
  await waitFor(() => expect(holder()).toMatchObject({ id: 'laptop2', started: true }), {
    timeout: 5000,
  });
  expect(performance.now() - rise).toBeLessThan(550); // (up at 1.7x: about 380 ms; 650 at 1x)
  expect(rayEl().__ray.pendingFrom).not.toBe(null); // (from his pose as he came up)
  await sleep(2500);
  expect(rayEl().__ray.films.laptop2.host.handle.F.L.back).toBeTruthy(); // (where its laptop's put away: the cut's read off it)
  await userEvent.click(getByRole('button', { name: 'Done' }));
  const done = performance.now();
  await waitFor(() => expect(doing()).toBe('hiding'), { timeout: 3000 });
  expect(performance.now() - done).toBeLessThan(1000); // (cut once the laptop's away, about 0.6 s, not after its whole exit: 1.1 s)
  const down = performance.now();
  await waitFor(() => expect(doing()).toBe('gone'), { timeout: 2000 });
  expect(performance.now() - down).toBeLessThan(450); // (down at 1.7x: about 350 ms; 500 at 1.2x)
};

// The way back is quicker: a Ray hopping back up onto his surface lands at 1.2x canon's pace
export const TestRayComesBackQuicker: StoryFn<typeof Ray> = TestRayHopsOffAndBack.bind({});
TestRayComesBackQuicker.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 3000 });
  await userEvent.click(getByRole('button', { name: 'Hide' }));
  await waitFor(() => expect(doing()).toBe('gone'), { timeout: 3000 });
  await userEvent.click(getByRole('button', { name: 'Show' }));
  const shown = performance.now();
  await waitFor(() => expect(doing()).toBe('rest'), { timeout: 3000 });
  expect(performance.now() - shown).toBeLessThan(850); // (canon's 900 ms at 1x; 750 at 1.2x)
};

// The Ray loader: started, he charges and dashes and holds while loading; `isLoading` false, he finishes (slides, turns, jumps, drops
// through the floor) and onComplete is called, once. Stopped mid-way (unmounted), a new one starts from his start
const loaderEl = (): any =>
  document.querySelector('[data-blade-component="ray-loader"]')?.firstElementChild;
export const TestRayLoaderLoadsAndFinishes: StoryFn<typeof RayLoader> = () => {
  const [run, setRun] = useState(0);
  const [isShown, setIsShown] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [completions, setCompletions] = useState(0);
  return (
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.4">
      <Box display="flex" gap="spacing.3">
        <Button
          onClick={() => {
            setRun((r) => r + 1);
            setIsShown(true);
            setIsLoading(true);
          }}
        >
          Start
        </Button>
        <Button onClick={() => setIsLoading(false)}>Finish</Button>
        <Button onClick={() => setIsShown(false)}>Stop</Button>
        <Text>{`completed ${completions}`}</Text>
      </Box>
      <Box width="720px">
        {isShown ? (
          <RayLoader
            key={run}
            isLoading={isLoading}
            onComplete={() => setCompletions((c) => c + 1)}
          />
        ) : null}
      </Box>
    </Box>
  );
};
TestRayLoaderLoadsAndFinishes.play = async () => {
  const { getByRole, getByText } = within(document.body);
  const debug = (): any => loaderEl()?.__rayLoader?.debug;
  await waitFor(() => expect(debug()).toMatchObject({ started: true, shown: true }), {
    timeout: 8000,
  });
  await sleep(1500);
  expect(debug()).toMatchObject({ finishing: false, done: false }); // (holding the dash while loading)
  await userEvent.click(getByRole('button', { name: 'Stop' })); // stopped mid-way: the loader goes
  expect(loaderEl()).toBeFalsy();
  await userEvent.click(getByRole('button', { name: 'Start' })); // a new one, from his start
  await waitFor(() => expect(debug()).toMatchObject({ started: true, shown: true }), {
    timeout: 8000,
  });
  await sleep(1200);
  await userEvent.click(getByRole('button', { name: 'Finish' }));
  await waitFor(() => expect(debug()?.finishing).toBe(true), { timeout: 1000 });
  await waitFor(() => expect(getByText('completed 1')).toBeTruthy(), { timeout: 8000 });
  await sleep(500);
  expect(getByText('completed 1')).toBeTruthy(); // (once)
  expect(
    loaderEl().getAttribute('aria-hidden') ?? loaderEl().parentElement.getAttribute('aria-hidden'),
  ).toBe('true');
};

// Each film draws inside its crop (FILM_CROP in RayMount): every film plays (the idle ones flip a coin too) and, a few times a second,
// is drawn once more on its whole stage at the same moment, where nothing may fall outside the part its canvases cover. A film retuned
// in Ray Studio to reach further fails here rather than being cut off (the performance review, 2026-11-16)
const CROP_FILMS: {
  id: string;
  state?: RayState;
  idle?: 'coffee' | 'cash' | 'reading';
  isOffline?: boolean;
  isListening?: boolean;
}[] = [
  { id: 'search', state: 'searching' },
  { id: 'calling', state: 'calling' },
  { id: 'writing', state: 'writing' },
  { id: 'laptop2', state: 'working' },
  { id: 'coffee', idle: 'coffee' },
  { id: 'cash', idle: 'cash' },
  { id: 'readbox', idle: 'reading' },
  { id: 'droop', isOffline: true },
  { id: 'mic', isListening: true },
];
export const TestRayFilmsStayInTheirCrop: StoryFn<typeof Ray> = () => (
  <Box display="flex" flexWrap="wrap" gap="spacing.4" padding="spacing.11" paddingTop="200px">
    {CROP_FILMS.map(({ id, state, idle, isOffline, isListening }) =>
      state || isOffline || isListening ? (
        <Box key={id} width="300px" height="160px" display="flex" alignItems="flex-end">
          <Ray
            state={state}
            idle="rest"
            isOffline={isOffline}
            isListening={isListening}
            shouldReactToPointer={false}
          />
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
    if (CROP_FILMS[i].idle) await userEvent.click(rayEl(i)); // the idle films' coin flips
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
