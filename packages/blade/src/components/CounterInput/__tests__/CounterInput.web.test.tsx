import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { CounterInput } from '../CounterInput';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<CounterInput />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<CounterInput label="Quantity" />);
    expect(container).toMatchSnapshot();
  });

  it('should render large size', () => {
    const { container } = renderWithTheme(<CounterInput label="Quantity" size="large" />);
    expect(container).toMatchSnapshot();
  });

  it('should render with intense emphasis', () => {
    const { container } = renderWithTheme(<CounterInput label="Quantity" emphasis="intense" />);
    expect(container).toMatchSnapshot();
  });

  it('should set value as an uncontrolled input', () => {
    const defaultValue = 5;
    const { getByRole } = renderWithTheme(
      <CounterInput label="Quantity" defaultValue={defaultValue} />,
    );

    const input = getByRole('spinbutton');
    expect(input).toHaveValue(defaultValue);
  });

  it('should increment value when increment button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <CounterInput label="Quantity" value={5} onChange={onChange} />,
    );

    const incrementButton = getByRole('button', { name: /increment/i });
    await user.click(incrementButton);

    expect(onChange).toHaveBeenCalledWith({ value: 6 });
  });

  it('should decrement value when decrement button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <CounterInput label="Quantity" value={5} onChange={onChange} min={0} />,
    );

    const decrementButton = getByRole('button', { name: /decrement/i });
    await user.click(decrementButton);

    expect(onChange).toHaveBeenCalledWith({ value: 4 });
  });

  it('should respect min constraint and disable decrement button', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const min = 1;
    const { getByRole } = renderWithTheme(
      <CounterInput label="Quantity" value={min} onChange={onChange} min={min} />,
    );

    const decrementButton = getByRole('button', { name: /decrement/i });
    expect(decrementButton).toBeDisabled();

    await user.click(decrementButton);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should respect max constraint and disable increment button', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const max = 10;
    const { getByRole } = renderWithTheme(
      <CounterInput label="Quantity" value={max} onChange={onChange} max={max} />,
    );

    const incrementButton = getByRole('button', { name: /increment/i });
    expect(incrementButton).toBeDisabled();

    await user.click(incrementButton);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should constrain manual input to min/max values', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const min = 1;
    const max = 10;
    const { getByRole } = renderWithTheme(
      <CounterInput label="Quantity" value={5} onChange={onChange} min={min} max={max} />,
    );

    const input = getByRole('spinbutton');

    // Test below min
    await user.clear(input);
    await user.type(input, '0');
    expect(onChange).toHaveBeenCalledWith({ value: min });

    // Test above max
    await user.clear(input);
    await user.type(input, '15');
    expect(onChange).toHaveBeenCalledWith({ value: max });
  });

  it('should handle invalid input and fallback to min value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const min = 0;
    const { getByRole } = renderWithTheme(
      <CounterInput label="Quantity" value={5} onChange={onChange} min={min} />,
    );

    const input = getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, 'abc');

    expect(onChange).toHaveBeenCalledWith({ value: min });
  });

  it('should handle onFocus event', async () => {
    const user = userEvent.setup();
    const onFocus = jest.fn();
    const { getByRole } = renderWithTheme(<CounterInput label="Quantity" onFocus={onFocus} />);

    const input = getByRole('spinbutton');
    await user.click(input);

    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('should handle onBlur event', async () => {
    const user = userEvent.setup();
    const onBlur = jest.fn();
    const { getByRole } = renderWithTheme(
      <CounterInput label="Quantity" onBlur={onBlur} defaultValue={5} />,
    );

    const input = getByRole('spinbutton');
    await user.click(input);
    await user.tab();

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when isDisabled is true', () => {
    const { getByRole } = renderWithTheme(
      <CounterInput label="Quantity" value={5} isDisabled={true} />,
    );

    const input = getByRole('spinbutton');
    const incrementButton = getByRole('button', { name: /increment/i });
    const decrementButton = getByRole('button', { name: /decrement/i });

    expect(input).toBeDisabled();
    expect(incrementButton).toBeDisabled();
    expect(decrementButton).toBeDisabled();
  });

  it('should be disabled when isLoading is true', () => {
    const { getByRole } = renderWithTheme(
      <CounterInput label="Quantity" value={5} isLoading={true} />,
    );

    const input = getByRole('spinbutton');
    const progressBar = getByRole('progressbar');

    expect(input).toBeDisabled();
    expect(progressBar).toBeInTheDocument();
  });

  it('should use accessibilityLabel when provided', () => {
    const accessibilityLabel = 'Product quantity selector';
    const { getByRole } = renderWithTheme(
      <CounterInput accessibilityLabel={accessibilityLabel} value={5} />,
    );

    const input = getByRole('spinbutton');
    expect(input).toHaveAccessibleName(accessibilityLabel);
  });

  it('should handle name attribute for form submission', () => {
    const name = 'quantity';
    const { getByRole } = renderWithTheme(<CounterInput label="Quantity" name={name} value={5} />);

    const input = getByRole('spinbutton');
    expect(input).toHaveAttribute('name', name);
  });

  it('should pass a11y', async () => {
    const { getByRole } = renderWithTheme(
      <CounterInput label="Product Quantity" value={5} min={1} max={100} />,
    );

    const input = getByRole('spinbutton');
    expect(input).toBeValid();
    expect(input).toBeEnabled();

    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = jest.fn();
    await assertAccessible(input);
    window.getComputedStyle = originalGetComputedStyle;
  });

  it('should not clip two-digit numbers — container uses minWidth instead of fixed width', () => {
    const { container } = renderWithTheme(<CounterInput label="Quantity" value={99} />);
    expect(container).toMatchSnapshot();
  });

  it('should not clip three-digit numbers — container grows beyond default size', () => {
    const { container } = renderWithTheme(<CounterInput label="Quantity" value={999} />);
    expect(container).toMatchSnapshot();
  });

  it('should render xsmall size', () => {
    const { container } = renderWithTheme(
      <CounterInput label="Quantity" size="xsmall" value={5} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should show per-digit animation overlay immediately on increment', async () => {
    const user = userEvent.setup();

    // Use defaultValue (uncontrolled) so internalValue actually updates on button click
    const { getByRole, container } = renderWithTheme(
      <CounterInput label="Quantity" defaultValue={15} />,
    );

    const incrementButton = getByRole('button', { name: /increment/i });
    await user.click(incrementButton);

    // After click the digit overlay should appear immediately
    await waitFor(() => {
      const overlay = container.querySelector('.__blade-counter-input-digit-overlay');
      expect(overlay).toBeInTheDocument();
    });

    // Overlay has two digit slots for "16"
    const slots = container.querySelectorAll('.__blade-counter-input-digit-slot');
    expect(slots).toHaveLength(2);
  });

  it('should only animate the units digit when tens digit is unchanged (15 → 16)', async () => {
    const user = userEvent.setup();

    // Use defaultValue so the internal state updates on button click
    const { getByRole, container } = renderWithTheme(
      <CounterInput label="Quantity" defaultValue={15} />,
    );

    const incrementButton = getByRole('button', { name: /increment/i });
    await user.click(incrementButton);

    await waitFor(() => {
      const overlay = container.querySelector('.__blade-counter-input-digit-overlay');
      expect(overlay).toBeInTheDocument();
    });

    const slots = container.querySelectorAll('.__blade-counter-input-digit-slot');
    expect(slots).toHaveLength(2); // "16" has two digits

    // Helper: get the entering (last) span in a slot — exit span is first if present
    const getEnterSpan = (slot: Element | undefined): Element | undefined => {
      const spans = slot?.querySelectorAll('span');
      return spans?.[spans.length - 1];
    };

    // First slot ("1") did not change — its only span has no animation class
    expect(getEnterSpan(slots[0])?.className ?? '').not.toContain('animate');
    expect(getEnterSpan(slots[0])?.className ?? '').not.toContain('enter');

    // Second slot ("6") changed — its enter span has slide-up class
    expect(getEnterSpan(slots[1])?.className ?? '').toContain(
      '__blade-counter-input-digit-enter-up',
    );
    // Second slot also has an exit span for the rolling effect
    expect(slots[1]?.querySelector('.__blade-counter-input-digit-exit-up')).toBeInTheDocument();
  });

  it('should animate all digits when crossing decade boundary (9 → 10)', async () => {
    const user = userEvent.setup();

    const { getByRole, container } = renderWithTheme(
      <CounterInput label="Quantity" defaultValue={9} />,
    );

    const incrementButton = getByRole('button', { name: /increment/i });
    await user.click(incrementButton);

    await waitFor(() => {
      const overlay = container.querySelector('.__blade-counter-input-digit-overlay');
      expect(overlay).toBeInTheDocument();
    });

    const slots = container.querySelectorAll('.__blade-counter-input-digit-slot');
    expect(slots).toHaveLength(2); // "10" has two digits

    // Helper: last span in slot is always the entering digit
    const getEnterSpan = (slot: Element | undefined): Element | undefined => {
      const spans = slot?.querySelectorAll('span');
      return spans?.[spans.length - 1];
    };

    // Both digits changed — both enter spans have slide-up class
    expect(getEnterSpan(slots[0])?.className ?? '').toContain(
      '__blade-counter-input-digit-enter-up',
    );
    expect(getEnterSpan(slots[1])?.className ?? '').toContain(
      '__blade-counter-input-digit-enter-up',
    );
    // Only slot[1] has an exit span (slot[0] was a newly-appeared digit — no previous value)
    expect(slots[1]?.querySelector('.__blade-counter-input-digit-exit-up')).toBeInTheDocument();
  });

  it('should use slide-down animation on decrement', async () => {
    const user = userEvent.setup();

    const { getByRole, container } = renderWithTheme(
      <CounterInput label="Quantity" defaultValue={15} min={0} />,
    );

    const decrementButton = getByRole('button', { name: /decrement/i });
    await user.click(decrementButton);

    await waitFor(() => {
      const overlay = container.querySelector('.__blade-counter-input-digit-overlay');
      expect(overlay).toBeInTheDocument();
    });

    const slots = container.querySelectorAll('.__blade-counter-input-digit-slot');
    const spans1 = slots[1]?.querySelectorAll('span');
    const enterSpan = spans1?.[spans1.length - 1]; // entering digit is always last
    expect(enterSpan?.className ?? '').toContain('__blade-counter-input-digit-enter-down');
    expect(slots[1]?.querySelector('.__blade-counter-input-digit-exit-down')).toBeInTheDocument();
  });

  it('should apply font-variant-numeric tabular-nums styling to the input', () => {
    const { container } = renderWithTheme(<CounterInput label="Quantity" value={5} />);
    // The input should be rendered correctly; tabular-nums CSS is verified in snapshot
    expect(container).toMatchSnapshot();
  });
});
