import BarChartIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BarChartIcon />', () => {
  it('should render BarChartIcon', () => {
    const { container } = renderWithTheme(
      <BarChartIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
