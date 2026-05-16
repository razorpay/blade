import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PieChartIcon from './';

describe('<PieChartIcon />', () => {
  it('should render PieChartIcon', () => {
    const { container } = renderWithTheme(
      <PieChartIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
