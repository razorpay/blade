import userEvent from '@testing-library/user-event';
import { act, waitFor } from '@testing-library/react';
import { ChatFeedback } from '../ChatFeedback';
import type { ChatFeedbackControls } from '../types';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<ChatFeedback />', () => {
  it('should render the mood step by default', () => {
    const { container } = renderWithTheme(<ChatFeedback />);
    expect(container).toMatchSnapshot();
  });

  it('should render the question and all four moods', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <ChatFeedback question="How did that go?" />,
    );

    expect(getByText('How did that go?')).toBeInTheDocument();
    expect(getByLabelText('Terrible')).toBeInTheDocument();
    expect(getByLabelText('Bad')).toBeInTheDocument();
    expect(getByLabelText('Good')).toBeInTheDocument();
    expect(getByLabelText('Love it!')).toBeInTheDocument();
  });

  it('should fire onMoodSelect and move to the tags step', async () => {
    const onMoodSelect = jest.fn();
    const { getByLabelText, findByText } = renderWithTheme(
      <ChatFeedback onMoodSelect={onMoodSelect} />,
    );

    await userEvent.click(getByLabelText('Love it!'));

    expect(onMoodSelect).toHaveBeenCalledWith({ mood: 'very-satisfied' });
    expect(await findByText('Love it! What stood out most?')).toBeInTheDocument();
  });

  it('should mark the picked mood as checked', async () => {
    const { getByLabelText } = renderWithTheme(<ChatFeedback />);
    const satisfied = getByLabelText('Good');

    expect(satisfied).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(satisfied);
    expect(satisfied).toHaveAttribute('aria-checked', 'true');
  });

  it('should keep submit disabled until at least one tag is picked', async () => {
    const { getByLabelText, findByRole, getByText } = renderWithTheme(<ChatFeedback />);

    await userEvent.click(getByLabelText('Good'));
    const submit = await findByRole('button', { name: 'Submit feedback' });
    expect(submit).toBeDisabled();

    await userEvent.click(getByText('Helpful'));
    expect(submit).toBeEnabled();
  });

  it('should submit the mood and selected tags', async () => {
    const onSubmit = jest.fn();
    const { getByLabelText, findByRole, findByText, getByText } = renderWithTheme(
      <ChatFeedback onSubmit={onSubmit} autoDismiss={false} />,
    );

    await userEvent.click(getByLabelText('Good'));
    await userEvent.click(await findByText('Helpful'));
    await userEvent.click(getByText('Clear'));
    await userEvent.click(await findByRole('button', { name: 'Submit feedback' }));

    expect(onSubmit).toHaveBeenCalledWith({ mood: 'satisfied', tags: ['Helpful', 'Clear'] });
  });

  it('should show the thanks step after submitting', async () => {
    const { getByLabelText, findByRole, findByText } = renderWithTheme(
      <ChatFeedback autoDismiss={false} />,
    );

    await userEvent.click(getByLabelText('Good'));
    await userEvent.click(await findByText('Helpful'));
    await userEvent.click(await findByRole('button', { name: 'Submit feedback' }));

    expect(await findByText('Thanks for the feedback!')).toBeInTheDocument();
  });

  it('should clear the selection when going back to the mood step', async () => {
    const { getByLabelText, findByRole } = renderWithTheme(<ChatFeedback />);

    await userEvent.click(getByLabelText('Good'));
    await userEvent.click(await findByRole('button', { name: 'Back to rating' }));

    await waitFor(() => {
      expect(getByLabelText('Good')).toHaveAttribute('aria-checked', 'false');
    });
  });

  it('should not offer a free-text follow-up of its own', async () => {
    const { getByLabelText, findByRole, findByText, queryByRole } = renderWithTheme(
      <ChatFeedback autoDismiss={false} />,
    );

    await userEvent.click(getByLabelText('Good'));
    await userEvent.click(await findByText('Helpful'));
    await userEvent.click(await findByRole('button', { name: 'Submit feedback' }));
    await findByText('Thanks for the feedback!');

    // Free text is the surrounding surface's job now — a composer, typically. This component
    // ends on the confirmation rather than opening a second act.
    expect(queryByRole('textbox')).toBeNull();
  });

  it('should call onDismiss after the thanks step when autoDismiss is on', async () => {
    const onDismiss = jest.fn();
    const { getByLabelText, findByRole, findByText } = renderWithTheme(
      <ChatFeedback onDismiss={onDismiss} />,
    );

    await userEvent.click(getByLabelText('Good'));
    await userEvent.click(await findByText('Helpful'));
    await userEvent.click(await findByRole('button', { name: 'Submit feedback' }));

    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1), { timeout: 4000 });
  });

  // Synchronous by design: fake timers drive the whole assertion, so there is nothing to await.
  it('should not call onDismiss when autoDismiss is off', () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    renderWithTheme(<ChatFeedback onDismiss={onDismiss} autoDismiss={false} />);

    jest.advanceTimersByTime(5000);
    expect(onDismiss).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should honour a custom moodConfig', async () => {
    const { getByLabelText, findByText } = renderWithTheme(
      <ChatFeedback
        moodConfig={{ satisfied: { question: 'Nice! Why?', tags: ['Speedy', 'Accurate'] } }}
      />,
    );

    await userEvent.click(getByLabelText('Good'));

    expect(await findByText('Nice! Why?')).toBeInTheDocument();
    expect(await findByText('Speedy')).toBeInTheDocument();
  });

  it('should disable every control when isDisabled is true', () => {
    const { getByLabelText } = renderWithTheme(<ChatFeedback isDisabled />);
    expect(getByLabelText('Good')).toBeDisabled();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(<ChatFeedback />);
    await assertAccessible(container);
  });

  it('should not have accessibility violations on the follow-up step', async () => {
    const { container, getByLabelText, findByRole } = renderWithTheme(<ChatFeedback />);

    await userEvent.click(getByLabelText('Good'));
    await findByRole('button', { name: 'Back to rating' });

    await assertAccessible(container);
  });

  it('should expose the scale as a radio group with a name for every point', () => {
    const { getByRole } = renderWithTheme(<ChatFeedback />);

    expect(getByRole('radiogroup', { name: 'Rate this experience' })).toBeTruthy();
    ['Terrible', 'Bad', 'Good', 'Love it!'].forEach((label) => {
      expect(getByRole('radio', { name: label })).toBeTruthy();
    });
  });

  describe('feedbackIcons', () => {
    /*
     * Emoji rather than the shipped SVGs. Untintable artwork with no filled twin is the case worth
     * proving: it is where the selected state has to survive on the button alone.
     */
    const emojiIcons = {
      'very-dissatisfied': <span>😢</span>,
      dissatisfied: <span>😕</span>,
      satisfied: <span>🙂</span>,
      'very-satisfied': <span>😍</span>,
    };

    it('should render the supplied artwork for every mood', () => {
      const { getByRole } = renderWithTheme(<ChatFeedback feedbackIcons={emojiIcons} />);

      expect(getByRole('radio', { name: 'Good' })).toHaveTextContent('🙂');
      expect(getByRole('radio', { name: 'Terrible' })).toHaveTextContent('😢');
    });

    it('should keep supplied artwork out of the accessibility tree', () => {
      const { getByRole } = renderWithTheme(<ChatFeedback feedbackIcons={emojiIcons} />);
      const button = getByRole('radio', { name: 'Good' });

      // The button already carries the mood's name; the glyph naming itself again is noise.
      expect(button.querySelector('[aria-hidden="true"]')).not.toBeNull();
    });

    /*
     * The selected treatment is a tinted disc drawn by a pseudo-element, which jsdom cannot
     * compute — `getComputedStyle(el, '::before')` returns nothing useful here. The visual is
     * asserted in `ChatFeedback.test.stories.tsx`, which runs in a real browser; what this level
     * can prove is that selection is recorded at all with artwork that carries none of it.
     */
    it('should record the selection with untintable artwork', async () => {
      const { getByRole } = renderWithTheme(<ChatFeedback feedbackIcons={emojiIcons} />);
      const button = getByRole('radio', { name: 'Good' });

      expect(button).toHaveAttribute('aria-checked', 'false');

      await userEvent.click(button);

      expect(button).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('controlsRef', () => {
    /*
     * The handle has to reflect the selection at the moment it is called, not at mount. It is
     * published from an effect rather than during render, so it delegates through refs — this is
     * the test that the delegation actually keeps it current.
     */
    it('should submit the selection as it stands when the handle is called', async () => {
      const onSubmit = jest.fn();
      const controlsRef: { current: ChatFeedbackControls | null } = { current: null };
      const { getByLabelText, findByText } = renderWithTheme(
        <ChatFeedback controlsRef={controlsRef} autoDismiss={false} onSubmit={onSubmit} />,
      );

      await userEvent.click(getByLabelText('Good'));
      await userEvent.click(await findByText('Helpful'));

      controlsRef.current?.submit();

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ mood: 'satisfied', tags: ['Helpful'] }),
      );
    });

    it('should let a host replace the selection', async () => {
      const controlsRef: { current: ChatFeedbackControls | null } = { current: null };
      const { getByLabelText, findByRole } = renderWithTheme(
        <ChatFeedback controlsRef={controlsRef} autoDismiss={false} />,
      );

      await userEvent.click(getByLabelText('Good'));
      await findByRole('checkbox', { name: 'Helpful' });

      // Synchronous state update, wrapped so React flushes it before the assertion.
      act(() => {
        controlsRef.current?.setTags(['Helpful']);
      });

      await waitFor(() => expect(getByLabelText('Helpful')).toBeChecked());
    });
  });
});
