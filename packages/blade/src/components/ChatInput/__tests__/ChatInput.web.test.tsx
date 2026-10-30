import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ChatInput } from '../index';
import { MenuItem, MenuOverlay } from '~components/Menu';
import { Tag } from '~components/Tag';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

const accessibilityLabel = 'Chat input';

describe('<ChatInput />', () => {
  beforeAll(() => {
    // jsdom has no scrollTo; the file preview strip scrolls to new files
    Element.prototype.scrollTo = jest.fn();
  });

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

  it('should hide Send until there is something to send', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} />,
    );

    expect(queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();

    await user.type(getByRole('textbox', { name: accessibilityLabel }), 'Hi');
    expect(getByRole('button', { name: 'Submit' })).toBeEnabled();
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

  describe('status', () => {
    it('shows Stop while streaming and calls onStop', async () => {
      const user = userEvent.setup();
      const onStop = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} status="streaming" onStop={onStop} />,
      );
      await user.click(getByRole('button', { name: 'Stop generation' }));
      expect(onStop).toHaveBeenCalledTimes(1);
    });

    it('lets status win over isGenerating', () => {
      const { queryByRole } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          isGenerating
          status="ready"
          defaultValue="Hi"
        />,
      );
      expect(queryByRole('button', { name: 'Stop generation' })).not.toBeInTheDocument();
      expect(queryByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('shows a disabled loader while submitted', () => {
      const { getByRole } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} status="submitted" />,
      );
      expect(getByRole('button', { name: 'Sending' })).toBeDisabled();
    });

    it('shows Retry on error, which sends again', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          status="error"
          defaultValue="Refund pay_123"
          onSubmit={onSubmit}
        />,
      );
      await user.click(getByRole('button', { name: 'Retry' }));
      expect(onSubmit).toHaveBeenCalledWith({ value: 'Refund pay_123', fileList: [] });
    });
  });

  describe('onSubmit returning a promise', () => {
    it('clears the text once the promise resolves', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn(() => Promise.resolve());
      const { getByRole } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} onSubmit={onSubmit} />,
      );
      const textarea = getByRole('textbox', { name: accessibilityLabel });
      await user.type(textarea, 'Hello{enter}');
      await waitFor(() => expect(textarea).toHaveValue(''));
    });

    it('keeps text typed while the request was in flight', async () => {
      const user = userEvent.setup();
      let resolveSend: () => void = () => undefined;
      const onSubmit = jest.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveSend = resolve;
          }),
      );
      const { getByRole } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} onSubmit={onSubmit} />,
      );
      const textarea = getByRole('textbox', { name: accessibilityLabel });
      await user.type(textarea, 'First{enter}');
      await user.type(textarea, ' and more');
      resolveSend();
      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(textarea).toHaveValue('First and more');
    });

    it('keeps the text when the promise rejects', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn(() => Promise.reject(new Error('failed')));
      const { getByRole } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} onSubmit={onSubmit} />,
      );
      const textarea = getByRole('textbox', { name: accessibilityLabel });
      await user.type(textarea, 'Hello{enter}');
      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      expect(textarea).toHaveValue('Hello');
    });

    it('never clears the text for a plain function', async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} onSubmit={jest.fn()} />,
      );
      const textarea = getByRole('textbox', { name: accessibilityLabel });
      await user.type(textarea, 'Hello{enter}');
      expect(textarea).toHaveValue('Hello');
    });
  });

  it('does not send while an input method editor is composing', () => {
    const onSubmit = jest.fn();
    const { getByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} defaultValue="ni" onSubmit={onSubmit} />,
    );
    fireEvent.keyDown(getByRole('textbox', { name: accessibilityLabel }), {
      key: 'Enter',
      isComposing: true,
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('renders header content above the text', () => {
    const { getByText } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        header={<Tag onDismiss={jest.fn()}>pay_Qx81Lm2</Tag>}
      />,
    );
    expect(getByText('pay_Qx81Lm2')).toBeInTheDocument();
  });

  it('opens actionMenu from the + button', async () => {
    const user = userEvent.setup();
    const { getByRole, findByText } = renderWithTheme(
      <ChatInput
        accessibilityLabel={accessibilityLabel}
        actionMenu={
          <MenuOverlay>
            <MenuItem title="Upload files" />
          </MenuOverlay>
        }
      />,
    );
    await user.click(getByRole('button', { name: 'Add files and more' }));
    expect(await findByText('Upload files')).toBeInTheDocument();
  });

  describe('slash commands', () => {
    const commands = [
      { value: 'refund', label: '/refund', description: 'Refund a payment' },
      { value: 'report', label: '/report' },
      { value: 'link', label: '/resend-link' },
    ];

    it('filters the list as you type and picks with the keyboard', async () => {
      const user = userEvent.setup();
      const onCommandSelect = jest.fn();
      const onSubmit = jest.fn();
      const { getByRole, getAllByRole, queryByRole } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          commands={commands}
          onCommandSelect={onCommandSelect}
          onSubmit={onSubmit}
        />,
      );
      const textarea = getByRole('textbox', { name: accessibilityLabel });
      await user.type(textarea, '/re');
      expect(getByRole('listbox', { name: 'Commands' })).toBeInTheDocument();
      expect(getAllByRole('option')).toHaveLength(3);

      await user.type(textarea, 'p');
      expect(getAllByRole('option')).toHaveLength(1);
      expect(textarea).toHaveAttribute('aria-activedescendant');

      await user.keyboard('{Enter}');
      expect(onCommandSelect).toHaveBeenCalledWith({ value: 'report' });
      expect(onSubmit).not.toHaveBeenCalled();
      expect(textarea).toHaveValue('');
      expect(queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('closes on Escape', async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} commands={commands} />,
      );
      await user.type(getByRole('textbox', { name: accessibilityLabel }), '/');
      expect(getByRole('listbox')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      expect(queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('only opens for a slash at the start', async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} commands={commands} />,
      );
      await user.type(getByRole('textbox', { name: accessibilityLabel }), 'pay /re');
      expect(queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('file limits and drop', () => {
    const makeFile = (name: string, bytes: number, type = 'image/png'): File =>
      new File(['x'.repeat(bytes)], name, { type });

    it('rejects files over maxFileSize and reports them', () => {
      const onFileError = jest.fn();
      const onFileChange = jest.fn();
      const { container } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          maxFileSize={10}
          onFileError={onFileError}
          onFileChange={onFileChange}
        />,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      fireEvent.change(input, {
        target: { files: [makeFile('big.png', 20), makeFile('ok.png', 5)] },
      });
      expect(onFileError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'maxFileSize',
          message: 'big.png is larger than 10 bytes',
        }),
      );
      expect(onFileChange).toHaveBeenCalledTimes(1);
      expect(onFileChange.mock.calls[0][0].fileList.map((f: File) => f.name)).toEqual(['ok.png']);
    });

    it('stops at maxFileCount', () => {
      const onFileError = jest.fn();
      const onFileChange = jest.fn();
      const { container } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          maxFileCount={1}
          onFileError={onFileError}
          onFileChange={onFileChange}
        />,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      fireEvent.change(input, { target: { files: [makeFile('a.png', 1), makeFile('b.png', 1)] } });
      expect(onFileError).toHaveBeenCalledWith(expect.objectContaining({ code: 'maxFileCount' }));
      expect(onFileChange.mock.calls[0][0].fileList).toHaveLength(1);
    });

    it('reports file errors after the accepted files, so they are not cleared', () => {
      const calls: string[] = [];
      const { container } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          maxFileCount={1}
          onFileChange={() => calls.push('change')}
          onFileError={() => calls.push('error')}
        />,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      fireEvent.change(input, { target: { files: [makeFile('a.png', 1), makeFile('b.png', 1)] } });
      expect(calls).toEqual(['change', 'error']);
    });

    it('applies accept to pasted files too', () => {
      const onFileError = jest.fn();
      const onFileChange = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          accept="image/*"
          onFileError={onFileError}
          onFileChange={onFileChange}
        />,
      );
      fireEvent.paste(getByRole('textbox', { name: accessibilityLabel }), {
        clipboardData: { files: [makeFile('notes.txt', 1, 'text/plain')] },
      });
      expect(onFileError).toHaveBeenCalledWith(expect.objectContaining({ code: 'accept' }));
      expect(onFileChange).not.toHaveBeenCalled();
    });

    it('adds files dropped on the input', () => {
      const onFileChange = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} onFileChange={onFileChange} />,
      );
      const card = getByRole('textbox', { name: accessibilityLabel }).closest(
        '[data-blade-component="base-box"]',
      ) as HTMLElement;
      const dataTransfer = { types: ['Files'], files: [makeFile('drop.png', 1)] };
      fireEvent.dragEnter(card, { dataTransfer });
      fireEvent.drop(card, { dataTransfer });
      expect(onFileChange).toHaveBeenCalledTimes(1);
    });

    it('adds files dropped anywhere on the page with dropTarget="page"', () => {
      const onFileChange = jest.fn();
      renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          dropTarget="page"
          onFileChange={onFileChange}
        />,
      );
      const dataTransfer = { types: ['Files'], files: [makeFile('drop.png', 1)] };
      fireEvent.drop(window, { dataTransfer });
      expect(onFileChange).toHaveBeenCalledTimes(1);
    });

    it('ignores drags without files', () => {
      const onFileChange = jest.fn();
      renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          dropTarget="page"
          onFileChange={onFileChange}
        />,
      );
      fireEvent.drop(window, { dataTransfer: { types: ['text/plain'], files: [] } });
      expect(onFileChange).not.toHaveBeenCalled();
    });
  });

  describe('ambient border', () => {
    it('renders only when showAmbientBorder is set and the input is usable', () => {
      const ring = '[data-blade-component="chat-input-ambient-border"]';
      const { container } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} showAmbientBorder />,
      );
      expect(container.querySelector(ring)).toBeInTheDocument();

      const { container: disabledContainer } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} showAmbientBorder isDisabled />,
      );
      expect(disabledContainer.querySelector(ring)).not.toBeInTheDocument();
    });
  });

  it('renders the compact size with the + and Send in one row', () => {
    const { getByRole } = renderWithTheme(
      <ChatInput accessibilityLabel={accessibilityLabel} size="small" defaultValue="Hi" />,
    );
    expect(getByRole('button', { name: 'Upload file' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});
