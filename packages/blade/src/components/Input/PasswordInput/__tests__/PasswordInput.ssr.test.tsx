import { PasswordInput } from '..';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

describe('<PasswordInput />', () => {
  it('should display error validation state', () => {
    const label = 'Enter password';
    const { container, getByText, getByLabelText } = renderWithSSR(
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
    expect(container).toMatchSnapshot();
  });
});
