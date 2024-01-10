import SkipForwardIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SkipForwardIcon />', () => {
  it('should render SkipForwardIcon', () => {
    const { container } = renderWithTheme(
      <SkipForwardIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
