import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CoinIcon from '.';

describe('<CoinIcon />', () => {
  it('should render CoinIcon', () => {
    const renderTree = renderWithTheme(
      <CoinIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
