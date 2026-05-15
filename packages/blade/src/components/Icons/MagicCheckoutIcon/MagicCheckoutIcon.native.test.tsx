import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MagicCheckoutIcon from '.';

describe('<MagicCheckoutIcon />', () => {
  it('should render MagicCheckoutIcon', () => {
    const renderTree = renderWithTheme(
      <MagicCheckoutIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
