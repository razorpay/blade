import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PieChartIcon from '.';

describe('<PieChartIcon />', () => {
  it('should render PieChartIcon', () => {
    const renderTree = renderWithTheme(
      <PieChartIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
