import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { ChatInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

const accessibilityLabel = 'Chat input';

/** Blade ships no artwork for the scale yet, so every render supplies its own. */
const feedbackIcons = {
  'very-dissatisfied': <span>😢</span>,
  dissatisfied: <span>😕</span>,
  satisfied: <span>🙂</span>,
  'very-satisfied': <span>😍</span>,
};

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

  describe('feedback prompt', () => {
    it('should render the attached prompt when feedback is passed', () => {
      const { getByText, getByRole } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          feedback={{ feedbackIcons, question: 'How are we doing?' }}
        />,
      );

      expect(getByText('How are we doing?')).toBeTruthy();
      expect(getByRole('radiogroup', { name: 'Rate this experience' })).toBeTruthy();
    });

    it('should not render the prompt when it is hidden', () => {
      const { queryByText } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          feedback={{ feedbackIcons, question: 'How are we doing?', isVisible: false }}
        />,
      );

      expect(queryByText('How are we doing?')).toBeNull();
    });

    it('should render no prompt at all when feedback is omitted', () => {
      const { queryByRole } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} />,
      );

      expect(queryByRole('radiogroup', { name: 'Rate this experience' })).toBeNull();
    });

    it('should report the mood the user picks', async () => {
      const onMoodSelect = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          feedback={{ feedbackIcons, onMoodSelect }}
        />,
      );

      await userEvent.click(getByRole('radio', { name: 'Good' }));

      expect(onMoodSelect).toHaveBeenCalledWith({ mood: 'satisfied' });
    });

    /*
     * The regression that made this worth a test: ChatInput keeps its validation region mounted
     * above the card even with no error, and it used to swallow clicks aimed at anything stacked
     * there — the lower two-thirds of every mood button, with nothing on screen to explain it.
     */
    it('should keep the prompt clickable while no error is showing', async () => {
      const onMoodSelect = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          validationState="none"
          feedback={{ feedbackIcons, onMoodSelect }}
        />,
      );

      await userEvent.click(getByRole('radio', { name: 'Love it!' }));

      expect(onMoodSelect).toHaveBeenCalledWith({ mood: 'very-satisfied' });
    });

    it('should not have accessibility violations with the prompt attached', async () => {
      const { container } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          feedback={{ feedbackIcons, question: 'How are we doing?' }}
        />,
      );
      await assertAccessible(container);
    });
  });

  describe('free-text feedback in the composer', () => {
    type Queries = Pick<ReturnType<typeof renderWithTheme>, 'getByRole' | 'findByText'>;

    /** Rate, then pick the tag that hands the composer over. */
    const openFreeText = async ({ getByRole, findByText }: Queries): Promise<void> => {
      await userEvent.click(getByRole('radio', { name: 'Good' }));
      await userEvent.click(await findByText('Other'));
    };

    it('should hand the composer over when the free-text tag is picked', async () => {
      const { getByRole, findByText, getByPlaceholderText } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} feedback={{ feedbackIcons }} />,
      );

      await openFreeText({ getByRole, findByText });

      expect(getByPlaceholderText('Anything else? (optional)')).toBeTruthy();
      expect(await findByText('Feedback')).toBeTruthy();
      expect(await findByText('esc to cancel')).toBeTruthy();
    });

    /*
     * The draft belongs to the user, not to us. Without stashing it, picking the tag silently
     * destroys a half-written message.
     */
    it('should stash the chat draft and put it back on cancel', async () => {
      const { getByRole, findByText, getByLabelText } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} feedback={{ feedbackIcons }} />,
      );
      const composer = getByLabelText(accessibilityLabel);

      await userEvent.type(composer, 'half written message');
      await openFreeText({ getByRole, findByText });
      expect(composer).toHaveValue('');

      await userEvent.type(composer, '{Escape}');

      expect(composer).toHaveValue('half written message');
    });

    it('should release the tag on cancel, so the user is not left with an unsendable choice', async () => {
      const { getByRole, findByText, getByLabelText } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} feedback={{ feedbackIcons }} />,
      );

      await openFreeText({ getByRole, findByText });
      await userEvent.type(getByLabelText(accessibilityLabel), '{Escape}');

      await waitFor(() => expect(getByRole('checkbox', { name: 'Other' })).not.toBeChecked());
    });

    /*
     * The one mistake that cannot be walked back: sending candid feedback to the assistant as a
     * prompt. The chat path is blocked while the mode is on, not merely redirected.
     */
    it('should never submit the chat while collecting feedback', async () => {
      const onSubmit = jest.fn();
      const onFeedbackSubmit = jest.fn();
      const { getByRole, findByText, getByLabelText } = renderWithTheme(
        <ChatInput
          accessibilityLabel={accessibilityLabel}
          onSubmit={onSubmit}
          feedback={{ feedbackIcons, onSubmit: onFeedbackSubmit }}
        />,
      );

      await openFreeText({ getByRole, findByText });
      await userEvent.type(getByLabelText(accessibilityLabel), 'the tone was great{Enter}');

      expect(onSubmit).not.toHaveBeenCalled();
      expect(onFeedbackSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ mood: 'satisfied', comment: 'the tone was great' }),
      );
    });

    it('should leave the mode once the feedback is submitted', async () => {
      const { getByRole, findByText, getByLabelText, queryByText } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} feedback={{ feedbackIcons }} />,
      );

      await openFreeText({ getByRole, findByText });
      await userEvent.type(getByLabelText(accessibilityLabel), 'done{Enter}');

      await waitFor(() => expect(queryByText('esc to cancel')).toBeNull());
    });

    it('should show its own submit only once a tag that stands alone is picked', async () => {
      const { getByRole, findByText, queryByRole } = renderWithTheme(
        <ChatInput accessibilityLabel={accessibilityLabel} feedback={{ feedbackIcons }} />,
      );

      await userEvent.click(getByRole('radio', { name: 'Good' }));
      await findByText('Other');
      expect(queryByRole('button', { name: 'Submit feedback' })).toBeNull();

      await userEvent.click(await findByText('Other'));
      expect(queryByRole('button', { name: 'Submit feedback' })).toBeNull();

      await userEvent.click(await findByText('Helpful'));
      await waitFor(() =>
        expect(queryByRole('button', { name: 'Submit feedback' })).not.toBeNull(),
      );
    });
  });
});
