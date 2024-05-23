import PaymentGatewayIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PaymentGatewayIcon />', () => {
  it('should render PaymentGatewayIcon', () => {
    const { container } = renderWithTheme(
      <PaymentGatewayIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
