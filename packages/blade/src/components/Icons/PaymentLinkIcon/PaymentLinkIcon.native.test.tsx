import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PaymentLinkIcon from '.';

describe('<PaymentLinkIcon />', () => {
  it('should render PaymentLinkIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentLinkIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
