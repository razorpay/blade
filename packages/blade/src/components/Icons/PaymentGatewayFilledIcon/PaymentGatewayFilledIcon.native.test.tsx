import PaymentGatewayFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PaymentGatewayFilledIcon />', () => {
  it('should render PaymentGatewayFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentGatewayFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
