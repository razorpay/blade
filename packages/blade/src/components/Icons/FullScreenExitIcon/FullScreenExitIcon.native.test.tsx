import renderWithTheme from '~utils/testing/renderWithTheme.native';

import FullScreenExitIcon from '.';

describe('<FullScreenExitIcon />', () => {
  it('should render FullScreenExitIcon', () => {
    const renderTree = renderWithTheme(
      <FullScreenExitIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
