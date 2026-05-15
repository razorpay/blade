import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TvIcon from '.';

describe('<TvIcon />', () => {
  it('should render TvIcon', () => {
    const renderTree = renderWithTheme(
      <TvIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
