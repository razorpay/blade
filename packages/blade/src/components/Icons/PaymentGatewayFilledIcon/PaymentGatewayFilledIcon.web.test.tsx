import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PaymentGatewayFilledIcon from './';

describe('<PaymentGatewayFilledIcon />', () => {
  it('should render PaymentGatewayFilledIcon', () => {
    const { container } = renderWithTheme(
      <PaymentGatewayFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
