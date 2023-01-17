import BarChartIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BarChartIcon />', () => {
  it('should render BarChartIcon', () => {
    const renderTree = renderWithTheme(
      <BarChartIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
