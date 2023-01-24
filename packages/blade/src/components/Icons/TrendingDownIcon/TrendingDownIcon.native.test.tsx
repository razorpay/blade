import TrendingDownIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<TrendingDownIcon />', () => {
  it('should render TrendingDownIcon', () => {
    const renderTree = renderWithTheme(
      <TrendingDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
