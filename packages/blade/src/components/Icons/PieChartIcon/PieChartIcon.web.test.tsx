import PieChartIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PieChartIcon />', () => {
  it('should render PieChartIcon', () => {
    const { container } = renderWithTheme(
      <PieChartIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
