import SkipForwardIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SkipForwardIcon />', () => {
  it('should render SkipForwardIcon', () => {
    const { container } = renderWithTheme(
      <SkipForwardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
