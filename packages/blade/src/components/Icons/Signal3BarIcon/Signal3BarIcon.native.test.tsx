import renderWithTheme from '~utils/testing/renderWithTheme.native';

import Signal3BarIcon from '.';

describe('<Signal3BarIcon />', () => {
  it('should render Signal3BarIcon', () => {
    const renderTree = renderWithTheme(
      <Signal3BarIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
