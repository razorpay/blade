import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PaymentPagesFilledIcon from '.';

describe('<PaymentPagesFilledIcon />', () => {
  it('should render PaymentPagesFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PaymentPagesFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
