import CreditCardIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CreditCardIcon />', () => {
  it('should render CreditCardIcon', () => {
    const { container } = renderWithTheme(
      <CreditCardIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
