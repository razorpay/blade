import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PayoutLinkIcon from '.';

describe('<PayoutLinkIcon />', () => {
  it('should render PayoutLinkIcon', () => {
    const renderTree = renderWithTheme(
      <PayoutLinkIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
