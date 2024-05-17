import PaymentGatewayIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PaymentGatewayIcon />', () => {
  it('should render PaymentGatewayIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentGatewayIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
