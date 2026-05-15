import renderWithTheme from '~utils/testing/renderWithTheme.native';

import YoutubeIcon from '.';

describe('<YoutubeIcon />', () => {
  it('should render YoutubeIcon', () => {
    const renderTree = renderWithTheme(
      <YoutubeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
