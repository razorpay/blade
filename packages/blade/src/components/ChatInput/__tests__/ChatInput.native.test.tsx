import React from 'react';
import { fireEvent } from '@testing-library/react-native';
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

  it('should keep submit button disabled when input is empty', () => {
    const { getByRole } = renderWithTheme(<ChatInput accessibilityLabel={accessibilityLabel} />);

    const submitButton = getByRole('button', { name: 'Submit' });
    expect(submitButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('should show stop button when isGenerating is true and call onStop', () => {
    const onStop = jest.fn();

    const { getByRole, queryByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} isGenerating onStop={onStop} />,
    );

    expect(queryByRole('button', { name: 'Submit' })).toBeNull();
    const stopButton = getByRole('button', { name: 'Stop generation' });
    fireEvent.press(stopButton);
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('should display error text when validationState is error', () => {
    const { getByText } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        validationState="error"
        errorText="Something went wrong"
      />,
    );

    expect(getByText('Something went wrong')).toBeTruthy();
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

  it('should disable input when isDisabled is true', () => {
    const { toJSON } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} isDisabled />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
