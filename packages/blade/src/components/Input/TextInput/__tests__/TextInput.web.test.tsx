// TODO disable this rule for non-react-native files
import userEvent from '@testing-library/user-event';

import type { ReactElement } from 'react';
import React, { useState } from 'react';
import { TextInput } from '../';
import { InfoIcon } from '~components/Icons';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';

describe('<TextInput />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<TextInput label="Enter name" />);

    expect(container).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <TextInput
        label="Enter name"
        validationState="success"
        successText="Success"
        errorText="Error"
        helpText="Help"
      />,
    );

    const input = getByLabelText(label);
    const successText = getByText('Success');

    expect(successText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Success');
    expect(input).toBeValid();
  });

  it('should display error validation state', () => {
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <TextInput
        label="Enter name"
        validationState="error"
        successText="Success"
        errorText="Error"
        helpText="Help"
      />,
    );

    const input = getByLabelText(label);
    const errorText = getByText('Error');

    expect(errorText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Error');
    expect(input).toBeInvalid();
  });

  it('should display help text', () => {
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <TextInput label="Enter name" successText="Success" errorText="Error" helpText="Help" />,
    );

    const input = getByLabelText(label);
    const helpText = getByText('Help');

    expect(helpText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Help');
    expect(input).toBeValid();
  });

  it('should render with icon, prefix, suffix', () => {
    const { container, getByText } = renderWithTheme(
      <TextInput
        label="Enter company website"
        type="url"
        placeholder="something"
        icon={InfoIcon}
        prefix="https://"
        suffix=".com"
      />,
    );
    const prefix = getByText('https://');
    expect(prefix).toBeVisible();

    const suffix = getByText('.com');
    expect(suffix).toBeVisible();

    expect(container).toMatchSnapshot();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const label = 'Enter name';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getByLabelText } = renderWithTheme(<TextInput label={label} autoFocus />);

    const input = getByLabelText(label);

    expect(input).toHaveFocus();
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Enter name';
    const { getByLabelText } = renderWithTheme(<TextInput label={label} isDisabled />);

    const input = getByLabelText(label);

    expect(input).toBeDisabled();
  });

  it('should show spinner when isLoading is passed', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';

    const { getByLabelText, queryByRole } = renderWithTheme(
      <TextInput label={label} showClearButton={true} isLoading={true} />,
    );

    const input = getByLabelText(label);
    let clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();
    await user.tab();
    /* We are intentionally making sure that the input is not disabled and focusable since we don't want the input to be disabled while the user is still typing. 
    For instance, in an autocomplete while the user types, API call is made for each letter and loader shows up but also allows the user to continue typing.
     */
    expect(input).toHaveFocus();
    await user.type(input, 'Kamlesh');
    clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();
    const loadingSpinner = queryByRole('progressbar');
    expect(loadingSpinner).toBeTruthy();
  });

  it('should handle onChange', async () => {
    const label = 'Enter name';
    const onChange = jest.fn();
    const user = userEvent.setup();
    const userName = 'Kamlesh';

    const { getByLabelText } = renderWithTheme(
      <TextInput label={label} name="name" onChange={onChange} />,
    );

    const input = getByLabelText(label);
    await user.type(input, userName);

    // should be called for each keystroke
    expect(onChange).toHaveBeenCalledTimes(userName.length);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'name', value: userName });
  });

  it('should handle onFocus', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const name = 'userName';
    const userName = 'Kamlesh';
    const onFocus = jest.fn();

    renderWithTheme(
      <TextInput label={label} name={name} defaultValue={userName} onFocus={onFocus} />,
    );

    // focus into textarea
    await user.tab();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledWith({ name, value: userName });
  });

  it('should handle onBlur', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const userName = 'Kamlesh';
    const onBlur = jest.fn();

    renderWithTheme(
      <TextInput
        label={label}
        name="name"
        defaultValue={userName}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onBlur={onBlur}
      />,
    );

    // shifts user focus and therefore blurs the focussed input
    await user.tab();

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledWith({ name: 'name', value: userName });
  });

  it('should be focusable', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const userName = 'Kamlesh';

    const { getByLabelText } = renderWithTheme(
      <TextInput label={label} name="name" defaultValue={userName} />,
    );

    const input = getByLabelText(label);

    expect(input).not.toHaveFocus();

    await user.tab();
    expect(input).toHaveFocus();
  });

  it('should set value as an uncontrolled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const valueInitial = 'Kamlesh';
    const valueFinal = 'Kamlesh Chandnani';

    const { getByLabelText } = renderWithTheme(
      <TextInput label={label} defaultValue={valueInitial} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' Chandnani');
    expect(input).toHaveValue(valueFinal);
  });

  it('should set value as a controlled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const valueInitial = 'Kamlesh';
    const valueFinal = 'Kamlesh Chandnani';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return <TextInput label={label} value={value} onChange={({ value }) => setValue(value)} />;
    };

    const { getByLabelText } = renderWithTheme(<ControlledInputExample />);

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' Chandnani');
    expect(input).toHaveValue(valueFinal);
  });

  it('should throw error when both value and defaultValue are passed', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <TextInput label="Enter name" defaultValue="Kamlesh" value="Kamlesh Chandnani" />,
      ),
    ).toThrow(
      `[Blade: Input]: Either 'value' or 'defaultValue' shall be passed. This decides if the input field is controlled or uncontrolled`,
    );
    mockConsoleError.mockRestore();
  });

  it('should clear input with defaultValue on clear buton click', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const onClearButtonClick = jest.fn();

    const { getByLabelText, getByRole } = renderWithTheme(
      <TextInput
        label={label}
        defaultValue="Kamlesh"
        showClearButton
        onClearButtonClick={onClearButtonClick}
      />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue('Kamlesh');

    const clearButton = getByRole('button');
    await user.click(clearButton);
    expect(onClearButtonClick).toHaveBeenCalledTimes(1);

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
  });

  it('should only show clear buton when the user type in something', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const onClearButtonClick = jest.fn();

    const { getByLabelText, getByRole, queryByRole } = renderWithTheme(
      <TextInput label={label} showClearButton onClearButtonClick={onClearButtonClick} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue('');

    let clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();

    await user.tab();
    expect(input).toHaveFocus();

    await user.type(input, 'Kamlesh');
    expect(input).toHaveValue('Kamlesh');

    clearButton = getByRole('button');
    await user.click(clearButton);
    expect(onClearButtonClick).toHaveBeenCalledTimes(1);

    expect(input).toHaveFocus();
    expect(input).toHaveValue('');
  });

  it('should not show clear button on initial render if showClearButton is false', () => {
    const label = 'Enter name';
    const onClearButtonClick = jest.fn();
    const valueInitial = '123';

    const { getByLabelText, queryByRole } = renderWithTheme(
      <TextInput
        label={label}
        defaultValue={valueInitial}
        showClearButton={false}
        onClearButtonClick={onClearButtonClick}
      />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    const clearButton = queryByRole('button');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should pass a11y', async () => {
    const { getByRole } = renderWithTheme(
      <TextInput
        label="Enter name"
        isRequired
        helpText="First name and last name"
        defaultValue="Kamlesh"
        validationState="none"
      />,
    );

    const input = getByRole('textbox');

    expect(input).toBeRequired();
    expect(input).toBeValid();
    expect(input).toBeEnabled();

    await assertAccessible(input);
  });

  it(`type='text' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const label = 'Enter Name';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="text" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputMode', 'text');
    expect(input).toHaveAttribute('enterKeyHint', 'enter');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it(`type='telephone' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const label = 'Enter Phone';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="telephone" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'tel');
    expect(input).toHaveAttribute('inputMode', 'tel');
    expect(input).toHaveAttribute('enterKeyHint', 'done');
    expect(input).toHaveAttribute('autoComplete', 'tel');
  });

  it(`type='email' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const label = 'Enter Email';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="email" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('inputMode', 'email');
    expect(input).toHaveAttribute('enterKeyHint', 'done');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });

  it(`type='url' should have correct keyboard type, autocomplete suggestions, autocapitalize and keyboard return key`, () => {
    const label = 'Enter Company Website';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="url" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'url');
    expect(input).toHaveAttribute('inputMode', 'url');
    expect(input).toHaveAttribute('enterKeyHint', 'go');
    expect(input).toHaveAttribute('autoComplete', 'off');
    expect(input).toHaveAttribute('autocapitalize', 'none');
  });

  it(`type='number' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const label = 'Enter Monthly Income';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="number" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputMode', 'decimal');
    expect(input).toHaveAttribute('enterKeyHint', 'done');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it(`type='search' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const label = 'Enter Name';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="search" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputMode', 'search');
    expect(input).toHaveAttribute('enterKeyHint', 'search');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it(`should expose native element methods via ref`, async () => {
    const label = 'Enter Name';

    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);

      return (
        <>
          <TextInput ref={ref} label={label} />
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
    const button = getByRole('button');

    expect(input).not.toHaveFocus();

    await userEvent.click(button);
    expect(input).toHaveFocus();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <TextInput label="Enter name" testID="text-input-test-id" />,
    );

    expect(getByTestId('text-input-test-id')).toBeTruthy();
  });
});
