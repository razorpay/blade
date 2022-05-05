import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import CreditCardIcon from '.';

describe('<CreditCardIcon />', () => {
  it('should render CreditCardIcon', () => {
    const { container } = renderWithTheme(
      <CreditCardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
