import TrendingUpIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<TrendingUpIcon />', () => {
  it('should render TrendingUpIcon', () => {
    const { container } = renderWithTheme(
      <TrendingUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
