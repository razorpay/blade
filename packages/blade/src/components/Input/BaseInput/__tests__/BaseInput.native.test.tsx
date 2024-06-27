import { fireEvent } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { BaseInput } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { CloseIcon, EyeIcon } from '~components/Icons';
import { Link } from '~components/Link';

describe('<BaseInput />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(<BaseInput label="Enter name" id="name" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const { getByText } = renderWithTheme(
      <BaseInput
        label="Enter name"
        id="name"
        validationState="success"
        successText="Success"
        helpText="Help"
        errorText="Error"
      />,
    );

    const successText = getByText('Success');

    expect(successText).toBeTruthy();
  });

  it('should display error validation state', () => {
    const { getByText } = renderWithTheme(
      <BaseInput
        label="Enter name"
        id="name"
        validationState="error"
        errorText="Error"
        successText="Success"
        helpText="Help"
      />,
    );

    const errorText = getByText('Error');

    expect(errorText).toBeTruthy();
  });

  it('should display help text', () => {
    const { getByText } = renderWithTheme(
      <BaseInput
        label="Enter name"
        id="name"
        errorText="Error"
        successText="Success"
        helpText="Help"
      />,
    );

    const helpText = getByText('Help');

    expect(helpText).toBeTruthy();
  });

  it('should render input with no borders', () => {
    const { toJSON } = renderWithTheme(
      <BaseInput isTableInputCell={true} label="Enter name" id="name" />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render input with no borders in error state', () => {
    const { toJSON } = renderWithTheme(
      <BaseInput
        isTableInputCell={true}
        validationState="error"
        errorText="Something went wrong"
        label="Enter name"
        id="name"
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render input with no borders in success state', () => {
    const { toJSON } = renderWithTheme(
      <BaseInput
        isTableInputCell={false}
        validationState="success"
        successText="This seems valid"
        label="Enter name"
        id="name"
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with icons', () => {
    const { toJSON } = renderWithTheme(
      <BaseInput
        label="Enter name"
        placeholder="First Last"
        id="name"
        leadingIcon={EyeIcon}
        trailingIcon={CloseIcon}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with large size input', () => {
    const { toJSON } = renderWithTheme(
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

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with trailingButton', () => {
    const { toJSON } = renderWithTheme(
      <BaseInput id="coupon" label="Coupon" trailingButton={<Link>Apply</Link>} />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const placeholder = 'First last';
    const { getByPlaceholderText } = renderWithTheme(
      // eslint-disable-next-line jsx-a11y/no-autofocus
      <BaseInput label="Enter name" placeholder={placeholder} id="name" autoFocus />,
    );

    const input = getByPlaceholderText(placeholder);

    // we assume auto focus is working with this prop in place, no simple way of asserting on focus otherwise
    expect(input).toHaveProp('autoFocus', true);
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const placeholder = 'First last';
    const { getByPlaceholderText } = renderWithTheme(
      <BaseInput label="Enter name" placeholder={placeholder} id="name" isDisabled />,
    );

    const input = getByPlaceholderText(placeholder);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', () => {
    const placeholder = 'First Last';
    const onChange = jest.fn();
    const userName = 'Divyanshu';

    const { getByPlaceholderText } = renderWithTheme(
      <BaseInput
        label="Enter name"
        placeholder={placeholder}
        id="name"
        name="name"
        onChange={onChange}
      />,
    );

    const input = getByPlaceholderText(placeholder);
    fireEvent.changeText(input, userName);

    // changeText changes entire text at once
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ name: 'name', value: userName });
  });

  it('should handle onBlur', () => {
    const placeholder = 'First Last';
    const onBlur = jest.fn();
    const userName = 'Divyanshu';

    const { getByPlaceholderText } = renderWithTheme(
      <BaseInput
        label="Enter name"
        placeholder={placeholder}
        id="name"
        name="name"
        onBlur={onBlur}
      />,
    );

    const input = getByPlaceholderText(placeholder);

    // shifts user focus and therefore blurs the focussed input
    fireEvent(input, 'onEndEditing', { nativeEvent: { text: userName } });
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledWith({ name: 'name', value: userName });
  });

  it('should handle onSubmit', () => {
    const placeholder = 'First Last';
    const onSubmit = jest.fn();
    const userName = 'Divyanshu';

    const { getByPlaceholderText } = renderWithTheme(
      <BaseInput
        label="Enter name"
        placeholder={placeholder}
        id="name"
        name="name"
        onSubmit={onSubmit}
      />,
    );

    const input = getByPlaceholderText(placeholder);

    fireEvent(input, 'onSubmitEditing', { nativeEvent: { text: userName } });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ name: 'name', value: userName });
  });

  /**
   * No tests for uncontrolled input because react-native-testing-library doesn't support it
   * https://github.com/callstack/react-native-testing-library/issues/978#issuecomment-1203256954
   */
  it('should set value as a controlled input', () => {
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu Maithani';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return (
        <BaseInput
          label="Enter name"
          id="name"
          value={value}
          onChange={({ value }) => setValue(value)}
        />
      );
    };

    const { getByDisplayValue } = renderWithTheme(<ControlledInputExample />);

    const input = getByDisplayValue(valueInitial);

    fireEvent.changeText(input, valueFinal);

    getByDisplayValue(valueFinal);
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

  it('should pass a11y', () => {
    // todo: tests should be updated for improved a11y after https://github.com/razorpay/blade/issues/696
    const placeholder = 'First Last';
    const { getByPlaceholderText } = renderWithTheme(
      <BaseInput
        label="Enter name"
        placeholder={placeholder}
        id="name"
        isRequired
        helpText="First name and last name"
        defaultValue="Divyanshu"
        validationState="none"
      />,
    );

    const input = getByPlaceholderText(placeholder);
    expect(input).toBeEnabled();
  });

  it(`should set autoCapitalize prop`, () => {
    const placeholder = 'abc@gmail.com';
    const { getByPlaceholderText } = renderWithTheme(
      <BaseInput id="email" label="Enter email" placeholder={placeholder} autoCapitalize="none" />,
    );

    const input = getByPlaceholderText(placeholder);

    expect(input).toHaveProp('autoCapitalize', 'none');
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <BaseInput id="name" label="Enter name" testID="base-input-test" />,
    );

    expect(getByTestId('base-input-test')).toBeTruthy();
  });
});
