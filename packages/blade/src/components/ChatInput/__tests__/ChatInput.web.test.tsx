import userEvent from '@testing-library/user-event';
import React from 'react';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import { ChatInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

const accessibilityLabel = 'Chat input';

describe('<ChatInput />', () => {
  it('should render ChatInput', () => {
    const { container } = renderWithTheme(
      <ChatInput placeholder="Ask a question..." accessibilityLabel={accessibilityLabel} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should call onSubmit with value when submit button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    const { getByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} onSubmit={onSubmit} />,
    );

    const textarea = getByRole('textbox', { name: accessibilityLabel });
    await user.type(textarea, 'Hello world');

    const submitButton = getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({ value: 'Hello world', fileList: [] });
  });

  it('should call onSubmit when Enter is pressed and NOT submit on Shift+Enter', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    const { getByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} onSubmit={onSubmit} />,
    );

    const textarea = getByRole('textbox', { name: accessibilityLabel });
    await user.type(textarea, 'Hello{shift>}{enter}{/shift}');
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(textarea, '{enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should keep submit button disabled when input is empty', () => {
    const { getByRole } = renderWithTheme(<ChatInput accessibilityLabel={accessibilityLabel} />);

    expect(getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('should keep submit button disabled when a file is in error state', () => {
    const file = new File(['content'], 'test.png', { type: 'image/png' });
    Object.assign(file, { id: 'file-1', status: 'error' });

    const { getByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} fileList={[file as never]} />,
    );

    expect(getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('should enable submit button when files exist and none are in error state', () => {
    const file = new File(['content'], 'test.png', { type: 'image/png' });
    Object.assign(file, { id: 'file-1', status: 'success' });

    const { getByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} fileList={[file as never]} />,
    );

    expect(getByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  it('should show stop button when isGenerating is true and call onStop', async () => {
    const user = userEvent.setup();
    const onStop = jest.fn();

    const { getByRole, queryByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} isGenerating onStop={onStop} />,
    );

    expect(queryByRole('button', { name: 'Submit' })).toBeNull();
    const stopButton = getByRole('button', { name: 'Stop generation' });
    await user.click(stopButton);
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('should show ghost suggestion and accept it via Tab key', async () => {
    const user = userEvent.setup();
    const onSuggestionAccept = jest.fn();
    const suggestions = ['Show me recent transactions'];

    const { getByRole, getByText } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        suggestions={suggestions}
        onSuggestionAccept={onSuggestionAccept}
      />,
    );

    expect(getByText('Show me recent transactions')).toBeTruthy();

    const textarea = getByRole('textbox', { name: accessibilityLabel });
    await user.click(textarea);
    await user.keyboard('{Tab}');

    expect(onSuggestionAccept).toHaveBeenCalledWith({ suggestion: suggestions[0] });
    expect(textarea).toHaveValue(suggestions[0]);
  });

  it('should call onFileRemove when a file is removed from preview', async () => {
    const user = userEvent.setup();
    const onFileRemove = jest.fn();

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    Object.assign(file, { id: 'file-1' });

    const { getByRole } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        fileList={[file as never]}
        onFileRemove={onFileRemove}
      />,
    );

    const removeButton = getByRole('button', { name: /remove/i });
    await user.click(removeButton);

    expect(onFileRemove).toHaveBeenCalledWith({
      file: expect.objectContaining({ name: 'test.png' }),
    });
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} testID="chat-input-test" />,
    );
    expect(getByTestId('chat-input-test')).toBeTruthy();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} placeholder="Ask a question..." />,
    );
    await assertAccessible(container);
  });
});

describe('ChatInput ambient border', () => {
  it.each(['light', 'dark'] as const)(
    'uses the %s theme without changing its controls',
    async (colorScheme) => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      const { getByRole, container } = renderWithTheme(
        <BladeProvider themeTokens={bladeTheme} colorScheme={colorScheme}>
          <ChatInput borderEffect="ambient" onSubmit={onSubmit} />
        </BladeProvider>,
      );
      const decoration = container.querySelector('span[aria-hidden="true"]');
      expect(decoration).toBeInTheDocument();
      expect(decoration).toHaveStyle({ pointerEvents: 'none' });
      await user.type(getByRole('textbox'), 'Hello{enter}');
      expect(onSubmit).toHaveBeenCalledWith({ value: 'Hello', fileList: [] });
      await assertAccessible(container);
    },
  );

  it.each([
    {},
    { borderEffect: 'none' as const },
    { borderEffect: 'ambient' as const, isDisabled: true },
    { borderEffect: 'ambient' as const, validationState: 'error' as const, errorText: 'Try again' },
  ])('does not decorate default, disabled, or error states (%o)', (props) => {
    const { container } = renderWithTheme(<ChatInput {...props} />);
    expect(container.querySelector('span[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('preserves the input and focus when the effect is toggled', async () => {
    const user = userEvent.setup();
    const { getByRole, rerender } = renderWithTheme(<ChatInput />);
    const input = getByRole('textbox');
    await user.type(input, 'Keep this draft');
    rerender(
      <BladeProvider themeTokens={bladeTheme}>
        <ChatInput borderEffect="ambient" />
      </BladeProvider>,
    );
    expect(getByRole('textbox')).toBe(input);
    expect(input).toHaveFocus();
    expect(input).toHaveValue('Keep this draft');
    rerender(
      <BladeProvider themeTokens={bladeTheme}>
        <ChatInput borderEffect="none" />
      </BladeProvider>,
    );
    expect(getByRole('textbox')).toBe(input);
    expect(input).toHaveFocus();
  });

  it('keeps generation stop and file upload behavior with an ambient outline', async () => {
    const user = userEvent.setup();
    const onStop = jest.fn();
    const onFileChange = jest.fn();
    const { getByRole, container } = renderWithTheme(
      <ChatInput borderEffect="ambient" isGenerating onStop={onStop} onFileChange={onFileChange} />,
    );
    await user.click(getByRole('button', { name: 'Stop generation' }));
    expect(onStop).toHaveBeenCalledTimes(1);
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const previewScroll = jest.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      value: previewScroll,
      configurable: true,
    });
    try {
      await user.upload(container.querySelector('input[type="file"]') as HTMLInputElement, file);
    } finally {
      Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo');
    }
    expect(onFileChange).toHaveBeenCalledWith({
      fileList: [expect.objectContaining({ name: 'test.txt' })],
    });
  });
});
