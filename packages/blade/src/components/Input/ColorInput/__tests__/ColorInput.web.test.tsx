import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { useRef, useState } from 'react';
import { ColorInput } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<ColorInput />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<ColorInput label="Brand Color" />);
    expect(container).toMatchSnapshot();
  });

  it('should render large size', () => {
    const { container } = renderWithTheme(<ColorInput label="Brand Color" size="large" />);
    expect(container).toMatchSnapshot();
  });

  it('should render with a default value and show color swatch', () => {
    const { container } = renderWithTheme(
      <ColorInput label="Brand Color" defaultValue="#3366FF" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const label = 'Brand Color';
    const { getByText, getByLabelText } = renderWithTheme(
      <ColorInput
        label={label}
        validationState="success"
        successText="Color applied"
        helpText="Help"
        errorText="Error"
      />,
    );

    const input = getByLabelText(label);
    const successText = getByText('Color applied');

    expect(successText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Color applied');
    expect(input).toBeValid();
  });

  it('should display error validation state', () => {
    const label = 'Brand Color';
    const { getByText, getByLabelText } = renderWithTheme(
      <ColorInput
        label={label}
        validationState="error"
        errorText="Invalid color"
        helpText="Help"
        successText="Success"
      />,
    );

    const input = getByLabelText(label);
    const errorText = getByText('Invalid color');

    expect(errorText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Invalid color');
    expect(input).toBeInvalid();
  });

  it('should display help text', () => {
    const label = 'Brand Color';
    const { getByText, getByLabelText } = renderWithTheme(
      <ColorInput
        label={label}
        errorText="Error"
        helpText="Enter a hex color"
        successText="Success"
      />,
    );

    const input = getByLabelText(label);
    const helpText = getByText('Enter a hex color');

    expect(helpText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Enter a hex color');
    expect(input).toBeValid();
  });

  it('should be focused when autoFocus flag is passed', () => {
    const label = 'Brand Color';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getByLabelText } = renderWithTheme(<ColorInput label={label} autoFocus />);

    const input = getByLabelText(label);
    expect(input).toHaveFocus();
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Brand Color';
    const { getByLabelText } = renderWithTheme(<ColorInput label={label} isDisabled />);

    const input = getByLabelText(label);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', async () => {
    const label = 'Brand Color';
    const onChange = jest.fn();
    const user = userEvent.setup();
    const colorValue = '#3366FF';

    const { getByLabelText } = renderWithTheme(
      <ColorInput label={label} name="brandColor" onChange={onChange} />,
    );

    const input = getByLabelText(label);
    await user.type(input, colorValue);

    expect(onChange).toHaveBeenCalledTimes(colorValue.length);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'brandColor', value: colorValue });
  });

  it('should handle onBlur', async () => {
    const user = userEvent.setup();
    const label = 'Brand Color';
    const onBlur = jest.fn();

    renderWithTheme(
      <ColorInput
        label={label}
        name="brandColor"
        defaultValue="#3366FF"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onBlur={onBlur}
      />,
    );

    await user.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledWith({ name: 'brandColor', value: '#3366FF' });
  });

  it('should set value as an uncontrolled input', async () => {
    const user = userEvent.setup();
    const label = 'Brand Color';

    const { getByLabelText } = renderWithTheme(<ColorInput label={label} defaultValue="#336" />);

    const input = getByLabelText(label);
    expect(input).toHaveValue('#336');

    await user.type(input, '6FF');
    expect(input).toHaveValue('#3366FF');
  });

  it('should set value as a controlled input', async () => {
    const user = userEvent.setup();
    const label = 'Brand Color';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>('#336');
      return (
        <ColorInput
          label={label}
          value={value}
          onChange={({ value }) => setValue(value as string)}
        />
      );
    };

    const { getByLabelText } = renderWithTheme(<ControlledInputExample />);

    const input = getByLabelText(label);
    expect(input).toHaveValue('#336');

    await user.type(input, '6FF');
    expect(input).toHaveValue('#3366FF');
  });

  it('should pass a11y', async () => {
    const { getByLabelText } = renderWithTheme(
      <ColorInput
        label="Brand Color"
        isRequired
        helpText="Enter a valid hex color"
        defaultValue="#3366FF"
        validationState="none"
      />,
    );

    const input = getByLabelText('Brand Color');
    expect(input).toBeRequired();
    expect(input).toBeValid();
    expect(input).toBeEnabled();

    await assertAccessible(input);
  });

  it('should expose native element methods via ref', async () => {
    const label = 'Brand Color';

    const Example = (): React.ReactElement => {
      const ref = useRef<HTMLInputElement>(null);
      return (
        <>
          <ColorInput ref={ref} label={label} />
          <Button onClick={() => ref.current?.focus()}>Focus</Button>
        </>
      );
    };

    const { getByLabelText, getByRole } = renderWithTheme(<Example />);

    const input = getByLabelText(label);
    const button = getByRole('button', { name: 'Focus' });

    expect(input).not.toHaveFocus();
    await userEvent.click(button);
    expect(input).toHaveFocus();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <ColorInput label="Brand Color" testID="color-input-test" />,
    );
    expect(getByTestId('color-input-test')).toBeTruthy();
  });

  it('should accept data-analytics attributes', () => {
    const { container } = renderWithTheme(
      <ColorInput label="Brand Color" data-analytics-type="color" data-analytics-event="change" />,
    );
    expect(container).toMatchSnapshot();
  });
});
