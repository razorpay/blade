import userEvent from '@testing-library/user-event';
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import { ChatInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

const accessibilityLabel = 'Chat input';

const originalScrollTo = Element.prototype.scrollTo;

beforeAll(() => {
  // jsdom has no Element.scrollTo; ChatInput scrolls the file previews to the newest file
  Element.prototype.scrollTo = jest.fn();
});

afterAll(() => {
  Element.prototype.scrollTo = originalScrollTo;
});

const createFile = (
  name: string,
  status?: 'success' | 'error' | 'uploading',
): File & { id: string; status?: string } => {
  const file = new File(['content'], name, { type: 'image/png' });
  return Object.assign(file, { id: name, status });
};

describe('<ChatInput />', () => {
  it('should render ChatInput', () => {
    const { container } = renderWithTheme(
      <ChatInput placeholder="Ask a question..." accessibilityLabel={accessibilityLabel} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render ChatInput with size small', () => {
    const { container } = renderWithTheme(
      <ChatInput
        size="small"
        placeholder="Ask a question..."
        accessibilityLabel={accessibilityLabel}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  describe('layout', () => {
    it('should render a two-row text area and an "Upload file" link by default', () => {
      const { getByRole, getByText } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} />,
      );

      expect(getByRole('textbox', { name: accessibilityLabel })).toHaveAttribute('rows', '2');
      expect(getByText('Upload file')).toBeInTheDocument();
    });

    it('should render a one-row text area with an icon-only upload button when size is small', () => {
      const { getByRole, queryByText } = renderWithTheme(
        <ChatInput size="small" accessibilityLabel={accessibilityLabel} />,
      );

      expect(getByRole('textbox', { name: accessibilityLabel })).toHaveAttribute('rows', '1');
      expect(getByRole('button', { name: 'Upload file' })).toBeInTheDocument();
      expect(queryByText('Upload file')).toBeNull();
    });
  });

  describe('text area height', () => {
    const OriginalResizeObserver = window.ResizeObserver;
    let resizeCallback: () => void = () => undefined;

    beforeEach(() => {
      window.ResizeObserver = (class {
        constructor(callback: () => void) {
          resizeCallback = callback;
        }

        observe = jest.fn();

        unobserve = jest.fn();

        disconnect = jest.fn();
      } as unknown) as typeof ResizeObserver;
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        callback(0);
        return 0;
      });
    });

    afterEach(() => {
      window.ResizeObserver = OriginalResizeObserver;
      jest.restoreAllMocks();
    });

    const setLayout = (
      textarea: HTMLElement,
      { width, scrollHeight }: { width: number; scrollHeight: number },
    ): void => {
      Object.defineProperty(textarea, 'clientWidth', { configurable: true, value: width });
      Object.defineProperty(textarea, 'scrollHeight', { configurable: true, value: scrollHeight });
    };

    it('should re-measure when the text area gets narrower and the text wraps', () => {
      const { getByRole } = renderWithTheme(
        <ChatInput size="small" accessibilityLabel={accessibilityLabel} defaultValue="Hello" />,
      );
      const textarea = getByRole('textbox', { name: accessibilityLabel });

      setLayout(textarea, { width: 200, scrollHeight: 72 });
      act(() => resizeCallback());

      expect(textarea.style.height).toBe('72px');
    });

    it('should not re-measure when only the height changed', () => {
      const { getByRole } = renderWithTheme(
        <ChatInput size="small" accessibilityLabel={accessibilityLabel} defaultValue="Hello" />,
      );
      const textarea = getByRole('textbox', { name: accessibilityLabel });
      const heightAfterMount = textarea.style.height;

      setLayout(textarea, { width: textarea.clientWidth, scrollHeight: 72 });
      act(() => resizeCallback());

      expect(textarea.style.height).toBe(heightAfterMount);
    });
  });

  // Every behaviour below must be the same in both sizes
  describe.each(['medium', 'small'] as const)('size="%s"', (size) => {
    it('should call onSubmit with value when submit button is clicked', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      const { getByRole } = renderWithTheme(
        <ChatInput size={size} accessibilityLabel={accessibilityLabel} onSubmit={onSubmit} />,
      );

      await user.type(getByRole('textbox', { name: accessibilityLabel }), 'Hello world');
      await user.click(getByRole('button', { name: 'Submit' }));

      expect(onSubmit).toHaveBeenCalledWith({ value: 'Hello world', fileList: [] });
    });

    it('should call onSubmit when Enter is pressed and add a new line on Shift+Enter', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      const { getByRole } = renderWithTheme(
        <ChatInput size={size} accessibilityLabel={accessibilityLabel} onSubmit={onSubmit} />,
      );

      const textarea = getByRole('textbox', { name: accessibilityLabel });
      await user.type(textarea, 'Hello{shift>}{enter}{/shift}world');
      expect(onSubmit).not.toHaveBeenCalled();
      expect(textarea).toHaveValue('Hello\nworld');

      await user.type(textarea, '{enter}');
      expect(onSubmit).toHaveBeenCalledWith({ value: 'Hello\nworld', fileList: [] });
    });

    it('should keep submit button disabled when input is empty', () => {
      const { getByRole } = renderWithTheme(
        <ChatInput size={size} accessibilityLabel={accessibilityLabel} />,
      );

      expect(getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    it.each(['error', 'uploading'] as const)(
      'should keep submit button disabled when a file is %s',
      (status) => {
        const { getByRole } = renderWithTheme(
          <ChatInput
            size={size}
            accessibilityLabel={accessibilityLabel}
            fileList={[createFile('test.png', status) as never]}
          />,
        );

        expect(getByRole('button', { name: 'Submit' })).toBeDisabled();
      },
    );

    it('should enable submit button when files exist and none are in error state', () => {
      const { getByRole } = renderWithTheme(
        <ChatInput
          size={size}
          accessibilityLabel={accessibilityLabel}
          fileList={[createFile('test.png', 'success') as never]}
        />,
      );

      expect(getByRole('button', { name: 'Submit' })).toBeEnabled();
    });

    it('should show stop button when isGenerating is true and call onStop', async () => {
      const user = userEvent.setup();
      const onStop = jest.fn();

      const { getByRole, queryByRole } = renderWithTheme(
        <ChatInput
          size={size}
          accessibilityLabel={accessibilityLabel}
          isGenerating
          onStop={onStop}
        />,
      );

      expect(queryByRole('button', { name: 'Submit' })).toBeNull();
      await user.click(getByRole('button', { name: 'Stop generation' }));
      expect(onStop).toHaveBeenCalledTimes(1);
    });

    it('should show ghost suggestion and accept it via Tab key', async () => {
      const user = userEvent.setup();
      const onSuggestionAccept = jest.fn();
      const suggestions = ['Show me recent transactions'];

      const { getByRole, getByText } = renderWithTheme(
        <ChatInput
          size={size}
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

    it('should open the file picker from the upload button and attach the picked file', async () => {
      const user = userEvent.setup();
      const onFileChange = jest.fn();
      const onSubmit = jest.fn();

      const { container, getByRole, getByText } = renderWithTheme(
        <ChatInput
          size={size}
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
          size={size}
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

    it('should call onFileRemove when a file is removed from preview', async () => {
      const user = userEvent.setup();
      const onFileRemove = jest.fn();

      const { getByRole } = renderWithTheme(
        <ChatInput
          size={size}
          accessibilityLabel={accessibilityLabel}
          fileList={[createFile('test.png') as never]}
          onFileRemove={onFileRemove}
        />,
      );

      await user.click(getByRole('button', { name: /remove/i }));

      expect(onFileRemove).toHaveBeenCalledWith({
        file: expect.objectContaining({ name: 'test.png' }),
      });
    });

    it('should hide the upload button when hideFileUpload is true', () => {
      const { queryByRole } = renderWithTheme(
        <ChatInput size={size} accessibilityLabel={accessibilityLabel} hideFileUpload />,
      );

      expect(queryByRole('button', { name: 'Upload file' })).toBeNull();
      expect(queryByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should disable the text area, upload and submit when isDisabled is true', () => {
      const { getByRole } = renderWithTheme(
        <ChatInput
          size={size}
          accessibilityLabel={accessibilityLabel}
          defaultValue="Hello"
          isDisabled
        />,
      );

      expect(getByRole('textbox', { name: accessibilityLabel })).toBeDisabled();
      expect(getByRole('button', { name: 'Upload file' })).toBeDisabled();
      expect(getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    it('should show the validation error and call onErrorDismiss', async () => {
      const user = userEvent.setup();
      const onErrorDismiss = jest.fn();

      const { getByRole } = renderWithTheme(
        <ChatInput
          size={size}
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
          size={size}
          accessibilityLabel={accessibilityLabel}
          data-analytics-name="chat-composer"
        />,
      );

      expect(getByRole('textbox', { name: accessibilityLabel })).toHaveAttribute(
        'data-analytics-name',
        'chat-composer',
      );
    });

    it('should accept testID', () => {
      const { getByTestId } = renderWithTheme(
        <ChatInput size={size} accessibilityLabel={accessibilityLabel} testID="chat-input-test" />,
      );
      expect(getByTestId('chat-input-test')).toBeTruthy();
    });

    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(
        <ChatInput
          size={size}
          accessibilityLabel={accessibilityLabel}
          placeholder="Ask a question..."
        />,
      );
      await assertAccessible(container);
    });
  });
});
