import userEvent from '@testing-library/user-event';

import type { ReactElement } from 'react';
import { useState } from 'react';
import { OTPInput } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<OTPInput />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<OTPInput label="Enter OTP" />);

    expect(container).toMatchSnapshot();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const label = 'Enter OTP';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getAllByLabelText } = renderWithTheme(<OTPInput label={label} autoFocus />);
    const allInputs = getAllByLabelText(/character/);
    expect(allInputs[0]).toHaveFocus();
  });

  it('should have hidden input for form submissions', () => {
    const label = 'Enter OTP';
    const name = 'otpInput';
    const value = '123456';
    const { getByLabelText } = renderWithTheme(
      <OTPInput label={label} name={name} value="123456" />,
    );
    const input = getByLabelText(label);
    expect(input).toHaveAttribute('hidden', '');
    expect(input).toHaveAttribute('name', name);
    expect(input).toHaveAttribute('value', value);
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Enter OTP';
    const { getAllByLabelText } = renderWithTheme(<OTPInput label={label} isDisabled />);

    const allInputs = getAllByLabelText(/character/);
    allInputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('should mask all fields when isMasked is true', async () => {
    const label = 'Enter OTP';
    const user = userEvent.setup();
    const otp = '123456';
    const { getAllByLabelText } = renderWithTheme(<OTPInput label={label} isMasked />);

    const allInputs = getAllByLabelText(/character/);
    await user.type(allInputs[0], otp);

    allInputs.forEach((input) => {
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  it('should handle onChange', async () => {
    const label = 'Enter OTP';
    const onChange = jest.fn();
    const user = userEvent.setup();
    const otp = '123456';

    const { getAllByLabelText } = renderWithTheme(
      <OTPInput label={label} name="otp" onChange={onChange} />,
    );

    const allInputs = getAllByLabelText(/character/);
    await user.type(allInputs[0], otp);

    // should be called for each keystroke
    expect(onChange).toHaveBeenCalledTimes(otp.length);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'otp', value: otp });
  });

  it('should handle onOTPFilled', async () => {
    const label = 'Enter OTP';
    const onOTPFilled = jest.fn();
    const user = userEvent.setup();
    const otp = '123456';

    const { getAllByLabelText } = renderWithTheme(
      <OTPInput label={label} name="otp" onOTPFilled={onOTPFilled} />,
    );

    const allInputs = getAllByLabelText(/character/);
    await user.type(allInputs[0], otp);

    expect(onOTPFilled).toHaveBeenLastCalledWith({ name: 'otp', value: otp });
  });

  it('should set value as an uncontrolled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter OTP';
    const otp = '123456';

    const { getAllByLabelText } = renderWithTheme(<OTPInput label={label} name="otp" />);

    const allInputs = getAllByLabelText(/character/);
    await user.type(allInputs[0], otp);
    allInputs.forEach((input, index) => {
      expect(input).toHaveValue(Array.from(otp)[index]);
    });
  });

  it('should set value as a controlled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter OTP';
    const otp = '123456';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>('');

      return <OTPInput label={label} value={value} onChange={({ value }) => setValue(value)} />;
    };

    const { getAllByLabelText } = renderWithTheme(<ControlledInputExample />);

    const allInputs = getAllByLabelText(/character/);

    await user.type(allInputs[0], otp);

    allInputs.forEach((input, index) => {
      expect(input).toHaveValue(Array.from(otp)[index]);
    });
  });

  it('should change focus with arrow keys and tab key', async () => {
    const user = userEvent.setup();
    const label = 'Enter OTP';

    const { getAllByLabelText } = renderWithTheme(
      // eslint-disable-next-line jsx-a11y/no-autofocus
      <OTPInput label={label} name="otp" autoFocus={true} />,
    );

    const allInputs = getAllByLabelText(/character/);
    expect(allInputs[0]).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(allInputs[1]).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(allInputs[0]).toHaveFocus();
    await user.keyboard('{Tab}');
    expect(allInputs[1]).toHaveFocus();
    await user.keyboard('{Shift>1}{Tab}');
    expect(allInputs[0]).toHaveFocus();
  });

  it('should change focus to previous tab on backspace and delete keys', async () => {
    const user = userEvent.setup();
    const label = 'Enter OTP';
    const otp = '123456';

    const { getAllByLabelText } = renderWithTheme(
      // eslint-disable-next-line jsx-a11y/no-autofocus
      <OTPInput label={label} name="otp" />,
    );

    const allInputs = getAllByLabelText(/character/);
    await user.type(allInputs[0], otp);
    await user.click(allInputs[5]);
    expect(allInputs[5]).toHaveFocus();
    await user.keyboard('{Backspace}');
    expect(allInputs[5]).toHaveValue('');
    expect(allInputs[4]).toHaveFocus();
    await user.keyboard('{Delete}');
    expect(allInputs[4]).toHaveValue('');
    expect(allInputs[3]).toHaveFocus();
  });

  it('should pass a11y', async () => {
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
      expect(input).toBeRequired();
      expect(input).toBeValid();
      expect(input).toBeEnabled();
    });
    // asserting inside a loop leads to an issue with multiple parallel runs ref: https://github.com/dequelabs/axe-core/issues/3426
    await assertAccessible(allInputs[0]);
    await assertAccessible(allInputs[1]);
    await assertAccessible(allInputs[2]);
    await assertAccessible(allInputs[3]);
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<OTPInput label="Enter OTP" testID="otp-input-test" />);

    expect(getByTestId('otp-input-test')).toBeTruthy();
  });
});
