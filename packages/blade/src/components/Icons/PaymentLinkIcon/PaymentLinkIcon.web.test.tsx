import PaymentLinkIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PaymentLinkIcon />', () => {
  it('should render PaymentLinkIcon', () => {
    const { container } = renderWithTheme(
      <PaymentLinkIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
