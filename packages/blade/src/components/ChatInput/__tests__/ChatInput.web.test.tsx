import userEvent from '@testing-library/user-event';
import React from 'react';
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
