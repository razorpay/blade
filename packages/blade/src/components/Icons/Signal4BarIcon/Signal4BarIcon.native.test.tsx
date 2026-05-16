import renderWithTheme from '~utils/testing/renderWithTheme.native';

import Signal4BarIcon from '.';

describe('<Signal4BarIcon />', () => {
  it('should render Signal4BarIcon', () => {
    const renderTree = renderWithTheme(
      <Signal4BarIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
