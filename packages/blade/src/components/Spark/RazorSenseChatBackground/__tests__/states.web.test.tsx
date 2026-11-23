import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { RazorSenseChatBackground } from '../index';
import { RazorSenseChat, RazorSenseBottomWave } from '../../RazorSenseChat';
import renderWithTheme from '~utils/testing/renderWithTheme';
import { bladeTheme } from '~tokens/theme';
import { BladeProvider } from '~components/BladeProvider';

// jsdom has no WebGL2: RazorSenseChatBackground goes to its still, which is what the states are checked on here. Each still is a
// module of its own, loaded only when it's needed: each is stood in for by its name, so a test reads which shows.
jest.mock('../stills/chatBackgroundLight', () => ({ chatBackgroundLight: 'still:chatBackground' }));
jest.mock('../stills/voiceDashboardLight', () => ({ voiceDashboardLight: 'still:voiceDashboard' }));

type Props = Partial<React.ComponentProps<typeof RazorSenseChatBackground>>;

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

/** settles the stills' dynamic imports inside act: each test ends with it, so no still lands after the test, outside act */
const flushImports = async (): Promise<void> => {
  await act(async () => {
    await settleMicrotasks();
  });
};

/** a stand-in for the page's own microphone stream (jsdom has no MediaStream): what the component may touch of it is counted */
const makeStream = (): {
  stream: MediaStream;
  track: { stop: jest.Mock };
  getTracks: jest.Mock;
  getAudioTracks: jest.Mock;
} => {
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

const Landing = (props: Props): React.ReactElement => (
  <RazorSenseChatBackground {...props}>
    <textarea placeholder="Ask anything..." />
  </RazorSenseChatBackground>
);

const stillOf = (container: HTMLElement): HTMLImageElement => {
  const still = container.querySelector<HTMLImageElement>(
    '[data-blade-component="razorsense-chat-background"] img',
  );
  if (!still) throw new Error('its still has not loaded yet');
  return still;
};

describe('RazorSenseChatBackground: the states on its still (jsdom has no WebGL2)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isOffline', () => {
    it('fades its still away over 1 s, and back to false brings it back over 1 s', async () => {
      const onError = jest.fn();
      const { container, update } = renderInTheme(<Landing onError={onError} />);
      const still = await waitFor(() => stillOf(container));
      // (on its still: it said so)
      expect(onError).toHaveBeenCalledTimes(1);
      expect(still.getAttribute('src')).toBe('still:chatBackground');
      expect(still.style.opacity).toBe('1');
      expect(still.style.transition).toBe('opacity 1s');

      update(<Landing onError={onError} isOffline />);
      expect(still.style.opacity).toBe('0');
      expect(still.style.transition).toBe('opacity 1s');
      // (it fades: still there, the same picture)
      expect(stillOf(container)).toBe(still);
      expect(still.getAttribute('src')).toBe('still:chatBackground');

      update(<Landing onError={onError} isOffline={false} />);
      expect(still.style.opacity).toBe('1');
      expect(still.style.transition).toBe('opacity 1s');
      await flushImports();
    });

    it('turns round mid-way from where it is: the same still, its opacity transition kept both ways', async () => {
      const { container, update } = renderInTheme(<Landing />);
      const still = await waitFor(() => stillOf(container));

      // offline and straight back, before its fade could end: the element isn't made again (that would jump to the end), so
      // the browser turns its running opacity transition round from the opacity it's at
      update(<Landing isOffline />);
      const goingOpacity = still.style.opacity;
      update(<Landing isOffline={false} />);
      expect(stillOf(container)).toBe(still);
      expect(goingOpacity).toBe('0');
      expect(still.style.opacity).toBe('1');
      expect(still.style.transition).toBe('opacity 1s');
      // and the other way round
      update(<Landing isOffline />);
      expect(stillOf(container)).toBe(still);
      expect(still.style.opacity).toBe('0');
      expect(still.style.transition).toBe('opacity 1s');
      await flushImports();
    });
  });

  describe('isListening and voiceStream', () => {
    it('listening, its still is the voice dashboard’s; back to false, its own', async () => {
      const { container, update } = renderInTheme(<Landing />);
      const still = await waitFor(() => stillOf(container));
      expect(still.getAttribute('src')).toBe('still:chatBackground');

      update(<Landing isListening />);
      await waitFor(() => expect(still.getAttribute('src')).toBe('still:voiceDashboard'));
      // (the same element: only its picture changes)
      expect(stillOf(container)).toBe(still);
      expect(still.style.opacity).toBe('1');

      update(<Landing isListening={false} />);
      expect(still.getAttribute('src')).toBe('still:chatBackground');
      await flushImports();
    });

    it('offline wins over listening: the voice still goes at once and it fades away; back online, the voice still at once', async () => {
      const { container, update } = renderInTheme(<Landing isListening />);
      await waitFor(() =>
        expect(stillOf(container).getAttribute('src')).toBe('still:voiceDashboard'),
      );
      const still = stillOf(container);

      update(<Landing isListening isOffline />);
      expect(still.getAttribute('src')).toBe('still:chatBackground');
      expect(still.style.opacity).toBe('0');

      // (already loaded: no wait for it)
      update(<Landing isListening isOffline={false} />);
      expect(still.getAttribute('src')).toBe('still:voiceDashboard');
      expect(still.style.opacity).toBe('1');
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
        const { container, update } = renderInTheme(<Landing voiceStream={mic.stream} />);
        // given while not listening, then listening, offline, and not listening again
        await waitFor(() => stillOf(container));
        update(<Landing voiceStream={mic.stream} isListening />);
        await waitFor(() =>
          expect(stillOf(container).getAttribute('src')).toBe('still:voiceDashboard'),
        );
        update(<Landing voiceStream={mic.stream} isListening isOffline />);
        update(<Landing voiceStream={mic.stream} />);
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

  it('inside a RazorSenseChat, draws nothing for its states either (the chat draws)', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const mic = makeStream();
    const onError = jest.fn();
    const { container } = renderInTheme(
      <RazorSenseChat>
        <Landing isListening voiceStream={mic.stream} onError={onError} />
        <RazorSenseBottomWave>
          <textarea />
        </RazorSenseBottomWave>
      </RazorSenseChat>,
    );
    await flushImports();
    expect(
      container.querySelector('[data-blade-component="razorsense-chat-background"] img'),
    ).toBeNull();
    // (it never tried to draw: nothing to fail)
    expect(onError).not.toHaveBeenCalled();
    expect(container.querySelector('textarea[placeholder="Ask anything..."]')).toBeInTheDocument();
  });

  it('forwards ref, className, style and testID to its root, with the states set', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const mic = makeStream();
    const { getByTestId, getByPlaceholderText } = renderInTheme(
      <RazorSenseChatBackground
        ref={ref}
        className="landing"
        style={{ zIndex: 5 }}
        testID="landing"
        isOffline
        isListening
        voiceStream={mic.stream}
      >
        <textarea placeholder="Ask anything..." />
      </RazorSenseChatBackground>,
    );
    const root = getByTestId('landing');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('data-blade-component', 'razorsense-chat-background');
    expect(root.className).toBe('landing');
    expect(root.style.zIndex).toBe('5');
    // (its own styles kept under what's given)
    expect(root.style.position).toBe('relative');
    expect(root.style.isolation).toBe('isolate');
    expect(root.contains(getByPlaceholderText('Ask anything...'))).toBe(true);
    await flushImports();
  });
});
