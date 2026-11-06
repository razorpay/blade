import React from 'react';
import { waitFor } from '@testing-library/react';
import { RazorSenseChat, RazorSenseThinking, RazorSenseBottomWave } from '../index';
import { RazorSenseChatBackground } from '../../RazorSenseChatBackground';
import { RazorSenseLoader } from '../../RazorSenseLoader';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

// jsdom has no WebGL2: every component goes to its still and says so through onError, which is what these check, with the root
// element's ref, className and style
describe('RazorSense 2.0 components', () => {
  it('forward ref, className and style to their root, and fall back without WebGL2', async () => {
    const refs = {
      loader: React.createRef<HTMLDivElement>(),
      background: React.createRef<HTMLDivElement>(),
      chat: React.createRef<HTMLDivElement>(),
      thinking: React.createRef<HTMLDivElement>(),
      wave: React.createRef<HTMLDivElement>(),
    };
    const onError = jest.fn();
    const { getByText, getByPlaceholderText } = renderWithTheme(
      <>
        <RazorSenseLoader
          ref={refs.loader}
          className="loader"
          style={{ zIndex: 3 }}
          onError={onError}
        />
        <RazorSenseChatBackground ref={refs.background} className="background" onError={onError}>
          <input placeholder="landing" />
        </RazorSenseChatBackground>
        <RazorSenseChat
          ref={refs.chat}
          className="chat"
          style={{ zIndex: 2 }}
          isThinking
          onError={onError}
        >
          <RazorSenseThinking ref={refs.thinking} className="thinking">
            Searching your settlements…
          </RazorSenseThinking>
          <RazorSenseBottomWave ref={refs.wave} className="wave">
            <input placeholder="chat" />
          </RazorSenseBottomWave>
        </RazorSenseChat>
      </>,
    );

    expect(refs.loader.current?.className).toBe('loader');
    expect(refs.loader.current?.style.zIndex).toBe('3');
    expect(refs.background.current?.className).toBe('background');
    expect(refs.background.current?.contains(getByPlaceholderText('landing'))).toBe(true);
    expect(refs.chat.current?.className).toBe('chat');
    expect(refs.chat.current?.style.zIndex).toBe('2');
    expect(refs.thinking.current?.className).toBe('thinking');
    expect(refs.thinking.current?.contains(getByText('Searching your settlements…'))).toBe(true);
    expect(refs.wave.current?.className).toBe('wave');
    expect(refs.wave.current?.contains(getByPlaceholderText('chat'))).toBe(true);

    // the loader, the chat background and the chat (its thinking and wave draw through it)
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(3));
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('pause the thinking label’s shimmer with isPaused (in a chat, the chat’s)', () => {
    const { getByText, unmount } = renderWithTheme(
      <>
        <RazorSenseThinking isPaused>Paused</RazorSenseThinking>
        <RazorSenseThinking>Running</RazorSenseThinking>
      </>,
    );
    const playState = (element: HTMLElement): string =>
      getComputedStyle(element).animationPlayState;
    expect(playState(getByText('Paused'))).toBe('paused');
    expect(playState(getByText('Running'))).toBe('running');
    unmount();
    const { getByText: getInChat } = renderWithTheme(
      <RazorSenseChat isPaused>
        <RazorSenseThinking>In a paused chat</RazorSenseThinking>
      </RazorSenseChat>,
    );
    expect(playState(getInChat('In a paused chat'))).toBe('paused');
  });

  it('warn when a part inside RazorSenseChat is given props the chat takes over', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    renderWithTheme(
      <RazorSenseChat>
        <RazorSenseThinking scale={1.2}>Searching…</RazorSenseThinking>
        <RazorSenseBottomWave isPaused onError={() => undefined}>
          <textarea />
        </RazorSenseBottomWave>
      </RazorSenseChat>,
    );
    const messages = warn.mock.calls.map(([message]) => String(message));
    expect(messages).toContain(
      "[Blade: RazorSenseThinking]: Inside RazorSenseChat the chat draws it, so its own scale doesn't apply: set it on RazorSenseChat instead.",
    );
    expect(messages).toContain(
      "[Blade: RazorSenseBottomWave]: Inside RazorSenseChat the chat draws it, so its own isPaused, onError don't apply: set them on RazorSenseChat instead.",
    );
    // on their own they're theirs: no warning
    warn.mockClear();
    renderWithTheme(<RazorSenseThinking scale={1.2}>Searching…</RazorSenseThinking>);
    expect(warn.mock.calls.map(([message]) => String(message)).join()).not.toContain(
      'Inside RazorSenseChat',
    );
    warn.mockRestore();
  });
});
