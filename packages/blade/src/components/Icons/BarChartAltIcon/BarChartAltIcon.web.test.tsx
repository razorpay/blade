import BarChartAltIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BarChartAltIcon />', () => {
  it('should render BarChartAltIcon', () => {
    const { container } = renderWithTheme(
      <BarChartAltIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
