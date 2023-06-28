import { BaseInput } from '..';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<BaseInput />', () => {
  it('should display success validation state', () => {
    const label = 'Enter name';
    const { getByText, getByLabelText, container } = renderWithSSR(
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
    expect(container).toMatchSnapshot();
  });
});
