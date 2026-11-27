import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { RazorSenseChat, RazorSenseThinking, RazorSenseBottomWave } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme';
import { bladeTheme } from '~tokens/theme';
import { BladeProvider } from '~components/BladeProvider';

// jsdom has no WebGL2: RazorSenseChat and RazorSenseBottomWave go to their stills, which is what the states are checked on here.
// Each still is a module of its own, loaded only when it's needed: each is stood in for by its name, so a test reads which shows.
jest.mock('../stills/thinkingLight', () => ({ thinkingLight: 'still:thinking' }));
jest.mock('../stills/bottomWaveLight', () => ({ bottomWaveLight: 'still:bottomWave' }));
jest.mock('../stills/voiceBottomLight', () => ({ voiceBottomLight: 'still:voiceBottom' }));
jest.mock('../stills/successLight', () => ({ successLight: 'still:success' }));
jest.mock('../stills/errorLight', () => ({ errorLight: 'still:error' }));

/** how long an outcome's still shows (useStateStill: its piece's length) */
const OUTCOME_STILL_MS = 3710;

type StateProps = React.ComponentProps<typeof RazorSenseChat> &
  React.ComponentProps<typeof RazorSenseBottomWave>;

type PageStream = {
  stream: MediaStream;
  track: { stop: jest.Mock };
  getTracks: jest.Mock;
  getAudioTracks: jest.Mock;
};

/** a stand-in for the page's own microphone stream (jsdom has no MediaStream): what the components may touch of it is counted */
const makeStream = (): PageStream => {
  const track = { kind: 'audio', stop: jest.fn() };
  const getTracks = jest.fn(() => [track]);
  const getAudioTracks = jest.fn(() => [track]);
  const stream = ({
    id: 'page-mic',
    active: true,
    getTracks,
    getAudioTracks,
  } as unknown) as MediaStream;
  return { stream, track, getTracks, getAudioTracks };
};

/** renders under the light theme, and renders again under it (renderWithTheme's own rerender drops the provider) */
const renderInTheme = (
  ui: React.ReactElement,
): ReturnType<typeof renderWithTheme> & { update: (next: React.ReactElement) => void } => {
  const result = renderWithTheme(ui);
  const update = (next: React.ReactElement): void =>
    result.rerender(
      <BladeProvider themeTokens={bladeTheme} colorScheme="light">
        {next}
      </BladeProvider>,
    );
  return { ...result, update };
};

/** ten microtask turns: enough for a still's dynamic import to land (no timer involved, so fake timers don't hold it) */
const settleMicrotasks = (): Promise<void> =>
  Array.from({ length: 10 }).reduce<Promise<void>>(
    (turn) => turn.then(() => undefined),
    Promise.resolve(),
  );

/**
 * settles the stills' dynamic imports inside act (promises only: no timer moves on, so fake timers stay where they are). Each test
 * ends with it too, so no still lands after the test, outside act
 */
const flushImports = async (): Promise<void> => {
  await act(async () => {
    await settleMicrotasks();
  });
};

const advance = (ms: number): void => {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
};

/** a chat after its answer (no RazorSenseThinking shown, unless isThinking): its bottom wave's still is up */
const Chat = ({
  isThinking = false,
  ...props
}: Partial<StateProps> & { isThinking?: boolean }): React.ReactElement => (
  <RazorSenseChat {...props}>
    {isThinking ? <RazorSenseThinking>Searching…</RazorSenseThinking> : <p>The answer</p>}
    <RazorSenseBottomWave>
      <textarea />
    </RazorSenseBottomWave>
  </RazorSenseChat>
);

/** a RazorSenseBottomWave on its own */
const Wave = (props: Partial<StateProps>): React.ReactElement => (
  <RazorSenseBottomWave {...props}>
    <textarea />
  </RazorSenseBottomWave>
);

/** the chat's stills: its thinking one, then its bottom wave's */
const chatStills = (container: HTMLElement): HTMLImageElement[] =>
  Array.from(container.querySelectorAll('[data-blade-component="razorsense-chat"] img'));
const chatWaveStill = (container: HTMLElement): HTMLImageElement => {
  const stills = chatStills(container);
  if (stills.length !== 2) throw new Error('the chat’s stills have not loaded yet');
  return stills[1];
};
const waveStill = (container: HTMLElement): HTMLImageElement => {
  const still = container.querySelector<HTMLImageElement>(
    '[data-blade-component="razorsense-bottom-wave"] img',
  );
  if (!still) throw new Error('the bottom wave’s still has not loaded yet');
  return still;
};

