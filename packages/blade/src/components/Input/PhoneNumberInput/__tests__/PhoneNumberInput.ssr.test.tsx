import { PhoneNumberInput } from '..';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<PhoneNumberInput />', () => {
  it('should render', () => {
    const label = 'Enter phone number';
    const { container } = renderWithSSR(<PhoneNumberInput label={label} />);

    expect(container).toMatchSnapshot();
  });
});
