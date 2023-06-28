import FullScreenExitIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FullScreenExitIcon />', () => {
  it('should render FullScreenExitIcon', () => {
    const renderTree = renderWithTheme(
      <FullScreenExitIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
