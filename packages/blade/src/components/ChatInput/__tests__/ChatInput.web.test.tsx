import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
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

  describe('size="small"', () => {
    beforeAll(() => {
      // jsdom has no Element.scrollTo; ChatInput scrolls the file previews to the newest file
      Element.prototype.scrollTo = jest.fn();
    });

    it('should render a single-row text area with inline upload and submit buttons', () => {
      const { container, getByRole, queryByText } = renderWithTheme(
        <ChatInput
          size="small"
          placeholder="Ask a question..."
          accessibilityLabel={accessibilityLabel}
        />,
      );

      expect(getByRole('textbox', { name: accessibilityLabel })).toHaveAttribute('rows', '1');
      expect(getByRole('button', { name: 'Upload file' })).toBeEnabled();
      expect(getByRole('button', { name: 'Submit' })).toBeDisabled();
      // the "Upload file" text link of the medium action bar is not rendered
      expect(queryByText('Upload file')).toBeNull();
      expect(container).toMatchSnapshot();
    });

    it('should keep the medium layout by default', () => {
      const { getByRole, getByText } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} />,
      );

      expect(getByRole('textbox', { name: accessibilityLabel })).toHaveAttribute('rows', '2');
      expect(getByText('Upload file')).toBeInTheDocument();
    });

    it('should submit with the inline button and with Enter, and add a newline on Shift+Enter', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      const { getByRole } = renderWithTheme(
        <ChatInput size="small" accessibilityLabel={accessibilityLabel} onSubmit={onSubmit} />,
      );

      const textarea = getByRole('textbox', { name: accessibilityLabel });
      await user.type(textarea, 'Hello{shift>}{enter}{/shift}world');
      expect(onSubmit).not.toHaveBeenCalled();
      expect(textarea).toHaveValue('Hello\nworld');

      await user.click(getByRole('button', { name: 'Submit' }));
      expect(onSubmit).toHaveBeenLastCalledWith({ value: 'Hello\nworld', fileList: [] });

      await user.type(textarea, '{enter}');
      expect(onSubmit).toHaveBeenCalledTimes(2);
    });

    it('should open the file picker from the inline upload button and show the attached file', async () => {
      const user = userEvent.setup();
      const onFileChange = jest.fn();
      const onSubmit = jest.fn();

      const { container, getByRole, getByText } = renderWithTheme(
        <ChatInput
          size="small"
          accessibilityLabel={accessibilityLabel}
          accept=".pdf"
          onFileChange={onFileChange}
          onSubmit={onSubmit}
        />,
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = jest.spyOn(fileInput, 'click');
      await user.click(getByRole('button', { name: 'Upload file' }));
      expect(clickSpy).toHaveBeenCalledTimes(1);

      const file = new File(['content'], 'business-pan.pdf', { type: 'application/pdf' });
      await user.upload(fileInput, file);

      expect(onFileChange).toHaveBeenCalledWith({
        fileList: [expect.objectContaining({ name: 'business-pan.pdf' })],
      });
      expect(getByText('business-pan.pdf')).toBeInTheDocument();

      await user.click(getByRole('button', { name: 'Submit' }));
      expect(onSubmit).toHaveBeenCalledWith({
        value: '',
        fileList: [expect.objectContaining({ name: 'business-pan.pdf' })],
      });
    });

    it('should attach a pasted image', () => {
      const onFileChange = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatInput
          size="small"
          accessibilityLabel={accessibilityLabel}
          onFileChange={onFileChange}
        />,
      );

      const image = new File(['image'], 'pasted.png', { type: 'image/png' });
      fireEvent.paste(getByRole('textbox', { name: accessibilityLabel }), {
        clipboardData: { files: [image] },
      });

      expect(onFileChange).toHaveBeenCalledWith({
        fileList: [expect.objectContaining({ name: 'pasted.png' })],
      });
    });

    it('should hide the inline upload button when hideFileUpload is true', () => {
      const { queryByRole } = renderWithTheme(
        <ChatInput size="small" accessibilityLabel={accessibilityLabel} hideFileUpload />,
      );

      expect(queryByRole('button', { name: 'Upload file' })).toBeNull();
      expect(queryByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should show the inline stop button while generating and call onStop', async () => {
      const user = userEvent.setup();
      const onStop = jest.fn();
      const onSubmit = jest.fn();

      const { getByRole, queryByRole } = renderWithTheme(
        <ChatInput
          size="small"
          accessibilityLabel={accessibilityLabel}
          defaultValue="Hello"
          isGenerating
          onStop={onStop}
          onSubmit={onSubmit}
        />,
      );

      expect(queryByRole('button', { name: 'Submit' })).toBeNull();
      await user.click(getByRole('button', { name: 'Stop generation' }));
      expect(onStop).toHaveBeenCalledTimes(1);
    });

    it('should disable the text area and both inline buttons when isDisabled is true', () => {
      const { getByRole } = renderWithTheme(
        <ChatInput
          size="small"
          accessibilityLabel={accessibilityLabel}
          defaultValue="Hello"
          isDisabled
        />,
      );

      expect(getByRole('textbox', { name: accessibilityLabel })).toBeDisabled();
      expect(getByRole('button', { name: 'Upload file' })).toBeDisabled();
      expect(getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    it('should accept a ghost suggestion with Tab', async () => {
      const user = userEvent.setup();
      const onSuggestionAccept = jest.fn();
      const suggestions = ['Show me recent transactions'];

      const { getByRole } = renderWithTheme(
        <ChatInput
          size="small"
          accessibilityLabel={accessibilityLabel}
          suggestions={suggestions}
          onSuggestionAccept={onSuggestionAccept}
        />,
      );

      const textarea = getByRole('textbox', { name: accessibilityLabel });
      await user.click(textarea);
      await user.keyboard('{Tab}');

      expect(onSuggestionAccept).toHaveBeenCalledWith({ suggestion: suggestions[0] });
      expect(textarea).toHaveValue(suggestions[0]);
    });

    it('should show the validation error and call onErrorDismiss', async () => {
      const user = userEvent.setup();
      const onErrorDismiss = jest.fn();

      const { getByRole } = renderWithTheme(
        <ChatInput
          size="small"
          accessibilityLabel={accessibilityLabel}
          validationState="error"
          errorText="Something went wrong"
          onErrorDismiss={onErrorDismiss}
        />,
      );

      expect(getByRole('alert')).toHaveTextContent('Something went wrong');
      await user.click(getByRole('button', { name: 'Dismiss error' }));
      expect(onErrorDismiss).toHaveBeenCalledTimes(1);
    });

    it('should pass data-analytics attributes to the text area', () => {
      const { getByRole } = renderWithTheme(
        <ChatInput
          size="small"
          accessibilityLabel={accessibilityLabel}
          data-analytics-name="chat-composer"
        />,
      );

      expect(getByRole('textbox', { name: accessibilityLabel })).toHaveAttribute(
        'data-analytics-name',
        'chat-composer',
      );
    });

    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(
        <ChatInput
          size="small"
          accessibilityLabel={accessibilityLabel}
          placeholder="Ask a question..."
        />,
      );
      await assertAccessible(container);
    });
  });
});
