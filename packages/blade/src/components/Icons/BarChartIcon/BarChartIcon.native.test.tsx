import BarChartIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BarChartIcon />', () => {
  it('should render BarChartIcon', () => {
    const renderTree = renderWithTheme(
      <BarChartIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
