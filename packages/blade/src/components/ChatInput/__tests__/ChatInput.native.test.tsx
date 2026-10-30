import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Text } from '~components/Typography';
import { ChatInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const accessibilityLabel = 'Chat input';

describe('<ChatInput /> (native)', () => {
  it('should render with default props', () => {
    const { toJSON } = renderWithTheme(
      <ChatInput placeholder="Ask a question..." accessibilityLabel={accessibilityLabel} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('warns once that web-only props have no effect', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { rerender } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} maxCount={3} showAmbientBorder />,
    );
    rerender(<ChatInput accessibilityLabel={accessibilityLabel} maxCount={3} showAmbientBorder />);
    const messages = warn.mock.calls.map(([message]) => String(message));
    expect(messages.filter((message) => message.includes('only work on web'))).toHaveLength(1);
    expect(messages.join(' ')).toContain('`maxCount`, `showAmbientBorder`');
    warn.mockRestore();
  });

  it('should call onSubmit with value when submit button is pressed', () => {
    const onSubmit = jest.fn();

    const { getByRole, getByLabelText } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} onSubmit={onSubmit} />,
    );

    const input = getByLabelText(accessibilityLabel);
    fireEvent.changeText(input, 'Hello world');

    const submitButton = getByRole('button', { name: 'Submit' });
    fireEvent.press(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({ value: 'Hello world', fileList: [] });
  });

  it('should hide Send until there is something to send', () => {
    const { queryByRole } = renderWithTheme(<ChatInput accessibilityLabel={accessibilityLabel} />);
    expect(queryByRole('button', { name: 'Submit', includeHiddenElements: false })).toBeNull();

    const { getAllByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} defaultValue="Hi" />,
    );
    expect(getAllByRole('button', { name: 'Submit', includeHiddenElements: false })).toHaveLength(
      1,
    );
  });

  it('should show Stop for status="streaming" and Retry for status="error"', () => {
    const onStop = jest.fn();
    const onSubmit = jest.fn();
    const { getByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} status="streaming" onStop={onStop} />,
    );
    fireEvent.press(getByRole('button', { name: 'Stop generation' }));
    expect(onStop).toHaveBeenCalledTimes(1);

    const { getByRole: getByRoleError } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        status="error"
        defaultValue="Refund pay_123"
        onSubmit={onSubmit}
      />,
    );
    fireEvent.press(getByRoleError('button', { name: 'Retry' }));
    expect(onSubmit).toHaveBeenCalledWith({ value: 'Refund pay_123', fileList: [] });
  });

  it('should not open the file picker when a promise submit resolves', async () => {
    const onFileChange = jest.fn();
    const file = { id: 'file-1', name: 'a.pdf', size: 1, status: 'success' };
    const { getByRole } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        defaultValue="Hi"
        fileList={[file as never]}
        onFileChange={onFileChange}
        onSubmit={() => Promise.resolve()}
        clearOnSubmit
      />,
    );
    fireEvent.press(getByRole('button', { name: 'Submit' }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onFileChange).not.toHaveBeenCalled();
  });

  it('should render the compact size and header', () => {
    const { toJSON, getByText } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        size="small"
        header={<Text>pay_Qx81Lm2</Text>}
      />,
    );
    expect(getByText('pay_Qx81Lm2')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show stop button when isGenerating is true and call onStop', () => {
    const onStop = jest.fn();

    const { getByRole, queryByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} isGenerating onStop={onStop} />,
    );

    expect(queryByRole('button', { name: 'Submit', includeHiddenElements: false })).toBeNull();
    const stopButton = getByRole('button', { name: 'Stop generation' });
    fireEvent.press(stopButton);
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('should display error text when validationState is error', () => {
    const { getByText, getByRole } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        validationState="error"
        errorText="Something went wrong"
      />,
    );

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByRole('alert')).toBeTruthy();
  });

  it('should call onErrorDismiss when dismiss button is pressed', () => {
    const onErrorDismiss = jest.fn();

    const { getByRole } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        validationState="error"
        errorText="Error occurred"
        onErrorDismiss={onErrorDismiss}
      />,
    );

    const dismissButton = getByRole('button', { name: 'Dismiss error' });
    fireEvent.press(dismissButton);
    expect(onErrorDismiss).toHaveBeenCalledTimes(1);
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} testID="chat-input-test" />,
    );
    expect(getByTestId('chat-input-test')).toBeTruthy();
  });

  it('should render file list when fileList is provided', () => {
    const files = [{ id: 'file-1', name: 'document.pdf', status: 'success' as const, size: 1024 }];

    const { getByText } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} fileList={files as never} />,
    );

    expect(getByText('document.pdf')).toBeTruthy();
  });

  it('should call onFileRemove when file remove button is pressed', () => {
    const onFileRemove = jest.fn();
    const files = [{ id: 'file-1', name: 'document.pdf', status: 'success' as const, size: 1024 }];

    const { getByRole } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        fileList={files as never}
        onFileRemove={onFileRemove}
      />,
    );

    const removeButton = getByRole('button', { name: 'Remove document.pdf' });
    fireEvent.press(removeButton);
    expect(onFileRemove).toHaveBeenCalledWith({
      file: expect.objectContaining({ name: 'document.pdf' }),
    });
  });

  it('should assign missing file ids and remove only the targeted file', () => {
    const onFileRemove = jest.fn();
    const files: Array<{ id?: string; name: string; status: 'success'; size: number }> = [
      { name: 'a.pdf', status: 'success', size: 1024 },
      { name: 'b.pdf', status: 'success', size: 2048 },
    ];

    const { getByRole, queryByText } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        fileList={files as never}
        onFileRemove={onFileRemove}
      />,
    );

    fireEvent.press(getByRole('button', { name: 'Remove a.pdf' }));
    fireEvent.press(getByRole('button', { name: 'Remove b.pdf' }));

    expect(onFileRemove).toHaveBeenCalledTimes(2);

    const removedA = onFileRemove.mock.calls[0][0].file;
    const removedB = onFileRemove.mock.calls[1][0].file;

    expect(removedA).toEqual(expect.objectContaining({ name: 'a.pdf' }));
    expect(removedB).toEqual(expect.objectContaining({ name: 'b.pdf' }));
    expect(removedA.id).toBeDefined();
    expect(removedB.id).toBeDefined();
    expect(removedA.id).not.toBe(removedB.id);

    // Native assigns ids on derived copies and does not mutate consumer file objects.
    expect(files[0].id).toBeUndefined();
    expect(files[1].id).toBeUndefined();
    // Controlled mode: parent still owns list after remove callbacks.
    expect(queryByText('b.pdf')).toBeTruthy();
  });

  it('should disable input when isDisabled is true', () => {
    const { toJSON } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} isDisabled />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
