import PaymentGatewayFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PaymentGatewayFilledIcon />', () => {
  it('should render PaymentGatewayFilledIcon', () => {
    const { container } = renderWithTheme(
      <PaymentGatewayFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
