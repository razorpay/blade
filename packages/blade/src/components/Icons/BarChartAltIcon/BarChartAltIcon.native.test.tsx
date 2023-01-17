import BarChartAltIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BarChartAltIcon />', () => {
  it('should render BarChartAltIcon', () => {
    const renderTree = renderWithTheme(
      <BarChartAltIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
