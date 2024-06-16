import TrendingUpIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TrendingUpIcon />', () => {
  it('should render TrendingUpIcon', () => {
    const { container } = renderWithTheme(
      <TrendingUpIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
