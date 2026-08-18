import userEvent from '@testing-library/user-event';
import { act, waitFor } from '@testing-library/react';
import { ChatFeedback } from '../ChatFeedback';
import type { ChatFeedbackControls } from '../types';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

/** Blade ships no artwork for the scale yet, so every render supplies its own. */
const moodIcons = {
  'very-dissatisfied': <span>😢</span>,
  dissatisfied: <span>😕</span>,
  satisfied: <span>🙂</span>,
  'very-satisfied': <span>😍</span>,
};

describe('<ChatFeedback moodIcons={moodIcons} />', () => {
  it('should render the mood step by default', () => {
    const { container } = renderWithTheme(<ChatFeedback moodIcons={moodIcons} />);
    expect(container).toMatchSnapshot();
  });

  it('should render the question and all four moods', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <ChatFeedback moodIcons={moodIcons} question="How did that go?" />,
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
      <ChatFeedback moodIcons={moodIcons} onMoodSelect={onMoodSelect} />,
    );

    await userEvent.click(getByLabelText('Love it!'));

    expect(onMoodSelect).toHaveBeenCalledWith({ mood: 'very-satisfied' });
    expect(await findByText('Love it! What stood out most?')).toBeInTheDocument();
  });

  it('should mark the picked mood as checked', async () => {
    const { getByLabelText } = renderWithTheme(<ChatFeedback moodIcons={moodIcons} />);
    const satisfied = getByLabelText('Good');

    expect(satisfied).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(satisfied);
    expect(satisfied).toHaveAttribute('aria-checked', 'true');
  });

  it('should keep submit disabled until at least one tag is picked', async () => {
    const { getByLabelText, findByRole, getByText } = renderWithTheme(
      <ChatFeedback moodIcons={moodIcons} />,
    );

    await userEvent.click(getByLabelText('Good'));
    const submit = await findByRole('button', { name: 'Submit feedback' });
    expect(submit).toBeDisabled();

    await userEvent.click(getByText('Helpful'));
    expect(submit).toBeEnabled();
  });

  it('should submit the mood and selected tags', async () => {
    const onSubmit = jest.fn();
    const { getByLabelText, findByRole, findByText, getByText } = renderWithTheme(
      <ChatFeedback moodIcons={moodIcons} onSubmit={onSubmit} autoDismiss={false} />,
    );

    await userEvent.click(getByLabelText('Good'));
    await userEvent.click(await findByText('Helpful'));
    await userEvent.click(getByText('Clear'));
    await userEvent.click(await findByRole('button', { name: 'Submit feedback' }));

    expect(onSubmit).toHaveBeenCalledWith({ mood: 'satisfied', tags: ['Helpful', 'Clear'] });
  });

  it('should show the thanks step after submitting', async () => {
    const { getByLabelText, findByRole, findByText } = renderWithTheme(
      <ChatFeedback moodIcons={moodIcons} autoDismiss={false} />,
    );

    await userEvent.click(getByLabelText('Good'));
    await userEvent.click(await findByText('Helpful'));
    await userEvent.click(await findByRole('button', { name: 'Submit feedback' }));

    expect(await findByText('Thanks for the feedback!')).toBeInTheDocument();
  });

  it('should clear the selection when going back to the mood step', async () => {
    const { getByLabelText, findByRole } = renderWithTheme(<ChatFeedback moodIcons={moodIcons} />);

    await userEvent.click(getByLabelText('Good'));
    await userEvent.click(await findByRole('button', { name: 'Back to rating' }));

    await waitFor(() => {
      expect(getByLabelText('Good')).toHaveAttribute('aria-checked', 'false');
    });
  });

  it('should not offer a free-text follow-up of its own', async () => {
    const { getByLabelText, findByRole, findByText, queryByRole } = renderWithTheme(
      <ChatFeedback moodIcons={moodIcons} autoDismiss={false} />,
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
      <ChatFeedback moodIcons={moodIcons} onDismiss={onDismiss} />,
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
    renderWithTheme(
      <ChatFeedback moodIcons={moodIcons} onDismiss={onDismiss} autoDismiss={false} />,
    );

    jest.advanceTimersByTime(5000);
    expect(onDismiss).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should honour a custom moodConfig', async () => {
    const { getByLabelText, findByText } = renderWithTheme(
      <ChatFeedback
        moodIcons={moodIcons}
        moodConfig={{ satisfied: { question: 'Nice! Why?', tags: ['Speedy', 'Accurate'] } }}
      />,
    );

    await userEvent.click(getByLabelText('Good'));

    expect(await findByText('Nice! Why?')).toBeInTheDocument();
    expect(await findByText('Speedy')).toBeInTheDocument();
  });

  it('should disable every control when isDisabled is true', () => {
    const { getByLabelText } = renderWithTheme(<ChatFeedback moodIcons={moodIcons} isDisabled />);
    expect(getByLabelText('Good')).toBeDisabled();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(<ChatFeedback moodIcons={moodIcons} />);
    await assertAccessible(container);
  });

  it('should not have accessibility violations on the follow-up step', async () => {
    const { container, getByLabelText, findByRole } = renderWithTheme(
      <ChatFeedback moodIcons={moodIcons} />,
    );

    await userEvent.click(getByLabelText('Good'));
    await findByRole('button', { name: 'Back to rating' });

    await assertAccessible(container);
  });

  it('should expose the scale as a radio group with a name for every point', () => {
    const { getByRole } = renderWithTheme(<ChatFeedback moodIcons={moodIcons} />);

    expect(getByRole('radiogroup', { name: 'Rate this experience' })).toBeTruthy();
    ['Terrible', 'Bad', 'Good', 'Love it!'].forEach((label) => {
      expect(getByRole('radio', { name: label })).toBeTruthy();
    });
  });

  describe('moodIcons', () => {
    it('should render the supplied artwork for every mood', () => {
      const { getByRole } = renderWithTheme(<ChatFeedback moodIcons={moodIcons} />);

      expect(getByRole('radio', { name: 'Good' })).toHaveTextContent('🙂');
      expect(getByRole('radio', { name: 'Terrible' })).toHaveTextContent('😢');
    });

    it('should keep supplied artwork out of the accessibility tree', () => {
      const { getByRole } = renderWithTheme(<ChatFeedback moodIcons={moodIcons} />);
      const button = getByRole('radio', { name: 'Good' });

      // The button already carries the mood's name; the glyph naming itself again is noise.
      expect(button.querySelector('[aria-hidden="true"]')).not.toBeNull();
    });

    /*
     * The reason the selected state lives on the button. Supplied artwork may be untintable, so
     * colouring the glyph does nothing — without a treatment on the button, a 12% scale would be
     * the only sign that a rating registered.
     */
    it('should still show a selected state with untintable artwork', async () => {
      const { getByRole } = renderWithTheme(<ChatFeedback moodIcons={moodIcons} />);
      const button = getByRole('radio', { name: 'Good' });
      // jsdom reports an unpainted background as either spelling, depending on how it was set.
      const isUnpainted = (): boolean =>
        ['transparent', 'rgba(0, 0, 0, 0)', ''].includes(
          window.getComputedStyle(button).backgroundColor,
        );

      expect(isUnpainted()).toBe(true);

      await userEvent.click(button);

      await waitFor(() => expect(isUnpainted()).toBe(false));
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
        <ChatFeedback
          moodIcons={moodIcons}
          controlsRef={controlsRef}
          autoDismiss={false}
          onSubmit={onSubmit}
        />,
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
        <ChatFeedback moodIcons={moodIcons} controlsRef={controlsRef} autoDismiss={false} />,
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
