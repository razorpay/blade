import { OTPInput } from '..';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

describe('<OTPInput />', () => {
  it('should have hidden input for form submissions', () => {
    const label = 'Enter OTP';
    const name = 'otpInput';
    const { getByLabelText, container } = renderWithSSR(<OTPInput label={label} name={name} />);
    const input = getByLabelText(label);
    expect(input).toHaveAttribute('hidden', '');
    expect(input).toHaveAttribute('name', name);
    expect(container).toMatchSnapshot();
  });
});
