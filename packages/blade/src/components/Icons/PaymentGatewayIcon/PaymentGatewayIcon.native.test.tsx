import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PaymentGatewayIcon from '.';

describe('<PaymentGatewayIcon />', () => {
  it('should render PaymentGatewayIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentGatewayIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
