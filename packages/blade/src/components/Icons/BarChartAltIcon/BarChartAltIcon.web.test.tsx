import BarChartAltIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BarChartAltIcon />', () => {
  it('should render BarChartAltIcon', () => {
    const { container } = renderWithTheme(
      <BarChartAltIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
