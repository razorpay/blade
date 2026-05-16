import renderWithTheme from '~utils/testing/renderWithTheme.native';

import Signal2BarIcon from '.';

describe('<Signal2BarIcon />', () => {
  it('should render Signal2BarIcon', () => {
    const renderTree = renderWithTheme(
      <Signal2BarIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