/** each case: the component, and where its bottom wave's still is */
const strips = [
  { name: 'RazorSenseChat', Strip: Chat, stillOf: chatWaveStill },
  { name: 'RazorSenseBottomWave on its own', Strip: Wave, stillOf: waveStill },
] as const;

describe('RazorSenseChat and RazorSenseBottomWave: the states on their stills (jsdom has no WebGL2)', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('isOffline', () => {
    it('RazorSenseBottomWave on its own: its still goes over 1.2 s, and comes back over 1.2 s', async () => {
      const { container, update } = renderInTheme(<Wave />);
      const still = await waitFor(() => waveStill(container));
      expect(still.style.opacity).toBe('1');

      update(<Wave isOffline />);
      expect(still.style.opacity).toBe('0');
      expect(still.style.transition).toBe('opacity 1.2s');

      // back online: the same element, so the browser turns its opacity round from where it is
      update(<Wave isOffline={false} />);
      expect(waveStill(container)).toBe(still);
      expect(still.style.opacity).toBe('1');
      expect(still.style.transition).toBe('opacity 1.2s');
      await flushImports();
    });

    it('RazorSenseChat: its bottom wave’s still goes over 1.2 s, and comes back', async () => {
      const { container, update } = renderInTheme(<Chat />);
      const still = await waitFor(() => chatWaveStill(container));
      expect(still.style.opacity).toBe('1');

      update(<Chat isOffline />);
      expect(still.style.opacity).toBe('0');
      expect(still.style.transition).toBe('opacity 1.2s');

      update(<Chat isOffline={false} />);
      expect(chatWaveStill(container)).toBe(still);
      expect(still.style.opacity).toBe('1');
      // (back online the same way: offline's 1.2 s, not thinking's 0.6 s)
      expect(still.style.transition).toBe('opacity 1.2s');
      await flushImports();
    });

    it('RazorSenseChat: leaves the thinking still as it is (only the strip drops)', async () => {
      const { container, update } = renderInTheme(<Chat isThinking />);
      await waitFor(() => expect(chatStills(container)).toHaveLength(2));
      const [thinking, wave] = chatStills(container);
      expect([thinking.style.opacity, wave.style.opacity]).toEqual(['1', '0']);

      update(<Chat isThinking isOffline />);
      expect([thinking.style.opacity, wave.style.opacity]).toEqual(['1', '0']);
      expect(thinking.getAttribute('src')).toBe('still:thinking');
      await flushImports();
    });

    it.each(strips)(
      '$name: offline wins over listening (the voice still goes at once)',
      async ({ Strip, stillOf }) => {
        const { container, update } = renderInTheme(<Strip isListening />);
        await waitFor(() =>
          expect(stillOf(container).getAttribute('src')).toBe('still:voiceBottom'),
        );

        update(<Strip isListening isOffline />);
        const still = stillOf(container);
        expect(still.getAttribute('src')).toBe('still:bottomWave');
        expect(still.style.opacity).toBe('0');

        // back online, still listening: the voice still again (already loaded: at once)
        update(<Strip isListening isOffline={false} />);
        expect(stillOf(container).getAttribute('src')).toBe('still:voiceBottom');
        expect(stillOf(container).style.opacity).toBe('1');
        await flushImports();
      },
    );
  });

  describe('outcome', () => {
    it.each(strips)(
      '$name: "success" shows its still for its piece’s length (3710 ms), then the strip at rest',
      async ({ Strip, stillOf }) => {
        jest.useFakeTimers();
        const { container, update } = renderInTheme(<Strip />);
        await flushImports();
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');

        update(<Strip outcome="success" />);
        await flushImports();
        expect(stillOf(container).getAttribute('src')).toBe('still:success');
        advance(OUTCOME_STILL_MS - 1);
        expect(stillOf(container).getAttribute('src')).toBe('still:success');
        advance(1);
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');
        await flushImports();
      },
    );

    it.each(strips)(
      '$name: "error" shows its still for its piece’s length (3710 ms), then the strip at rest',
      async ({ Strip, stillOf }) => {
        jest.useFakeTimers();
        const { container, update } = renderInTheme(<Strip />);
        await flushImports();

        update(<Strip outcome="error" />);
        await flushImports();
        expect(stillOf(container).getAttribute('src')).toBe('still:error');
        advance(OUTCOME_STILL_MS - 1);
        expect(stillOf(container).getAttribute('src')).toBe('still:error');
        advance(1);
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');
        await flushImports();
      },
    );

    it.each(strips)(
      '$name: changed mid-way, the new outcome shows for its own full length',
      async ({ Strip, stillOf }) => {
        jest.useFakeTimers();
        const { container, update } = renderInTheme(<Strip />);
        await flushImports();

        update(<Strip outcome="success" />);
        await flushImports();
        advance(2000);
        update(<Strip outcome="error" />);
        await flushImports();
        expect(stillOf(container).getAttribute('src')).toBe('still:error');
        // (its length counts from the change, not from the first outcome)
        advance(OUTCOME_STILL_MS - 1);
        expect(stillOf(container).getAttribute('src')).toBe('still:error');
        advance(1);
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');
        await flushImports();
      },
    );

    it.each(strips)(
      '$name: cleared mid-way, the strip is back at rest at once',
      async ({ Strip, stillOf }) => {
        jest.useFakeTimers();
        const { container, update } = renderInTheme(<Strip />);
        await flushImports();

        update(<Strip outcome="success" />);
        await flushImports();
        advance(1000);
        expect(stillOf(container).getAttribute('src')).toBe('still:success');
        update(<Strip outcome={undefined} />);
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');
        // (and its timer gone with it: nothing comes back later)
        advance(OUTCOME_STILL_MS);
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');
        await flushImports();
      },
    );

    it.each(strips)(
      '$name: plays once each time it’s set: left set, it doesn’t play again; cleared and set again, it does',
      async ({ Strip, stillOf }) => {
        jest.useFakeTimers();
        const { container, update } = renderInTheme(<Strip />);
        await flushImports();

        update(<Strip outcome="success" />);
        await flushImports();
        advance(OUTCOME_STILL_MS);
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');
        // still set (the page rendering again): it stays at rest
        update(<Strip outcome="success" />);
        await flushImports();
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');

        update(<Strip />);
        update(<Strip outcome="success" />);
        await flushImports();
        expect(stillOf(container).getAttribute('src')).toBe('still:success');
      },
    );

    it.each(strips)(
      '$name: set while listening, it waits for the voice look to go, then shows for its full length',
      async ({ Strip, stillOf }) => {
        jest.useFakeTimers();
        const { container, update } = renderInTheme(<Strip isListening />);
        await flushImports();
        expect(stillOf(container).getAttribute('src')).toBe('still:voiceBottom');

        update(<Strip isListening outcome="success" />);
        await flushImports();
        expect(stillOf(container).getAttribute('src')).toBe('still:voiceBottom');
        advance(OUTCOME_STILL_MS);
        expect(stillOf(container).getAttribute('src')).toBe('still:voiceBottom');

        update(<Strip outcome="success" />);
        await flushImports();
        expect(stillOf(container).getAttribute('src')).toBe('still:success');
        advance(OUTCOME_STILL_MS - 10);
        expect(stillOf(container).getAttribute('src')).toBe('still:success');
        advance(10);
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');
        await flushImports();
      },
    );

    it.each(strips)(
      '$name: set while offline, it waits till it is back online, then shows for its full length',
      async ({ Strip, stillOf }) => {
        jest.useFakeTimers();
        const { container, update } = renderInTheme(<Strip isOffline outcome="error" />);
        await flushImports();
        advance(OUTCOME_STILL_MS);
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');

        update(<Strip outcome="error" />);
        await flushImports();
        expect(stillOf(container).getAttribute('src')).toBe('still:error');
        advance(OUTCOME_STILL_MS);
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');
        await flushImports();
      },
    );

    it('RazorSenseChat: set while it thinks, it waits for the answer, then shows for its full length', async () => {
      jest.useFakeTimers();
      const { container, update } = renderInTheme(<Chat isThinking outcome="success" />);
      await flushImports();
      advance(OUTCOME_STILL_MS + 500);
      update(<Chat outcome="success" />);
      await flushImports();
      expect(chatWaveStill(container).getAttribute('src')).toBe('still:success');
      advance(OUTCOME_STILL_MS);
      expect(chatWaveStill(container).getAttribute('src')).toBe('still:bottomWave');
      await flushImports();
    });
  });

  describe('isListening and voiceStream', () => {
    it.each(strips)(
      '$name: listening, its bottom wave shows the voice still; back to false, its own',
      async ({ Strip, stillOf }) => {
        const { container, update } = renderInTheme(<Strip />);
        const still = await waitFor(() => stillOf(container));
        expect(still.getAttribute('src')).toBe('still:bottomWave');

        update(<Strip isListening />);
        await waitFor(() =>
          expect(stillOf(container).getAttribute('src')).toBe('still:voiceBottom'),
        );
        // (the same element: only its picture changes)
        expect(stillOf(container)).toBe(still);
        expect(still.style.opacity).toBe('1');

        update(<Strip isListening={false} />);
        expect(stillOf(container).getAttribute('src')).toBe('still:bottomWave');
        await flushImports();
      },
    );

    it('RazorSenseChat: listening while it thinks, its bottom wave’s still stays hidden under the thinking', async () => {
      const { container } = renderInTheme(<Chat isThinking isListening />);
      await waitFor(() => expect(chatStills(container)).toHaveLength(2));
      const [thinking, wave] = chatStills(container);
      expect(thinking.style.opacity).toBe('1');
      expect(wave.style.opacity).toBe('0');
      await flushImports();
    });

    it('never opens the microphone, nor reads or stops the stream it’s given', async () => {
      // (jsdom has neither: both stood in for, and put back after)
      const getUserMedia = jest.fn(() => Promise.reject(new Error('not in a test')));
      const hadMediaDevices = 'mediaDevices' in navigator;
      const mediaDevices = hadMediaDevices ? navigator.mediaDevices : ({} as MediaDevices);
      if (!hadMediaDevices) {
        Object.defineProperty(navigator, 'mediaDevices', {
          value: mediaDevices,
          configurable: true,
        });
      }
      const ownGetUserMedia = Object.getOwnPropertyDescriptor(mediaDevices, 'getUserMedia');
      Object.defineProperty(mediaDevices, 'getUserMedia', {
        value: getUserMedia,
        configurable: true,
      });
      const AudioContext = jest.fn();
      const audioWindow = window as Window & {
        AudioContext?: unknown;
        webkitAudioContext?: unknown;
      };
      const ownAudioContext = audioWindow.AudioContext;
      audioWindow.AudioContext = AudioContext;
      audioWindow.webkitAudioContext = AudioContext;

      try {
        const mic = makeStream();
        const Both = (props: Partial<StateProps>): React.ReactElement => (
          <>
            <Chat {...props} />
            <Wave {...props} />
          </>
        );
        const { container, update } = renderInTheme(<Both voiceStream={mic.stream} />);
        // given while not listening, then listening, offline, with an outcome, and not listening again
        await waitFor(() => expect(waveStill(container)).toBeTruthy());
        update(<Both voiceStream={mic.stream} isListening />);
        await waitFor(() =>
          expect(waveStill(container).getAttribute('src')).toBe('still:voiceBottom'),
        );
        update(<Both voiceStream={mic.stream} isListening isOffline />);
        // (an outcome waits for the voice look to go: listening ends, then it shows)
        update(<Both voiceStream={mic.stream} isListening outcome="success" />);
        update(<Both voiceStream={mic.stream} outcome="success" />);
        await waitFor(() => expect(waveStill(container).getAttribute('src')).toBe('still:success'));
        update(<Both voiceStream={mic.stream} />);
        await flushImports();

        expect(getUserMedia).not.toHaveBeenCalled();
        // (on its still nothing reads the stream: no audio context is made for it)
        expect(AudioContext).not.toHaveBeenCalled();
        expect(mic.getTracks).not.toHaveBeenCalled();
        expect(mic.getAudioTracks).not.toHaveBeenCalled();
        // (the stream is the page's: never stopped here)
        expect(mic.track.stop).not.toHaveBeenCalled();
      } finally {
        if (ownGetUserMedia) Object.defineProperty(mediaDevices, 'getUserMedia', ownGetUserMedia);
        else delete (mediaDevices as { getUserMedia?: unknown }).getUserMedia;
        if (!hadMediaDevices) delete (navigator as { mediaDevices?: unknown }).mediaDevices;
        audioWindow.AudioContext = ownAudioContext;
        delete audioWindow.webkitAudioContext;
      }
    });
  });

  describe('state props on a RazorSenseBottomWave inside a RazorSenseChat', () => {
    const InChat = (props: Partial<StateProps>): React.ReactElement => (
      <RazorSenseChat>
        <p>The answer</p>
        <RazorSenseBottomWave {...props}>
          <textarea />
        </RazorSenseBottomWave>
      </RazorSenseChat>
    );
    const warnings = (warn: jest.SpyInstance): string[] =>
      warn.mock.calls.map(([message]) => String(message));

    it('warn that the chat’s apply, listing the ones given', async () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const mic = makeStream();
      renderInTheme(<InChat isOffline isListening voiceStream={mic.stream} outcome="success" />);
      expect(warnings(warn)).toContain(
        "[Blade: RazorSenseBottomWave]: Inside RazorSenseChat the chat draws it, so its own isOffline, isListening, voiceStream, outcome don't apply: set them on RazorSenseChat instead.",
      );
      await flushImports();
    });

    it('warn for one alone, and for one given as false (it’s set there)', async () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const { unmount } = renderInTheme(<InChat outcome="error" />);
      expect(warnings(warn)).toContain(
        "[Blade: RazorSenseBottomWave]: Inside RazorSenseChat the chat draws it, so its own outcome doesn't apply: set it on RazorSenseChat instead.",
      );
      unmount();
      warn.mockClear();
      renderInTheme(<InChat isOffline={false} />);
      expect(warnings(warn)).toContain(
        "[Blade: RazorSenseBottomWave]: Inside RazorSenseChat the chat draws it, so its own isOffline doesn't apply: set it on RazorSenseChat instead.",
      );
      await flushImports();
    });

    it('warn once per change of which are given, not again as their values change', async () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const ownWarnings = (): string[] =>
        warnings(warn).filter((message) => message.includes('[Blade: RazorSenseBottomWave]'));
      const { update } = renderInTheme(<InChat isListening />);
      expect(ownWarnings()).toHaveLength(1);
      update(<InChat isListening={false} />);
      update(<InChat isListening />);
      expect(ownWarnings()).toHaveLength(1);
      update(<InChat isListening outcome="success" />);
      expect(ownWarnings()).toHaveLength(2);
      expect(ownWarnings()[1]).toContain('its own isListening, outcome don');
      await flushImports();
    });

    it('don’t warn for a RazorSenseBottomWave on its own, nor for one in a chat given none', async () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const mic = makeStream();
      renderInTheme(<Wave isOffline isListening voiceStream={mic.stream} outcome="success" />);
      renderInTheme(<InChat />);
      expect(warnings(warn).join('\n')).not.toContain('Inside RazorSenseChat');
      await flushImports();
    });

    it('change nothing the chat draws: its bottom wave’s still is the chat’s, at rest', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      jest.useFakeTimers();
      const { container } = renderInTheme(<InChat isOffline isListening outcome="success" />);
      await flushImports();
      const still = chatWaveStill(container);
      expect(still.getAttribute('src')).toBe('still:bottomWave');
      expect(still.style.opacity).toBe('1');
      // (the bottom wave draws nothing of its own in a chat)
      expect(
        container.querySelector('[data-blade-component="razorsense-bottom-wave"] img'),
      ).toBeNull();
    });
  });

  describe('ref, className, style and testID, with the states set', () => {
    it('RazorSenseChat forwards them to its root', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const mic = makeStream();
      const { getByTestId } = renderInTheme(
        <RazorSenseChat
          ref={ref}
          className="chat"
          style={{ zIndex: 2 }}
          testID="chat"
          isOffline
          isListening
          voiceStream={mic.stream}
          outcome="error"
        >
          <RazorSenseBottomWave>
            <textarea />
          </RazorSenseBottomWave>
        </RazorSenseChat>,
      );
      const root = getByTestId('chat');
      expect(ref.current).toBe(root);
      expect(root).toHaveAttribute('data-blade-component', 'razorsense-chat');
      expect(root.className).toBe('chat');
      expect(root.style.zIndex).toBe('2');
      // (its own styles kept under what's given)
      expect(root.style.position).toBe('relative');
      await flushImports();
    });

    it('RazorSenseBottomWave forwards them to its root, on its own and in a chat', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const mic = makeStream();
      const lone = React.createRef<HTMLDivElement>();
      const inChat = React.createRef<HTMLDivElement>();
      const states = {
        isOffline: true,
        isListening: true,
        voiceStream: mic.stream,
        outcome: 'success',
      } as const;
      const { getByTestId } = renderInTheme(
        <>
          <RazorSenseBottomWave
            ref={lone}
            className="lone"
            style={{ zIndex: 3 }}
            testID="lone-wave"
            {...states}
          >
            <textarea />
          </RazorSenseBottomWave>
          <RazorSenseChat>
            <RazorSenseBottomWave
              ref={inChat}
              className="in-chat"
              style={{ zIndex: 4 }}
              testID="chat-wave"
              {...states}
            >
              <textarea />
            </RazorSenseBottomWave>
          </RazorSenseChat>
        </>,
      );
      const cases = [
        { ref: lone, testID: 'lone-wave', className: 'lone', zIndex: '3' },
        { ref: inChat, testID: 'chat-wave', className: 'in-chat', zIndex: '4' },
      ];
      for (const { ref, testID, className, zIndex } of cases) {
        const root = getByTestId(testID);
        expect(ref.current).toBe(root);
        expect(root).toHaveAttribute('data-blade-component', 'razorsense-bottom-wave');
        expect(root.className).toBe(className);
        expect(root.style.zIndex).toBe(zIndex);
        expect(root.style.position).toBe('relative');
      }
      await flushImports();
    });
  });
});
