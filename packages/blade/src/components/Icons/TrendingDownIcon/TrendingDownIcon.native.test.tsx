import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TrendingDownIcon from '.';

describe('<TrendingDownIcon />', () => {
  it('should render TrendingDownIcon', () => {
    const renderTree = renderWithTheme(
      <TrendingDownIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
