import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PaymentLinkFilledIcon from '.';

describe('<PaymentLinkFilledIcon />', () => {
  it('should render PaymentLinkFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentLinkFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
