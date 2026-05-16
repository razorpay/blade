import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BarChartIcon from './';

describe('<BarChartIcon />', () => {
  it('should render BarChartIcon', () => {
    const { container } = renderWithTheme(
      <BarChartIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
