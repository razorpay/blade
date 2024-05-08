import PaymentLinksIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PaymentLinksIcon />', () => {
  it('should render PaymentLinksIcon', () => {
    const { container } = renderWithTheme(
      <PaymentLinksIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
