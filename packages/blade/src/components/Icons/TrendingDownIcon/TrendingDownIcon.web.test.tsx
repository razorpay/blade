import TrendingDownIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TrendingDownIcon />', () => {
  it('should render TrendingDownIcon', () => {
    const { container } = renderWithTheme(
      <TrendingDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
