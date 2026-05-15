import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SkipForwardIcon from '.';

describe('<SkipForwardIcon />', () => {
  it('should render SkipForwardIcon', () => {
    const renderTree = renderWithTheme(
      <SkipForwardIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
