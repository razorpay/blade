import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TrendingUpIcon from '.';

describe('<TrendingUpIcon />', () => {
  it('should render TrendingUpIcon', () => {
    const renderTree = renderWithTheme(
      <TrendingUpIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
