import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BarChartAltIcon from './';

describe('<BarChartAltIcon />', () => {
  it('should render BarChartAltIcon', () => {
    const { container } = renderWithTheme(
      <BarChartAltIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
