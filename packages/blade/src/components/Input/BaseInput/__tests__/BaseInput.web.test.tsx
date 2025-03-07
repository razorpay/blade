import userEvent from '@testing-library/user-event';

import type { ReactElement } from 'react';
import { useState } from 'react';
import { BaseInput } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { CloseIcon, EyeIcon } from '~components/Icons';
import { Link } from '~components/Link';

describe('<BaseInput />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<BaseInput label="Enter name" id="name" />);

    expect(container).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <BaseInput
        label={label}
        id="name"
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
      <BaseInput
        label={label}
        id="name"
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
      <BaseInput label={label} id="name" errorText="Error" helpText="Help" successText="Success" />,
    );

    const input = getByLabelText(label);
    const HelpText = getByText('Help');

    expect(HelpText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Help');
    expect(input).toBeValid();
  });

  it('should render base input with no borders', () => {
    const label = 'Enter name';
    const { getByLabelText } = renderWithTheme(
      <BaseInput label={label} id="name" isTableInputCell={false} />,
    );

    const input = getByLabelText(label);

    expect(input).toMatchSnapshot();
  });

  it('should render base input with no borders in error state', () => {
    const label = 'Enter name';
    const { getByLabelText } = renderWithTheme(
      <BaseInput
        label={label}
        id="name"
        isTableInputCell={false}
        validationState="error"
        errorText="Something went wrong"
      />,
    );

    const input = getByLabelText(label);

    expect(input).toMatchSnapshot();
  });

  it('should render base input with no borders in success state', () => {
    const label = 'Enter name';
    const { getByLabelText } = renderWithTheme(
      <BaseInput
        label={label}
        id="name"
        isTableInputCell={false}
        validationState="success"
        successText="This seems valid"
      />,
    );

    const input = getByLabelText(label);

    expect(input).toMatchSnapshot();
  });

  it('should render with icons', () => {
    const { container } = renderWithTheme(
      <BaseInput
        label="Enter name"
        placeholder="First Last"
        id="name"
        leadingIcon={EyeIcon}
        trailingIcon={CloseIcon}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with large size input', () => {
    const { container } = renderWithTheme(
      <BaseInput
        label="Enter name"
        placeholder="First Last"
        id="name"
        leadingIcon={EyeIcon}
        trailingIcon={CloseIcon}
        successText="Success"
        validationState="success"
        size="large"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with trailingButton', () => {
    const { container } = renderWithTheme(
      <BaseInput id="coupon" label="Coupon" trailingButton={<Link>Apply</Link>} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const label = 'Enter name';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getByLabelText } = renderWithTheme(<BaseInput label={label} id="name" autoFocus />);

    const input = getByLabelText(label);
    expect(input).toHaveFocus();
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Enter name';
    const { getByLabelText } = renderWithTheme(<BaseInput label={label} id="name" isDisabled />);

    const input = getByLabelText(label);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', async () => {
    const label = 'Enter name';
    const onChange = jest.fn();
    const user = userEvent.setup();
    const userName = 'Divyanshu';

    const { getByLabelText } = renderWithTheme(
      <BaseInput label={label} id="name" name="name" onChange={onChange} />,
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
      <BaseInput
        label={label}
        id="name"
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

  it('should be focussable', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const userName = 'Divyanshu';

    const { getByLabelText } = renderWithTheme(
      <BaseInput label={label} id="name" name="name" defaultValue={userName} />,
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
      <BaseInput label={label} id="name" defaultValue={valueInitial} />,
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
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return (
        <BaseInput
          label={label}
          id="name"
          value={value}
          onChange={({ value }) => setValue(value)}
        />
      );
    };

    const { getByLabelText } = renderWithTheme(<ControlledInputExample />);

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' Maithani');
    expect(input).toHaveValue(valueFinal);
  });

  it('should throw error when both value and defaultValue are passed', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <BaseInput
          id="name"
          label="Enter name"
          defaultValue="Divyanshu"
          value="Divyanshu Maithani"
        />,
      ),
    ).toThrow(
      `[Blade: Input]: Either 'value' or 'defaultValue' shall be passed. This decides if the input field is controlled or uncontrolled`,
    );
    mockConsoleError.mockRestore();
  });

  it('should pass a11y', async () => {
    const { getByRole } = renderWithTheme(
      <BaseInput
        label="Enter name"
        id="name"
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

  it('should set autocapitalize attribute', () => {
    const { getByLabelText } = renderWithTheme(
      <BaseInput label="Enter name" id="name" autoCapitalize="none" />,
    );

    expect(getByLabelText('Enter name')).toHaveAttribute('autocapitalize', 'none');
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <BaseInput id="name" label="Enter name" testID="base-input-test" />,
    );

    expect(getByTestId('base-input-test')).toBeTruthy();
  });
  it('should support passing data-analytics-* attributes to the input field', () => {
    const { getByLabelText, container } = renderWithTheme(
      <BaseInput id="name" label="Enter name" data-analytics-name="base-input" />,
    );

    expect(container).toMatchSnapshot();
    expect(getByLabelText('Enter name')).toHaveAttribute('data-analytics-name', 'base-input');
  });
});
