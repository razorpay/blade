import userEvent from '@testing-library/user-event';

import type { ReactElement } from 'react';
import React, { useState } from 'react';
import { OTPInput } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<OTPInput />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<OTPInput label="Enter OTP" />);

    expect(container).toMatchSnapshot();
  });

  it('should render large size', () => {
    const { container } = renderWithTheme(<OTPInput label="Enter OTP" value="1234" size="large" />);

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

  it('should handle onFocus', async () => {
    const label = 'Enter OTP';
    const onFocus = jest.fn();
    const user = userEvent.setup();
    const otp = '123456';

    const { getAllByLabelText } = renderWithTheme(
      <OTPInput label={label} name="otp" onFocus={onFocus} />,
    );
    const allInputs = getAllByLabelText(/character/);
    await user.type(allInputs[0], otp);

    // should be called for each keystroke
    expect(onFocus).toHaveBeenCalledTimes(6);
    expect(onFocus).toHaveBeenLastCalledWith({
      name: 'otp',
      value: '',
      inputIndex: otp.length - 1,
    });
  });

  it('should handle onBlur', async () => {
    const label = 'Enter OTP';
    const onBlur = jest.fn();
    const user = userEvent.setup();
    const otp = '123456';

    const { getAllByLabelText } = renderWithTheme(
      <OTPInput label={label} name="otp" onBlur={onBlur} />,
    );
    const allInputs = getAllByLabelText(/character/);
    await user.type(allInputs[0], otp);

    // should be called for each keystroke
    expect(onBlur).toHaveBeenCalledTimes(5); // 5 because the last input will remain focused
    expect(onBlur).toHaveBeenLastCalledWith({
      name: 'otp',
      value: otp[otp.length - 2], // -2 because the last input will remain focused and the last blurred input would be 2nd last
      inputIndex: otp.length - 2,
    });
  });

  it('should handle ref focus', async () => {
    const label = 'Enter OTP';
    const onFocus = jest.fn();
    const user = userEvent.setup();

    const Example = (): ReactElement => {
      const inputRef = React.useRef<HTMLInputElement[]>([]);
      const handleClick = (): void => {
        inputRef.current[1].focus();
      };

      return (
        <>
          <OTPInput label={label} name="otp" onFocus={onFocus} ref={inputRef} />
          <button onClick={handleClick}>Focus</button>
        </>
      );
    };

    const { getByRole } = renderWithTheme(<Example />);

    await user.click(getByRole('button', { name: 'Focus' }));

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenLastCalledWith({
      name: 'otp',
      value: '',
      inputIndex: 1,
    });
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
  it('should accept data-analytics attributes', () => {
    const { container } = renderWithTheme(
      <OTPInput
        label="Enter OTP"
        data-analytics-type="otp"
        data-analytics-event="change"
        otpLength={4}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
