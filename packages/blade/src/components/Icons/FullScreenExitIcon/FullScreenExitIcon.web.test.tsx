import FullScreenExitIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FullScreenExitIcon />', () => {
  it('should render FullScreenExitIcon', () => {
    const { container } = renderWithTheme(
      <FullScreenExitIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
