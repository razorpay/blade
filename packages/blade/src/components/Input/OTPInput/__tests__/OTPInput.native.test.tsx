import { fireEvent } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { OTPInput } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<OTPInput />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(<OTPInput label="Enter OTP" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size', () => {
    const { toJSON } = renderWithTheme(<OTPInput label="Enter OTP" value="1234" size="large" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const label = 'Enter OTP';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getAllByLabelText } = renderWithTheme(<OTPInput label={label} autoFocus />);
    const allInputs = getAllByLabelText(/character/);
    // we assume auto focus is working with this prop in place, no simple way of asserting on focus otherwise

    expect(allInputs[0]).toHaveProp('autoFocus', true);
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Enter OTP';
    const { getAllByLabelText } = renderWithTheme(<OTPInput label={label} isDisabled />);

    const allInputs = getAllByLabelText(/character/);
    allInputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('should mask all fields when isMasked is true', () => {
    const label = 'Enter OTP';
    const otp = '123456';
    const { getAllByLabelText } = renderWithTheme(<OTPInput label={label} isMasked />);

    const allInputs = getAllByLabelText(/character/);
    allInputs.forEach((input, index) => {
      // we assume auto focus is working with this prop in place, no simple way of asserting on focus otherwise
      fireEvent.changeText(input, Array.from(otp)[index]);
      expect(input).toHaveProp('secureTextEntry', true);
    });
  });

  it('should handle onChange', () => {
    const label = 'Enter OTP';
    const onChange = jest.fn();
    const otp = '123456';

    const { getAllByLabelText } = renderWithTheme(
      <OTPInput label={label} name="otp" onChange={onChange} />,
    );

    const allInputs = getAllByLabelText(/character/);
    allInputs.forEach((input, index) => {
      fireEvent.changeText(input, Array.from(otp)[index]);
    });

    // should be called for each keystroke
    expect(onChange).toHaveBeenCalledTimes(otp.length);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'otp', value: otp });
  });

  it('should handle onOTPFilled', () => {
    const label = 'Enter OTP';
    const onOTPFilled = jest.fn();
    const otp = '123456';

    const { getAllByLabelText } = renderWithTheme(
      <OTPInput label={label} name="otp" onOTPFilled={onOTPFilled} />,
    );

    const allInputs = getAllByLabelText(/character/);
    allInputs.forEach((input, index) => {
      fireEvent.changeText(input, Array.from(otp)[index]);
    });

    expect(onOTPFilled).toHaveBeenLastCalledWith({ name: 'otp', value: otp });
  });

  it('should set value as an uncontrolled input', () => {
    const label = 'Enter OTP';
    const otp = '123456';

    const { getAllByLabelText } = renderWithTheme(<OTPInput label={label} name="otp" />);

    const allInputs = getAllByLabelText(/character/);
    fireEvent.changeText(allInputs[0], otp);
    allInputs.forEach((input, index) => {
      expect(input).toHaveProp('value', Array.from(otp)[index]);
    });
  });

  it('should set value as a controlled input', () => {
    const label = 'Enter OTP';
    const otp = '123456';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>('');

      return <OTPInput label={label} value={value} onChange={({ value }) => setValue(value)} />;
    };

    const { getAllByLabelText } = renderWithTheme(<ControlledInputExample />);

    const allInputs = getAllByLabelText(/character/);

    fireEvent.changeText(allInputs[0], otp);

    allInputs.forEach((input, index) => {
      expect(input).toHaveProp('value', Array.from(otp)[index]);
    });
  });

  it('should pass a11y', () => {
    const { getAllByLabelText } = renderWithTheme(
      <OTPInput
        label="Enter OTP"
        helpText="Enter OTP sent to your mobile"
        validationState="none"
        value="1234"
        otpLength={4}
      />,
    );

    const allInputs = getAllByLabelText(/character/);
    allInputs.forEach((input) => {
      expect(input).toHaveProp('accessibilityInvalid', false);
      expect(input).toHaveProp('accessibilityRequired', true);
      expect(input).toHaveProp('accessibilityState', { disabled: false });
      expect(input).toHaveProp('textContentType', 'oneTimeCode');
    });
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<OTPInput label="Enter OTP" testID="otp-input-test" />);

    expect(getByTestId('otp-input-test')).toBeTruthy();
  });
});
