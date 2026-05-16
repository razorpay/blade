import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BarChartAltIcon from '.';

describe('<BarChartAltIcon />', () => {
  it('should render BarChartAltIcon', () => {
    const renderTree = renderWithTheme(
      <BarChartAltIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
