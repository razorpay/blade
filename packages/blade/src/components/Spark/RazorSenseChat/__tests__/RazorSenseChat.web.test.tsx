import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { RazorSenseChat, RazorSenseThinking, RazorSenseBottomWave } from '../index';
import { RazorSenseChatBackground } from '../../RazorSenseChatBackground';
import { RazorSenseLoader } from '../../RazorSenseLoader';
import { ChatMessage } from '~components/ChatMessage';
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
        <RazorSenseChat ref={refs.chat} className="chat" style={{ zIndex: 2 }} onError={onError}>
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

  it('think while a RazorSenseThinking is shown, and surge to the bottom wave once it goes', async () => {
    // (jsdom has no WebGL2: the chat shows its stills, the thinking one only while thinking)
    const Chat = (): React.ReactElement => {
      const [isWaiting, setIsWaiting] = React.useState(true);
      return (
        <>
          <button onClick={() => setIsWaiting(!isWaiting)}>Toggle</button>
          <RazorSenseChat>
            {isWaiting ? <RazorSenseThinking>Searching…</RazorSenseThinking> : <p>The answer</p>}
            <RazorSenseBottomWave>
              <textarea />
            </RazorSenseBottomWave>
          </RazorSenseChat>
        </>
      );
    };
    const { container, getByRole } = renderWithTheme(<Chat />);
    const stills = (): HTMLImageElement[] =>
      Array.from(container.querySelectorAll('[data-blade-component="razorsense-chat"] img'));
    await waitFor(() => expect(stills()).toHaveLength(2));
    const opacities = (): string[] => stills().map((still) => still.style.opacity);
    expect(opacities()).toEqual(['1', '0']);
    fireEvent.click(getByRole('button', { name: 'Toggle' }));
    expect(opacities()).toEqual(['0', '1']);
    fireEvent.click(getByRole('button', { name: 'Toggle' }));
    expect(opacities()).toEqual(['1', '0']);
  });

  it('think while a ChatMessage inside is loading, showing its loading text as the thinking label', async () => {
    const Chat = (): React.ReactElement => {
      const [isLoading, setIsLoading] = React.useState(true);
      return (
        <>
          <button onClick={() => setIsLoading(!isLoading)}>Toggle</button>
          <RazorSenseChat>
            <ChatMessage senderType="self">How is my business doing?</ChatMessage>
            <ChatMessage
              senderType="other"
              isLoading={isLoading}
              loadingText={['Thinking...', 'Processing your request...']}
            >
              Your payments are up 12%.
            </ChatMessage>
            <RazorSenseBottomWave>
              <textarea />
            </RazorSenseBottomWave>
          </RazorSenseChat>
        </>
      );
    };
    const { container, getByRole, getByText, queryByText } = renderWithTheme(<Chat />);
    const stills = (): HTMLImageElement[] =>
      Array.from(container.querySelectorAll('[data-blade-component="razorsense-chat"] img'));
    await waitFor(() => expect(stills()).toHaveLength(2));
    const opacities = (): string[] => stills().map((still) => still.style.opacity);
    // loading: its loading text is the thinking label, and the chat thinks
    expect(
      getByText('Thinking...').closest('[data-blade-component="razorsense-thinking"]'),
    ).toBeInTheDocument();
    expect(opacities()).toEqual(['1', '0']);
    // done: the answer shows and the thinking has gone down to the bottom wave
    fireEvent.click(getByRole('button', { name: 'Toggle' }));
    expect(getByText('Your payments are up 12%.')).toBeInTheDocument();
    expect(queryByText('Thinking...')).not.toBeInTheDocument();
    expect(opacities()).toEqual(['0', '1']);
    // the user's own message never thinks, loading or not
    expect(container.querySelectorAll('[data-blade-component="razorsense-thinking"]')).toHaveLength(
      0,
    );
  });

  it('show JSX children as one label, and roll only through texts', () => {
    const count = 3;
    const { getByText, unmount } = renderWithTheme(
      <RazorSenseThinking>Searching {count} settlements…</RazorSenseThinking>,
    );
    expect(getByText('Searching 3 settlements…')).toBeInTheDocument();
    unmount();
    const { getByText: getRolling } = renderWithTheme(
      <RazorSenseThinking texts={['Thinking...', 'Processing your request...']} />,
    );
    expect(getRolling('Thinking...')).toBeInTheDocument();
  });

  it('keep thinking while any of several thinking labels is still shown', async () => {
    const Chat = (): React.ReactElement => {
      const [shown, setShown] = React.useState({ label: true, message: true });
      return (
        <>
          <button onClick={() => setShown({ ...shown, message: false })}>Answer</button>
          <button onClick={() => setShown({ ...shown, label: false })}>Done</button>
          <RazorSenseChat>
            {shown.label ? <RazorSenseThinking>Searching…</RazorSenseThinking> : null}
            <ChatMessage senderType="other" isLoading={shown.message} loadingText="Thinking...">
              Answer
            </ChatMessage>
            <RazorSenseBottomWave>
              <textarea />
            </RazorSenseBottomWave>
          </RazorSenseChat>
        </>
      );
    };
    const { container, getByRole } = renderWithTheme(<Chat />);
    const stills = (): HTMLImageElement[] =>
      Array.from(container.querySelectorAll('[data-blade-component="razorsense-chat"] img'));
    await waitFor(() => expect(stills()).toHaveLength(2));
    const opacities = (): string[] => stills().map((still) => still.style.opacity);
    expect(opacities()).toEqual(['1', '0']);
    // the later one goes: the other is still up, so it still thinks
    fireEvent.click(getByRole('button', { name: 'Answer' }));
    expect(opacities()).toEqual(['1', '0']);
    // the last one goes: now it surges down
    fireEvent.click(getByRole('button', { name: 'Done' }));
    expect(opacities()).toEqual(['0', '1']);
  });

  it('leave a loading ChatMessage outside a RazorSenseChat as it is', () => {
    const { container, getByText } = renderWithTheme(
      <ChatMessage senderType="other" isLoading loadingText="Thinking...">
        Done
      </ChatMessage>,
    );
    expect(getByText('Thinking...')).toBeInTheDocument();
    expect(container.querySelector('[data-blade-component="razorsense-thinking"]')).toBeNull();
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
