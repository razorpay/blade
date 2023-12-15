import PieChartIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PieChartIcon />', () => {
  it('should render PieChartIcon', () => {
    const { container } = renderWithTheme(
      <PieChartIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
