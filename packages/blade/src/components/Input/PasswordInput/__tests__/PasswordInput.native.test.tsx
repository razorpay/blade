/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import React, { useState } from 'react';

import { PasswordInput } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PasswordInput />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(<PasswordInput label="Enter password" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size', () => {
    const { toJSON } = renderWithTheme(<PasswordInput label="Enter password" size="large" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const { getByText } = renderWithTheme(
      <PasswordInput
        label="Enter password"
        validationState="success"
        successText="Success"
        helpText="Help"
        errorText="Error"
      />,
    );

    getByText('Success');
  });

  it('should display error validation state', () => {
    const { getByText } = renderWithTheme(
      <PasswordInput
        label="Enter password"
        validationState="error"
        errorText="Error"
        successText="Success"
        helpText="Help"
      />,
    );

    getByText('Error');
  });

  it('should display help text', () => {
    const { getByText } = renderWithTheme(
      <PasswordInput
        label="Enter password"
        errorText="Error"
        successText="Success"
        helpText="Help"
      />,
    );

    getByText('Help');
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const placeholder = 'Password';
    const { getByPlaceholderText } = renderWithTheme(
      // eslint-disable-next-line jsx-a11y/no-autofocus
      <PasswordInput label="Enter password" placeholder={placeholder} autoFocus />,
    );

    const input = getByPlaceholderText(placeholder);

    // we assume auto focus is working with this prop in place, no simple way of asserting on focus otherwise
    expect(input).toHaveProp('autoFocus', true);
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const placeholder = 'Password';
    const { getByPlaceholderText } = renderWithTheme(
      <PasswordInput label="Enter password" placeholder={placeholder} isDisabled />,
    );

    const input = getByPlaceholderText(placeholder);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', () => {
    const placeholder = 'Password';
    const onChange = jest.fn();
    const userPassword = 'Divyanshu$123';

    const { getByPlaceholderText } = renderWithTheme(
      <PasswordInput
        label="Enter password"
        placeholder={placeholder}
        name="password"
        onChange={onChange}
      />,
    );

    const input = getByPlaceholderText(placeholder);
    fireEvent.changeText(input, userPassword);

    // changeText changes entire text at once
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ name: 'password', value: userPassword });
  });

  it('should handle onBlur', () => {
    const placeholder = 'Password';
    const onBlur = jest.fn();
    const userPassword = 'Divyanshu$123';

    const { getByPlaceholderText } = renderWithTheme(
      <PasswordInput
        label="Enter password"
        placeholder={placeholder}
        name="password"
        onBlur={onBlur}
      />,
    );

    const input = getByPlaceholderText(placeholder);

    // We can't rely on onBlur because it doesn't pass the actual value (just React Native things)
    fireEvent(input, 'onEndEditing', { nativeEvent: { text: userPassword } });
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledWith({ name: 'password', value: userPassword });
  });

  /**
   * No tests for uncontrolled input because react-native-testing-library doesn't support it
   * https://github.com/callstack/react-native-testing-library/issues/978#issuecomment-1203256954
   */
  it('should set value as a controlled input', () => {
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu$123';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return (
        <PasswordInput
          label="Enter password"
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

  it('should toggle password visibility on clicking reveal button', () => {
    const placeholder = 'Password';
    const userPassword = 'Divyanshu$123';

    const { getByPlaceholderText, getByRole, getByLabelText } = renderWithTheme(
      <PasswordInput
        label="Enter password"
        placeholder={placeholder}
        defaultValue={userPassword}
      />,
    );

    const input = getByPlaceholderText(placeholder);
    const button = getByRole('button');

    expect(input).toHaveProp('secureTextEntry', true);
    getByLabelText('Show password');

    fireEvent.press(button);

    expect(input).toHaveProp('secureTextEntry', false);
    getByLabelText('Hide password');
  });

  it('should pass a11y', () => {
    // todo: tests should be updated for improved a11y after https://github.com/razorpay/blade/issues/696
    const placeholder = 'Password';
    const { getByPlaceholderText } = renderWithTheme(
      <PasswordInput
        label="Enter name"
        placeholder={placeholder}
        isRequired
        helpText="First name and last name"
        defaultValue="Divyanshu"
        validationState="none"
      />,
    );

    const input = getByPlaceholderText(placeholder);
    expect(input).toBeEnabled();
  });

  it('should expose native element methods via ref', () => {
    let refValue = null;
    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);
      return (
        <PasswordInput
          label="ref test"
          ref={(value) => {
            console.log(value);
            // @ts-expect-error
            ref.current = value;
            refValue = value;
          }}
        />
      );
    };

    renderWithTheme(<Example />);
    expect(refValue).toHaveProperty('focus');
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <PasswordInput label="Enter password" testID="password-input-test" />,
    );

    expect(getByTestId('password-input-test')).toBeTruthy();
  });
});
