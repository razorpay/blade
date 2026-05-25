import { ColorInput } from '..';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<ColorInput />', () => {
  it('should display error validation state', () => {
    const label = 'Brand Color';
    const { container, getByText, getByLabelText } = renderWithSSR(
      <ColorInput
        label={label}
        validationState="error"
        errorText="Invalid color"
        helpText="Help"
        successText="Success"
      />,
    );

    const input = getByLabelText(label);
    const errorText = getByText('Invalid color');

    expect(errorText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Invalid color');
    expect(input).toBeInvalid();
    expect(container).toMatchSnapshot();
  });
});
