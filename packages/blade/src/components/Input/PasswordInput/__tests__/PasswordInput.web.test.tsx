import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { useRef, useState } from 'react';
import { PasswordInput } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<PasswordInput />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<PasswordInput label="Enter password" />);

    expect(container).toMatchSnapshot();
  });

  it('should render large size', () => {
    const { container } = renderWithTheme(<PasswordInput label="Enter password" size="large" />);

    expect(container).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const label = 'Enter password';
    const { getByText, getByLabelText } = renderWithTheme(
      <PasswordInput
        label={label}
        validationState="success"
        successText="Success"
        helpText="Help"
        errorText="Error"
      />,
    );

    const input = getByLabelText(label);
    const successText = getByText('Success');

    expect(successText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Success');
    expect(input).toBeValid();
  });

  it('should display error validation state', () => {
    const label = 'Enter password';
    const { getByText, getByLabelText } = renderWithTheme(
      <PasswordInput
        label={label}
        validationState="error"
        errorText="Error"
        helpText="Help"
        successText="Success"
      />,
    );

    const input = getByLabelText(label);
    const errorText = getByText('Error');

    expect(errorText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Error');
    expect(input).toBeInvalid();
  });

  it('should display help text', () => {
    const label = 'Enter password';
    const { getByText, getByLabelText } = renderWithTheme(
      <PasswordInput label={label} errorText="Error" helpText="Help" successText="Success" />,
    );

    const input = getByLabelText(label);
    const HelpText = getByText('Help');

    expect(HelpText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Help');
    expect(input).toBeValid();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const label = 'Enter password';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getByLabelText } = renderWithTheme(<PasswordInput label={label} autoFocus />);

    const input = getByLabelText(label);
    expect(input).toHaveFocus();
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Enter password';
    const { getByLabelText } = renderWithTheme(<PasswordInput label={label} isDisabled />);

    const input = getByLabelText(label);
    expect(input).toBeDisabled();
  });
  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Enter password';
    const { getByLabelText } = renderWithTheme(<PasswordInput label={label} isDisabled />);

    const input = getByLabelText(label);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', async () => {
    const label = 'Enter password';
    const onChange = jest.fn();
    const user = userEvent.setup();
    const userPassword = 'Divyanshu$123';

    const { getByLabelText } = renderWithTheme(
      <PasswordInput label={label} name="password" onChange={onChange} />,
    );

    const input = getByLabelText(label);
    await user.type(input, userPassword);

    // should be called for each keystroke
    expect(onChange).toHaveBeenCalledTimes(userPassword.length);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'password', value: userPassword });
  });

  it('should handle onBlur', async () => {
    const user = userEvent.setup();
    const label = 'Enter password';
    const userPassword = 'Divyanshu$123';
    const onBlur = jest.fn();

    renderWithTheme(
      <PasswordInput
        label={label}
        name="password"
        defaultValue={userPassword}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onBlur={onBlur}
      />,
    );

    // shifts user focus and therefore blurs the focussed input
    await user.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledWith({ name: 'password', value: userPassword });
  });

  it('should be focussable', async () => {
    const user = userEvent.setup();
    const label = 'Enter password';
    const userPassword = 'Divyanshu$123';

    const { getByLabelText, getByRole } = renderWithTheme(
      <PasswordInput label={label} name="password" defaultValue={userPassword} />,
    );

    const input = getByLabelText(label);
    const revealButton = getByRole('button');

    expect(input).not.toHaveFocus();
    await user.tab();
    expect(input).toHaveFocus();
    await user.tab();
    expect(revealButton).toHaveFocus();
  });

  it('should set value as an uncontrolled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter password';
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu$123';

    const { getByLabelText } = renderWithTheme(
      <PasswordInput label={label} defaultValue={valueInitial} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, '$123');
    expect(input).toHaveValue(valueFinal);
  });

  it('should set value as a controlled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter password';
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu$123';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return (
        <PasswordInput label={label} value={value} onChange={({ value }) => setValue(value)} />
      );
    };

    const { getByLabelText } = renderWithTheme(<ControlledInputExample />);

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, '$123');
    expect(input).toHaveValue(valueFinal);
  });

  it('should toggle password visibility on clicking reveal button', async () => {
    const user = userEvent.setup();
    const label = 'Enter password';
    const userPassword = 'Divyanshu$123';

    const { getByLabelText, getByRole } = renderWithTheme(
      <PasswordInput label={label} name="password" defaultValue={userPassword} />,
    );

    const input = getByLabelText(label);
    const revealButton = getByRole('button');

    expect(input).toHaveAttribute('type', 'password');
    expect(revealButton).toHaveAccessibleName('Show password');

    await user.click(revealButton);

    expect(input).toHaveAttribute('type', 'text');
    expect(revealButton).toHaveAccessibleName('Hide password');
  });

  it('should pass a11y', async () => {
    const { getByLabelText, getByRole } = renderWithTheme(
      <PasswordInput
        label="Enter password"
        isRequired
        helpText="Use a strong password"
        defaultValue="Divyanshu"
        validationState="none"
      />,
    );

    // A password field can't be a textbox. There is currently no role for password https://github.com/w3c/aria/issues/935
    const input = getByLabelText('Enter password');
    expect(input).toBeRequired();
    expect(input).toBeValid();
    expect(input).toBeEnabled();

    // Reveal button
    getByRole('button');

    await assertAccessible(input);
  });

  it(`should expose native element methods via ref`, async () => {
    const label = 'Enter Password';

    const Example = (): React.ReactElement => {
      const ref = useRef<HTMLInputElement>(null);

      return (
        <>
          <PasswordInput ref={ref} label={label} />
          <Button
            onClick={() => {
              ref.current?.focus();
            }}
          >
            Focus
          </Button>
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
      <PasswordInput label="Enter password" testID="password-input-test" />,
    );

    expect(getByTestId('password-input-test')).toBeTruthy();
  });
  it('should accept data-analytics attributes', () => {
    const { container } = renderWithTheme(
      <PasswordInput
        label="Enter password"
        data-analytics-type="password"
        data-analytics-event="change"
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
