import TvIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TvIcon />', () => {
  it('should render TvIcon', () => {
    const { container } = renderWithTheme(
      <TvIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
