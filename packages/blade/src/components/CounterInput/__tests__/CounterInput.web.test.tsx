import userEvent from '@testing-library/user-event';
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

    window.getComputedStyle = jest.fn();
    await assertAccessible(input);
    jest.clearAllMocks();
  });
});
