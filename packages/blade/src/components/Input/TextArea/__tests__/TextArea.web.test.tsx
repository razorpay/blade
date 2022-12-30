import userEvent from '@testing-library/user-event';
import React from 'react';
import type { ReactElement } from 'react';
import { TextArea } from '../TextArea';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';

describe('<TextArea />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<TextArea label="Enter name" />);

    expect(container).toMatchSnapshot();
  });

  it('should limit with maxCharacters', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';

    const { getByLabelText } = renderWithTheme(<TextArea maxCharacters={5} label={label} />);

    const input = getByLabelText(label);
    await user.type(input, '123456789');

    expect(input).toHaveValue('12345');
  });

  it('should clear the input when uncontrolled', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const inputValue = 'Hello world';

    const { getByLabelText } = renderWithTheme(
      <TextArea defaultValue={inputValue} showClearButton label={label} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(inputValue);

    const clearButton = getByLabelText(/Clear/i);
    await user.click(clearButton);

    expect(input).toHaveFocus();
    expect(input).toHaveValue('');
  });

  it('should clear the input when controlled', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const inputValue = 'Hello world';

    const ControlledInputExample = (): React.ReactElement => {
      const [value, setValue] = React.useState<string | undefined>(inputValue);

      return (
        <TextArea
          value={value}
          onChange={({ value }) => setValue(value)}
          showClearButton
          onClearButtonClick={() => {
            setValue('');
          }}
          label={label}
        />
      );
    };
    const { getByLabelText } = renderWithTheme(<ControlledInputExample />);

    const input = getByLabelText(label);
    expect(input).toHaveValue(inputValue);

    const clearButton = getByLabelText(/Clear/i);
    await user.click(clearButton);

    expect(input).toHaveFocus();
    expect(input).toHaveValue('');
  });

  it('should set number of lines', () => {
    const label = 'Enter name';

    const { container } = renderWithTheme(<TextArea numberOfLines={3} label={label} />);

    expect(container).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <TextArea
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
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <TextArea
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
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <TextArea label="Enter name" successText="Success" errorText="Error" helpText="Help" />,
    );

    const input = getByLabelText(label);
    const helpText = getByText('Help');

    expect(helpText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Help');
    expect(input).toBeValid();
  });

  it.only('should be focussed when autoFocus flag is passed', () => {
    const label = 'Enter name';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getByLabelText } = renderWithTheme(<TextArea label={label} autoFocus />);

    const input = getByLabelText(label);
    expect(input).toHaveFocus();
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Enter name';
    const { getByLabelText } = renderWithTheme(<TextArea label={label} isDisabled />);

    const input = getByLabelText(label);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', async () => {
    const label = 'Enter name';
    const onChange = jest.fn();
    const user = userEvent.setup();
    const userName = 'Divyanshu';

    const { getByLabelText } = renderWithTheme(
      <TextArea label={label} name="name" onChange={onChange} />,
    );

    const input = getByLabelText(label);
    await user.type(input, userName);

    // should be called for each keystroke
    expect(onChange).toHaveBeenCalledTimes(userName.length);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'name', value: userName });
  });

  it('should handle onBlur', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const userName = 'Divyanshu';
    const onBlur = jest.fn();

    renderWithTheme(
      <TextArea
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
    const userName = 'Divyanshu';

    const { getByLabelText } = renderWithTheme(
      <TextArea label={label} name="name" defaultValue={userName} />,
    );

    const input = getByLabelText(label);

    expect(input).not.toHaveFocus();
    await user.tab();
    expect(input).toHaveFocus();
  });

  it('should set value as an uncontrolled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu Maithani';

    const { getByLabelText } = renderWithTheme(
      <TextArea label={label} defaultValue={valueInitial} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' Maithani');
    expect(input).toHaveValue(valueFinal);
  });

  it('should set value as a controlled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu Maithani';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = React.useState<string | undefined>(valueInitial);

      return <TextArea label={label} value={value} onChange={({ value }) => setValue(value)} />;
    };

    const { getByLabelText } = renderWithTheme(<ControlledInputExample />);

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' Maithani');
    expect(input).toHaveValue(valueFinal);
  });

  it('should only show clear buton when the user type in something', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const onClearButtonClick = jest.fn();

    const { getByLabelText, getByRole, queryByRole } = renderWithTheme(
      <TextArea label={label} showClearButton onClearButtonClick={onClearButtonClick} />,
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

  it('should pass a11y', async () => {
    const { getByRole } = renderWithTheme(
      <TextArea
        label="Enter name"
        isRequired
        helpText="First name and last name"
        defaultValue="Divyanshu"
        validationState="none"
      />,
    );

    const input = getByRole('textbox');
    expect(input).toBeRequired();
    expect(input).toBeValid();
    expect(input).toBeEnabled();

    // There's some issue in jest-axe so we mock this function
    window.getComputedStyle = jest.fn();
    await assertAccessible(input);
    jest.clearAllMocks();
  });
});
